/**
 * 文章《网页图形与动画的技术路线》中交互示例的入口。
 *
 * 正文里的 <div class="gfx-demo" data-gfx="名称"> 进入视口附近时，按名称动态加载对应模块，
 * 每个示例的库都打成独立 chunk，只在看到它时才下载。由 Layout.astro 的 loadPageEffects 调用。
 */
import { watchVisibility } from "../magic/lifecycle";
import type { Mount } from "./shared";

const demos: Record<string, () => Promise<{ mount: Mount }>> = {
	canvas2d: () => import("./demos/canvas2d"),
	waapi: () => import("./demos/waapi"),
	"view-transition": () => import("./demos/view-transition"),
	three: () => import("./demos/three"),
	ogl: () => import("./demos/ogl"),
	webgpu: () => import("./demos/webgpu"),
	pixi: () => import("./demos/pixi"),
	matter: () => import("./demos/matter"),
	gsap: () => import("./demos/gsap"),
	motion: () => import("./demos/motion"),
	anime: () => import("./demos/anime"),
};

export function initGfxDemos(signal: AbortSignal): void {
	for (const el of document.querySelectorAll<HTMLElement>("[data-gfx]")) {
		const load = demos[el.dataset.gfx ?? ""];
		if (!load || el.dataset.gfxReady) continue;
		let started = false;
		watchVisibility(
			el,
			(visible) => {
				if (!visible || started || signal.aborted) return;
				started = true;
				el.dataset.gfxReady = "1";
				el.classList.add("is-loading");
				load()
					.then(({ mount }) => mount(el, signal))
					.catch((error) => {
						console.error(`[gfx] ${el.dataset.gfx}`, error);
						el.classList.add("is-error");
					})
					.finally(() => el.classList.remove("is-loading"));
			},
			signal,
			"200px",
		);
		signal.addEventListener("abort", () => {
			delete el.dataset.gfxReady;
		});
	}
}
