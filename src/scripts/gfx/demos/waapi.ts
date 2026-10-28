/**
 * Web Animations API：焰的魔法阵（她的魔法阵用菱形代替圆）。
 * element.animate() 返回 Animation 对象，可以直接暂停、倒放、调整速度。
 */
import { asset, type Mount, PALETTE, reduced } from "../shared";

const NS = "http://www.w3.org/2000/svg";

export const mount: Mount = (el, signal) => {
	const svg = document.createElementNS(NS, "svg");
	svg.setAttribute("viewBox", "-220 -160 440 320");
	svg.classList.add("gfx-stage");
	el.prepend(svg);

	const ring = (r: number, dash: string, width: number) => {
		const c = document.createElementNS(NS, "circle");
		c.setAttribute("r", String(r));
		c.setAttribute("fill", "none");
		c.setAttribute("stroke", PALETTE.homuraLight);
		c.setAttribute("stroke-opacity", "0.45");
		c.setAttribute("stroke-width", String(width));
		c.setAttribute("stroke-dasharray", dash);
		return c;
	};

	const outer = document.createElementNS(NS, "g");
	outer.append(ring(132, "2 8", 2), ring(118, "", 1.5));
	const diamonds: SVGPathElement[] = [];
	for (let i = 0; i < 12; i++) {
		const p = document.createElementNS(NS, "path");
		const big = i % 3 === 0;
		p.setAttribute(
			"d",
			big ? "M0 -18 L10 0 L0 18 L-10 0 Z" : "M0 -11 L6 0 L0 11 L-6 0 Z",
		);
		p.setAttribute("fill", big ? PALETTE.homura : PALETTE.homuraLight);
		p.setAttribute("transform", `rotate(${i * 30}) translate(0 -125)`);
		outer.append(p);
		diamonds.push(p);
	}
	const inner = document.createElementNS(NS, "g");
	inner.append(ring(86, "10 6", 1.5));
	for (let i = 0; i < 4; i++) {
		const p = document.createElementNS(NS, "path");
		p.setAttribute("d", "M0 -9 L5 0 L0 9 L-5 0 Z");
		p.setAttribute("fill", PALETTE.madoka);
		p.setAttribute("transform", `rotate(${i * 90 + 45}) translate(0 -86)`);
		inner.append(p);
	}
	const shield = document.createElementNS(NS, "image");
	shield.setAttribute("href", asset("prop-shield.webp"));
	shield.setAttribute("x", "-62");
	shield.setAttribute("y", "-62");
	shield.setAttribute("width", "124");
	shield.setAttribute("height", "124");
	svg.append(outer, inner, shield);
	for (const g of [outer, inner, shield]) {
		g.style.transformBox = "view-box";
		g.style.transformOrigin = "0 0";
	}

	const animations: Animation[] = [
		outer.animate([{ rotate: "0deg" }, { rotate: "360deg" }], {
			duration: 24000,
			iterations: Number.POSITIVE_INFINITY,
		}),
		inner.animate([{ rotate: "0deg" }, { rotate: "-360deg" }], {
			duration: 14000,
			iterations: Number.POSITIVE_INFINITY,
		}),
		shield.animate([{ scale: "1" }, { scale: "1.06" }, { scale: "1" }], {
			duration: 3000,
			iterations: Number.POSITIVE_INFINITY,
			easing: "ease-in-out",
		}),
		// 菱形依次闪烁：同一组关键帧，用 delay 错开
		...diamonds.map((d, i) =>
			d.animate([{ opacity: 0.35 }, { opacity: 1 }, { opacity: 0.35 }], {
				duration: 2400,
				delay: i * 200,
				iterations: Number.POSITIVE_INFINITY,
			}),
		),
	];
	if (reduced()) for (const a of animations) a.pause();

	const controls = document.createElement("div");
	controls.className = "gfx-controls";
	const button = (label: string, action: () => void) => {
		const b = document.createElement("button");
		b.type = "button";
		b.textContent = label;
		b.addEventListener("click", action, { signal });
		controls.append(b);
		return b;
	};
	const toggle = button("暂停", () => {
		const paused = animations[0].playState === "paused";
		for (const a of animations) paused ? a.play() : a.pause();
		toggle.textContent = paused ? "暂停" : "继续";
	});
	if (reduced()) toggle.textContent = "继续";
	button("倒放", () => {
		for (const a of animations) a.playbackRate *= -1;
	});
	button("加速", () => {
		for (const a of animations)
			a.playbackRate =
				Math.sign(a.playbackRate) * Math.min(8, Math.abs(a.playbackRate) * 2);
	});
	button("复位", () => {
		for (const a of animations) a.playbackRate = 1;
	});
	el.append(controls);
	signal.addEventListener("abort", () => {
		for (const a of animations) a.cancel();
	});
};
