/**
 * 图形示例的公共工具：只在可见时运行的动画循环、素材地址、图片加载。
 * 每个示例模块导出 mount(el, signal)，signal 中止时（swup 换页）自行清理。
 */
import { prefersReducedMotion, watchVisibility } from "../magic/lifecycle";

export type Mount = (
	el: HTMLElement,
	signal: AbortSignal,
) => void | Promise<void>;

/** 焰紫、圆粉与几种辅助色，示例里统一使用。 */
export const PALETTE = {
	homura: "#8b5cf6",
	homuraDeep: "#5b21b6",
	homuraLight: "#c4b5fd",
	madoka: "#f472b6",
	madokaLight: "#fbcfe8",
	gold: "#f5c97a",
	ink: "#1e1033",
};

export const reduced = (): boolean => prefersReducedMotion();

/** public/images/gfx/ 下的素材地址。 */
export const asset = (name: string): string =>
	`${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/gfx/${name}`;

export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.decoding = "async";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

/**
 * requestAnimationFrame 循环：元素不可见、页面隐藏或系统要求减少动态效果时不运行，
 * signal 中止时停止。frame 收到距上一帧的秒数与累计时间。
 */
export function runLoop(
	el: HTMLElement,
	signal: AbortSignal,
	frame: (dt: number, t: number) => void,
): void {
	let raf = 0;
	let last = 0;
	let t = 0;
	let visible = false;
	const tick = (now: number) => {
		const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
		last = now;
		t += dt;
		frame(dt, t);
		raf = requestAnimationFrame(tick);
	};
	const start = () => {
		if (raf || reduced()) return;
		last = 0;
		raf = requestAnimationFrame(tick);
	};
	const stop = () => {
		cancelAnimationFrame(raf);
		raf = 0;
	};
	frame(0, 0);
	watchVisibility(
		el,
		(v) => {
			visible = v;
			if (v) start();
			else stop();
		},
		signal,
	);
	document.addEventListener(
		"visibilitychange",
		() => (document.hidden ? stop() : visible && start()),
		{ signal },
	);
	signal.addEventListener("abort", stop);
}

/** 让 canvas 的像素尺寸跟随容器与设备像素比，返回当前的 CSS 尺寸。 */
export function fitCanvas(
	canvas: HTMLCanvasElement,
	signal: AbortSignal,
	onResize?: (w: number, h: number, dpr: number) => void,
): { w: number; h: number; dpr: number } {
	const size = { w: 0, h: 0, dpr: 1 };
	const apply = () => {
		const rect = canvas.getBoundingClientRect();
		size.dpr = Math.min(window.devicePixelRatio || 1, 2);
		size.w = rect.width;
		size.h = rect.height;
		canvas.width = Math.max(1, Math.round(rect.width * size.dpr));
		canvas.height = Math.max(1, Math.round(rect.height * size.dpr));
		onResize?.(size.w, size.h, size.dpr);
	};
	const observer = new ResizeObserver(apply);
	observer.observe(canvas);
	signal.addEventListener("abort", () => observer.disconnect());
	apply();
	return size;
}

/** 在示例里显示一条提示（比如浏览器不支持时的说明）。 */
export function notice(el: HTMLElement, text: string): void {
	const p = document.createElement("p");
	p.className = "gfx-notice";
	p.textContent = text;
	el.append(p);
}
