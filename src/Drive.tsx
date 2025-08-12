import { type Component, Show } from 'solid-js';

import styles from './Drive.module.css';

import { SideTab } from './components/SideTab';
import { FilesWindow } from './components/FilesWindow';

export const DEV_SERVER: string = "http://127.0.0.1:9998";

// import { MainWindow } from './components/MainWindow';
// import { FileHints } from './components/FileHints';

export const Drive: Component = () => {
	return (
		<div class={styles.Drive}>
			<SideTab />
			<FilesWindow />
		</div >
	);
}

export const parse_svg = (svg: string): SVGSVGElement => {
	return new DOMParser().parseFromString(svg, "image/svg+xml").querySelector("svg")!;
}

export type _ = any;

export function map_from_json(json: Object): Map<string, _> {
	const map = new Map();
	for (const [k, v] of Object.entries(json)) {
		map.set(k, v)
	}

	return map;
}


