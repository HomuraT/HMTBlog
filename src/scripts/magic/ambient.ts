/**
 * 全站常驻特效：黑羽飘落、魔法时钟走时、卡片指针光斑、点击碎晶、文章阅读进度。
 *
 * 这些元素都在 swup 容器之外（见 MagicBackground.astro），整站只初始化一次；
 * 换页后只需调用 refreshAmbient() 更新和当前页面有关的状态。
 */
import { isDark, prefersReducedMotion } from "./lifecycle";
import { isTimeStopped, onTimeStop } from "./time-stop";

let started = false;

export function initAmbient(): void {
	if (started) return;
	started = true;
	const reduced = prefersReducedMotion();
	startClock();
	startFeathers(reduced);
	bindSpotlight();
	if (!reduced) bindShards();
	bindReadingProgress();
}

export function refreshAmbient(): void {
	updateReadingProgress();
}

// ── 魔法时钟：表盘指针按本地时间走动，时停期间停摆 ──────────────

function startClock(): void {
	const hour = document.getElementById("mbg-hour");
	const minute = document.getElementById("mbg-minute");
	const second = document.getElementById("mbg-second");
	if (!hour || !minute || !second) return;
	const tick = () => {
		if (isTimeStopped()) return;
		const now = new Date();
		const s = now.getSeconds();
		const m = now.getMinutes() + s / 60;
		const h = (now.getHours() % 12) + m / 60;
		hour.style.transform = `rotate(${h * 30}deg)`;
		minute.style.transform = `rotate(${m * 6}deg)`;
		second.style.transform = `rotate(${s * 6}deg)`;
	};
	tick();
	window.setInterval(tick, 1000);
}

// ── 黑羽与星屑 ────────────────────────────────────────────────

interface Feather {
	x: number;
	y: number;
	size: number;
	vy: number;
	sway: number;
	phase: number;
	spin: number;
	angle: number;
	sprite: number;
}

interface Glint {
	x: number;
	y: number;
	size: number;
	phase: number;
	speed: number;
	hue: number;
}

/** codex 画的四根黑羽（public/images/fx/），2 倍分辨率，绘制时缩放一半。 */
const FEATHER_URLS = [0, 1, 2, 3].map(
	(i) =>
		`${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx/feather-${i}.webp`,
);

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.decoding = "async";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

/** 图片羽毛的预渲染：深色模式加一圈紫色辉光，否则黑羽会融进背景。 */
function imageSprite(img: HTMLImageElement, dark: boolean): HTMLCanvasElement {
	const pad = 16;
	const canvas = document.createElement("canvas");
	canvas.width = img.width + pad * 2;
	canvas.height = img.height + pad * 2;
	const ctx = canvas.getContext("2d");
	if (!ctx) return canvas;
	if (dark) {
		ctx.shadowColor = "rgba(185, 135, 255, 0.7)";
		ctx.shadowBlur = 14;
	} else {
		ctx.globalAlpha = 0.8;
	}
	ctx.drawImage(img, pad, pad);
	return canvas;
}

/** 图片加载前的兜底：用路径画一根羽毛。dark 为黑羽紫边，light 为深紫半透明。 */
function drawFeatherSprite(dark: boolean, variant: number): HTMLCanvasElement {
	const length = 64;
	const width = 18 + variant * 4;
	const canvas = document.createElement("canvas");
	canvas.width = width * 2 + 8;
	canvas.height = length + 8;
	const ctx = canvas.getContext("2d");
	if (!ctx) return canvas;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	const top = -length / 2;
	const bottom = length / 2;

	const vane = new Path2D();
	vane.moveTo(0, top);
	vane.bezierCurveTo(
		width * 0.9,
		top + length * 0.18,
		width,
		bottom - length * 0.35,
		1,
		bottom - 10,
	);
	vane.lineTo(-1, bottom - 10);
	vane.bezierCurveTo(
		-width * 0.8,
		bottom - length * 0.3,
		-width * 0.75,
		top + length * 0.2,
		0,
		top,
	);

	const gradient = ctx.createLinearGradient(0, top, 0, bottom);
	if (dark) {
		gradient.addColorStop(0, "rgba(28, 16, 44, 0.95)");
		gradient.addColorStop(1, "rgba(8, 4, 14, 0.9)");
	} else {
		gradient.addColorStop(0, "rgba(70, 40, 110, 0.55)");
		gradient.addColorStop(1, "rgba(30, 14, 50, 0.5)");
	}
	ctx.fillStyle = gradient;
	ctx.fill(vane);

	// 羽枝的细缺口
	ctx.globalCompositeOperation = "destination-out";
	ctx.lineWidth = 1.2;
	for (let i = 0; i < 6; i++) {
		const y = top + length * (0.25 + i * 0.09);
		const side = i % 2 === 0 ? 1 : -1;
		ctx.beginPath();
		ctx.moveTo(side * width * 0.95, y - 2);
		ctx.lineTo(side * width * 0.35, y + 5);
		ctx.stroke();
	}
	ctx.globalCompositeOperation = "source-over";

	ctx.strokeStyle = dark
		? "rgba(190, 150, 255, 0.45)"
		: "rgba(120, 70, 180, 0.35)";
	ctx.lineWidth = 1;
	ctx.stroke(vane);

	// 羽轴
	ctx.strokeStyle = dark
		? "rgba(210, 180, 255, 0.55)"
		: "rgba(60, 30, 90, 0.6)";
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(0, top + 2);
	ctx.quadraticCurveTo(1.5, 0, 0, bottom);
	ctx.stroke();
	return canvas;
}

