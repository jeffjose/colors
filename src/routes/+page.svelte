<script lang="ts">
	import { allPalettes, radixPalette, type Palette } from '$lib/palettes';
	import { getContrastColor, copyToClipboard } from '$lib/utils';
	import { Select } from 'bits-ui';

	let selectedPalette = $state<Palette>(radixPalette);
	let copiedColor = $state<string | null>(null);
	let copiedName = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;

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
			<Select.Root
				type="single"
				value={selectedPalette.name}
				onValueChange={(value) => {
					const palette = allPalettes.find(p => p.name === value);
					if (palette) selectedPalette = palette;
				}}
			>
				<Select.Trigger
					class="inline-flex items-center justify-between gap-2 px-3 py-1.5 h-9 min-w-[140px] rounded-md border border-slate-700 bg-slate-800 text-sm text-slate-200 ring-offset-slate-950 placeholder:text-slate-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
				>
					<span>{selectedPalette.name}</span>
					<svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
					</svg>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content
						class="relative z-50 max-h-96 min-w-[140px] overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-slate-200 shadow-lg"
						sideOffset={4}
					>
						<Select.Viewport class="p-1">
							{#each allPalettes as palette}
								<Select.Item
									value={palette.name}
									class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 data-[highlighted]:bg-slate-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
								>
									{#snippet children({ selected })}
										{#if selected}
											<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
												</svg>
											</span>
										{/if}
										{palette.name}
									{/snippet}
								</Select.Item>
							{/each}
						</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
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
