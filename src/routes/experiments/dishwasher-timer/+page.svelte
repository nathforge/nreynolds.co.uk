<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let programDurationString = $state('02:35');
	let programDesiredEndStr = $state('07:00');

	let programDurationMs = $derived(durationMsFromTimeStr(programDurationString));

	let nowTime = $state(new Date().getTime());
	let nowDate = $derived(new Date(nowTime));
	let nowStr = $derived(timeStrFromDate(nowDate));

	let timerDurationMs = $derived.by(() => {
		const programDesiredEndDate = dateFromTimeStr(programDesiredEndStr);
		// If finish time is before current time, assume it's tomorrow
		if (programDesiredEndDate <= nowDate) {
			programDesiredEndDate.setDate(programDesiredEndDate.getDate() + 1);
		}

		// Calculate when to start
		const startTime = new Date(programDesiredEndDate.getTime() - programDurationMs).getTime();

		return startTime - nowTime;
	});

	let timerHours = $derived(Math.max(0, Math.floor(timerDurationMs / (1000 * 60 * 60))));

	let programStartTime = $derived(new Date(nowTime + timerHours * 60 * 60 * 1000).getTime());
	let programEndTime = $derived(programStartTime + programDurationMs);

	let programStartStr = $derived(timeStrFromDate(new Date(programStartTime)));
	let programEndStr = $derived(timeStrFromDate(new Date(programEndTime)));

	onMount(() => {
		const interval = setInterval(() => (nowTime = new Date().getTime()), 60_000);
		return () => clearInterval(interval);
	});

	onMount(() => {
		if (browser) {
			programDurationString = getTimeStrFromLocalStorage('programDuration', programDurationString);
			programDesiredEndStr = getTimeStrFromLocalStorage('programEndAt', programDesiredEndStr);
		}
	});

	$effect(() => {
		if (browser) {
			setTimeStrToLocalStorage('programDuration', programDurationString);
			setTimeStrToLocalStorage('programEndAt', programDesiredEndStr);
		}
	});

	function timeStrFromDate(date: Date): string {
		return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}

	function dateFromTimeStr(timeString: string) {
		const [hour, minute] = timeString.split(':').map(Number);
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const date = new Date();
		date.setHours(hour, minute, 0, 0);
		return date;
	}

	function durationMsFromTimeStr(timeString: string) {
		const [hour, minute] = timeString.split(':').map(Number);
		return (hour * 60 + minute) * 60 * 1000;
	}

	function getTimeStrFromLocalStorage<T>(key: string, defaultValue: T): string | T {
		const string = localStorage.getItem(`dishwasher-calc:${key}`);
		if (string !== null && string.match(/^\d{2}:\d{2}$/)) {
			return string;
		}
		return defaultValue;
	}

	function setTimeStrToLocalStorage(key: string, value: string): void {
		if (!value.match(/^\d{2}:\d{2}$/)) {
			throw new Error('Invalid time string');
		}
		localStorage.setItem(`dishwasher-calc:${key}`, value);
	}
</script>

<svelte:head>
	<title>Dishwasher Timer</title>
</svelte:head>

<div class="mt-8 w-full rounded-lg bg-white p-6 sm:mx-auto sm:max-w-md sm:shadow-lg">
	<h1 class="mb-6 text-center text-2xl font-bold text-gray-800">🧽 Dishwasher Timer</h1>

	<div class="mb-4 rounded-md bg-blue-50 p-3">
		<p class="text-sm text-blue-700">
			<strong>Current time:</strong>
			{nowStr}
		</p>
	</div>

	<form class="space-y-4">
		<label class="mb-6 block">
			<span class="mb-2 block text-sm font-medium text-gray-700">Program Duration</span>
			<input
				type="time"
				bind:value={programDurationString}
				class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</label>
		<label class="mb-4 block">
			<span class="mb-2 block text-sm font-medium text-gray-700">Finish Time</span>
			<input
				type="time"
				bind:value={programDesiredEndStr}
				class="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</label>
	</form>

	<div class="mt-6 rounded-r-md border-l-4 border-green-400 bg-green-50 p-4">
		<h2 class="mb-2 text-lg font-semibold text-green-800">Result:</h2>

		{#if timerHours > 0}
			<p class="text-green-700">
				Set your dishwasher timer for
				{timerHours}
				{#if timerHours === 1}hour{:else}hours{/if}. It will start at {programStartStr} and finish at
				{programEndStr}.
			</p>
			<div class="mt-3 rounded-md bg-green-100 p-2">
				<p class="text-center text-2xl font-bold text-green-800">
					⏰ {timerHours}
					{#if timerHours === 1}hour{:else}hours{/if}
				</p>
			</div>
		{:else}
			<div class="text-green-700">
				<p>The dishwasher should have been started already!</p>
				<p>If you start it now, it'll finish at {programEndStr}.</p>
			</div>
		{/if}
	</div>
</div>
