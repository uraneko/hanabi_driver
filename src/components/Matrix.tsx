import { type Component, For } from 'solid-js';

import { type _ } from '../Drive';

import styles from './Matrix.module.css';

export const Matrix = (props: { arr: _[], call: Component<_>, r_init?: _, r_call?: Component[] }) => {
	const arr = () => props.arr;
	if (arr()?.length == 0) console.error("matrix items array cant be empty");

	const call = () => props.call;

	const columns = Object.keys(arr()[0]).filter((k) =>
		["name", "ext", "size", "created", "children"].includes(k));

	const r_init = () => props.r_init;
	const r_call = () => props.r_call;

	return (
		<div class={styles.Matrix}>
			<div class={styles.Columns}>
				<For each={columns} >
					{(col: string) => <span>{col}</span>}
				</For>
			</div>
			<For each={arr()}>
				{(params: _) => call()({ meta: params })}
			</For>
		</div>
	);
};

export const Vec = (props: { entries: _[], call: Component }) => {
	const entries = () => props.entries;
	const call = () => props.call;

	return (
		<div class={styles.Vector}>
			<For each={entries()}>
				{(params: _) => call()(params)}
			</For>
		</div>
	);
};
