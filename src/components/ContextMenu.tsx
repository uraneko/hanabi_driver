import { onMount, type Component, createSignal, createEffect, createResource, For, JSX } from 'solid-js';

import { type _ } from '../Drive';
import styles from './ContextMenu.module.css';

// checks if the event.target has a context menu and is this context menu's target component
function at_right_place(el: HTMLElement, target: string): boolean {
	return el.classList.contains(target)
		&& el.querySelector(`div.${styles.ContextMenu}`) !== undefined
}

export const ContextMenu = (props: { inner: JSX.Element, thing: HTMLDivElement, target: string }) => {
	const inner = () => props.inner;
	const target = () => props.target;

	console.log(props.thing);

	// ctx menu events
	const [menu, toggle] = createSignal({ hide: true, x: 0, y: 0 });
	const show_menu = (e: Event) => {
		e.preventDefault();
		const me = (e as MouseEvent);

		toggle((params: _) => {
			return {
				hide: false,
				x: me.clientX,
				y: me.clientY,
			}
		})
	};
	props.thing?.addEventListener("contextmenu", show_menu);

	const w = 134;
	const h = 164;
	const hide_menu = (e: Event) => {
		const me = (e as MouseEvent);
		const new_x = me.clientX;
		const new_y = me.clientY;

		toggle((params: _) => {
			const x = () => params.x;
			const y = () => params.y;

			return new_x >= x() && new_x < x() + w && new_y >= y() && new_y < y() + h ?
				{
					hide: false,
					x: x(),
					y: y(),
				} : {
					hide: true,
					x: 0,
					y: 0,
				}
		})
	};
	props.thing?.addEventListener("mousedown", hide_menu);

	const eschide_menu = (e: Event) => {
		const kbe = (e as KeyboardEvent);
		const esc = kbe.key;
		if (esc != "Escape") return;

		toggle((_params: _) => {
			return {
				hide: true,
				x: 0,
				y: 0,
			}
		})
	};
	props.thing?.addEventListener("keydown", eschide_menu);

	return (
		<div style={{
			left: `${menu().x}px`,
			top: `${menu().y}px`,
		}} class={styles.ContextMenu} hide={menu().hide}>
			{inner()}
		</div >
	);
};

export const WindowMenu = () => {
	return (<div class={styles.WindowMenu}>
		<button class={styles.CopyHere}>Copy To This Dir</button>
		<button class={styles.ChangeView}>Change Dir Entries Display Style</button>
		<button class={styles.Refresh}>Refresh DIrectory</button>
		<button class={styles.Undo}>Undo Last Action</button>
		<button class={styles.New}>Create New Entry</button>
	</div>);
};
