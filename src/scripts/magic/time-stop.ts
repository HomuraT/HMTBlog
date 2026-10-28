/**
 * 时间停止：晓美焰的魔法。
 *
 * 触发后从点击位置扩散出一圈灰阶结界（#time-stop-layer 的 backdrop-filter），
 * <html> 加上 time-stopped 类冻结全站 CSS 动画，羽毛、时钟、灵魂宝石等
 * 由脚本驱动的动画通过 isTimeStopped() 自行暂停。几秒后自动解除。
 */

const DURATION = 6000;
const listeners = new Set<(stopped: boolean) => void>();
let stopped = false;
let timer = 0;

export const isTimeStopped = (): boolean => stopped;

export function onTimeStop(
	callback: (stopped: boolean) => void,
	signal?: AbortSignal,
): void {
	listeners.add(callback);
	signal?.addEventListener("abort", () => listeners.delete(callback));
}

function setStopped(value: boolean, x: number, y: number): void {
	const layer = document.getElementById("time-stop-layer");
	stopped = value;
	window.clearTimeout(timer);
	if (layer) {
		layer.style.setProperty("--ts-x", `${x}px`);
		layer.style.setProperty("--ts-y", `${y}px`);
		// 圆要盖住离原点最远的那个角
		const r = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y),
		);
		layer.style.setProperty("--ts-r", `${Math.ceil(r)}px`);
	}
	document.documentElement.classList.toggle("time-stopped", value);
	for (const callback of listeners) callback(value);
	if (value) {
		timer = window.setTimeout(() => setStopped(false, x, y), DURATION);
	}
}

export function toggleTimeStop(
	x = window.innerWidth / 2,
	y = window.innerHeight / 2,
): void {
	setStopped(!stopped, x, y);
}
