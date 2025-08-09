import { type Component, createResource } from 'solid-js';

import styles from './FileTree.module.css';





async function fetchFileTreeSsr(): Promise<HTMLElement> {
	const res = await fetch("http://127.0.0.1:9998/ftree?path=src&ssr",
		{
			method: "GET",
			headers: {
				"Content-Type": "text/html",
			}
		});

	const text = await res.text();
	const html = new DOMParser().parseFromString(text, "text/html").body.firstElementChild;

	return html as HTMLElement;
}

export const FileTree: Component = () => {
	const [data, { mutate, refetch }] = createResource(fetchFileTreeSsr);

	return (<div class={styles.FileTree}>
		{data()}
	</div>);
};
