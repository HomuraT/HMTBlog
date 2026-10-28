/// <reference types="@webgpu/types" />
/**
 * WebGPU：计算着色器驱动的 4 万个粒子，取意「圆环之理」。
 * 粉色粒子（小圆）在外圈逆时针绕行，紫色粒子（焰）在内圈反向绕行；按住指针产生引力。
 * 计算着色器每帧更新位置与速度，渲染管线按实例画成发光的圆点。
 */
import { fitCanvas, type Mount, runLoop } from "../shared";

const COUNT = 40000;

const PARAMS = /* wgsl */ `
	struct Params {
		time: f32,
		dt: f32,
		aspect: f32,
		pull: f32,
		mouse: vec2f,
		pad: vec2f,
	}
`;

const computeCode = /* wgsl */ `
	${PARAMS}
	@group(0) @binding(0) var<uniform> params: Params;
	@group(0) @binding(1) var<storage, read_write> particles: array<vec4f>;

	@compute @workgroup_size(64)
	fn main(@builtin(global_invocation_id) id: vec3u) {
		let i = id.x;
		if (i >= arrayLength(&particles)) { return; }
		let p = particles[i];
		var pos = p.xy;
		var vel = p.zw;
		let homura = (i % 2u) == 1u;
		let fi = f32(i);
		let r = length(pos) + 0.0001;
		let dir = pos / r;
		// 回到各自的环上：小圆在外圈，焰在内圈，环的半径带一点波动
		let ring = select(0.66, 0.42, homura) + 0.07 * sin(fi * 0.37 + params.time * 0.8);
		var force = -dir * (r - ring) * 14.0;
		let tangent = vec2f(-dir.y, dir.x);
		force += tangent * select(0.55, -0.75, homura);
		// 按住指针时的引力
		let toMouse = params.mouse - pos;
		let dm = length(toMouse) + 0.06;
		force += params.pull * toMouse / (dm * dm * dm) * 0.025;
		vel = (vel + force * params.dt) * 0.985;
		pos += vel * params.dt;
		particles[i] = vec4f(pos, vel);
	}
`;

const renderCode = /* wgsl */ `
	${PARAMS}
	@group(0) @binding(0) var<uniform> params: Params;
	@group(0) @binding(1) var<storage, read> particles: array<vec4f>;

	struct VOut {
		@builtin(position) pos: vec4f,
		@location(0) uv: vec2f,
		@location(1) color: vec3f,
	}

	@vertex
	fn vs(@builtin(vertex_index) v: u32, @builtin(instance_index) i: u32) -> VOut {
		var corners = array<vec2f, 6>(
			vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
			vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
		);
		let c = corners[v];
		let p = particles[i].xy;
		let size = 0.0075;
		var out: VOut;
		out.pos = vec4f((p.x + c.x * size) / params.aspect, p.y + c.y * size, 0.0, 1.0);
		out.uv = c;
		out.color = select(vec3f(0.98, 0.45, 0.75), vec3f(0.6, 0.42, 1.0), (i % 2u) == 1u);
		return out;
	}

	@fragment
	fn fs(input: VOut) -> @location(0) vec4f {
		let a = smoothstep(1.0, 0.0, length(input.uv)) * 0.5;
		return vec4f(input.color * a, a);
	}
`;

/** 指针状态：位置为世界坐标（x 在 ±宽高比之间，y 在 ±1 之间），pull 为 1 时产生引力。 */
function trackPointer(canvas: HTMLCanvasElement, signal: AbortSignal) {
	const mouse = { x: 0, y: 0, pull: 0 };
	const toWorld = (e: PointerEvent) => {
		const r = canvas.getBoundingClientRect();
		const aspect = r.width / r.height;
		mouse.x = (((e.clientX - r.left) / r.width) * 2 - 1) * aspect;
		mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
	};
	canvas.addEventListener("pointermove", toWorld, { signal });
	canvas.addEventListener(
		"pointerdown",
		(e) => {
			toWorld(e);
			mouse.pull = 1;
			canvas.setPointerCapture(e.pointerId);
		},
		{ signal },
	);
	for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
		canvas.addEventListener(
			type,
			() => {
				mouse.pull = 0;
			},
			{ signal },
		);
	}
	return mouse;
}

/**
 * 不支持 WebGPU 时的降级版本：同样的受力规则在 CPU 上计算 4000 个粒子，用 Canvas 2D 绘制，
 * 左上角标明降级原因。
 */
