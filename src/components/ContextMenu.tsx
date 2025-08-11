
import { type Component, createEffect, createResource, For, JSX } from 'solid-js';

import styles from './ContextMenu.module.css';

export const ContextMenu = (props: { hide: boolean, x: number, y: number, inner: JSX.Element }) => {
	const hide = () => props.hide;
	const x = () => props.x;
	const y = () => props.y;
	const inner = () => props.inner;

	return (
		<div style={{
			left: `${x()}px`,
			top: `${y()}px`,
		}} class={styles.ContextMenu} hide={hide()} x={x()} y={y()}>
			{inner()}
		</div>
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
