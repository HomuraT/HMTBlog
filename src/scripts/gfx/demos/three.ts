/**
 * three.js：焰的盾。盾面用盾的线稿作发光纹样，中央的玻璃沙漏里沙子持续下落；
 * 拖动旋转（OrbitControls），单击让沙子停住，即「挡住沙子就能停止时间」。
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { fitCanvas, loadImage, type Mount, runLoop } from "../shared";

export const mount: Mount = (el, signal) => {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	const canvas = renderer.domElement;
	el.prepend(canvas);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 50);
	camera.position.set(0.6, 0.4, 6.2);
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	scene.add(new THREE.HemisphereLight(0xe8dcff, 0x1a0f2e, 0.6));
	const key = new THREE.DirectionalLight(0xffffff, 1.6);
	key.position.set(3, 4, 5);
	scene.add(key);

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	controls.enableZoom = false;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.8;

	// 盾：圆盘的正反面贴线稿作发光纹样，侧面与外圈是金属
	const group = new THREE.Group();
	scene.add(group);
	const metal = new THREE.MeshStandardMaterial({
		color: 0x8a8398,
		metalness: 0.9,
		roughness: 0.3,
	});
	const face = new THREE.MeshStandardMaterial({
		color: 0x1d1528,
		metalness: 0.7,
		roughness: 0.35,
		emissive: new THREE.Color(0xb48cff),
		emissiveIntensity: 1.4,
	});
	// 线稿是「白色 + 透明度」，emissiveMap 只读颜色，先画到黑底上再当贴图
	loadImage(
		`${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx/shield.webp`,
	).then((img) => {
		if (signal.aborted) return;
		const c = document.createElement("canvas");
		c.width = img.width;
		c.height = img.height;
		const g = c.getContext("2d");
		if (!g) return;
		g.fillStyle = "#000";
		g.fillRect(0, 0, c.width, c.height);
		g.drawImage(img, 0, 0);
		const texture = new THREE.CanvasTexture(c);
		texture.colorSpace = THREE.SRGBColorSpace;
		face.emissiveMap = texture;
		face.needsUpdate = true;
	});
	const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.16, 128), [
		metal,
		face,
		face,
	]);
	disc.rotation.x = Math.PI / 2;
	group.add(disc);
	const rim = new THREE.Mesh(
		new THREE.TorusGeometry(1.62, 0.07, 16, 160),
		metal,
	);
	group.add(rim);

	// 沙漏：玻璃外壳 + 金属框，立在盾面前方
	const hourglass = new THREE.Group();
	hourglass.position.z = 0.55;
	group.add(hourglass);
	const glassProfile: THREE.Vector2[] = [];
	for (let i = 0; i <= 40; i++) {
		const y = -0.62 + (i / 40) * 1.24;
		const r = 0.05 + 0.28 * Math.abs(y / 0.62) ** 1.4;
		glassProfile.push(new THREE.Vector2(r, y));
	}
	const glass = new THREE.Mesh(
		new THREE.LatheGeometry(glassProfile, 48),
		new THREE.MeshPhysicalMaterial({
			color: 0xe9ddff,
			transmission: 1,
			thickness: 0.2,
			roughness: 0.02,
			ior: 1.4,
			transparent: true,
			opacity: 0.9,
		}),
	);
	hourglass.add(glass);
	for (const y of [-0.66, 0.66]) {
		const cap = new THREE.Mesh(
			new THREE.CylinderGeometry(0.4, 0.4, 0.06, 48),
			metal,
		);
		cap.position.y = y;
		hourglass.add(cap);
	}

	// 沙：下落的颗粒与上下两堆沙
	const SAND = 260;
	const pos = new Float32Array(SAND * 3);
	const vel = new Float32Array(SAND);
	const spawn = (i: number, initial: boolean) => {
		pos[i * 3] = (Math.random() - 0.5) * 0.02;
		pos[i * 3 + 1] = initial ? -Math.random() * 0.5 : -0.02;
		pos[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
		vel[i] = Math.random() * 0.3;
	};
	for (let i = 0; i < SAND; i++) spawn(i, true);
	const sandGeo = new THREE.BufferGeometry();
	sandGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
	const sandMat = new THREE.PointsMaterial({ color: 0xd8b4fe, size: 0.03 });
	hourglass.add(new THREE.Points(sandGeo, sandMat));
	const pileMat = new THREE.MeshStandardMaterial({
		color: 0xc084fc,
		emissive: 0x6d28d9,
		emissiveIntensity: 0.4,
	});
	const topPile = new THREE.Mesh(
		new THREE.ConeGeometry(0.26, 0.3, 32),
		pileMat,
	);
	topPile.rotation.x = Math.PI;
	topPile.position.y = 0.26;
	const bottomPile = new THREE.Mesh(
		new THREE.ConeGeometry(0.3, 0.22, 32),
		pileMat,
	);
	bottomPile.position.y = -0.5;
	hourglass.add(topPile, bottomPile);

	// 单击（非拖动）切换时停
	let stopped = false;
	let downAt = 0;
	canvas.addEventListener(
		"pointerdown",
		() => {
			downAt = performance.now();
		},
		{
			signal,
		},
	);
	canvas.addEventListener(
		"pointerup",
		() => {
			if (performance.now() - downAt > 250) return;
			stopped = !stopped;
			controls.autoRotate = !stopped;
			face.emissive.set(stopped ? 0x9a9aa8 : 0xb48cff);
			sandMat.color.set(stopped ? 0xb8b8c4 : 0xd8b4fe);
		},
		{ signal },
	);

	const size = fitCanvas(canvas, signal, (w, h) => {
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	});
	void size;

	let fill = 0;
	runLoop(el, signal, (dt) => {
		controls.update();
		if (!stopped) {
			fill = (fill + dt * 0.04) % 1;
			topPile.scale.setScalar(1 - fill * 0.8);
			bottomPile.scale.set(
				0.4 + fill * 0.6,
				0.4 + fill * 0.6,
				0.4 + fill * 0.6,
			);
			for (let i = 0; i < SAND; i++) {
				vel[i] += dt * 2.2;
				pos[i * 3 + 1] -= vel[i] * dt;
				if (pos[i * 3 + 1] < -0.5 + fill * 0.08) spawn(i, false);
			}
			sandGeo.attributes.position.needsUpdate = true;
		}
		renderer.render(scene, camera);
	});

	signal.addEventListener("abort", () => {
		controls.dispose();
		scene.traverse((o) => {
			if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
				o.geometry.dispose();
				for (const m of [o.material].flat()) m.dispose();
			}
		});
		pmrem.dispose();
		renderer.dispose();
		canvas.remove();
	});
};
