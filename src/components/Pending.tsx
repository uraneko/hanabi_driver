import { type Component, createSignal, JSX } from 'solid-js';

import { type _, type Maybe, is } from '../Drive';

import styles from './Pending.module.css';

export function maybe_resolved(resolver: () => Maybe<_>, inner: () => JSX.Element): JSX.Element {
	const resolved = () => is(resolver());

	return resolved() ? inner() : <PendingInner />
};

const PendingInner = () => {
	return (<div class={styles.PendingInner}><span class={styles.PendingText}>Loading...</span></div>);
};
