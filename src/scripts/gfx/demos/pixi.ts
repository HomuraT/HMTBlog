/**
 * PixiJS：恶魔焰身边盘旋的黑羽、彼岸花、灵魂宝石与缎带。
 * 700 个精灵由 WebGL 批量绘制；指针划过时把附近的精灵吹开，单击从该处放出一圈羽毛。
 */
import { Application, Assets, Container, Sprite, type Texture } from "pixi.js";
import { asset, type Mount, runLoop } from "../shared";

interface Mote {
	sprite: Sprite;
	angle: number;
	radius: number;
	speed: number;
	vx: number;
	vy: number;
	spin: number;
}

export const mount: Mount = async (el, signal) => {
	const app = new Application();
	await app.init({
		resizeTo: el,
		backgroundAlpha: 0,
		antialias: true,
		resolution: Math.min(window.devicePixelRatio, 2),
		autoDensity: true,
		autoStart: false,
	});
	if (signal.aborted) {
		app.destroy(true);
		return;
	}
	el.prepend(app.canvas);
	app.ticker.stop();

	const fx = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx`;
	const [feathers, others, akuma] = await Promise.all([
		Promise.all(
			[0, 1, 2, 3].map((i) => Assets.load<Texture>(`${fx}/feather-${i}.webp`)),
		),
		Promise.all(
			[
				"prop-lily.webp",
				"prop-gem-homura.webp",
				"prop-ribbon.webp",
				"prop-grief-seed.webp",
			].map((n) => Assets.load<Texture>(asset(n))),
		),
		Assets.load<Texture>(asset("chibi-akuma.webp")),
	]);
	if (signal.aborted) {
		app.destroy(true);
		return;
	}

	const layer = new Container();
	app.stage.addChild(layer);
	const center = new Sprite(akuma);
	center.anchor.set(0.5);
	app.stage.addChild(center);

	const motes: Mote[] = [];
	const add = (
		texture: Texture,
		scale: number,
		radius: number,
		extra?: Partial<Mote>,
	) => {
		const sprite = new Sprite(texture);
		sprite.anchor.set(0.5);
		sprite.scale.set(scale);
		const isFeather = feathers.includes(texture);
		// 黑羽在深色背景上不明显，染成淡紫色
		sprite.tint = isFeather ? 0xd9c8ff : 0xffffff;
		sprite.alpha = isFeather ? 0.85 : 0.95;
		layer.addChild(sprite);
		const mote: Mote = {
			sprite,
			angle: Math.random() * Math.PI * 2,
			radius,
			speed: (0.15 + Math.random() * 0.35) * (Math.random() < 0.5 ? 1 : -1),
			vx: 0,
			vy: 0,
			spin: (Math.random() - 0.5) * 2,
			...extra,
		};
		motes.push(mote);
		return mote;
	};
	for (let i = 0; i < 700; i++) {
		const feather = i % 5 !== 0;
		const texture = feather ? feathers[i % 4] : others[i % 4];
		add(
			texture,
			feather ? 0.1 + Math.random() * 0.12 : 0.07 + Math.random() * 0.08,
			60 + Math.random() * 320,
		);
	}

	const pointer = { x: -1e4, y: -1e4 };
	app.canvas.addEventListener(
		"pointermove",
		(e) => {
			const r = app.canvas.getBoundingClientRect();
			pointer.x = e.clientX - r.left;
			pointer.y = e.clientY - r.top;
		},
		{ signal },
	);
	app.canvas.addEventListener(
		"pointerleave",
		() => {
			pointer.x = -1e4;
		},
		{
			signal,
		},
	);
	app.canvas.addEventListener(
		"click",
		(e) => {
			const r = app.canvas.getBoundingClientRect();
			const x = e.clientX - r.left;
			const y = e.clientY - r.top;
			for (let i = 0; i < 24; i++) {
				const a = (i / 24) * Math.PI * 2;
				const m = add(feathers[i % 4], 0.12, 0, {
					vx: Math.cos(a) * 420,
					vy: Math.sin(a) * 420,
				});
				m.sprite.position.set(x, y);
				m.radius = -1; // 自由飞行的羽毛，飞出画面后移除
			}
		},
		{ signal },
	);

	runLoop(el, signal, (dt, t) => {
		const w = app.screen.width;
		const h = app.screen.height;
		const cx = w / 2;
		const cy = h / 2;
		const fit = Math.min(w, h) / 560;
		center.position.set(cx, cy + Math.sin(t * 1.4) * 6);
		center.scale.set(fit * 0.75);
		for (let i = motes.length - 1; i >= 0; i--) {
			const m = motes[i];
			const s = m.sprite;
			if (m.radius < 0) {
				m.vy += 260 * dt;
				s.x += m.vx * dt;
				s.y += m.vy * dt;
				m.vx *= 0.985;
				s.rotation += m.spin * dt * 3;
				if (s.y > h + 60 || s.x < -60 || s.x > w + 60) {
					s.destroy();
					motes.splice(i, 1);
				}
				continue;
			}
			m.angle += m.speed * dt;
			const tx = cx + Math.cos(m.angle) * m.radius * fit * 1.4;
			const ty = cy + Math.sin(m.angle) * m.radius * fit * 0.8;
			// 指针附近的精灵被推开，之后靠阻尼回到轨道
			const dx = s.x - pointer.x;
			const dy = s.y - pointer.y;
			const d2 = dx * dx + dy * dy;
			if (d2 < 110 * 110) {
				const f = (1 - Math.sqrt(d2) / 110) * 1600;
				const d = Math.sqrt(d2) + 0.01;
				m.vx += (dx / d) * f * dt;
				m.vy += (dy / d) * f * dt;
			}
			m.vx += (tx - s.x) * 6 * dt;
			m.vy += (ty - s.y) * 6 * dt;
			m.vx *= 0.9;
			m.vy *= 0.9;
			s.x += m.vx * dt;
			s.y += m.vy * dt;
			s.rotation += m.spin * dt;
		}
		app.render();
	});

	signal.addEventListener("abort", () => app.destroy(true, { children: true }));
};
