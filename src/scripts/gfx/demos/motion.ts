/**
 * Motion：弹簧动画与手势。小圆跟着指针跑，焰用更软、带延迟的弹簧追在后面；
 * 单击时小圆弹跳一下；丘比用 hover() 手势，指针靠近时竖起来。
 * 每次 pointermove 都重新调用 animate()，Motion 会接着当前速度过渡，不会突变。
 */
import { animate, hover, spring } from "motion";
import { asset, type Mount } from "../shared";

export const mount: Mount = (el, signal) => {
	const stage = document.createElement("div");
	stage.className = "gfx-stage";
	el.prepend(stage);

	const sprite = (file: string, size: number) => {
		const img = document.createElement("img");
		img.src = asset(file);
		img.className = "gfx-sprite";
		img.style.width = `${size}px`;
		img.style.height = `${size}px`;
		stage.append(img);
		return img;
	};
	const homura = sprite("chibi-homura.webp", 96);
	const madoka = sprite("chibi-madoka.webp", 96);
	const kyubey = sprite("chibi-kyubey.webp", 76);
	kyubey.style.pointerEvents = "auto";

	let kyubeyY = 0;
	const place = () => {
		const { width, height } = el.getBoundingClientRect();
		kyubeyY = height - 96;
		animate(madoka, { x: width * 0.55, y: height * 0.45 }, { duration: 0 });
		animate(homura, { x: width * 0.3, y: height * 0.45 }, { duration: 0 });
		animate(kyubey, { x: width - 100, y: kyubeyY }, { duration: 0 });
	};
	place();

	el.addEventListener(
		"pointermove",
		(e) => {
			const r = el.getBoundingClientRect();
			const x = e.clientX - r.left - 48;
			const y = e.clientY - r.top - 48;
			// 小圆：硬一些的弹簧，紧跟指针
			animate(madoka, { x, y }, { type: spring, stiffness: 260, damping: 18 });
			// 焰：软弹簧加延迟，停在小圆左后方
			animate(
				homura,
				{ x: x - 70, y: y + 10 },
				{ type: spring, stiffness: 70, damping: 12, delay: 0.12 },
			);
			// 面朝指针移动的方向
			madoka.style.scale = e.movementX < 0 ? "-1 1" : "1 1";
		},
		{ signal },
	);
	el.addEventListener(
		"pointerdown",
		() => {
			animate(
				madoka,
				{ rotate: [0, -12, 10, 0], scale: [1, 1.25, 1] },
				{ duration: 0.6 },
			);
			animate(homura, { rotate: [0, 8, 0] }, { duration: 0.5, delay: 0.15 });
		},
		{ signal },
	);
	const cancel = hover(kyubey, () => {
		animate(
			kyubey,
			{ y: kyubeyY - 18, rotate: -8 },
			{ type: spring, stiffness: 400, damping: 10 },
		);
		return () =>
			animate(
				kyubey,
				{ y: kyubeyY, rotate: 0 },
				{ type: spring, stiffness: 300, damping: 14 },
			);
	});

	const observer = new ResizeObserver(place);
	observer.observe(el);
	signal.addEventListener("abort", () => {
		cancel();
		observer.disconnect();
	});
};
