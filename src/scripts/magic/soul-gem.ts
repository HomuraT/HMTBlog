/**
 * 首页主视觉：晓美焰的灵魂宝石。
 *
 * 多面体紫水晶（透射 + 虹彩）包着一颗发光的核，上下是金色托座；
 * 背后是缓慢转动的罗马数字表盘与两枚齿轮，外圈两道倾斜的魔法环，
 * 四周飘着紫、粉、金三色光点，后期加泛光。点击宝石触发时间停止。
 *
 * 只在首页按需加载（Layout.astro → loadPageEffects），three.js 打成独立 chunk。
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import {
	isDark,
	prefersReducedMotion,
	watchTheme,
	watchVisibility,
} from "./lifecycle";
import { isTimeStopped, onTimeStop, toggleTimeStop } from "./time-stop";

const ROMAN = [
	"XII",
	"I",
	"II",
	"III",
	"IV",
	"V",
	"VI",
	"VII",
	"VIII",
	"IX",
	"X",
	"XI",
];

/** CSS 颜色（含 oklch、color-mix）转成 THREE.Color：画到 1×1 画布上再读回像素。 */
function cssColor(value: string): THREE.Color {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = 1;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return new THREE.Color(0x1a1622);
	ctx.fillStyle = value;
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return new THREE.Color().setRGB(
		r / 255,
		g / 255,
		b / 255,
		THREE.SRGBColorSpace,
	);
}