function startFeathers(reduced: boolean): void {
	const canvas = document.getElementById(
		"mbg-feathers",
	) as HTMLCanvasElement | null;
	const ctx = canvas?.getContext("2d");
	if (!canvas || !ctx) return;

	let width = 0;
	let height = 0;
	let dpr = 1;
	let sprites: HTMLCanvasElement[] = [];
	let spritesDark = isDark();
	let images: HTMLImageElement[] = [];
	let spriteScale = 1;
	const feathers: Feather[] = [];
	const glints: Glint[] = [];

	const buildSprites = () => {
		spritesDark = isDark();
		if (images.length > 0) {
			sprites = images.map((img) => imageSprite(img, spritesDark));
			spriteScale = 0.5;
		} else {
			sprites = [0, 1, 2].map((v) => drawFeatherSprite(spritesDark, v));
			spriteScale = 1;
		}
	};

	const spawnFeather = (initial: boolean): Feather => ({
		x: Math.random() * width,
		y: initial ? Math.random() * height : -60 - Math.random() * 200,
		size: 0.45 + Math.random() * 0.7,
		vy: 16 + Math.random() * 26,
		sway: 18 + Math.random() * 30,
		phase: Math.random() * Math.PI * 2,
		spin: 0.4 + Math.random() * 0.8,
		angle: Math.random() * Math.PI * 2,
		sprite: Math.floor(Math.random() * 4),
	});

	const resize = () => {
		dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		const featherCount = Math.max(
			5,
			Math.min(16, Math.round((width * height) / 110000)),
		);
		const glintCount = Math.max(
			12,
			Math.min(40, Math.round((width * height) / 45000)),
		);
		while (feathers.length < featherCount) feathers.push(spawnFeather(true));
		feathers.length = featherCount;
		while (glints.length < glintCount) {
			glints.push({
				x: Math.random(),
				y: Math.random(),
				size: 1.5 + Math.random() * 3,
				phase: Math.random() * Math.PI * 2,
				speed: 0.6 + Math.random() * 1.4,
				hue: Math.random() < 0.7 ? 290 : 340,
			});
		}
		glints.length = glintCount;
	};

	const drawGlint = (g: Glint, t: number, dark: boolean) => {
		const twinkle = (Math.sin(t * g.speed + g.phase) + 1) / 2;
		const alpha = twinkle ** 3 * (dark ? 0.9 : 0.6);
		if (alpha < 0.02) return;
		const x = g.x * width;
		const y = ((((g.y - t * 0.004 * g.speed) % 1) + 1) % 1) * height;
		const r = g.size * (0.6 + twinkle * 0.6);
		ctx.fillStyle = dark
			? `hsla(${g.hue}, 90%, 82%, ${alpha})`
			: `hsla(${g.hue}, 70%, 55%, ${alpha})`;
		// 四芒星
		ctx.beginPath();
		ctx.moveTo(x, y - r * 2.4);
		ctx.quadraticCurveTo(x, y, x + r * 2.4, y);
		ctx.quadraticCurveTo(x, y, x, y + r * 2.4);
		ctx.quadraticCurveTo(x, y, x - r * 2.4, y);
		ctx.quadraticCurveTo(x, y, x, y - r * 2.4);
		ctx.fill();
	};

	let last = performance.now();
	let elapsed = 0;
	let frame = 0;

	const render = (dt: number) => {
		const dark = isDark();
		if (dark !== spritesDark) buildSprites();
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, width, height);
		for (const g of glints) drawGlint(g, elapsed, dark);
		for (const f of feathers) {
			f.phase += dt * 0.9;
			f.y += f.vy * dt;
			f.x += Math.sin(f.phase) * f.sway * dt;
			f.angle = Math.sin(f.phase * 0.7) * 0.9 + f.phase * 0.05;
			if (f.y > height + 80) Object.assign(f, spawnFeather(false));
			const sprite = sprites[f.sprite % sprites.length];
			// 绕自身长轴翻转，模拟羽毛在空中打转
			const flip = Math.cos(f.phase * f.spin);
			ctx.save();
			ctx.translate(f.x, f.y);
			ctx.rotate(f.angle);
			ctx.scale(
				f.size *
					spriteScale *
					(0.25 + Math.abs(flip) * 0.75) *
					Math.sign(flip || 1),
				f.size * spriteScale,
			);
			ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
			ctx.restore();
		}
	};

	const loop = (now: number) => {
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		elapsed += dt;
		render(dt);
		frame = requestAnimationFrame(loop);
	};

	buildSprites();
	resize();
	window.addEventListener("resize", resize, { passive: true });
	Promise.all(FEATHER_URLS.map(loadImage)).then(
		(loaded) => {
			images = loaded;
			buildSprites();
			if (reduced) render(0);
		},
		() => {
			// 加载失败就继续用路径画的羽毛
		},
	);

	if (reduced) {
		render(0);
		window.addEventListener("resize", () => render(0), { passive: true });
		return;
	}
	frame = requestAnimationFrame(loop);
	onTimeStop((stopped) => {
		cancelAnimationFrame(frame);
		if (!stopped) {
			last = performance.now();
			frame = requestAnimationFrame(loop);
		}
	});
}

