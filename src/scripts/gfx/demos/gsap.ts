/**
 * GSAP：用一条时间线编排「时间停止」。焰滑入，小圆跑来牵住她的手；表盘急转后骤停，
 * 羽毛定格在半空，除两人以外的画面变灰（时停时与焰接触的人不受影响），标题逐字落下。
 * 整条时间线可以重播、倒放、慢放；羽毛的下落是另一条循环时间线，时停时把它的 timeScale 降到 0。
 */
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { asset, type Mount, reduced } from "../shared";

gsap.registerPlugin(SplitText);

const css = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) =>
	Object.assign(el.style, styles);

export const mount: Mount = (el, signal) => {
	const stage = document.createElement("div");
	stage.className = "gfx-stage";
	css(stage, { overflow: "hidden" });
	el.prepend(stage);

	// 背景层：会被时停变灰的部分
	const bg = document.createElement("div");
	css(bg, { position: "absolute", inset: "0" });
	const sky = document.createElement("div");
	css(sky, {
		position: "absolute",
		inset: "0",
		background:
			"radial-gradient(70% 90% at 50% 40%, #6d28d9 0%, #2e1065 55%, #12081f 100%)",
	});
	const dial = document.createElement("img");
	dial.src = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx/shield.webp`;
	css(dial, {
		position: "absolute",
		left: "50%",
		top: "46%",
		width: "62%",
		aspectRatio: "1",
		translate: "-50% -50%",
		opacity: "0.35",
	});
	bg.append(sky, dial);
	const feathers = Array.from({ length: 8 }, (_, i) => {
		const f = document.createElement("img");
		f.src = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/fx/feather-${i % 4}.webp`;
		css(f, {
			position: "absolute",
			left: `${8 + i * 11.5}%`,
			top: "-12%",
			width: "3.2%",
			filter: "drop-shadow(0 0 6px #c4b5fd)",
		});
		bg.append(f);
		return f;
	});

	const sprite = (file: string, left: string) => {
		const img = document.createElement("img");
		img.src = asset(file);
		css(img, {
			position: "absolute",
			left,
			bottom: "8%",
			height: "52%",
			objectFit: "contain",
		});
		return img;
	};
	const homura = sprite("chibi-homura.webp", "26%");
	const madoka = sprite("chibi-madoka.webp", "50%");
	const title = document.createElement("div");
	title.textContent = "時間停止";
	css(title, {
		position: "absolute",
		left: "0",
		right: "0",
		top: "9%",
		textAlign: "center",
		font: "700 clamp(1.6rem, 6vw, 3.4rem)/1 'Noto Serif CJK JP', 'Noto Serif SC', serif",
		letterSpacing: "0.4em",
		paddingLeft: "0.4em",
		color: "#f5f3ff",
		textShadow: "0 0 18px rgba(196, 181, 253, 0.9)",
	});
	stage.append(bg, homura, madoka, title);

	// 羽毛持续下落的循环时间线
	const fall = gsap.timeline({ repeat: -1 });
	feathers.forEach((f, i) => {
		fall.fromTo(
			f,
			{ y: "-10%", rotation: -30 },
			{ y: "2600%", rotation: 200, duration: 6, ease: "none" },
			i * 0.75,
		);
	});

	const split = SplitText.create(title, { type: "chars" });
	const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
	tl.set(bg, { filter: "grayscale(0) brightness(1)" })
		.set(split.chars, { y: -60, opacity: 0 })
		.fromTo(
			homura,
			{ xPercent: -160, opacity: 0 },
			{ xPercent: 0, opacity: 1, duration: 0.8 },
		)
		.fromTo(
			madoka,
			{ xPercent: 220, opacity: 0 },
			{ xPercent: 0, opacity: 1, duration: 0.9 },
			"-=0.3",
		)
		.to(madoka, { xPercent: -42, duration: 0.5, ease: "back.out(2)" })
		// 表盘急转，然后骤停
		.fromTo(
			dial,
			{ rotation: 0 },
			{ rotation: 720, duration: 1.2, ease: "power4.out" },
			"stop",
		)
		.to(fall, { timeScale: 0, duration: 0.6, ease: "power2.out" }, "stop+=0.4")
		.to(
			bg,
			{ filter: "grayscale(1) brightness(0.75)", duration: 0.8 },
			"stop+=0.5",
		)
		.to(
			split.chars,
			{ y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: "bounce.out" },
			"stop+=0.7",
		)
		.to(title, {
			textShadow: "0 0 28px rgba(244, 114, 182, 0.9)",
			duration: 0.6,
			yoyo: true,
			repeat: 1,
		});

	const controls = document.createElement("div");
	controls.className = "gfx-controls";
	const button = (label: string, action: () => void) => {
		const b = document.createElement("button");
		b.type = "button";
		b.textContent = label;
		b.addEventListener("click", action, { signal });
		controls.append(b);
	};
	const restart = () => {
		fall.timeScale(1);
		tl.timeScale(1).restart();
	};
	button("重播", restart);
	button("倒放", () => {
		tl.timeScale(1).reverse();
		gsap.to(fall, { timeScale: 1, duration: 0.6 });
	});
	button("慢放", () => {
		fall.timeScale(1);
		tl.timeScale(0.35).restart();
	});
	el.append(controls);

	if (reduced()) {
		tl.progress(1);
		fall.pause();
	} else {
		// 第一次进入视口时自动播放
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					restart();
					io.disconnect();
				}
			},
			{ threshold: 0.6 },
		);
		io.observe(el);
		signal.addEventListener("abort", () => io.disconnect());
	}

	signal.addEventListener("abort", () => {
		tl.kill();
		fall.kill();
		split.revert();
	});
};
