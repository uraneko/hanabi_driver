import { type Component, For, createSignal, mergeProps } from 'solid-js';

import styles from './DriveShortcuts.module.css';

import { parse_svg } from '../App';

import sharedSVG from '../../../assets/shared.svg?raw';
import filesSVG from '../../../assets/files.svg?raw';
import trashSVG from '../../../assets/trash.svg?raw';
import archiveSVG from '../../../assets/archive.svg?raw';

type _ = any;

const shared = {
	icon: sharedSVG,
	title: "Public",
};
const files = {
	icon: filesSVG,
	title: "Files",
};
const trash = {
	icon: trashSVG,
	title: "Trash",
};
const backup = {
	icon: archiveSVG,
	title: "Backup"
};

export const DriveShortcuts = () => {
	return (
		<div class={styles.DriveShortcuts}>
			<div class={styles.Shortcuts}>
				<For each={[files, shared, backup, trash]}>
					{(parts: Parts) => <DriveShortcut parts={parts} />}
				</For >
			</div>
		</div>
	);
}

type Parts = {
	icon: string,
	title: string,
};

export const DriveShortcut: Component<{ parts: Parts }> = (props: { parts: Parts }) => {
	const parts = () => props.parts;
	const svg = parse_svg(parts().icon);

	return (
		<div class={styles.ShortcutEntry}>
			<button class={styles.ShortcutButton}>
				{svg}
				<span class={styles.ShortcutTitle}>{parts().title}</span>
			</button>
		</div>
	);
};
