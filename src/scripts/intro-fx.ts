/**
 * 个人简介页（/intro/）的滚动渐入等特效。
 *
 * 这段代码原来直接写在 src/pages/intro.astro 的 <script> 里，但那样在 swup
 * 客户端跳转时根本不会执行：swup 只替换 containers（main / #toc），
 * 容器外的 <script> 不会被插入到页面里。结果就是从别的页面点进个人简介没特效，
 * 手动刷新（走整页加载）才有。
 *
 * 所以改成一个独立模块，由 src/layouts/Layout.astro 里那段「每页都有」的脚本
 * 在首次加载和每次 page:view 时按需动态 import 并调用 initIntroEffects()。
 */

let observer: IntersectionObserver | null = null;

function stagger(items: Element[], step = 45): void {
	items.forEach((el, i) => {
		(el as HTMLElement).style.transitionDelay = `${i * step}ms`;
	});
}

function reveal(el: Element): void {
	el.classList.add("fx-reveal");
	observer?.observe(el);
}

/**
 * 离站的链接一律开新标签页，别顶掉当前页面。
 * 必须在 buildContactRows 之前跑：那边是靠拷贝行内 <a> 的属性来生成整行的
 * <a>，属性先加好，target/rel 才会一起被带上去。
 * 顺带一个好处：swup 会跳过带 target 的链接，CV 那个 PDF 不会再被
 * 当成站内页面去做转场。
 */
function openExternalInNewTab(md: Element): void {
	for (const a of md.querySelectorAll("a[href]")) {
		const href = a.getAttribute("href") ?? "";

		// mailto: / tel: 交给系统处理，开空白标签页没意义
		if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) continue;
		// 页内锚点（含标题旁边的 # 链接）
		if (href.startsWith("#")) continue;

		let target: URL;
		try {
			target = new URL(href, location.href);
		} catch {
			continue;
		}

		const isExternal = target.origin !== location.origin;
		// 站内的附件（CV 的 PDF）也开新标签，站内页面则保留 swup 转场
		const isAsset = /\.(pdf|zip|png|jpe?g|gif|svg|webp)$/i.test(target.pathname);
		if (!isExternal && !isAsset) continue;

		a.setAttribute("target", "_blank");
		a.setAttribute("rel", "noopener noreferrer");
	}
}

/** 把 Contact 那一段 <strong>标签</strong>　值<br> 拆成可独立悬停的行 */
function buildContactRows(section: Element): void {
	const p = section.querySelector(":scope > p");
	if (!p) return;

	const wrap = document.createElement("div");
	wrap.className = "fx-contact";

	for (const raw of p.innerHTML.split(/<br\s*\/?>/i)) {
		const m = raw.match(/^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/i);
		if (!m) continue;

		const val = document.createElement("span");
		val.className = "fx-cval";
		// 内容来自本仓库的 markdown，不是用户输入
		val.innerHTML = m[2].replace(/^[\s　]+/, "");

		// 整行可点：把行本身做成 <a>，行内原来的 <a> 降级成 <span>。
		// 不能直接嵌套 <a>（非法 HTML，浏览器会拆开）。这样做的好处是
		// 中键新标签页、右键复制链接、Tab 聚焦、状态栏预览全都还在。
		const inner = val.querySelector("a");
		let row: HTMLElement;

		if (inner) {
			const anchor = document.createElement("a");
			for (const attr of Array.from(inner.attributes)) {
				if (attr.name !== "class") anchor.setAttribute(attr.name, attr.value);
			}
			anchor.className = "fx-crow no-styling";

			const text = document.createElement("span");
			text.className = "fx-clink";
			text.append(...Array.from(inner.childNodes));
			inner.replaceWith(text);

			row = anchor;
		} else {
			row = document.createElement("div");
			row.className = "fx-crow fx-crow-plain";
		}

		const key = document.createElement("span");
		key.className = "fx-ckey";
		key.textContent = m[1].trim();

		row.append(key, val);
		wrap.appendChild(row);
	}

	if (!wrap.children.length) return;
	p.replaceWith(wrap);

	const rows = Array.from(wrap.children);
	stagger(rows, 55);
	for (const row of rows) reveal(row);
}

function enhance(md: HTMLElement): void {
	openExternalInNewTab(md);

	const hero = md.querySelector(":scope > section");
	if (!hero) return;

	// 姓名 + 自绘横线
	const h1 = hero.querySelector(":scope > h1");
	if (h1) {
		h1.classList.add("fx-name");
		const rule = document.createElement("div");
		rule.className = "fx-rule";
		h1.after(rule);
		observer?.observe(rule);
	}

	// 开头三段简介
	for (const p of hero.querySelectorAll(":scope > p")) reveal(p);

	for (const section of hero.querySelectorAll<HTMLElement>(":scope > section")) {
		const id = section.querySelector(":scope > h2")?.id ?? "";

		const heading = section.querySelector(":scope > h2");
		if (heading) reveal(heading);

		if (id === "contact") {
			buildContactRows(section);
			continue;
		}

		if (id === "research-interests") {
			const ul = section.querySelector(":scope > ul");
			if (!ul) continue;
			ul.classList.add("fx-chips");
			const chips = Array.from(ul.children);
			stagger(chips, 60);
			for (const li of chips) {
				li.classList.add("fx-chip");
				reveal(li);
			}
			continue;
		}

		if (id === "education") {
			section.classList.add("fx-timeline");
			const entries = Array.from(section.querySelectorAll(":scope > p"));
			stagger(entries, 90);
			for (const p of entries) {
				p.classList.add("fx-edu");
				reveal(p);
			}
			continue;
		}

		if (id === "publications") {
			// 「My name is in bold...」那段说明
			for (const p of section.querySelectorAll(":scope > p")) reveal(p);

			for (const year of section.querySelectorAll(":scope > section")) {
				const h3 = year.querySelector(":scope > h3");
				if (h3) {
					h3.classList.add("fx-year");
					reveal(h3);
				}
				const pubs = Array.from(year.querySelectorAll(":scope > p"));
				stagger(pubs, 70);
				for (const p of pubs) {
					p.classList.add("fx-pub");
					reveal(p);
				}
			}
			continue;
		}

		reveal(section);
	}
}

/** 幂等：不在个人简介页时直接返回，重复调用只会重建 observer。 */
export function initIntroEffects(): void {
	const root = document.getElementById("intro-root");
	if (!root) return;

	const md = root.querySelector<HTMLElement>(".custom-md");
	if (!md) return;

	observer?.disconnect();
	observer = new IntersectionObserver(
		entries => {
			for (const e of entries) {
				if (!e.isIntersecting) continue;
				e.target.classList.add("is-in");
				observer?.unobserve(e.target);
			}
		},
		{ rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
	);

	// .fx 一加上，.fx-reveal 就变成 opacity:0，后面必须有人把它们点亮，
	// 所以整段包 try/catch：万一抛异常就把 .fx 摘掉，让内容原样显示。
	root.classList.add("fx");
	try {
		if (md.dataset.fx === "done") {
			// swup 缓存有可能把已增强的 DOM 原样存下来再还原回来，
			// 这时结构都在，只需要重新接管观察。
			for (const el of md.querySelectorAll(".fx-reveal, .fx-rule")) {
				if (!el.classList.contains("is-in")) observer.observe(el);
			}
		} else {
			md.dataset.fx = "done";
			enhance(md);
		}
	} catch (err) {
		console.error("[intro] 特效初始化失败，已回退到无特效显示", err);
		root.classList.remove("fx");
		observer.disconnect();
		observer = null;
	}
}
