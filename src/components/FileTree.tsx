import { type Component, For, createResource, type JSX, } from 'solid-js';
import { type _ } from '../Drive';

import styles from './FileTree.module.css';


async function fetchFileTreeSsr(): Promise<HTMLElement> {
	const res = await fetch(`http://127.0.0.1:9998/ftree?path=src`,
		{
			method: "GET",
			headers: {
				"Content-Type": "text/html",
			}
		});

	const json = await res.json();
	console.log(json);

	return json
}

export const FileTree: Component = () => {
	const [data, { mutate, refetch }] = createResource(fetchFileTreeSsr);

	return (
		<div class={styles.FileTree}>
			<Dir level={0} name={data()?.dirs[0]} tree={data()} />
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

	return (
		<div class={styles.Dir} level={level()}>
			<button style={{
				"padding-left": `${level() * 10}px`,
			}} class={styles.DirName}>{name()}</button>
			<div class={styles.DirEntries}>
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
