/**
 * 首页主视觉：标题逐字解码、数字滚动、指针光晕与倾斜，以及灵魂宝石的按需加载。
 */
import { prefersReducedMotion } from "./lifecycle";

const POOL = "時間停止魔法少女焰円環理希望絶望契約魂宝石";

/** 未定位的字符先随机跳动，再从左到右依次落定。 */
function decode(el: HTMLElement, signal: AbortSignal, delay = 0): void {
	const target = el.dataset.text ?? el.textContent ?? "";
	el.dataset.text = target;
	const chars = [...target];
	const duration = 500 + chars.length * 70;
	let frame = 0;
	let start = 0;
	const tick = (now: number) => {
		if (!start) start = now + delay;
		const k = Math.max(0, Math.min(1, (now - start) / duration));
		el.textContent = chars
			.map((c, i) => {
				if (c === " " || k >= (i + 1) / chars.length) return c;
				return POOL[Math.floor(Math.random() * POOL.length)];
			})
			.join("");
		if (k < 1) frame = requestAnimationFrame(tick);
	};
	frame = requestAnimationFrame(tick);
	signal.addEventListener("abort", () => {
		cancelAnimationFrame(frame);
		el.textContent = target;
	});
}

function countUp(el: HTMLElement): void {
	const target = Number(el.dataset.count);
	const start = performance.now();
	const step = (now: number) => {
		const k = Math.min(1, (now - start) / 1400);
		el.textContent = String(Math.round(target * (1 - (1 - k) ** 3)));
		if (k < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}

export function initHomeHero(hero: HTMLElement, signal: AbortSignal): void {
	const reduced = prefersReducedMotion();

	if (!reduced) {
		hero.querySelectorAll<HTMLElement>("[data-decode]").forEach((el, i) => {
			decode(el, signal, i * 180);
		});
		hero.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
	}

	const tilt = hero.querySelector<HTMLElement>("[data-tilt]");
	hero.addEventListener(
		"pointermove",
		(event) => {
			const rect = hero.getBoundingClientRect();
			hero.style.setProperty("--px", `${event.clientX - rect.left}px`);
			hero.style.setProperty("--py", `${event.clientY - rect.top}px`);
			if (!tilt || reduced || event.pointerType !== "mouse") return;
			const box = tilt.getBoundingClientRect();
			const x = (event.clientX - box.left) / box.width - 0.5;
			const y = (event.clientY - box.top) / box.height - 0.5;
			tilt.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
			tilt.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
		},
		{ passive: true, signal },
	);
	hero.addEventListener(
		"pointerleave",
		() => {
			tilt?.style.setProperty("--rx", "0deg");
			tilt?.style.setProperty("--ry", "0deg");
		},
		{ signal },
	);

	const stage = hero.querySelector<HTMLElement>("[data-soul-gem]");
	if (stage) {
		import("./soul-gem").then(({ initSoulGem }) => {
			if (!signal.aborted) initSoulGem(stage, signal);
		});
	}
}
