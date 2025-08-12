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
		<button class={styles.Entry} kind={meta()?.kind}>
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

	const inner_dir = (e: Event) => {
		const et = (e.target as HTMLElement);
		const parent = et.parentElement!;
		if (parent.getAttribute("kind") != "Dir") return;

		const new_segment = parent.children[1].textContent!;

		cd((dir: string[]) => [...dir, new_segment]);
	};

	// better hook this to the Drive component and check if mouse is inside FilesWindow
	const outer_dir = (e: Event) => {
		const kbe = (e as KeyboardEvent);
		if (!(kbe.key == "ArrowLeft" && kbe.shiftKey)) return;

		cd((dir: string[]) => dir.length > 1 ? dir.slice(0, dir.length - 1) : dir)
	};

	async function fetchWrapper() {
		return fetchCurrentDir(state.files_base + dir().join('/'))
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

	// MouseArea events
	const [hl, hl_update] = createSignal({ hide: true, down: false, x: 0, y: 0, w: 1, h: 1 });
	const move = (e: Event) => {
		const me = (e as MouseEvent);
		const x = me.clientX;
		const y = me.clientY;

		hl_update((params: _) => {
			return {
				hide: false,
				down: true,
				x: x,
				y: y,
				w: params.w,
				h: params.h,
			}
		})
	};

	const release = () => hl_update((props: _) => {
		return {
			down: false,
			hide: true,
			x: props.x,
			y: props.y,
			w: props.w,
			h: props.h,
		}
	});

	const resize = (e: Event) => {

		if (!hl().down) return;
		const me = (e as MouseEvent);
		const x1 = me.clientX;
		const y1 = me.clientY;

		console.log(x1, y1);

		hl_update((params: _) => {
			const w = x1 - params.x;
			const h = y1 - params.y;

			return {
				hide: false,
				down: true,
				x: params.x,
				y: params.y,
				w: w,
				h: h,
			}
		})
	}


	return (
		<div class={styles.FilesWindow}
			onmousemove={resize}
			onMousedown={move}
			on:mouseup={release}

			onmousedown={inner_dir}
			onkeydown={outer_dir}

			on:contextmenu={show_menu}
			on:mousedown={hide_menu}
			on:keydown={eschide_menu} tabindex='0' files-dir={dir()}>

			<ContextMenu hide={menu().hide} x={menu().x} y={menu().y} inner={<WindowMenu />} />
			<For each={data()} >
				{(meta: _) => <Entry meta={meta} />}
			</For >
			<MouseArea hl={hl()} update={hl_update} />
		</div >
	);
};

const MouseArea = (props: { hl: _ }) => {
	const hl = () => props.hl;


	return (
		<div style={{
			width: `${hl().w}px`,
			height: `${hl().h}px`,
			left: `${hl().x}px`,
			top: `${hl().y}px`,
		}} class={styles.MouseArea} hide={hl().hide} down={hl().down}>
		</div>
	);

};
