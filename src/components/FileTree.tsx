import { type Component, For, createSignal, createResource, type JSX, } from 'solid-js';

import { type _, drive_ctx, DriveCtx } from '../Drive';
import { maybe_resolved } from './Pending';
import styles from './FileTree.module.css';

async function fetchFileTree(base: string): Promise<HTMLElement> {
	const res = await fetch(`http://127.0.0.1:9998/ftree?path=${base}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "text/html",
			}
		});

	return await res.json();
}

export const FileTree: Component = () => {
	const { drive, sync } = drive_ctx();

	const move_dir = (e: Event) => {
		const et = (e.target as HTMLElement);
		if (!et.classList.contains(`${styles.DirName}`)) return;
		// BUG this event triggers as intended 
		// but sometimes the createResource function set on 
		// FilesWindow will not trigger a refetch 
		// reloading the page and trying again may fix it 

		let new_path = et.textContent!
		let path = new_path == "/" ? [""] : new_path.split('/');

		sync((drive: DriveCtx) => {
			return {
				dir: path,
				base: drive.base,
				drive: drive.drive,
			}
		});
	};

	async function fetchWrapper() {
		return fetchFileTree(drive().base);
	}

	const [tree, { mutate, refetch }] = createResource(fetchWrapper);

	return (
		<div class={styles.FileTree}
			ondblclick={move_dir}>
			{maybe_resolved(tree, () => <Dir level={0} name={tree()!.dirs[0]} tree={tree()} />)}
		</div>
	);
};

export const File: Component<{ level: number, name: string, }> = (props: { level: number, name: string }) => {
	const level = () => props.level;
	const name = () => props.name;

	return (<button style={{
		"padding-left": `${level() * 10}px`
	}} class={styles.File} level={level()}>{name()}</button>);
};

function dir_nodes(json: _, dir: string) {
	const idx = json?.dirs.indexOf(dir)

	return json?.nodes[idx]
}

function is_dir(dirs: string[], maybe_dir: string): boolean {
	return dirs.includes(maybe_dir);
}

export const Dir: Component<{ level: number, name: string, tree: _ }> = (props: { level: number, name: string, tree: _ }) => {
	const level = () => props.level;
	const name = () => props.name;
	const dirs = () => props.tree.dirs;
	const tree = () => props.tree;

	const [show, toggle] = createSignal(false);
	const toggle_entries = (e: Event) => {
		const kbe = (e as KeyboardEvent);
		if (!kbe.shiftKey) return;
		const et = (e.target as HTMLElement);
		if (!et.classList.contains(`${styles.DirName}`)) return;

		e.stopPropagation();

		toggle((show: boolean) => !show)
	};

	return (
		<div class={styles.Dir} level={level()}
			on:click={toggle_entries}>

			<button style={{
				"padding-left": `${level() * 10}px`,
			}} class={styles.DirName}>{name()}</button>
			<div class={styles.DirEntries} show={show()}>
				<For each={dir_nodes(tree(), name())}>
					{(entry: string) => {
						if (is_dir(dirs(), entry)) {
							return <Dir name={entry} level={level() + 1} tree={tree()} />
						} else {
							return <File name={entry} level={level() + 1} />
						}
					}}
				</For >
			</div>
		</div>
	);
};
