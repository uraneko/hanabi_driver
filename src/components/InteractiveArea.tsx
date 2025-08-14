import { createSignal, type Component, JSX } from 'solid-js';

import { type _ } from '../Drive';

import styles from './InteractiveArea.module.css';

export const InteractiveArea = (props: { children: JSX.Element }) => {
	const children = () => props.children;

	// MouseArea events
	const [hl, hl_update] = createSignal({
		down: false, x: 0, y: 0, rx: false, ry: false, w: 1, h: 1
	});

	const locate = (e: Event) => {
		if (!(e.target! as Element).classList.contains(`${styles.InteractiveArea}`)) return

		const me = (e as MouseEvent);
		const x = me.clientX;
		const y = me.clientY;

		hl_update((params: _) => {
			return {
				down: true,
				x: x,
				y: y,
				rx: false,
				ry: false,
				w: params.w,
				h: params.h,
			}
		})
	};

	const release = () =>
		hl_update((props: _) => {
			return {
				down: false,
				x: props.x,
				y: props.y,
				rx: false,
				ry: false,
				w: 0,
				h: 0,
			}
		});

	const resize = (e: Event) => {
		if (!hl().down) return;
		const me = (e as MouseEvent);
		const x1 = me.clientX;
		const y1 = me.clientY;

		hl_update((params: _) => {
			const w = Math.abs(x1 - params.x);
			const h = Math.abs(y1 - params.y);

			return {
				down: true,
				x: params.x,
				y: params.y,
				rx: x1 < params.x,
				ry: y1 < params.y,
				w: w,
				h: h,
			}
		})
	}

	return (
		<div class={styles.InteractiveArea}
			on:mousemove={resize}
			on:pointerdown={locate}
			on:mouseup={release}>
			<div ></div>
			<div style={{
				width: `${hl().w}px`,
				height: `${hl().h}px`,
				left: `${hl().x}px`,
				top: `${hl().y}px`,
			}} class={styles.MouseSelection} down={hl().down} rx={hl().rx} ry={hl().ry}>
			</div>
			{children()}
		</div>
	);
};
