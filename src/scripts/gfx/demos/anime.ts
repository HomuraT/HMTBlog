/**
 * anime.js：SVG 描线与网格交错。左侧逐笔描出焰的菱形徽记（createDrawable），
 * 右侧是取自焰长袜纹样的菱形格阵，单击任一格，波纹按 stagger 的 grid/from 从该格向外扩散。
 */
import { animate, stagger, svg } from "animejs";
import { type Mount, PALETTE, reduced } from "../shared";

const NS = "http://www.w3.org/2000/svg";
const COLS = 12;
const ROWS = 7;

export const mount: Mount = (el, signal) => {
	const root = document.createElementNS(NS, "svg");
	root.setAttribute("viewBox", "0 0 640 360");
	root.classList.add("gfx-stage");
	el.prepend(root);

	// 徽记：圆环、菱形、十字与中央的沙漏，用描边路径表示
	const emblem = document.createElementNS(NS, "g");
	emblem.setAttribute("transform", "translate(150 180)");
	emblem.setAttribute("fill", "none");
	emblem.setAttribute("stroke-linecap", "round");
	emblem.setAttribute("stroke-linejoin", "round");
	const paths = [
		["M 0 -120 A 120 120 0 1 1 -0.1 -120", PALETTE.homuraLight, 3],
		["M 0 -104 A 104 104 0 1 1 -0.1 -104", PALETTE.homura, 1.5],
		["M 0 -96 L 62 0 L 0 96 L -62 0 Z", PALETTE.madoka, 3],
		["M 0 -96 L 0 96 M -62 0 L 62 0", PALETTE.homuraLight, 2],
		["M -22 -44 L 22 -44 L 3 -4 L 22 44 L -22 44 L -3 -4 Z", PALETTE.gold, 2.5],
	] as const;
	for (const [d, color, width] of paths) {
		const p = document.createElementNS(NS, "path");
		p.setAttribute("d", d);
		p.setAttribute("stroke", color);
		p.setAttribute("stroke-width", String(width));
		emblem.append(p);
	}
	root.append(emblem);

	// 菱形格阵
	const grid = document.createElementNS(NS, "g");
	grid.setAttribute("transform", "translate(318 54)");
	const cells: SVGPathElement[] = [];
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			const p = document.createElementNS(NS, "path");
			const x = c * 24 + (r % 2) * 12;
			const y = r * 38;
			p.setAttribute(
				"d",
				`M ${x} ${y - 15} L ${x + 8} ${y} L ${x} ${y + 15} L ${x - 8} ${y} Z`,
			);
			p.setAttribute("fill", PALETTE.homuraDeep);
			p.style.transformBox = "fill-box";
			p.style.transformOrigin = "center";
			p.style.cursor = "pointer";
			p.dataset.index = String(r * COLS + c);
			grid.append(p);
			cells.push(p);
		}
	}
	root.append(grid);

	const drawables = svg.createDrawable(emblem.querySelectorAll("path"));
	const draw = animate(drawables, {
		draw: ["0 0", "0 1", "1 1"],
		ease: "inOutQuad",
		duration: 2600,
		delay: stagger(260),
		loop: true,
		loopDelay: 600,
		autoplay: !reduced(),
	});

	const ripple = (from: number) =>
		animate(cells, {
			scale: [1, 1.6, 1],
			fill: [PALETTE.homura, PALETTE.madoka, PALETTE.homuraDeep],
			delay: stagger(55, { grid: [COLS, ROWS], from }),
			duration: 900,
			ease: "outQuad",
		});
	grid.addEventListener(
		"click",
		(e) => {
			const index = (e.target as SVGElement).dataset?.index;
			if (index !== undefined) ripple(Number(index));
		},
		{ signal },
	);
	// 进入时先从中心扩散一次
	const intro = ripple(Math.floor((ROWS / 2) * COLS + COLS / 2));

	signal.addEventListener("abort", () => {
		draw.revert();
		intro.revert();
	});
};
