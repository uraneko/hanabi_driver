import { type Component, createContext, useContext } from 'solid-js';

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

type DriveCtx = {
	// which of the 4 drives is the user currently on 
	current_drive: "Files" | "Shared" | "Backup" | "Trash",
	// what is the user's Files drive base path
	files_base: string,
	// what is the current dir of the Files drive
	files_dir: string,
};

const DRIVE_CONTEXT = createContext([
	{
		current_drive: "Files",
		files_base: ".",
		files_dir: "",
	} as DriveCtx,
]);

export function drive_ctx() {
	return useContext(DRIVE_CONTEXT)
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


