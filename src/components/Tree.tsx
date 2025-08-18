import { type Component, For, createSignal, createResource, type JSX, } from 'solid-js';
import styles from './Tree.module.css';

// TODO 

type RecursionData = {
	recursors: string[],
	stoppers: string[],
	origin?: string,
}

export const Tree = (props: { data: RecursionData, recursor: Component, closing: Component }) => {
	return (
		<div class={styles.Tree}>

		</div>
	)
};
