import { type Component, For, createSignal, mergeProps } from 'solid-js';

import styles from './DriveShortcuts.module.css';

import { parse_svg } from '../Drive';

import sharedSVG from '../../../assets/shared.svg?raw';
import filesSVG from '../../../assets/files.svg?raw';
import trashSVG from '../../../assets/trash.svg?raw';
import archiveSVG from '../../../assets/archive.svg?raw';
import jetSVG from '../../../assets/jet.svg?raw';

type _ = any;

const shared = {
	icon: sharedSVG,
	title: "Shared",
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
	const [blinds, update] = createSignal(false);

	return (
		<div class={styles.DriveShortcuts}>
			<Blinds setter={update} />
			<div class={styles.Shortcuts} hide={blinds()}>
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

export const Blinds = (props: _) => {
	const svg = parse_svg(jetSVG);

	const update = () => props.setter;
	const toggle_display = () => update()((display: boolean) => {
		console.log(display);

		return !display
	});

	return (
		<button type="button" class={styles.Blinds} on:click={toggle_display}>
			<div class={styles.BlindsTab}>
			</div>
			{svg}
		</button>
	);
}

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