/** 罗马数字表盘贴图，白色线条，颜色由材质着色。 */
function dialTexture(): THREE.CanvasTexture {
	const size = 1024;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext("2d");
	const texture = new THREE.CanvasTexture(canvas);
	if (!ctx) return texture;
	const c = size / 2;
	ctx.translate(c, c);
	ctx.strokeStyle = "#fff";
	ctx.fillStyle = "#fff";

	const ring = (r: number, width: number, dash: number[] = []) => {
		ctx.setLineDash(dash);
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.arc(0, 0, r, 0, Math.PI * 2);
		ctx.stroke();
	};
	ring(c * 0.97, 3);
	ring(c * 0.93, 1.5, [3, 9]);
	ring(c * 0.86, 2.5);
	ring(c * 0.6, 1.5, [2, 7]);
	ctx.setLineDash([]);

	for (let i = 0; i < 60; i++) {
		const a = (i / 60) * Math.PI * 2;
		const major = i % 5 === 0;
		const r1 = c * 0.86;
		const r2 = c * (major ? 0.8 : 0.83);
		ctx.lineWidth = major ? 5 : 2;
		ctx.beginPath();
		ctx.moveTo(Math.sin(a) * r1, -Math.cos(a) * r1);
		ctx.lineTo(Math.sin(a) * r2, -Math.cos(a) * r2);
		ctx.stroke();
	}

	ctx.font = `600 ${Math.round(size * 0.05)}px "Times New Roman", serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ROMAN.forEach((text, i) => {
		const a = (i / 12) * Math.PI * 2;
		ctx.save();
		ctx.translate(Math.sin(a) * c * 0.71, -Math.cos(a) * c * 0.71);
		ctx.rotate(a);
		ctx.fillText(text, 0, 0);
		ctx.restore();
	});

	// 外圈的菱形符文
	for (let i = 0; i < 24; i++) {
		const a = ((i + 0.5) / 24) * Math.PI * 2;
		ctx.save();
		ctx.translate(Math.sin(a) * c * 0.95, -Math.cos(a) * c * 0.95);
		ctx.rotate(a);
		ctx.beginPath();
		ctx.moveTo(0, -9);
		ctx.lineTo(6, 0);
		ctx.lineTo(0, 9);
		ctx.lineTo(-6, 0);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	return texture;
}

/** 柔和圆点贴图，给光点用。 */
function dotTexture(): THREE.CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = 64;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
		g.addColorStop(0, "rgba(255,255,255,1)");
		g.addColorStop(0.25, "rgba(255,255,255,0.8)");
		g.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 64, 64);
	}
	return new THREE.CanvasTexture(canvas);
}

function gearShape(
	teeth: number,
	r: number,
	depth: number,
	hole: number,
): THREE.Shape {
	const shape = new THREE.Shape();
	const step = (Math.PI * 2) / teeth;
	for (let i = 0; i < teeth; i++) {
		const a = i * step;
		const corners: [number, number][] = [
			[a, r - depth],
			[a + step * 0.15, r],
			[a + step * 0.5, r],
			[a + step * 0.65, r - depth],
		];
		corners.forEach(([angle, radius], k) => {
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			if (i === 0 && k === 0) shape.moveTo(x, y);
			else shape.lineTo(x, y);
		});
	}
	shape.closePath();
	const inner = new THREE.Path();
	inner.absarc(0, 0, hole, 0, Math.PI * 2, true);
	shape.holes.push(inner);
	// 辐条之间的镂空
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2;
		const cutout = new THREE.Path();
		cutout.absarc(
			Math.cos(a) * (r * 0.55),
			Math.sin(a) * (r * 0.55),
			r * 0.17,
			0,
			Math.PI * 2,
			true,
		);
		shape.holes.push(cutout);
	}
	return shape;
}

/** 由刻度组成的环，作为倾斜的魔法轨道。 */
function tickRing(
	radius: number,
	count: number,
	length: number,
): THREE.BufferGeometry {
	const points: number[] = [];
	for (let i = 0; i < count; i++) {
		const a = (i / count) * Math.PI * 2;
		const l = i % 6 === 0 ? length * 2.2 : length;
		points.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
		points.push(Math.cos(a) * (radius + l), Math.sin(a) * (radius + l), 0);
	}
	// 再补一圈细线
	const segments = 160;
	for (let i = 0; i < segments; i++) {
		const a = (i / segments) * Math.PI * 2;
		const b = ((i + 1) / segments) * Math.PI * 2;
		points.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
		points.push(Math.cos(b) * radius, Math.sin(b) * radius, 0);
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(points, 3),
	);
	return geometry;
}

export function initSoulGem(container: HTMLElement, signal: AbortSignal): void {
	if (container.dataset.ready) return;
	const reduced = prefersReducedMotion();

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		});
	} catch {
		// WebGL 不可用时保留 CSS 画的宝石
		return;
	}
	container.dataset.ready = "1";
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	const canvas = renderer.domElement;
	canvas.setAttribute("aria-hidden", "true");
	canvas.classList.add("gem-canvas");
	container.prepend(canvas);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
	camera.position.set(0, 0.15, 8.4);

	const pmrem = new THREE.PMREMGenerator(renderer);
	const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	scene.environment = envTexture;
	pmrem.dispose();

	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.9, 0.55, 0.78);
	composer.addPass(bloom);
	composer.addPass(new OutputPass());

	const disposables: { dispose(): void }[] = [envTexture, composer];
	const keep = <T extends { dispose(): void }>(item: T): T => {
		disposables.push(item);
		return item;
	};

	// ── 宝石 ──
	const root = new THREE.Group();
	scene.add(root);
	const gemGroup = new THREE.Group();
	root.add(gemGroup);

	const profile = [
		[0.0, -1.42],
		[0.36, -1.12],
		[0.66, -0.62],
		[0.8, -0.08],
		[0.76, 0.42],
		[0.56, 0.86],
		[0.24, 1.12],
		[0.0, 1.18],
	].map(([x, y]) => new THREE.Vector2(x, y));
	const gemGeometry = keep(new THREE.LatheGeometry(profile, 10));
	const gemMaterial = keep(
		new THREE.MeshPhysicalMaterial({
			color: 0x6b2cf0,
			emissive: 0x24064f,
			emissiveIntensity: 0.7,
			metalness: 0.05,
			roughness: 0.08,
			transmission: 0.3,
			thickness: 1.6,
			attenuationColor: new THREE.Color(0x4a12b0),
			attenuationDistance: 0.8,
			ior: 1.9,
			iridescence: 1,
			iridescenceIOR: 1.5,
			clearcoat: 1,
			clearcoatRoughness: 0.05,
			envMapIntensity: 1.6,
			flatShading: true,
		}),
	);
	const gem = new THREE.Mesh(gemGeometry, gemMaterial);
	gemGroup.add(gem);

	const coreMaterial = keep(
		new THREE.MeshBasicMaterial({
			color: new THREE.Color(1.6, 0.9, 2.4),
			toneMapped: false,
		}),
	);
	const core = new THREE.Mesh(
		keep(new THREE.IcosahedronGeometry(0.26, 1)),
		coreMaterial,
	);
	gemGroup.add(core);
	const coreLight = new THREE.PointLight(0xb070ff, 4, 5, 1.8);
	gemGroup.add(coreLight);

	// 金色托座：上下两道金箍、顶端的冠饰
	const gold = keep(
		new THREE.MeshStandardMaterial({
			color: 0xe7c27a,
			metalness: 1,
			roughness: 0.28,
			envMapIntensity: 1.3,
		}),
	);
	const bandTop = new THREE.Mesh(
		keep(new THREE.TorusGeometry(0.6, 0.045, 12, 64)),
		gold,
	);
	bandTop.rotation.x = Math.PI / 2;
	bandTop.position.y = 0.76;
	const bandBottom = new THREE.Mesh(
		keep(new THREE.TorusGeometry(0.5, 0.04, 12, 64)),
		gold,
	);
	bandBottom.rotation.x = Math.PI / 2;
	bandBottom.position.y = -0.9;
	gemGroup.add(bandTop, bandBottom);

	const crownGeometry = keep(
		new THREE.LatheGeometry(
			[
				[0.0, 0.0],
				[0.3, 0.0],
				[0.22, 0.12],
				[0.08, 0.22],
				[0.05, 0.36],
				[0.0, 0.42],
			].map(([x, y]) => new THREE.Vector2(x, y)),
			24,
		),
	);
	const crown = new THREE.Mesh(crownGeometry, gold);
	crown.position.y = 1.1;
	gemGroup.add(crown);
	const spikeGeometry = keep(new THREE.ConeGeometry(0.05, 0.3, 8));
	for (let i = 0; i < 4; i++) {
		const spike = new THREE.Mesh(spikeGeometry, gold);
		const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
		spike.position.set(Math.cos(a) * 0.62, 0.86, Math.sin(a) * 0.62);
		spike.lookAt(Math.cos(a) * 2, 1.4, Math.sin(a) * 2);
		spike.rotateX(Math.PI / 2);
		gemGroup.add(spike);
	}
	const finial = new THREE.Mesh(
		keep(new THREE.OctahedronGeometry(0.09, 0)),
		gold,
	);
	finial.position.y = 1.6;
	gemGroup.add(finial);

	// ── 表盘与齿轮 ──
	const dialMap = keep(dialTexture());
	const dialMaterial = keep(
		new THREE.MeshBasicMaterial({
			map: dialMap,
			color: 0xb48cff,
			transparent: true,
			opacity: 0.55,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		}),
	);
	// codex 画的表盘线稿（public/images/fx/clock-dial.webp）加载好后替换掉画布画的表盘
	new THREE.TextureLoader().load(
		`${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx/clock-dial.webp`,
		(texture) => {
			if (signal.aborted) {
				texture.dispose();
				return;
			}
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.anisotropy = 4;
			dialMaterial.map = texture;
			dialMaterial.needsUpdate = true;
			keep(texture);
			if (!running) renderFrame(0);
		},
	);
	const dial = new THREE.Mesh(
		keep(new THREE.PlaneGeometry(5.2, 5.2)),
		dialMaterial,
	);
	dial.position.z = -1.2;
	root.add(dial);

	const gearMaterial = keep(
		new THREE.MeshStandardMaterial({
			color: 0x6e4fa8,
			metalness: 0.9,
			roughness: 0.35,
			transparent: true,
			opacity: 0.55,
		}),
	);
	const extrude = { depth: 0.06, bevelEnabled: false, curveSegments: 6 };
	const gearA = new THREE.Mesh(
		keep(new THREE.ExtrudeGeometry(gearShape(22, 0.95, 0.12, 0.22), extrude)),
		gearMaterial,
	);
	gearA.position.set(-1.75, -1.35, -1.6);
	const gearB = new THREE.Mesh(
		keep(new THREE.ExtrudeGeometry(gearShape(12, 0.52, 0.11, 0.12), extrude)),
		gearMaterial,
	);
	gearB.position.set(-0.6, -2.05, -1.6);
	const gearC = new THREE.Mesh(
		keep(new THREE.ExtrudeGeometry(gearShape(16, 0.7, 0.11, 0.16), extrude)),
		gearMaterial,
	);
	gearC.position.set(1.95, 1.45, -1.9);
	root.add(gearA, gearB, gearC);

	// ── 倾斜的魔法环 ──
	const ringMaterialA = keep(
		new THREE.LineBasicMaterial({
			color: 0xc9a2ff,
			transparent: true,
			opacity: 0.7,
			blending: THREE.AdditiveBlending,
		}),
	);
	const ringMaterialB = keep(
		new THREE.LineBasicMaterial({
			color: 0xff9ccf,
			transparent: true,
			opacity: 0.55,
			blending: THREE.AdditiveBlending,
		}),
	);
	const ringA = new THREE.LineSegments(
		keep(tickRing(1.75, 72, 0.06)),
		ringMaterialA,
	);
	ringA.rotation.set(1.15, 0.25, 0);
	const ringB = new THREE.LineSegments(
		keep(tickRing(2.05, 48, 0.08)),
		ringMaterialB,
	);
	ringB.rotation.set(1.35, -0.55, 0.3);
	root.add(ringA, ringB);

	// 环上各挂一颗小菱晶
	const orbMaterial = keep(
		new THREE.MeshBasicMaterial({
			color: new THREE.Color(2, 1.4, 2.6),
			toneMapped: false,
		}),
	);
	const orbGeometry = keep(new THREE.OctahedronGeometry(0.07, 0));
	const orbA = new THREE.Mesh(orbGeometry, orbMaterial);
	const orbB = new THREE.Mesh(orbGeometry, orbMaterial);
	ringA.add(orbA);
	ringB.add(orbB);

	// ── 光点 ──
	const COUNT = 320;
	const positions = new Float32Array(COUNT * 3);
	const colors = new Float32Array(COUNT * 3);
	const speeds = new Float32Array(COUNT);
	const palette = [
		new THREE.Color(0xb27cff),
		new THREE.Color(0xff8fc8),
		new THREE.Color(0xffd98a),
	];
	const placeMote = (i: number, initial: boolean) => {
		const r = 1.3 + Math.random() * 2.4;
		const a = Math.random() * Math.PI * 2;
		positions[i * 3] = Math.cos(a) * r;
		positions[i * 3 + 1] = initial ? (Math.random() - 0.5) * 5 : -2.6;
		positions[i * 3 + 2] = Math.sin(a) * r - 0.4;
	};
	for (let i = 0; i < COUNT; i++) {
		placeMote(i, true);
		speeds[i] = 0.12 + Math.random() * 0.35;
		const color = palette[i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0];
		colors.set([color.r, color.g, color.b], i * 3);
	}
	const moteGeometry = keep(new THREE.BufferGeometry());
	moteGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(positions, 3),
	);
	moteGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	const moteMaterial = keep(
		new THREE.PointsMaterial({
			size: 0.07,
			map: keep(dotTexture()),
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		}),
	);
	const motes = new THREE.Points(moteGeometry, moteMaterial);
	root.add(motes);

	const hemi = new THREE.HemisphereLight(0xd9c6ff, 0x1a0f2e, 0.8);
	const key = new THREE.DirectionalLight(0xffffff, 1.8);
	key.position.set(3, 4, 5);
	const rim = new THREE.DirectionalLight(0xff8fd0, 2.4);
	rim.position.set(-4, -1, -3);
	scene.add(hemi, key, rim);

	// ── 主题：背景色与卡片一致，浅色模式降低泛光与叠加强度 ──
	const applyTheme = () => {
		const dark = isDark();
		const bg =
			getComputedStyle(container).getPropertyValue("--gem-bg").trim() ||
			"#1a1622";
		scene.background = cssColor(bg);
		// 浅色背景本身就超过泛光阈值，开着会把整块画布打白
		bloom.enabled = dark;
		renderer.toneMappingExposure = dark ? 1.05 : 0.9;
		const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
		for (const material of [
			dialMaterial,
			ringMaterialA,
			ringMaterialB,
			moteMaterial,
		]) {
			material.blending = blending;
			material.needsUpdate = true;
		}
		dialMaterial.color.set(dark ? 0xb48cff : 0x7a4fd0);
		dialMaterial.opacity = dark ? 0.55 : 0.4;
		ringMaterialA.color.set(dark ? 0xc9a2ff : 0x8a5ad8);
		ringMaterialB.color.set(dark ? 0xff9ccf : 0xd8609e);
		hemi.intensity = dark ? 0.8 : 1.3;
	};
	applyTheme();
	watchTheme(() => {
		// 等 CSS 变量的过渡结束再取色
		window.setTimeout(() => {
			applyTheme();
			if (!running) renderFrame(0);
		}, 320);
	}, signal);

	// ── 尺寸 ──
	const resize = () => {
		const { width, height } = container.getBoundingClientRect();
		if (width === 0 || height === 0) return;
		renderer.setSize(width, height, false);
		composer.setSize(width, height);
		bloom.resolution.set(width, height);
		camera.aspect = width / height;
		// 竖长的容器拉远一些，保证魔法环完整
		camera.position.z = 8.4 * Math.max(1, 0.9 / camera.aspect);
		camera.updateProjectionMatrix();
	};
	const resizeObserver = new ResizeObserver(() => {
		resize();
		if (!running) renderFrame(0);
	});
	resizeObserver.observe(container);
	resize();

	// ── 交互：指针视差、悬停高亮、点击时停 ──
	const pointer = new THREE.Vector2();
	const target = { x: 0, y: 0 };
	const raycaster = new THREE.Raycaster();
	let hover = false;
	const updatePointer = (event: PointerEvent) => {
		const rect = canvas.getBoundingClientRect();
		pointer.set(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			-((event.clientY - rect.top) / rect.height) * 2 + 1,
		);
	};
	const hitGem = () => {
		raycaster.setFromCamera(pointer, camera);
		return raycaster.intersectObject(gem, false).length > 0;
	};
	canvas.addEventListener(
		"pointermove",
		(event) => {
			updatePointer(event);
			target.x = pointer.x;
			target.y = pointer.y;
			hover = hitGem();
			canvas.style.cursor = hover ? "pointer" : "";
			container.classList.toggle("is-hover", hover);
			if (!running) renderFrame(0);
		},
		{ signal },
	);
	canvas.addEventListener(
		"pointerleave",
		() => {
			target.x = target.y = 0;
			hover = false;
			canvas.style.cursor = "";
			container.classList.remove("is-hover");
		},
		{ signal },
	);
	canvas.addEventListener(
		"click",
		(event) => {
			updatePointer(event as PointerEvent);
			if (hitGem()) toggleTimeStop(event.clientX, event.clientY);
		},
		{ signal },
	);
	// 键盘可达：容器上的按钮同样触发时停
	container
		.querySelector<HTMLButtonElement>("[data-time-stop]")
		?.addEventListener(
			"click",
			() => {
				const rect = canvas.getBoundingClientRect();
				toggleTimeStop(rect.left + rect.width / 2, rect.top + rect.height / 2);
			},
			{ signal },
		);

	// ── 渲染循环 ──
	let elapsed = 0;
	let glow = 0;
	const renderFrame = (dt: number) => {
		const frozen = isTimeStopped();
		const step = frozen ? 0 : dt;
		elapsed += step;

		gemGroup.rotation.y += step * 0.45;
		gemGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;
		root.rotation.x +=
			(target.y * -0.18 - root.rotation.x) * Math.min(1, dt * 3);
		root.rotation.y +=
			(target.x * 0.32 - root.rotation.y) * Math.min(1, dt * 3);

		glow += ((hover ? 1 : 0) - glow) * Math.min(1, dt * 6);
		const pulse = 0.85 + Math.sin(elapsed * 2.2) * 0.15 + glow * 0.5;
		coreMaterial.color.setRGB(1.5 * pulse, 0.85 * pulse, 2.4 * pulse);
		coreLight.intensity = 3 + pulse * 2.5;
		gemMaterial.emissiveIntensity = 0.55 + glow * 0.9;

		dial.rotation.z -= step * 0.06;
		gearA.rotation.z += step * 0.35;
		gearB.rotation.z -= step * 0.35 * (22 / 12);
		gearC.rotation.z -= step * 0.25;
		ringA.rotation.z += step * 0.25;
		ringB.rotation.z -= step * 0.18;
		const oa = elapsed * 0.9;
		orbA.position.set(Math.cos(oa) * 1.75, Math.sin(oa) * 1.75, 0);
		orbB.position.set(
			Math.cos(-oa * 0.7) * 2.05,
			Math.sin(-oa * 0.7) * 2.05,
			0,
		);
		orbA.rotation.y = orbB.rotation.y = elapsed * 2;

		if (step > 0) {
			for (let i = 0; i < COUNT; i++) {
				positions[i * 3 + 1] += speeds[i] * step;
				if (positions[i * 3 + 1] > 2.6) placeMote(i, false);
			}
			moteGeometry.attributes.position.needsUpdate = true;
		}
		composer.render(dt);
	};

	let running = false;
	let visible = false;
	let frame = 0;
	let last = performance.now();
	const loop = (now: number) => {
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		renderFrame(dt);
		frame = requestAnimationFrame(loop);
	};
	const start = () => {
		if (running || reduced) return;
		running = true;
		last = performance.now();
		frame = requestAnimationFrame(loop);
	};
	const stop = () => {
		running = false;
		cancelAnimationFrame(frame);
	};

	renderFrame(0);
	container.classList.add("is-ready");
	watchVisibility(
		container,
		(v) => {
			visible = v;
			if (v) start();
			else stop();
		},
		signal,
		"80px",
	);
	onTimeStop((stopped) => {
		// 时停期间只保留指针视差，其余全部静止；解除后恢复
		if (!stopped && visible) start();
	}, signal);

	signal.addEventListener("abort", () => {
		stop();
		resizeObserver.disconnect();
		for (const item of disposables) item.dispose();
		renderer.dispose();
		canvas.remove();
		delete container.dataset.ready;
		container.classList.remove("is-ready", "is-hover");
	});
}
