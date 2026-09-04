import type {
	ExpressiveCodeConfig,
	HomeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "HMT",
	subtitle: "个人博客",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{
			name: "博客",
			url: "/blog/", // 文章列表，原来在 "/"，现在让位给引导主页
		},
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "个人简介",
			url: "/intro/", // 内部链接不要带 base path，会自动加上
		},
		{
			name: "GitHub",
			url: "https://github.com/HomuraT", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

/**
 * 引导主页（"/"）的内容。文章列表已经移到 "/blog/"。
 *
 * links 里写 slug 就够了 —— 标题、摘要、日期都从文章 frontmatter 里读，
 * 不用在这儿重复维护。slug 就是 src/content/posts 下去掉后缀的路径，
 * 例如 src/content/posts/tech/server/init/index.md -> "tech/server/init"。
 * 写错的 slug 会在构建时直接报错，不会悄悄变成死链。
 */
export const homeConfig: HomeConfig = {
	title: "HMT",
	subtitle: "比希望更炽热，比绝望更深邃的，是爱啊！",
	description:
		"这里堆着我平时的笔记：服务器怎么配、论文读到哪、工具怎么用。下面按主题挑了几篇常翻的，剩下的都在博客和归档里。",
	actions: [
		{
			name: "全部博客",
			url: "/blog/",
			icon: "material-symbols:article-outline-rounded",
		},
		{
			name: "归档",
			url: "/archive/",
			icon: "material-symbols:inventory-2-outline-rounded",
		},
		{
			name: "个人简介",
			url: "/intro/",
			icon: "material-symbols:person-outline-rounded",
		},
	],
	sections: [
		{
			title: "服务器与运维",
			description: "从零配一台机器，以及把自己作坏之后怎么救回来。",
			icon: "material-symbols:terminal-rounded",
			links: [
				{ slug: "tech/server/init" },
				{ slug: "tech/server/docker_install" },
				{ slug: "tech/server/missing_sudo" },
				{ slug: "tech/server/announcement" },
				{ slug: "github-https-connection-fix" },
			],
		},
		{
			title: "科研与论文",
			description: "读过的论文和攒下来的资料，按方向分开放。",
			icon: "material-symbols:lab-research-outline-rounded",
			links: [{ slug: "study/paper/agent" }, { slug: "study/paper/vkg" }],
		},
		{
			title: "工具与效率",
			description: "用顺手了就懒得换的那些东西。",
			icon: "material-symbols:build-outline-rounded",
			links: [{ slug: "uv-learning" }],
		},
		{
			title: "校园与杂项",
			description: "东南大学的各种流程，以及一些和技术无关的收藏。",
			icon: "material-symbols:school-outline-rounded",
			links: [{ slug: "seu/20251213_因公出国报销" }, { slug: "hmt/playlist" }],
		},
	],
	recentPostCount: 5,
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/hmt-avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "HMT",
	bio: "比希望更炽热，比绝望更深邃的，是爱啊！",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://github.com/HomuraT",
		},
		{
			name: "Google Scholar",
			icon: "fa6-brands:google-scholar",
			url: "https://scholar.google.com/citations?user=FZ_bjkQAAAAJ&hl=en",
		},
		{
			name: "CSDN",
			// Only icon set here that has a CSDN logo, hence @iconify-json/simple-icons
			icon: "simple-icons:csdn",
			url: "https://blog.csdn.net/qq_42464569",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
