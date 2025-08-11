import { type Component, createResource, type JSX } from 'solid-js';

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
			{data()}
		</div>
	);
};

export const File: Component<{ level: number, name: string, }> = (props: { level: number, name: string }) => {
	const level = () => props.level;
	const name = () => props.name;

	return (<div class={styles.File} level={level()}>{name()}</div>);
};

export const Dir: Component<{ level: number, name: string, nodes: JSX.Element }> = (props: { level: number, name: string, nodes: JSX.Element }) => {
	const level = () => props.level;
	const name = () => props.name;
	const nodes = () => props.nodes;

	return (
		<div class={styles.File} level={level()}>{name()}
			<Parent class={styles.Parent} level={level()} name={name()} />
			<Children level={level()} nodes={nodes()} />
		</div>
	);
};

const Children = (props: { level: number, nodes: JSX.Element }) => {
	let level = () => props.level;
	let nodes = () => props.nodes;

	return (
		<div class={styles.Children} level={level()}>
			{nodes()}
		</div>
	)
};

const Parent = (props: { name: string, level: number, }) => {
	let level = () => props.level;
	let name = () => props.name;


	return (
		<div style={{
			"padding-left": `${level() * 5}px`
		}} class={styles.Parent} level={level()}>
			<span>{name()}</span>
		</div>
	);
};