// ── 卡片指针光斑：记录指针在 .magic-card 内的位置，供 CSS 径向渐变使用 ──

function bindSpotlight(): void {
	document.addEventListener(
		"pointermove",
		(event) => {
			if (event.pointerType !== "mouse") return;
			const card = (event.target as Element | null)?.closest<HTMLElement>(
				".magic-card",
			);
			if (!card) return;
			const rect = card.getBoundingClientRect();
			card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
			card.style.setProperty("--my", `${event.clientY - rect.top}px`);
		},
		{ passive: true },
	);
}

// ── 点击碎晶 ───────────────────────────────────────────────────

const SHARD_COLORS = ["var(--homura)", "var(--madoka)", "var(--gem-gold)"];

function bindShards(): void {
	const layer = document.getElementById("fx-shards");
	if (!layer) return;
	document.addEventListener(
		"pointerdown",
		(event) => {
			if (event.button !== 0 || layer.childElementCount > 48) return;
			const target = event.target as Element | null;
			if (target?.closest("input, textarea, select, [contenteditable]")) return;
			for (let i = 0; i < 7; i++) {
				const shard = document.createElement("span");
				shard.className = "fx-shard";
				shard.style.left = `${event.clientX}px`;
				shard.style.top = `${event.clientY}px`;
				shard.style.setProperty(
					"--shard",
					SHARD_COLORS[i % SHARD_COLORS.length],
				);
				layer.append(shard);
				const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.6;
				const distance = 26 + Math.random() * 38;
				const dx = Math.cos(angle) * distance;
				const dy = Math.sin(angle) * distance;
				const turn = (angle * 180) / Math.PI + 90;
				shard
					.animate(
						[
							{
								transform: `translate(0, 0) rotate(${turn}deg) scale(0.4)`,
								opacity: 1,
							},
							{
								transform: `translate(${dx}px, ${dy}px) rotate(${turn}deg) scale(1)`,
								opacity: 0.9,
								offset: 0.55,
							},
							{
								transform: `translate(${dx * 1.25}px, ${dy * 1.25 + 14}px) rotate(${turn + 90}deg) scale(0.2)`,
								opacity: 0,
							},
						],
						{
							duration: 620 + Math.random() * 240,
							easing: "cubic-bezier(.22,1,.36,1)",
						},
					)
					.finished.then(
						() => shard.remove(),
						() => shard.remove(),
					);
			}
		},
		{ passive: true },
	);
}

// ── 阅读进度 ───────────────────────────────────────────────────

let progressFrame = 0;

function updateReadingProgress(): void {
	progressFrame = 0;
	const bar = document.getElementById("reading-progress");
	if (!bar) return;
	const post = document.getElementById("post-container");
	if (!post) {
		bar.classList.remove("is-active");
		return;
	}
	const rect = post.getBoundingClientRect();
	const total = rect.height - window.innerHeight;
	const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
	bar.style.setProperty("--progress", progress.toFixed(4));
	bar.classList.add("is-active");
}

function bindReadingProgress(): void {
	const schedule = () => {
		if (!progressFrame)
			progressFrame = requestAnimationFrame(updateReadingProgress);
	};
	window.addEventListener("scroll", schedule, { passive: true });
	window.addEventListener("resize", schedule, { passive: true });
	updateReadingProgress();
}
