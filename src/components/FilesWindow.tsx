import { type Component, createEffect, createSignal, createResource, For } from 'solid-js';

import rustSVG from '../../../file_icons/rust.svg?raw';
import dirSVG from '../../../file_icons/dir.svg?raw'
import helpSVG from '../../../file_icons/help.svg?raw'

import { drive_ctx, DEV_SERVER } from '../Drive';
import { WindowMenu, ContextMenu } from './ContextMenu';

import { type _, parse_svg } from '../Drive';

import styles from './FilesWindow.module.css';

async function fetchCurrentDir(base: string) {
	const res = await fetch(DEV_SERVER + `/drive/read_dir?path=${base}`,
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
	const [state] = drive_ctx();

	const [dir, cd] = createSignal(state.files_dir);
	const change_dir = (e: Event) => {
		const et = (e.target as HTMLElement);
		const new_dir = dir() + "/" + et.parentElement!.children[1].textContent!;
		console.log(new_dir);
		cd((dir: string) => new_dir)
	}

	async function fetchWrapper() {
		return fetchCurrentDir(state.files_base + dir())
	}

	const [data, { mutate, refetch }] = createResource(dir, fetchWrapper);

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
			onmousedown={change_dir}
			on:keydown={eschide_menu} tabindex='0' files-dir={dir()}>

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
