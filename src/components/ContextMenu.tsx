import { onMount, type Component, createSignal, createEffect, createResource, For, JSX } from 'solid-js';

import { DEV_SERVER, type _, type Maybe } from '../Drive';
import styles from './ContextMenu.module.css';

type CtxParams = {
	hide: boolean,
	x: number, y: number,
	target: Maybe<Element>
}

export const ContextMenu = (props: { referrer: HTMLDivElement, targets: [Component<{ ref: HTMLDivElement }>, string][] }) => {
	const comps = () => props.targets.map((t: [Component<_>, string]) => t[0]);
	const classes = () => props.targets.map((t: [Component<_>, string]) => t[1]);
	const ref = () => props.referrer;

	// ctx menu events
	const [menu, toggle] = createSignal({ hide: true, x: 0, y: 0, target: undefined } as CtxParams);
	const show_menu = (e: Event) => {
		if (!menu().hide) return;
		const et = e.target as Element;
		let target = undefined;
		if (classes().includes(et.className)) {
			target = et;
		} else if (classes().includes(et.parentElement!.className)) {
			target = et.parentElement!;
			// } else if (et.children != undefined &&
			// 	classes()
			// 		.find((c: string) =>
			// 			[...et.children]
			// 				.map((ch: Element) => ch.className)
			// 				.includes(c))
			// ) {
			// 	const chs = [...et.children].map((ch: Element) => ch.className);
			// 	target = classes()
			// 		.find((cl: string) => chs.includes(cl))
		} else return;

		e.stopPropagation();
		e.preventDefault();
		const me = (e as MouseEvent);

		toggle((params: _) => {
			return {
				target: target,
				hide: false,
				x: me.clientX,
				y: me.clientY,
			}
		});
	};
	ref().addEventListener("contextmenu", show_menu);

	const w = 134;
	const h = 164;
	const hide_menu = (e: Event) => {
		const me = (e as MouseEvent);
		const new_x = me.clientX;
		const new_y = me.clientY;

		toggle((params: _) => {
			const x = () => params.x;
			const y = () => params.y;

			// return new_x >= x() && new_x < x() + w && new_y >= y() && new_y < y() + h ?
			// 	{
			// 		target: undefined,
			// 		hide: false,
			// 		x: x(),
			// 		y: y(),
			// 	} : 
			return {
				target: undefined,
				hide: true,
				x: 0,
				y: 0,
			}
		})
	};
	ref().addEventListener("mousedown", hide_menu);

	const eschide_menu = (e: Event) => {
		const kbe = (e as KeyboardEvent);
		const esc = kbe.key;
		if (esc != "Escape") return;

		toggle((_params: _) => {
			return {
				target: undefined,
				hide: true,
				x: 0,
				y: 0,
			}
		})
	};
	ref().addEventListener("keydown", eschide_menu);

	return (
		<div style={{
			left: `${menu().x}px`,
			top: `${menu().y}px`,
		}} class={styles.ContextMenu} hide={menu().hide}>
			{menu().target === undefined ? <span>Undefined</span> : comps()[classes().indexOf(menu().target!.className)]({ ref: ref(), target: menu().target })}
		</div >
	);
};

export const WindowMenu = (props: { ref: Element, target: Element }) => {
	const ref = () => props.ref;
	const target = () => props.target;

	const actions = async (e: Event) => {
		const et = e.target as HTMLElement;
		console.log(et);
		if (et.classList.contains(styles.Upload)) {
			const upload = et.children[1] as HTMLInputElement;
			upload.click();

		}
	};

	const upload = (e: Event) => {
		const et = e.target as HTMLInputEvent;
		const name = et.value.split('/').at(-1);
		const data = et.files[0];
		const reader = new FileReader();
		reader.readAsText(data, 'UTF-8');
		reader.onload = async (re) => {
			const content = re.target!.result;
			await fetch(DEV_SERVER + "/drive/upload?name=" + name, {
				method: "POST",
				headers: {
					"Content-Type": "text/plain",
				},
				body: content,
			})
		}
	};

	return (
		<div class={styles.WindowMenu} onmousedown={actions}>
			<button class={styles.Upload}>
				<span>Upload a file from your machine</span>
				<input type="file" hidden onchange={upload} />
			</button>
		</div>
	);
};


export const FileMenu = (props: { ref: Element, target: Element }) => {
	const ref = () => props.ref;
	const target = () => props.target;
	const path = ref().getAttribute("base") + "/" + ref().getAttribute("dir") + target().getAttribute("name");
	console.log("path --->", path);

	const actions = async (e: Event) => {
		const et = e.target as Element;
		console.log(et);
		if (et.classList.contains(styles.Download)) {
			const res = await fetch(DEV_SERVER + "/drive/download?path=" + path, {
				method: "GET",
				headers: {
					"Content-Type": "application/octet-stream",
				}
			});
			const bytes = await res.bytes();
		}
	};

	return (
		<div class={styles.WindowMenu} onmousedown={actions}>
			<button class={styles.Download}>Download this file to your machine</button>
		</div>
	);
};


export const DirMenu = (props: { ref: Element, target: Element }) => {
	const ref = () => props.ref;
	const target = () => props.target;

	return (<div class={styles.WindowMenu}>
		<button class={styles.CopyHere}>Copy To This Dir</button>
		<button class={styles.Refresh}>Refresh DIrectory</button>
		<button class={styles.Undo}>Undo Last Action</button>
		<button class={styles.Create}>Create New</button>
	</div>);
};


