/**
 * matter.js：二维刚体物理。焰与小圆的布偶、灵魂宝石、悲叹之种等道具落进画面并相互碰撞，
 * 可以用指针抓起、甩出，单击空白处掉落新的道具。matter.js 只算物理，绘制用 Canvas 2D。
 */
import Matter from "matter-js";
import { asset, fitCanvas, loadImage, type Mount, runLoop } from "../shared";

const {
	Bodies,
	Body,
	Composite,
	Engine,
	Events,
	Mouse,
	MouseConstraint,
	Query,
} = Matter;

/** 道具：图片、显示尺寸（宽）、碰撞形状。 */
const PROPS = [
	{ file: "prop-plush-homura.webp", w: 92, shape: "circle" },
	{ file: "prop-plush-madoka.webp", w: 96, shape: "circle" },
	{ file: "prop-gem-homura.webp", w: 46, shape: "box" },
	{ file: "prop-gem-madoka.webp", w: 48, shape: "box" },
	{ file: "prop-grief-seed.webp", w: 40, shape: "box" },
	{ file: "prop-shield.webp", w: 72, shape: "circle" },
	{ file: "prop-ribbon.webp", w: 64, shape: "box" },
	{ file: "prop-dark-orb.webp", w: 70, shape: "circle" },
] as const;

export const mount: Mount = async (el, signal) => {
	const canvas = document.createElement("canvas");
	el.prepend(canvas);
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const images = await Promise.all(PROPS.map((p) => loadImage(asset(p.file))));
	if (signal.aborted) return;

	const engine = Engine.create();
	engine.gravity.y = 1;
	const walls = [0, 1, 2].map(() =>
		Bodies.rectangle(0, 0, 60, 60, { isStatic: true }),
	);
	Composite.add(engine.world, walls);
	const size = fitCanvas(canvas, signal, (w, h) => {
		// 地面与左右墙随尺寸重新摆放
		Body.setVertices(walls[0], Bodies.rectangle(0, 0, w + 200, 60).vertices);
		Body.setPosition(walls[0], { x: w / 2, y: h + 30 });
		for (const [i, x] of [
			[1, -30],
			[2, w + 30],
		]) {
			Body.setVertices(walls[i], Bodies.rectangle(0, 0, 60, h * 3).vertices);
			Body.setPosition(walls[i], { x, y: h / 2 - h });
		}
	});

	const bodies: Matter.Body[] = [];
	const spawn = (
		x: number,
		y: number,
		index = Math.floor(Math.random() * PROPS.length),
	) => {
		const prop = PROPS[index];
		const img = images[index];
		const scale = (prop.w / img.width) * Math.min(1, size.w / 640 + 0.25);
		const w = img.width * scale;
		const h = img.height * scale;
		const body =
			prop.shape === "circle"
				? Bodies.circle(x, y, Math.min(w, h) / 2, {
						restitution: 0.35,
						friction: 0.3,
					})
				: Bodies.rectangle(x, y, w * 0.8, h * 0.9, {
						restitution: 0.4,
						chamfer: { radius: 8 },
					});
		Body.setAngle(body, (Math.random() - 0.5) * 0.8);
		body.plugin = { img, w, h };
		bodies.push(body);
		Composite.add(engine.world, body);
		if (bodies.length > 36)
			Composite.remove(engine.world, bodies.shift() as Matter.Body);
	};
	for (let i = 0; i < 12; i++) {
		spawn(size.w * (0.2 + Math.random() * 0.6), -80 - i * 70, i % PROPS.length);
	}

	// matter 的 Mouse 按 data-pixel-ratio 换算坐标，让它与 CSS 像素一致
	canvas.setAttribute("data-pixel-ratio", String(size.dpr));
	const mouse = Mouse.create(canvas);
	// 默认会拦截滚轮，导致指针在画布上时页面无法滚动
	const m = mouse as unknown as { mousewheel: EventListener };
	canvas.removeEventListener("wheel", m.mousewheel);
	canvas.removeEventListener("DOMMouseScroll", m.mousewheel);
	const drag = MouseConstraint.create(engine, {
		mouse,
		constraint: { stiffness: 0.2, render: { visible: false } },
	});
	Composite.add(engine.world, drag);
	Events.on(drag, "mousedown", () => {
		if (Query.point(bodies, mouse.position).length === 0)
			spawn(mouse.position.x, mouse.position.y - 20);
	});

	runLoop(el, signal, (dt) => {
		// matter 建议每步不超过 16.7 ms，帧间隔长时拆成几步
		const ms = Math.min(dt, 1 / 20) * 1000 || 16;
		const steps = Math.ceil(ms / 16.6);
		for (let i = 0; i < steps; i++) Engine.update(engine, ms / steps);
		const { w, h, dpr } = size;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		for (const body of bodies) {
			const {
				img,
				w: bw,
				h: bh,
			} = body.plugin as { img: HTMLImageElement; w: number; h: number };
			ctx.save();
			ctx.translate(body.position.x, body.position.y);
			ctx.rotate(body.angle);
			ctx.drawImage(img, -bw / 2, -bh / 2, bw, bh);
			ctx.restore();
		}
	});

	signal.addEventListener("abort", () => {
		Mouse.clearSourceEvents(mouse);
		Engine.clear(engine);
		canvas.remove();
	});
};
