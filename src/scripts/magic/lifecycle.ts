/**
 * 页面级特效的生命周期。
 *
 * swup 换页时只替换 <main> 和 #toc，旧页面上启动的渲染循环、事件监听不会自己停。
 * 每个页面特效拿 pageSignal() 注册清理逻辑，Layout.astro 在 content:replace 之前
 * 调用 endPage()，中止旧信号并换一个新的。
 */

let controller = new AbortController();

export function pageSignal(): AbortSignal {
	return controller.signal;
}

export function endPage(): void {
	controller.abort();
	controller = new AbortController();
}

export const prefersReducedMotion = (): boolean =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isDark = (): boolean =>
	document.documentElement.classList.contains("dark");

/** 元素进出视口时回调，signal 中止后自动断开。 */
export function watchVisibility(
	element: Element,
	callback: (visible: boolean) => void,
	signal: AbortSignal,
	rootMargin = "0px",
): void {
	const observer = new IntersectionObserver(
		([entry]) => callback(entry.isIntersecting),
		{ rootMargin },
	);
	observer.observe(element);
	signal.addEventListener("abort", () => observer.disconnect());
}

/** 明暗模式切换时回调（Fuwari 通过 <html> 上的 dark 类切换）。 */
export function watchTheme(
	callback: (dark: boolean) => void,
	signal: AbortSignal,
): void {
	let last = isDark();
	const observer = new MutationObserver(() => {
		const now = isDark();
		if (now !== last) {
			last = now;
			callback(now);
		}
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	signal.addEventListener("abort", () => observer.disconnect());
}
