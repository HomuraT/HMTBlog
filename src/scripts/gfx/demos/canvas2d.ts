/**
 * Canvas 2D：流场粒子。每个粒子沿着随位置与时间变化的角度场移动，
 * 每帧用半透明底色覆盖上一帧留下拖尾；指针附近叠加一个漩涡。
 */
import { fitCanvas, type Mount, PALETTE, runLoop } from "../shared";

export const mount: Mount = (el, signal) => {
	const canvas = document.createElement("canvas");
	el.prepend(canvas);
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const size = fitCanvas(canvas, signal, () => {
		ctx.fillStyle = "#140c20";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	});
	const COUNT = 2000;
	const xs = new Float32Array(COUNT);
	const ys = new Float32Array(COUNT);
	const life = new Float32Array(COUNT);
	const reset = (i: number) => {
		xs[i] = Math.random() * size.w;
		ys[i] = Math.random() * size.h;
		life[i] = 2 + Math.random() * 4;
	};
	for (let i = 0; i < COUNT; i++) reset(i);

	const pointer = { x: -1e4, y: -1e4 };
	canvas.addEventListener(
		"pointermove",
		(e) => {
			const r = canvas.getBoundingClientRect();
			pointer.x = e.clientX - r.left;
			pointer.y = e.clientY - r.top;
		},
		{ signal },
	);
	canvas.addEventListener(
		"pointerleave",
		() => {
			pointer.x = -1e4;
		},
		{ signal },
	);

	runLoop(el, signal, (dt, t) => {
		const { w, h, dpr } = size;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		// 半透明底色盖住上一帧，形成拖尾
		ctx.fillStyle = "rgba(20, 12, 32, 0.08)";
		ctx.fillRect(0, 0, w, h);
		ctx.lineWidth = 1.1;
		for (let i = 0; i < COUNT; i++) {
			const x = xs[i];
			const y = ys[i];
			// 角度场：几组正弦叠加，随时间缓慢旋转
			let angle =
				Math.sin(x * 0.006 + t * 0.3) * 1.6 +
				Math.cos(y * 0.007 - t * 0.25) * 1.6 +
				Math.sin((x + y) * 0.003) * 0.8;
			const dx = x - pointer.x;
			const dy = y - pointer.y;
			const d2 = dx * dx + dy * dy;
			if (d2 < 140 * 140) {
				// 指针附近绕圈
				angle = Math.atan2(dy, dx) + Math.PI / 2 + 0.3;
			}
			const speed = 70 * (dt || 0.016);
			const nx = x + Math.cos(angle) * speed;
			const ny = y + Math.sin(angle) * speed;
			ctx.strokeStyle =
				i % 5 === 0
					? PALETTE.madoka
					: i % 3 === 0
						? PALETTE.homuraLight
						: PALETTE.homura;
			ctx.globalAlpha = 0.55;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(nx, ny);
			ctx.stroke();
			xs[i] = nx;
			ys[i] = ny;
			life[i] -= dt;
			if (life[i] < 0 || nx < 0 || nx > w || ny < 0 || ny > h) reset(i);
		}
		ctx.globalAlpha = 1;
	});
};
