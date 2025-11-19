<script lang="ts">
	import { onMount } from 'svelte';

	let activityByWeekday = [
		[0, 0, 0, 0, 0, 0, 0, 0, 38, 56, 66, 60, 49, 39, 37, 36, 38, 42, 45, 37, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 30, 40, 42, 48, 53, 61, 63, 62, 61, 70, 82, 100, 94, 76, 53, 28, 0, 0],
		[0, 0, 0, 0, 0, 0, 37, 48, 50, 47, 46, 45, 46, 48, 53, 61, 75, 87, 93, 80, 60, 35, 0, 0],
		[0, 0, 0, 0, 0, 0, 36, 46, 42, 42, 45, 46, 44, 45, 49, 59, 74, 95, 93, 77, 53, 32, 0, 0],
		[0, 0, 0, 0, 0, 0, 40, 54, 58, 60, 57, 57, 55, 51, 46, 46, 58, 78, 91, 89, 73, 44, 0, 0],
		[0, 0, 0, 0, 0, 0, 36, 53, 58, 58, 58, 53, 47, 45, 51, 59, 67, 65, 60, 54, 41, 28, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 49, 66, 64, 53, 42, 37, 32, 30, 30, 30, 30, 23, 0, 0, 0, 0]
	];

	let now = $state(new Date().getTime());
	const nowWeekday = $derived(new Date(now).getDay());
	const nowHour = $derived(new Date(now).getHours());

	// Monday to Sunday
	const weekdayNumbers = [1, 2, 3, 4, 5, 6, 0];

	const weekdayNames = weekdayNumbers.map((weekday) => {
		const date = new Date(Date.UTC(2025, 0, 5 + weekday));
		return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);
	});

	const hours: number[] = [];
	for (let hour = 6; hour < 22; hour++) {
		hours.push(hour);
	}

	// Update current time every second
	onMount(() => {
		const interval = setInterval(() => (now = new Date().getTime()), 1_000);
		return () => clearInterval(interval);
	});


</script>

<svelte:head>
	<title>Nuffield activity</title>
</svelte:head>

<div class="activity-table-wrapper h-dvh w-screen">
	<div class="activity-table mx-auto h-dvh w-screen md:w-xl md:shadow-xl">
		<div
			class={`grid-rows-[repeat(${hours.length + 1}, minmax(0, 1fr))] grid h-full w-full grid-cols-8`}
		>
			<div style:background="color-mix(in oklab, var(--header-background-color), white 50%)"></div>
			{#each weekdayNames as name (name)}
				<div
					class="flex items-center justify-center bg-gray-200 text-center text-sm font-medium text-gray-600"
					style:background="linear-gradient(90deg, color-mix(in oklab,
					var(--header-background-color), white 50%), var(--header-background-color))"
				>
					{name}
				</div>
			{/each}
			{#each hours as hour (hour)}
				<div
					class="flex items-center justify-center bg-gray-200 text-center text-xs font-medium text-gray-600"
					style:background="linear-gradient(180deg, color-mix(in oklab,
					var(--header-background-color), white 50%), var(--header-background-color))"
				>
					{#if hour == 6}
						<!-- Earliest opening is 6:30 -->
						6:30
					{:else}
						{hour}:00
					{/if}
				</div>
				{#each weekdayNumbers as weekday (weekday)}
					{@const isNow = hour === nowHour && weekday === nowWeekday}
					{@const activity = activityByWeekday[weekday][hour]}

					{#if activity === 0}
						<div></div>
					{:else}
						{@const backgroundColor =
							activity < 50
								? `color-mix(in oklab, var(--heatmap-gradient-0), var(--heatmap-gradient-50) ${(activity / 50) * 100}%)`
								: `color-mix(in oklab, var(--heatmap-gradient-50), var(--heatmap-gradient-100) ${((activity - 50) / 50) * 100}%)`}

						<div
						class={`
						flex items-center justify-center text-center
						${activity > 0 && isNow ? 'z-10 -m-2 rounded-2xl border-1 border-gray-700/50 text-lg font-semibold drop-shadow-md' : ''}
						`}
							style:background={isNow
								? `linear-gradient(155deg, color-mix(in oklab, ${backgroundColor}, white 50%), ${backgroundColor})`
								: `linear-gradient(155deg, color-mix(in oklab, ${backgroundColor}, white 20%), ${backgroundColor})`}
						>
							{activity}
						</div>
					{/if}
				{/each}
			{/each}
		</div>
	</div>
</div>

<style>
	.activity-table-wrapper {
		--header-background-color: oklch(92.8% 0.006 264.531);

		--heatmap-gradient-0: hsl(120 80% 60%);
		--heatmap-gradient-50: hsl(60 85% 67.5%);
		--heatmap-gradient-100: hsl(0 90% 75%);

		--background-color: oklch(70.4% 0.04 256.788);
		--stripe-color: color-mix(in oklab, var(--background-color), black 5%);

		background-image: repeating-linear-gradient(
			135deg,
			var(--stripe-color) 0,
			var(--stripe-color) 1px,
			var(--background-color) 0,
			var(--background-color) 50%
		);
		background-size: 10px 10px;
		background-attachment: fixed;
	}

	.activity-table {
		--background-color: oklch(95.84 0 0);
		--stripe-color: color-mix(in oklab, var(--background-color), black 2%);

		background-image: repeating-linear-gradient(
			45deg,
			var(--stripe-color) 0,
			var(--stripe-color) 1px,
			var(--background-color) 0,
			var(--background-color) 50%
		);
		background-size: 10px 10px;
		background-attachment: fixed;
	}
</style>
