/**
 * OGL：全屏片元着色器。Homulilly 结界里的红色彼岸花，花瓣与花蕊随时间卷曲，
 * 背景是分形噪声扭曲出的紫雾；花心跟随指针。
 */
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { type Mount, runLoop } from "../shared";

const vertex = /* glsl */ `
	attribute vec2 uv;
	attribute vec2 position;
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = vec4(position, 0.0, 1.0);
	}
`;

const fragment = /* glsl */ `
	precision highp float;
	uniform float uTime;
	uniform vec2 uRes;
	uniform vec2 uMouse;
	varying vec2 vUv;

	float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
	float noise(vec2 p) {
		vec2 i = floor(p), f = fract(p);
		f = f * f * (3.0 - 2.0 * f);
		return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
	}
	float fbm(vec2 p) {
		float v = 0.0, a = 0.5;
		for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + 3.1; a *= 0.5; }
		return v;
	}

	void main() {
		vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
		vec2 p = (vUv - 0.5) * aspect * 2.2;
		p -= (uMouse - 0.5) * aspect * 0.8;
		float r = length(p);
		float a = atan(p.y, p.x);

		// 背景：分形噪声再扭曲一次，像结界里翻涌的紫雾
		vec2 q = p * 1.4;
		float n = fbm(q + fbm(q + vec2(uTime * 0.08, -uTime * 0.05)));
		vec3 col = mix(vec3(0.05, 0.02, 0.09), vec3(0.32, 0.1, 0.46), n);

		// 花瓣：六片，角度随半径与时间弯曲，形成向外翻卷的形状
		float curl = a + 0.55 * sin(r * 5.5 - uTime * 1.1);
		float petal = pow(abs(cos(curl * 3.0)), 6.0);
		float body = petal * smoothstep(0.85, 0.12, r);
		vec3 red = mix(vec3(0.95, 0.15, 0.3), vec3(0.55, 0.02, 0.12), r);
		col = mix(col, red, clamp(body * 1.6, 0.0, 1.0));

		// 花蕊：细长的弧线，比花瓣伸得更远，末端一颗小点
		float sa = a + 0.35 * sin(r * 3.0 + uTime * 0.6) + 0.26;
		float stamen = pow(abs(cos(sa * 3.0)), 220.0) * smoothstep(1.25, 0.35, r) * step(0.18, r);
		float tip = smoothstep(0.06, 0.0, abs(r - 1.2)) * pow(abs(cos(sa * 3.0)), 60.0);
		col += vec3(1.0, 0.45, 0.6) * (stamen + tip) * 1.2;

		// 花心的光
		col += vec3(0.75, 0.35, 1.0) * 0.06 / (r + 0.08);
		gl_FragColor = vec4(col, 1.0);
	}
`;

export const mount: Mount = (el, signal) => {
	const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2) });
	const gl = renderer.gl;
	const canvas = gl.canvas as HTMLCanvasElement;
	el.prepend(canvas);

	const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
	const program = new Program(gl, {
		vertex,
		fragment,
		uniforms: {
			uTime: { value: 0 },
			uRes: { value: [1, 1] },
			uMouse: { value: [0.5, 0.5] },
		},
	});
	const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

	const resize = () => {
		const { width, height } = el.getBoundingClientRect();
		renderer.setSize(width, height);
		program.uniforms.uRes.value = [width, height];
	};
	const observer = new ResizeObserver(resize);
	observer.observe(el);
	resize();

	canvas.addEventListener(
		"pointermove",
		(e) => {
			const r = canvas.getBoundingClientRect();
			mouse.tx = (e.clientX - r.left) / r.width;
			mouse.ty = 1 - (e.clientY - r.top) / r.height;
		},
		{ signal },
	);

	runLoop(el, signal, (dt, t) => {
		mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 4);
		mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 4);
		program.uniforms.uTime.value = t;
		program.uniforms.uMouse.value = [mouse.x, mouse.y];
		renderer.render({ scene: mesh });
	});

	signal.addEventListener("abort", () => {
		observer.disconnect();
		gl.getExtension("WEBGL_lose_context")?.loseContext();
		canvas.remove();
	});
};
