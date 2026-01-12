<script lang="ts">
	import { allPalettes, radixPalette, type Palette } from '$lib/palettes';
	import { getContrastColor, copyToClipboard } from '$lib/utils';
	import { Select } from 'bits-ui';

	let selectedPalette = $state<Palette>(radixPalette);
	let copiedColor = $state<string | null>(null);
	let copiedName = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;
	let rightSidebarOpen = $state(true);
	let selectedColor = $state<{ hex: string; name: string; shade: string } | null>(null);
	let hoveredColor = $state<{ hex: string; name: string; shade: string } | null>(null);

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

	function handleColorClick(hex: string, name: string, shade: string) {
		selectedColor = { hex, name, shade };
		handleCopy(hex, name, shade);
	}

	function handleColorHover(hex: string, name: string, shade: string) {
		hoveredColor = { hex, name, shade };
	}

	function handleColorLeave() {
		hoveredColor = null;
	}

	let displayColor = $derived(hoveredColor || selectedColor);

	let colorRGB = $derived.by(() => {
		if (!displayColor) return null;
		return {
			r: parseInt(displayColor.hex.slice(1, 3), 16),
			g: parseInt(displayColor.hex.slice(3, 5), 16),
			b: parseInt(displayColor.hex.slice(5, 7), 16)
		};
	});

	let colorHSL = $derived.by(() => {
		if (!colorRGB) return null;
		const r = colorRGB.r / 255;
		const g = colorRGB.g / 255;
		const b = colorRGB.b / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const l = (max + min) / 2;
		const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
		let h = 0;
		if (max !== min) {
			if (max === r) h = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
			else if (max === g) h = ((b - r) / (max - min) + 2) * 60;
			else h = ((r - g) / (max - min) + 4) * 60;
		}
		return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
	});
</script>

<svelte:head>
	<title>Colors - Palette</title>
</svelte:head>

