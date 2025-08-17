import { type Component, For, createEffect, createSignal, mergeProps, createResource } from 'solid-js';

import styles from './DriveHints.module.css';
import driveRatioSVG from '../../../assets/drive-ratio.svg?raw';
import { parse_svg, DEV_SERVER, map_from_json } from '../Drive';
import { maybe_resolved } from './Pending';

type _ = any;

async function fetchDriveHints(): Promise<HintsMap> {
	const res = await fetch(DEV_SERVER + "/dh?truncate",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});

	return await res.json();
}

export const DriveHints: Component = () => {
	const [data, { mutate, refetch }] = createResource(fetchDriveHints);

	return (<div class={styles.DriveHints}>
		{
			maybe_resolved(data, () =>
				<div class={styles.Ratio}>
					<RatioSpear hints={data()!} />
					<RatioNotes hints={data()!} />
				</div>
			)}
	</div >);
};

type HintsMap = {
	total: number, t_unit: string, used: number, u_unit: string
};

const RatioNotes: Component<{ hints: HintsMap }> = (props: { hints: HintsMap }) => {
	const hints = () => props.hints;

	return (<div class={styles.RatioNotes} >
		<span class={styles.NotesUsed}>{hints()?.used}&thinsp;{hints()?.u_unit}</span>
		<span>/</span>
		<span class={styles.NotesTotal}>{hints()?.total}&thinsp;{hints()?.t_unit}</span>
	</div >)
};

const RatioSpear: Component<{ hints: HintsMap }> = (props: { hints: HintsMap }) => {
	const hints = () => props.hints;

	const svg = parse_svg(driveRatioSVG);

	return (<div class={styles.RatioSpear}>
		<div class={styles.SpearContainer}>
			<div class={styles.SpearProgress} style={{
				width: `${ratio(hints()?.total, hints()?.used)}%`
			}}></div>
		</div>
	</div>);
};

function ratio(t: number, a: number): number {
	return Math.trunc((a / t) * 100);
}
