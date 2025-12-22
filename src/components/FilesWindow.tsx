import { type Component, createEffect, createSignal, createResource, For } from 'solid-js';
import { WindowMenu, FileMenu, DirMenu } from './ContextMenus';
import { FileViewer } from './FileViewer';
import { InteractiveArea } from 'core/wrappers';
import { type _, parse_svg } from 'core';
import { Matrix } from 'core/containers';
import { ContextMenu, maybe_resolved } from 'core/extra';
import { drive_ctx, DriveCtx } from '../Drive';
import styles from './FilesWindow.module.css';

import rustSVG from '../../../assets/file_icons/rust.svg?raw';
import svgSVG from '../../../assets/file_icons/svg.svg?raw';
import html5SVG from '../../../assets/file_icons/html5.svg?raw';
import cssSVG from '../../../assets/file_icons/css.svg?raw';
import javascriptSVG from '../../../assets/file_icons/javascript.svg?raw';
import dirSVG from '../../../assets/file_icons/dir.svg?raw'
import unknSVG from '../../../assets/file_icons/unkn.svg?raw'
import jsonSVG from '../../../assets/file_icons/json.svg?raw'
import tsSVG from '../../../assets/file_icons/typescript.svg?raw'
import mdSVG from '../../../assets/file_icons/markdown.svg?raw'
import tomlSVG from '../../../assets/file_icons/toml.svg?raw'


const origin = "";

async function fetchCurrentDir(path: string) {
	const res = await fetch(origin + `/drive/read_dir?path=${path}`,
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
		case "Html":
			return parse_svg(html5SVG)
		case "Css":
			return parse_svg(cssSVG)
		case "Js":
			return parse_svg(javascriptSVG)
		case "Svg":
			return parse_svg(svgSVG)
		case "Json":
			return parse_svg(jsonSVG)
		case "Ts":
			return parse_svg(tsSVG)
		case "Md":
			return parse_svg(mdSVG)
		case "Toml":
			return parse_svg(tomlSVG)
		default:
			return parse_svg(unknSVG)
	}
}

export const FilesWindow: Component = () => {
	let FW!: HTMLDivElement;
	const { drive, sync } = drive_ctx();

	const inner_dir = (e: Event) => {
		const et = (e.target as HTMLElement);
		const parent = et.parentElement!;
		if (parent.getAttribute("kind") != "Dir") return;

		const new_segment = parent.children[1].textContent!;

		sync((drive: DriveCtx) => {
			return {
				dir: [...drive.dir, new_segment],
				base: drive.base,
				drive: drive.drive,
			}
		});
	};

	// better hook this to the Drive component and check if mouse is inside FilesWindow
	const outer_dir = (e: Event) => {
		const kbe = (e as KeyboardEvent);
		if (!(kbe.key == "ArrowLeft" && kbe.shiftKey)) return;

		sync((drive: DriveCtx) => {
			return {
				dir: drive.dir.length > 1 ? drive.dir.slice(0, drive.dir.length - 1) : drive.dir,
				base: drive.base,
				drive: drive.drive
			}
		});
	};

	const [data] =
		createResource(() => drive().base + drive().dir.join('/'), fetchCurrentDir);

	return (
		<div class={styles.FilesWindow} on:dblclick={inner_dir}
			on:keydown={outer_dir} tabindex='0' ref={FW} base={drive().base} dir={drive().dir}>

			<FileViewer referrer={FW} />
			<InteractiveArea>
				<ContextMenu referrer={FW} targets={[[WindowMenu, styles.FilesWindow], [DirMenu, `${styles.Entry} DirEntry`], [FileMenu, `${styles.Entry} FileEntry`]]} />
				{maybe_resolved(data, () => <Matrix arr={data()!} call={Entry} />)}
			</InteractiveArea>
		</div >
	);
};

const Entry = (props: { meta: _ }) => {
	const meta = () => props.meta;

	const icon = entry_icon(meta().kind, meta().ext);

	return (
		<button class={`${styles.Entry} ${meta().kind}Entry`} kind={meta().kind} draggable={true} name={meta().name}>
			{icon}
			<span class={styles.EntryName}>{meta().name}</span>
			<span class={styles.EntrySize}>{(meta().size.size).toFixed(2)}&thinsp;{meta().size.unit}</span>
			<span class={styles.EntryCreated}>{meta().created.slice(0, 10)}</span>
			<span class={styles.EntryChildren}>{meta().entries ?? '-'}</span>
		</button>
	);
};

