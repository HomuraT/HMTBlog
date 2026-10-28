/**
 * 首页主视觉：晓美焰的灵魂宝石。
 *
 * 蛋形紫水晶（全透射、色散、虹彩），内部翻涌着灵魂之火，金色冠与杯用爪扣住宝石，
 * 冠顶托着焰的菱形徽记；背后是缓慢转动的焰之盾与齿轮，外圈两道倾斜的魔法环，
 * 四周飘着紫、粉、金三色光点。点击宝石触发时间停止。
 *
 * 不用泛光后期：透射材质的高光远超 1，泛光会把整颗宝石糊成白色，改用背后的光晕精灵。
 *
 * 只在首页按需加载（Layout.astro → loadPageEffects），three.js 打成独立 chunk。
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
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

	const disposables: { dispose(): void }[] = [envTexture];
	const keep = <T extends { dispose(): void }>(item: T): T => {
		disposables.push(item);
		return item;
	};

	// ── 宝石 ──
	// 灵魂宝石的默认形态是蛋形（形似法贝热彩蛋），上下嵌着金属托座，顶端是主人的徽记。
	// 焰的徽记是菱形，所以冠顶托着一颗紫色菱形宝石。
	const root = new THREE.Group();
	scene.add(root);
	const gemGroup = new THREE.Group();
	root.add(gemGroup);

	const EGG_H = 1.18;
	const EGG_R = 0.74;
	/** 蛋形半径：下宽上窄。 */
	const eggRadius = (y: number) => {
		const t = Math.max(-1, Math.min(1, y / EGG_H));
		return EGG_R * Math.sqrt(1 - t * t) * (1 - 0.13 * t);
	};
	const eggProfile: THREE.Vector2[] = [];
	for (let i = 0; i <= 96; i++) {
		const y = -EGG_H + (i / 96) * EGG_H * 2;
		eggProfile.push(new THREE.Vector2(Math.max(eggRadius(y), 0.0001), y));
	}
	const gemGeometry = keep(new THREE.LatheGeometry(eggProfile, 96));
	const gemMaterial = keep(
		new THREE.MeshPhysicalMaterial({
			color: 0xd2b0ff,
			emissive: 0x2a0860,
			emissiveIntensity: 0.35,
			metalness: 0,
			roughness: 0.03,
			transmission: 1,
			thickness: 1.6,
			ior: 1.65,
			dispersion: 3,
			attenuationColor: new THREE.Color(0xa24cff),
			attenuationDistance: 0.9,
			iridescence: 0.45,
			iridescenceIOR: 1.4,
			clearcoat: 1,
			clearcoatRoughness: 0.02,
			specularIntensity: 1,
			envMapIntensity: 1.5,
		}),
	);
	const gem = new THREE.Mesh(gemGeometry, gemMaterial);
	gemGroup.add(gem);

	// 宝石中心的亮核：不透明，透过透射材质能看到被折射的样子
	const coreMaterial = keep(
		new THREE.MeshBasicMaterial({
			color: new THREE.Color(1.6, 0.9, 2.4),
			toneMapped: false,
		}),
	);
	const core = new THREE.Mesh(
		keep(new THREE.IcosahedronGeometry(0.16, 3)),
		coreMaterial,
	);
	core.scale.set(1, 1.3, 1);
	gemGroup.add(core);
	const coreLight = new THREE.PointLight(0xb070ff, 4, 5, 1.8);
	gemGroup.add(coreLight);

	// 灵魂之火：在宝石内部翻涌的紫粉色光雾，叠加在宝石之上，不参与深度测试
	const soulUniforms = {
		uTime: { value: 0 },
		uGlow: { value: 1 },
		uColorA: { value: new THREE.Color(0x7a3cff) },
		uColorB: { value: new THREE.Color(0xff8fd0) },
	};
	const soulMaterial = keep(
		new THREE.ShaderMaterial({
			uniforms: soulUniforms,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexShader: /* glsl */ `
				varying vec3 vPos;
				varying vec3 vNormal;
				varying vec3 vView;
				void main() {
					vPos = position;
					vec4 mv = modelViewMatrix * vec4(position, 1.0);
					vNormal = normalize(normalMatrix * normal);
					vView = normalize(-mv.xyz);
					gl_Position = projectionMatrix * mv;
				}
			`,
			fragmentShader: /* glsl */ `
				uniform float uTime;
				uniform float uGlow;
				uniform vec3 uColorA;
				uniform vec3 uColorB;
				varying vec3 vPos;
				varying vec3 vNormal;
				varying vec3 vView;
				float hash(vec3 p) {
					p = fract(p * 0.3183099 + 0.1);
					p *= 17.0;
					return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
				}
				float noise(vec3 x) {
					vec3 i = floor(x);
					vec3 f = fract(x);
					f = f * f * (3.0 - 2.0 * f);
					return mix(
						mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
						mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
						f.z);
				}
				float fbm(vec3 p) {
					float v = 0.0;
					float a = 0.5;
					for (int i = 0; i < 4; i++) {
						v += a * noise(p);
						p = p * 2.03 + vec3(1.7, 9.2, 3.1);
						a *= 0.5;
					}
					return v;
				}
				void main() {
					float facing = abs(dot(normalize(vNormal), normalize(vView)));
					vec3 p = vPos * 2.4 + vec3(0.0, -uTime * 0.45, uTime * 0.12);
					float n = fbm(p + fbm(p * 1.3 + uTime * 0.08));
					float wisps = smoothstep(0.42, 0.78, n);
					float body = pow(facing, 1.6);
					vec3 col = mix(uColorA, uColorB, smoothstep(0.5, 0.85, n));
					float strength = (0.18 + wisps * 0.9) * body + pow(1.0 - facing, 3.0) * 0.12;
					gl_FragColor = vec4(col * strength * uGlow, 1.0);
				}
			`,
		}),
	);
	const soul = new THREE.Mesh(
		keep(new THREE.SphereGeometry(1, 48, 32)),
		soulMaterial,
	);
	soul.scale.set(EGG_R * 0.78, EGG_H * 0.8, EGG_R * 0.78);
	soul.renderOrder = 2;
	gemGroup.add(soul);

	// 宝石背后的柔光晕
	const haloMaterial = keep(
		new THREE.SpriteMaterial({
			map: keep(dotTexture()),
			color: 0xa868ff,
			transparent: true,
			opacity: 0.55,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		}),
	);
	const halo = new THREE.Sprite(haloMaterial);
	halo.scale.set(3.4, 3.8, 1);
	halo.position.z = -0.9;
	root.add(halo);

	// ── 金色托座 ──
	const gold = keep(
		new THREE.MeshPhysicalMaterial({
			color: 0xe9c27a,
			metalness: 1,
			roughness: 0.24,
			clearcoat: 0.4,
			clearcoatRoughness: 0.15,
			envMapIntensity: 1.4,
		}),
	);
	/** 贴着蛋面、向外偏移 lift 的一段轮廓，用来做冠和杯。 */
	const shellProfile = (y0: number, y1: number, lift: number) => {
		const pts: THREE.Vector2[] = [];
		for (let i = 0; i <= 32; i++) {
			const y = y0 + ((y1 - y0) * i) / 32;
			pts.push(new THREE.Vector2(eggRadius(y) + lift, y));
		}
		return pts;
	};

	// 顶冠：贴合蛋顶的金壳
	const capProfile = shellProfile(EGG_H * 0.76, EGG_H, 0.025);
	capProfile.push(new THREE.Vector2(0.0001, EGG_H + 0.025));
	const cap = new THREE.Mesh(
		keep(new THREE.LatheGeometry(capProfile, 64)),
		gold,
	);
	gemGroup.add(cap);

	// 底杯：贴合蛋底的金壳，下端收成尖
	const cupProfile = [
		new THREE.Vector2(0.0001, -EGG_H - 0.32),
		new THREE.Vector2(0.05, -EGG_H - 0.12),
		...shellProfile(-EGG_H, -EGG_H * 0.74, 0.025),
	];
	const cup = new THREE.Mesh(
		keep(new THREE.LatheGeometry(cupProfile, 64)),
		gold,
	);
	gemGroup.add(cup);

	// 冠沿与杯沿的串珠
	const beadGeometry = keep(new THREE.SphereGeometry(0.032, 12, 8));
	const addBeadRing = (y: number, count: number) => {
		const r = eggRadius(y) + 0.04;
		const beads = new THREE.InstancedMesh(beadGeometry, gold, count);
		const m = new THREE.Matrix4();
		for (let i = 0; i < count; i++) {
			const a = (i / count) * Math.PI * 2;
			m.makeTranslation(Math.cos(a) * r, y, Math.sin(a) * r);
			beads.setMatrixAt(i, m);
		}
		gemGroup.add(beads);
	};
	addBeadRing(EGG_H * 0.76, 32);
	addBeadRing(-EGG_H * 0.74, 28);
	const rimGeometry = keep(
		new THREE.TorusGeometry(eggRadius(EGG_H * 0.76) + 0.035, 0.014, 8, 96),
	);
	const rimTop = new THREE.Mesh(rimGeometry, gold);
	rimTop.rotation.x = Math.PI / 2;
	rimTop.position.y = EGG_H * 0.76 - 0.04;
	gemGroup.add(rimTop);

	// 爪：沿蛋面从冠沿、杯沿伸向腰线，末端一颗小珠
	const clawRadius = 0.022;
	const addClaws = (
		from: number,
		to: number,
		count: number,
		offset: number,
	) => {
		for (let i = 0; i < count; i++) {
			const a = (i / count) * Math.PI * 2 + offset;
			const pts: THREE.Vector3[] = [];
			for (let k = 0; k <= 12; k++) {
				const y = from + ((to - from) * k) / 12;
				// 爪子中段稍稍鼓起，末端收回贴住宝石
				const lift = 0.03 + Math.sin((k / 12) * Math.PI) * 0.03;
				const r = eggRadius(y) + lift;
				pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
			}
			const claw = new THREE.Mesh(
				keep(
					new THREE.TubeGeometry(
						new THREE.CatmullRomCurve3(pts),
						24,
						clawRadius,
						8,
						false,
					),
				),
				gold,
			);
			gemGroup.add(claw);
			const tip = new THREE.Mesh(beadGeometry, gold);
			tip.position.copy(pts[pts.length - 1]);
			tip.scale.setScalar(1.3);
			gemGroup.add(tip);
		}
	};
	addClaws(EGG_H * 0.76, EGG_H * 0.18, 8, 0);
	addClaws(-EGG_H * 0.74, -EGG_H * 0.3, 8, Math.PI / 8);

	// 冠顶：短颈、托环，托着焰的菱形徽记
	const neck = new THREE.Mesh(
		keep(
			new THREE.LatheGeometry(
				[
					[0.12, 0],
					[0.06, 0.08],
					[0.045, 0.18],
					[0.08, 0.22],
					[0.0001, 0.24],
				].map(([x, y]) => new THREE.Vector2(x, y)),
				32,
			),
		),
		gold,
	);
	neck.position.y = EGG_H;
	gemGroup.add(neck);
	const emblemRing = new THREE.Mesh(
		keep(new THREE.TorusGeometry(0.17, 0.016, 8, 48)),
		gold,
	);
	emblemRing.position.y = EGG_H + 0.43;
	gemGroup.add(emblemRing);
	const emblemMaterial = keep(
		new THREE.MeshPhysicalMaterial({
			color: 0xc79bff,
			emissive: 0x5a18c0,
			emissiveIntensity: 0.6,
			roughness: 0.05,
			transmission: 0.6,
			thickness: 0.3,
			ior: 1.8,
			clearcoat: 1,
			flatShading: true,
		}),
	);
	const emblem = new THREE.Mesh(
		keep(new THREE.OctahedronGeometry(0.13, 0)),
		emblemMaterial,
	);
	emblem.scale.set(0.8, 1.45, 0.55);
	emblem.position.y = EGG_H + 0.43;
	gemGroup.add(emblem);

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
	// codex 画的焰之盾线稿（public/images/fx/shield.webp）加载好后替换掉画布画的表盘
	new THREE.TextureLoader().load(
		`${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx/shield.webp`,
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

	// 环上各有一颗沿轨道运行的光点
	const orbMaterial = keep(
		new THREE.SpriteMaterial({
			map: keep(dotTexture()),
			color: 0xf4d8ff,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		}),
	);
	const orbA = new THREE.Sprite(orbMaterial);
	const orbB = new THREE.Sprite(orbMaterial);
	orbA.scale.setScalar(0.28);
	orbB.scale.setScalar(0.22);
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
		haloMaterial.blending = dark
			? THREE.AdditiveBlending
			: THREE.NormalBlending;
		haloMaterial.opacity = dark ? 0.75 : 0.3;
		renderer.toneMappingExposure = dark ? 0.92 : 0.9;
		const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
		for (const material of [
			dialMaterial,
			ringMaterialA,
			ringMaterialB,
			moteMaterial,
			orbMaterial,
		]) {
			material.blending = blending;
			material.needsUpdate = true;
		}
		dialMaterial.color.set(dark ? 0xb48cff : 0x7a4fd0);
		dialMaterial.opacity = dark ? 0.55 : 0.4;
		ringMaterialA.color.set(dark ? 0xc9a2ff : 0x8a5ad8);
		ringMaterialB.color.set(dark ? 0xff9ccf : 0xd8609e);
		orbMaterial.color.set(dark ? 0xf4d8ff : 0xb070e8);
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
		gemMaterial.emissiveIntensity = 0.3 + glow * 0.6;
		soulUniforms.uTime.value = elapsed;
		soulUniforms.uGlow.value = 0.9 + glow * 0.8 + Math.sin(elapsed * 2.2) * 0.1;
		emblem.rotation.y = elapsed * 1.2;
		halo.scale.set(3.4 * (0.96 + glow * 0.12), 3.8 * (0.96 + glow * 0.12), 1);

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

		if (step > 0) {
			for (let i = 0; i < COUNT; i++) {
				positions[i * 3 + 1] += speeds[i] * step;
				if (positions[i * 3 + 1] > 2.6) placeMote(i, false);
			}
			moteGeometry.attributes.position.needsUpdate = true;
		}
		renderer.render(scene, camera);
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