function fallback(el: HTMLElement, signal: AbortSignal, reason: string) {
	const badge = document.createElement("p");
	badge.className = "gfx-badge";
	badge.textContent = `${reason}，以下为 Canvas 2D 版本（4000 个粒子）`;
	el.append(badge);
	const canvas = document.createElement("canvas");
	el.prepend(canvas);
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const size = fitCanvas(canvas, signal);
	const mouse = trackPointer(canvas, signal);
	const N = 4000;
	const pos = new Float32Array(N * 2);
	const vel = new Float32Array(N * 2);
	for (let i = 0; i < N; i++) {
		const a = Math.random() * Math.PI * 2;
		const r = (i % 2 ? 0.42 : 0.66) + (Math.random() - 0.5) * 0.4;
		pos[i * 2] = Math.cos(a) * r;
		pos[i * 2 + 1] = Math.sin(a) * r;
	}
	runLoop(el, signal, (dt, t) => {
		const step = dt || 0.016;
		const { w, h, dpr } = size;
		const scale = h / 2;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = "#100819";
		ctx.fillRect(0, 0, w, h);
		ctx.globalCompositeOperation = "lighter";
		for (let i = 0; i < N; i++) {
			const homura = i % 2 === 1;
			let x = pos[i * 2];
			let y = pos[i * 2 + 1];
			const r = Math.hypot(x, y) + 0.0001;
			const dx = x / r;
			const dy = y / r;
			const ring = (homura ? 0.42 : 0.66) + 0.07 * Math.sin(i * 0.37 + t * 0.8);
			const spin = homura ? -0.75 : 0.55;
			let fx = -dx * (r - ring) * 14 - dy * spin;
			let fy = -dy * (r - ring) * 14 + dx * spin;
			if (mouse.pull) {
				const mx = mouse.x - x;
				const my = mouse.y - y;
				const dm = Math.hypot(mx, my) + 0.06;
				fx += (mx / dm ** 3) * 0.025;
				fy += (my / dm ** 3) * 0.025;
			}
			vel[i * 2] = (vel[i * 2] + fx * step) * 0.985;
			vel[i * 2 + 1] = (vel[i * 2 + 1] + fy * step) * 0.985;
			x += vel[i * 2] * step;
			y += vel[i * 2 + 1] * step;
			pos[i * 2] = x;
			pos[i * 2 + 1] = y;
			ctx.fillStyle = homura
				? "rgba(153, 107, 255, 0.55)"
				: "rgba(250, 115, 190, 0.55)";
			ctx.fillRect(w / 2 + x * scale - 1, h / 2 - y * scale - 1, 2.2, 2.2);
		}
		ctx.globalCompositeOperation = "source-over";
	});
}

export const mount: Mount = async (el, signal) => {
	// WebGPU 只在安全上下文（HTTPS 或 localhost）中提供
	if (!window.isSecureContext) {
		fallback(el, signal, "WebGPU 只能在 HTTPS 或 localhost 页面中使用");
		return;
	}
	if (!navigator.gpu) {
		fallback(el, signal, "当前浏览器不支持 WebGPU");
		return;
	}
	const adapter = await navigator.gpu.requestAdapter().catch(() => null);
	if (signal.aborted) return;
	if (!adapter) {
		fallback(el, signal, "没有可用的 WebGPU 适配器（显卡或驱动不支持）");
		return;
	}
	const device = await adapter.requestDevice();
	device.addEventListener("uncapturederror", (e) => {
		console.warn("[gfx] WebGPU", (e as GPUUncapturedErrorEvent).error.message);
	});
	const canvas = document.createElement("canvas");
	el.prepend(canvas);
	const context = canvas.getContext("webgpu");
	if (!context) return;
	const format = navigator.gpu.getPreferredCanvasFormat();
	context.configure({ device, format, alphaMode: "opaque" });

	// 初始位置：随机撒在两个环附近
	const init = new Float32Array(COUNT * 4);
	for (let i = 0; i < COUNT; i++) {
		const a = Math.random() * Math.PI * 2;
		const r = (i % 2 ? 0.42 : 0.66) + (Math.random() - 0.5) * 0.4;
		init[i * 4] = Math.cos(a) * r;
		init[i * 4 + 1] = Math.sin(a) * r;
	}
	const particles = device.createBuffer({
		size: init.byteLength,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(particles, 0, init);
	const params = new Float32Array(8);
	const paramBuffer = device.createBuffer({
		size: params.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	});

	const computePipeline = device.createComputePipeline({
		layout: "auto",
		compute: {
			module: device.createShaderModule({ code: computeCode }),
			entryPoint: "main",
		},
	});
	const renderModule = device.createShaderModule({ code: renderCode });
	const additive: GPUBlendComponent = {
		srcFactor: "one",
		dstFactor: "one",
		operation: "add",
	};
	const renderPipeline = device.createRenderPipeline({
		layout: "auto",
		vertex: { module: renderModule, entryPoint: "vs" },
		fragment: {
			module: renderModule,
			entryPoint: "fs",
			targets: [{ format, blend: { color: additive, alpha: additive } }],
		},
		primitive: { topology: "triangle-list" },
	});
	const bind = (pipeline: GPUComputePipeline | GPURenderPipeline) =>
		device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: paramBuffer } },
				{ binding: 1, resource: { buffer: particles } },
			],
		});
	const computeBind = bind(computePipeline);
	const renderBind = bind(renderPipeline);

	const size = fitCanvas(canvas, signal);
	const mouse = trackPointer(canvas, signal);

	runLoop(el, signal, (dt, t) => {
		if (canvas.width < 2) return;
		params.set([
			t,
			dt || 0.016,
			size.w / Math.max(1, size.h),
			mouse.pull,
			mouse.x,
			mouse.y,
			0,
			0,
		]);
		device.queue.writeBuffer(paramBuffer, 0, params);
		const encoder = device.createCommandEncoder();
		const cpass = encoder.beginComputePass();
		cpass.setPipeline(computePipeline);
		cpass.setBindGroup(0, computeBind);
		cpass.dispatchWorkgroups(Math.ceil(COUNT / 64));
		cpass.end();
		const rpass = encoder.beginRenderPass({
			colorAttachments: [
				{
					view: context.getCurrentTexture().createView(),
					clearValue: { r: 0.06, g: 0.03, b: 0.1, a: 1 },
					loadOp: "clear",
					storeOp: "store",
				},
			],
		});
		rpass.setPipeline(renderPipeline);
		rpass.setBindGroup(0, renderBind);
		rpass.draw(6, COUNT);
		rpass.end();
		device.queue.submit([encoder.finish()]);
	});

	signal.addEventListener("abort", () => {
		device.destroy();
		canvas.remove();
	});
};
