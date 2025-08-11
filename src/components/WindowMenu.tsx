
import { type Component, createEffect, createResource, For } from 'solid-js';

import styles from './WindowMenu.module.css';

export const WindowMenu = (props: { hide: boolean, x: number, y: number }) => {
	const hide = () => props.hide;
	const x = () => props.x;
	const y = () => props.y;

	return (
		<div style={{
			left: `${x()}px`,
			top: `${y()}px`,
		}} class={styles.WindowMenu} hide={hide()} x={x()} y={y()}>
			<button class={styles.CopyHere}>Copy To This Dir</button>
			<button class={styles.ChangeView}>Change Dir Entries Display Style</button>
			<button class={styles.Refresh}>Refresh DIrectory</button>
			<button class={styles.Undo}>Undo Last Action</button>
			<button class={styles.New}>Create New Entry</button>
		</div>
	);
};
