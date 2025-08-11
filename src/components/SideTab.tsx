import { type Component, For, createSignal, mergeProps } from 'solid-js';

import { DriveShortcuts } from './DriveShortcuts';
import { DriveHints } from './DriveHints';
import { FileTree } from './FileTree';

import styles from './SideTab.module.css';

type _ = any;

export const SideTab: Component = () => {
	return (
		<div class={styles.SideTab}>
			<DriveShortcuts />
			<FileTree />
			<DriveHints />
		</div>
	);
};

