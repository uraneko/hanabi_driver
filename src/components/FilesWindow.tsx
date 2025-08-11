import { type Component, createEffect, createResource, For } from 'solid-js';

import rustSVG from '../../../file_icons/rust.svg?raw';
import dirSVG from '../../../file_icons/dir.svg?raw'
import helpSVG from '../../../file_icons/help.svg?raw'

import { type _, parse_svg } from '../App';

import styles from './FilesWindow.module.css';

async function fetchCurrentDir() {
	const res = await fetch("http://127.0.0.1:9998/drive/read_dir?path=src",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});

	return await res.json();
}

function entry_icon(kind: "File" | "Dir", ext: string | null): SVGSVGElement {
	if (kind == "Dir") return parse_svg(dirSVG);
	else switch (ext) {
		case "Rs":
			return parse_svg(rustSVG)
		default:
			return parse_svg(helpSVG)
	}
}

const Entry = (props: { meta: _ }) => {
	const meta = () => props.meta;

	const icon = entry_icon(meta()?.kind, meta()?.ext);

	return (
		<button class={styles.Entry}>
			{icon}
			<span class={styles.EntryName}>{meta()?.name}</span>
			<span class={styles.EntrySize}>{(meta()?.size.size).toFixed(2)}&thinsp;{meta()?.size.unit}</span>
			<span class={styles.EntryCreated}>{meta()?.created.slice(0, 10)}</span>
		</button>
	);
};

export const FilesWindow: Component = () => {
	const [data, { mutate, refetch }] = createResource(fetchCurrentDir);

	return (
		<div class={styles.FilesWindow}>
			<For each={data()}>
				{(meta: _) => <Entry meta={meta} />}
			</For>
		</div>
	);
};

const Toolkit = () => {
	return (
		<div>
		</div>
	);
};

const FileUtils = () => { };

const DirsUtils = () => { };
