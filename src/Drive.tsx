import { type Component, createContext, createSignal, useContext } from 'solid-js';

import styles from './Drive.module.css';

import { SideTab } from './components/SideTab';
import { FilesWindow } from './components/FilesWindow';

export const DEV_SERVER: string = "";

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

export type DriveCtx = {
	// which of the 4 drives is the user currently on 
	drive: "Files" | "Shared" | "Backup" | "Trash",
	// what is the user's Files drive base path
	base: string,
	// what is the current dir of the Files drive
	dir: string[],
};

const [drive, sync] = createSignal(
	{
		drive: "Files",
		base: ".",
		dir: [""],
	} as DriveCtx
);

const ctx = createContext({ drive, sync });

export function drive_ctx() {
	return useContext(ctx)
}