<!-- Toolbar -->
<header class="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 shrink-0">
	<div class="flex items-center gap-1">
		<Select.Root
			type="single"
			value={selectedPalette.name}
			onValueChange={(value) => {
				const palette = allPalettes.find(p => p.name === value);
				if (palette) selectedPalette = palette;
			}}
		>
			<Select.Trigger
				class="inline-flex items-center gap-2 px-2.5 py-1.5 h-7 rounded-md text-xs font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
			>
				<span>{selectedPalette.name}</span>
				<svg class="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					class="z-50 min-w-[160px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/50"
					sideOffset={4}
				>
					<Select.Viewport class="p-1">
						{#each allPalettes as palette}
							<Select.Item
								value={palette.name}
								class="relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-7 pr-2 text-xs outline-none text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 data-[highlighted]:bg-zinc-800"
							>
								{#snippet children({ selected })}
									{#if selected}
										<span class="absolute left-2 flex items-center justify-center">
											<svg class="h-3 w-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

	<div class="flex-1"></div>

	<div class="flex items-center gap-1">
		<span class="text-[10px] text-zinc-500 mr-2">Click to copy</span>
		<button
			onclick={() => (rightSidebarOpen = !rightSidebarOpen)}
			class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-zinc-800 transition-colors {rightSidebarOpen ? 'bg-zinc-800 text-zinc-300' : 'text-zinc-500'}"
			title="Toggle sidebar"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
			</svg>
		</button>
	</div>
</header>

<!-- Content Area -->
<div class="flex-1 flex min-h-0">
	<!-- Main Canvas -->
	<main class="flex-1 flex flex-col min-h-0 min-w-0 bg-zinc-950">
		<div class="flex-1 flex flex-col p-4 overflow-auto">
			<!-- Headers Row -->
			<div class="flex gap-1 mb-2 shrink-0 sticky top-0 bg-zinc-950 z-10 pb-1">
				<div class="w-14 shrink-0"></div>
				<div class="flex-1 grid gap-1" style="grid-template-columns: repeat({selectedPalette.groups.length}, minmax(0, 1fr))">
					{#each selectedPalette.groups as group}
						<div class="text-center text-[10px] font-medium text-zinc-500 truncate">
							{group.name}
						</div>
					{/each}
				</div>
			</div>

			<!-- Color Rows -->
			<div class="flex-1 flex flex-col gap-1">
				{#each Array(getMaxShades(selectedPalette)) as _, rowIndex}
					{@const shadeLabel = selectedPalette.shadeLabels[rowIndex]}
					<div class="flex gap-1" style="height: calc((100vh - 180px) / {getMaxShades(selectedPalette)})">
						<div class="w-14 shrink-0 flex items-center justify-end pr-2 gap-1">
							<span class="text-[9px] text-zinc-600">{shadeLabel?.hint || ''}</span>
							<span class="text-[10px] font-mono text-zinc-500 w-5 text-right">{shadeLabel?.shade || ''}</span>
						</div>
						<div class="flex-1 grid gap-1" style="grid-template-columns: repeat({selectedPalette.groups.length}, minmax(0, 1fr))">
							{#each selectedPalette.groups as group}
								{@const color = group.colors[rowIndex]}
								{#if color}
									{@const contrastColor = getContrastColor(color.hex)}
									{@const isSelected = selectedColor?.hex === color.hex && selectedColor?.name === group.name}
									<button
										onclick={() => handleColorClick(color.hex, group.name, color.shade)}
										onmouseenter={() => handleColorHover(color.hex, group.name, color.shade)}
										onmouseleave={handleColorLeave}
										class="group relative w-full h-full min-h-6 rounded transition-all hover:scale-105 hover:z-10 hover:shadow-lg hover:shadow-black/40 cursor-pointer active:scale-100 {isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-950' : ''}"
										style="background-color: {color.hex}"
										title="{group.name} {color.shade}: {color.hex}"
									>
										{#if copiedColor === color.hex}
											<span
												class="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
												style="color: {contrastColor}"
											>
												Copied!
											</span>
										{/if}
									</button>
								{:else}
									<div class="w-full h-full min-h-6"></div>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</main>

	<!-- Right Sidebar -->
	{#if rightSidebarOpen}
		<aside class="w-60 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
			<div class="h-10 px-3 flex items-center border-b border-zinc-800">
				<span class="text-xs font-medium text-zinc-400">Properties</span>
			</div>

			<div class="flex-1 overflow-y-auto">
				{#if displayColor}
					<div class="p-3">
						<div
							class="w-full aspect-square rounded-lg shadow-inner"
							style="background-color: {displayColor.hex}"
						></div>
					</div>

					<div class="px-3 pb-3">
						<div class="space-y-3">
							<div>
								<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Color</div>
								<div class="text-sm text-zinc-200 mt-0.5">{displayColor.name}</div>
							</div>

							<div>
								<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Shade</div>
								<div class="text-sm text-zinc-200 mt-0.5">{displayColor.shade}</div>
							</div>

							<div class="h-px bg-zinc-800"></div>

							<div>
								<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Hex</div>
								<button
									onclick={() => handleCopy(displayColor.hex, displayColor.name, displayColor.shade)}
									class="flex items-center gap-2 mt-0.5 group"
								>
									<code class="text-sm text-zinc-200 font-mono">{displayColor.hex.toUpperCase()}</code>
									<svg class="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								</button>
							</div>

							{#if colorRGB}
								<div>
									<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">RGB</div>
									<div class="text-sm text-zinc-200 font-mono mt-0.5">{colorRGB.r}, {colorRGB.g}, {colorRGB.b}</div>
								</div>
							{/if}

							{#if colorHSL}
								<div>
									<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">HSL</div>
									<div class="text-sm text-zinc-200 font-mono mt-0.5">{colorHSL.h}, {colorHSL.s}%, {colorHSL.l}%</div>
								</div>
							{/if}
						</div>
					</div>
				{:else}
					<div class="p-4 text-center">
						<div class="text-zinc-600 text-xs">Hover or select a color to see details</div>
					</div>
				{/if}
			</div>

			<div class="p-3 border-t border-zinc-800">
				<div class="text-[10px] text-zinc-600">
					{selectedPalette.groups.length} colors &middot; {getMaxShades(selectedPalette)} shades
				</div>
			</div>
		</aside>
	{/if}
</div>

<!-- Toast -->
{#if copiedColor}
	<div
		class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium z-50"
	>
		<div class="w-4 h-4 rounded shadow-inner" style="background-color: {copiedColor}"></div>
		<span>{copiedName}</span>
		<span class="text-zinc-500 uppercase">{copiedColor}</span>
	</div>
{/if}
