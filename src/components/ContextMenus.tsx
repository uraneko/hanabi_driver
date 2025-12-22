import { type _ } from 'core';
import styles from './ContextMenus.module.css';

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
		const et = e.target as HTMLInputElement;
		const name = et.value.split('/').at(-1);
		const data = et.files![0];
		const reader = new FileReader();
		reader.readAsText(data, 'UTF-8');
		reader.onload = async (re) => {
			const content = re.target!.result;
			await fetch(origin + "/drive/upload?name=" + name, {
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

const origin = "";

export const FileMenu = (props: { ref: Element, target: Element }) => {
	const ref = () => props.ref;
	const target = () => props.target;
	const path = ref().getAttribute("base") +
		ref().getAttribute("dir")!.replaceAll(',', '/') + '/' +
		target().getAttribute("name");

	const actions = async (e: Event) => {
		const et = e.target as Element;
		if (et.classList.contains(styles.Download)) {
			const res = await fetch(origin + "/drive/download?path=" + path, {
				method: "GET",
				headers: {
					"Content-Type": "application/octet-stream",
				}
			});
			const bytes = await res.bytes();
			const blob = new Blob([bytes], { type: "application/octet-stream" });
			const objectURL = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = objectURL;
			anchor.click();
			URL.revokeObjectURL(objectURL);
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


