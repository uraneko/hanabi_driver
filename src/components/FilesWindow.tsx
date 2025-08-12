import { type Component, createEffect, createSignal, createResource, For } from 'solid-js';

import rustSVG from '../../../file_icons/rust.svg?raw';
import dirSVG from '../../../file_icons/dir.svg?raw'
import helpSVG from '../../../file_icons/help.svg?raw'

import { WindowMenu, ContextMenu } from './ContextMenu';

import { type _, parse_svg } from '../Drive';

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

	const [menu, toggle] = createSignal({ hide: true, x: 0, y: 0 });
	const show_menu = (e: Event) => {
		e.preventDefault();
		const me = (e as MouseEvent);

		toggle((params: _) => {
			return {
				hide: false,
				x: me.clientX,
				y: me.clientY,
			}
		})
	};

	const w = 134;
	const h = 164;
	const hide_menu = (e: Event) => {
		const me = (e as MouseEvent);
		const new_x = me.clientX;
		const new_y = me.clientY;

		toggle((params: _) => {
			const x = () => params.x;
			const y = () => params.y;
			console.log(x(), y(), w, h, new_x, new_y);

			return new_x >= x() && new_x < x() + w && new_y >= y() && new_y < y() + h ?
				{
					hide: false,
					x: x(),
					y: y(),
				} : {
					hide: true,
					x: 0,
					y: 0,
				}

		})
	};

	const eschide_menu = (e: Event) => {
		const kbe = (e as KeyboardEvent);
		const esc = kbe.key;
		if (esc != "Escape") return;

		toggle((_params: _) => {
			return {
				hide: true,
				x: 0,
				y: 0,
			}
		})
	};

	return (
		<div class={styles.FilesWindow}
			on:contextmenu={show_menu}
			on:mousedown={hide_menu}
			on:keydown={eschide_menu} tabindex='0' >

			<ContextMenu hide={menu().hide} x={menu().x} y={menu().y} inner={<WindowMenu />} />
			<For each={data()} >
				{(meta: _) => <Entry meta={meta} />}
			</For >
		</div >
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
