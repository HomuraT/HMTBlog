import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

/** 首页导航卡片里的一项：要么指向站内笔记（slug），要么是任意 url。卡片只显示标题 */
export type HomeLink = {
	/** posts 集合里的 slug，如 "tech/server/init"。标题自动取自 frontmatter */
	slug?: string;
	/** 任意链接。给了 url 就必须自己写 title */
	url?: string;
	/** 覆盖自动取到的标题；url 形式时必填 */
	title?: string;
	/** 外链会开新标签页并显示斜箭头。不填时按 url 是否 http(s) 开头自动判断 */
	external?: boolean;
};

export type HomeSection = {
	title: string;
	/** astro-icon 图标名，见 https://icones.js.org/ */
	icon: string;
	links: HomeLink[];
};

export type HomeConfig = {
	title: string;
	subtitle?: string;
	description?: string;
	/** 顶部那排快捷按钮 */
	actions: {
		name: string;
		url: string;
		icon: string;
		external?: boolean;
	}[];
	sections: HomeSection[];
	/** 底部「最新文章」列几篇，0 表示不显示这一块 */
	recentPostCount: number;
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};
