/**
 * View Transitions：document.startViewTransition() 包住一次 DOM 修改，
 * 浏览器给修改前后的两张快照生成过渡，每张卡片按 view-transition-name 配对、平滑移动。
 */
import { asset, type Mount } from "../shared";

const CAST = [
	["chibi-homura.webp", "晓美焰"],
	["chibi-homura-glasses.webp", "初期的焰"],
	["chibi-akuma.webp", "恶魔焰"],
	["chibi-madoka.webp", "鹿目圆"],
	["chibi-ultimate.webp", "圆神"],
	["chibi-kyubey.webp", "丘比"],
] as const;

type DocWithVT = Document & {
	startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export const mount: Mount = (el, signal) => {
	const grid = document.createElement("div");
	grid.className = "gfx-cards";
	const cards = CAST.map(([file, name], i) => {
		const card = document.createElement("div");
		card.className = "gfx-card";
		card.style.viewTransitionName = `gfx-card-${i}`;
		const img = document.createElement("img");
		img.src = asset(file);
		img.alt = name;
		img.loading = "lazy";
		const label = document.createElement("span");
		label.textContent = name;
		card.append(img, label);
		grid.append(card);
		return card;
	});
	el.prepend(grid);

	const doc = document as DocWithVT;
	const transition = (update: () => void) => {
		if (doc.startViewTransition) doc.startViewTransition(update);
		else update();
	};

	grid.addEventListener(
		"click",
		(e) => {
			const card = (e.target as Element).closest<HTMLElement>(".gfx-card");
			if (!card) return;
			transition(() => {
				const already = card.classList.contains("is-big");
				for (const c of cards) c.classList.remove("is-big");
				grid.classList.toggle("is-focus", !already);
				if (!already) {
					card.classList.add("is-big");
					grid.prepend(card);
				}
			});
		},
		{ signal },
	);

	const controls = document.createElement("div");
	controls.className = "gfx-controls";
	const shuffle = document.createElement("button");
	shuffle.type = "button";
	shuffle.textContent = "打乱";
	shuffle.addEventListener(
		"click",
		() =>
			transition(() => {
				const order = [...grid.children].sort(() => Math.random() - 0.5);
				grid.append(...order);
			}),
		{ signal },
	);
	controls.append(shuffle);
	el.append(controls);
	if (!doc.startViewTransition) {
		const hint = el.querySelector(".gfx-hint");
		if (hint)
			hint.textContent = "当前浏览器不支持 View Transitions，布局会直接切换";
	}
};
