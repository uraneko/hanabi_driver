import { type Component } from 'solid-js';
import { type _ } from 'comps';
import { DriveShortcuts } from './DriveShortcuts';
import { DriveHints } from './DriveHints';
import { FileTree } from './FileTree';

import styles from './SideTab.module.css';

export const SideTab: Component = () => {
	return (
		<div class={styles.SideTab}>
			<DriveShortcuts />
			<FileTree />
			<DriveHints />
		</div>
	);
};

