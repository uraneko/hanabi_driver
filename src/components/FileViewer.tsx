import { type Component, createResource, createSignal } from 'solid-js';
import { drive_ctx } from '../Drive';
import styles from './FileViewer.module.css';
import fstl from './FilesWindow.module.css';
import { type _, type Maybe, parse_svg } from 'comps';

import closeSVG from '../../../assets/close.svg?raw';

const origin = "http://localhost:9998";

async function fetchFile(path: Maybe<string>) {
	const resource = origin + "/drive/view?path=" + path!;
	console.log(resource);
	const res = await fetch(resource, {
		method: "GET",
	});

	return await res.text()
}

type ViewMeta = {
	name: Maybe<string>,
	path: Maybe<string>,
}

export const FileViewer: Component<_> = (props: { referrer: HTMLElement }) => {
	const { drive, sync } = drive_ctx();
	const dir = () => drive().dir.join('/');

	const ref = () => props.referrer;
	const [meta, update] = createSignal({ name: undefined, path: undefined } as ViewMeta);

	const [file] = createResource(() => meta().path, fetchFile);

	const view = (e: Event) => {
		const et = e.target as HTMLElement;
		let target = undefined;
		if (et.classList.contains(fstl.Entry) && et.getAttribute("Kind") == "File")
			target = et;
		else if (et.parentElement!.classList.contains(fstl.Entry)
			&& et.parentElement!.getAttribute("Kind") == "File")
			target = et.parentElement;
		else return;

		const name = target!.getAttribute("name");
		console.log(dir());
		const path = drive().base + dir() + "/" + name;

		update((_meta: ViewMeta) => {
			return {
				name: name,
				path: path,
			} as ViewMeta
		})
	};
	ref().addEventListener("click", view);

	const hide = (e: Event) => {
		update((_: ViewMeta) => {
			return {
				name: undefined,
				path: undefined,
			}
		})
	}

	const close = parse_svg(closeSVG);

	return (
		<div class={styles.FileViewer} hide={meta().path == undefined}>
			<div class={styles.Header}>
				<h4 class={styles.FileTitle}>{meta().name}</h4>
				<button class={styles.CloseButton} onclick={hide}>
					{close}
				</button>
			</div>
			<span class={styles.FileContents}>{file()}</span>
		</div>
	);
};


