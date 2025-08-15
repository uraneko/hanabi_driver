import { type Component, createSignal, JSX } from 'solid-js';

import { type _, type Maybe, is } from '../Drive';

import styles from './Pending.module.css';

export const Pending = (props: { resolver: Maybe<_>, inner: JSX.Element }) => {
	const resolved = () => is(props.resolver);
	const inner = () => props.inner;

	return (
		<div class={styles.Pending} resolved={resolved()}>
			{resolved() ? inner() : <PendingComp />}
		</div >
	);
};

const PendingComp = () => {
	return (<div class={styles.PendingInner}><span class={styles.PendingText}>Loading...</span></div>);
};
