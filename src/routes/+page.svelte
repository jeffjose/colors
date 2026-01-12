<script lang="ts">
	import { allPalettes, type Palette } from '$lib/palettes';
	import { getContrastColor, copyToClipboard } from '$lib/utils';

	let selectedPalette = $state<Palette>(allPalettes[0]);
	let copiedColor = $state<string | null>(null);
	let copiedName = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;
	let dropdownOpen = $state(false);

	function getMaxShades(palette: Palette): number {
		return Math.max(...palette.groups.map((g) => g.colors.length));
	}

	async function handleCopy(hex: string, name: string, shade: string) {
		const success = await copyToClipboard(hex);
		if (success) {
			copiedColor = hex;
			copiedName = `${name} ${shade}`;
			clearTimeout(toastTimeout);
			toastTimeout = setTimeout(() => {
				copiedColor = null;
			}, 1500);
		}
	}

	function selectPalette(palette: Palette) {
		selectedPalette = palette;
		dropdownOpen = false;
	}
</script>

<svelte:head>
	<title>Colors</title>
</svelte:head>

<div class="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
	<!-- Header -->
	<header class="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 shrink-0">
		<div class="flex items-center gap-3">
			<h1 class="text-white font-semibold">Colors</h1>

			<!-- Dropdown -->
			<div class="relative">
				<button
					onclick={() => (dropdownOpen = !dropdownOpen)}
					class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition-colors"
				>
					<span>{selectedPalette.name}</span>
					<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{#if dropdownOpen}
					<!-- Backdrop -->
					<button
						class="fixed inset-0 z-10"
						onclick={() => (dropdownOpen = false)}
						aria-label="Close dropdown"
					></button>

					<!-- Menu -->
					<div class="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 min-w-[160px] py-1">
						{#each allPalettes as palette}
							<button
								onclick={() => selectPalette(palette)}
								class="w-full text-left px-3 py-2 text-sm hover:bg-slate-700 transition-colors {selectedPalette.name === palette.name ? 'text-white bg-slate-700' : 'text-slate-300'}"
							>
								{palette.name}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="ml-auto text-slate-500 text-xs">
			Click any color to copy
		</div>
	</header>

	<!-- Color Grid -->
	<main class="flex-1 flex flex-col min-h-0 p-3">
		<!-- Headers Row -->
		<div class="flex gap-1 mb-1.5 shrink-0">
			<!-- Empty space for row labels -->
			<div class="w-16 shrink-0"></div>
			<!-- Color headers -->
			<div class="flex-1 grid gap-1" style="grid-template-columns: repeat({selectedPalette.groups.length}, minmax(0, 1fr))">
				{#each selectedPalette.groups as group}
					<div class="text-center text-[11px] font-medium text-slate-400 truncate">
						{group.name}
					</div>
				{/each}
			</div>
		</div>

		<!-- Color Rows -->
		<div class="flex-1 flex flex-col gap-1 min-h-0">
			{#each Array(getMaxShades(selectedPalette)) as _, rowIndex}
				{@const shadeLabel = selectedPalette.shadeLabels[rowIndex]}
				<div class="flex-1 flex gap-1">
					<!-- Row label -->
					<div class="w-16 shrink-0 flex items-center justify-end pr-2 gap-1.5">
						<span class="text-[10px] text-slate-500">{shadeLabel?.hint || ''}</span>
						<span class="text-[11px] font-mono text-slate-400 w-6 text-right">{shadeLabel?.shade || ''}</span>
					</div>
					<!-- Colors -->
					<div class="flex-1 grid gap-1" style="grid-template-columns: repeat({selectedPalette.groups.length}, minmax(0, 1fr))">
						{#each selectedPalette.groups as group}
							{@const color = group.colors[rowIndex]}
							{#if color}
								{@const contrastColor = getContrastColor(color.hex)}
								<button
									onclick={() => handleCopy(color.hex, group.name, color.shade)}
									class="group relative w-full h-full rounded-md transition-all hover:scale-110 hover:z-10 hover:shadow-xl hover:shadow-black/50 cursor-pointer active:scale-95"
									style="background-color: {color.hex}"
									title="{group.name} {color.shade}: {color.hex}"
								>
									{#if copiedColor === color.hex}
										<span
											class="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
											style="color: {contrastColor}"
										>
											Copied!
										</span>
									{/if}
								</button>
							{:else}
								<div class="w-full h-full"></div>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</main>

	<!-- Toast -->
	{#if copiedColor}
		<div
			class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-2 rounded-lg shadow-xl flex items-center gap-3 text-sm font-medium"
		>
			<div class="w-5 h-5 rounded shadow-inner" style="background-color: {copiedColor}"></div>
			<span>{copiedName}</span>
			<span class="text-slate-500 uppercase text-xs">{copiedColor}</span>
		</div>
	{/if}
</div>
