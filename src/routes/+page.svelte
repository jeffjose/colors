<script lang="ts">
	import { allPalettes, radixPalette, type Palette } from '$lib/palettes';
	import { getContrastColor, copyToClipboard } from '$lib/utils';
	import { Select } from 'bits-ui';

	type AppMode = 'palette' | 'theme';
	let activeMode = $state<AppMode>('palette');

	let selectedPalette = $state<Palette>(radixPalette);
	let copiedColor = $state<string | null>(null);
	let copiedName = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;
	let rightSidebarOpen = $state(true);
	let selectedColor = $state<{ hex: string; name: string; shade: string } | null>(null);
	let hoveredColor = $state<{ hex: string; name: string; shade: string } | null>(null);

	// Theme builder state (placeholder)
	let theme = $state({
		background: '#18181b',
		text: '#fafafa',
		muted: '#a1a1aa',
		accent: '#3b82f6',
		accentText: '#ffffff',
		border: '#27272a'
	});

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

	// Get the display color for the sidebar (hovered takes priority over selected)
	let displayColor = $derived(hoveredColor || selectedColor);

	// Derived color values for sidebar
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
	<title>Colors</title>
</svelte:head>

<div class="h-screen w-screen bg-zinc-950 flex overflow-hidden">
	<!-- Left Icon Sidebar -->
	<nav class="w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-2 shrink-0">
		<!-- Mode: Palette -->
		<button
			onclick={() => (activeMode = 'palette')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors {activeMode === 'palette' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Palette"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
		</button>

		<!-- Mode: Theme Builder -->
		<button
			onclick={() => (activeMode = 'theme')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors mt-1 {activeMode === 'theme' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Theme Builder"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
			</svg>
		</button>

		<div class="flex-1"></div>
	</nav>

	<!-- Main Column -->
	<div class="flex-1 flex flex-col min-h-0 min-w-0">
		<!-- Toolbar -->
		<header class="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 shrink-0">
			<!-- Left section -->
			<div class="flex items-center gap-1">
				{#if activeMode === 'palette'}
					<!-- Palette Selector -->
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
				{:else}
					<span class="text-xs font-medium text-zinc-300">Theme Builder</span>
				{/if}
			</div>

			<!-- Center section -->
			<div class="flex-1"></div>

			<!-- Right section -->
			<div class="flex items-center gap-1">
				{#if activeMode === 'palette'}
					<span class="text-[10px] text-zinc-500 mr-2">Click to copy</span>
				{/if}

				<!-- Toggle right sidebar -->
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
				{#if activeMode === 'palette'}
				<!-- Color Grid Container -->
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
							<!-- Row label -->
							<div class="w-14 shrink-0 flex items-center justify-end pr-2 gap-1">
								<span class="text-[9px] text-zinc-600">{shadeLabel?.hint || ''}</span>
								<span class="text-[10px] font-mono text-zinc-500 w-5 text-right">{shadeLabel?.shade || ''}</span>
							</div>
							<!-- Colors -->
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
				{:else}
				<!-- Theme Builder View -->
				<div class="flex-1 flex flex-col p-6 overflow-auto">
					<div class="max-w-4xl mx-auto w-full">
						<!-- Preview Card -->
						<div class="mb-8">
							<h3 class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Preview</h3>
							<div
								class="rounded-xl p-6 border"
								style="background-color: {theme.background}; border-color: {theme.border}"
							>
								<h2 class="text-xl font-semibold mb-2" style="color: {theme.text}">Slide Title</h2>
								<p class="text-sm mb-4" style="color: {theme.muted}">Secondary text and descriptions go here. This is what your muted content will look like.</p>

								<div class="flex gap-3">
									<div
										class="px-4 py-2 rounded-lg text-sm font-medium"
										style="background-color: {theme.accent}; color: {theme.accentText}"
									>
										Primary Button
									</div>
									<div
										class="px-4 py-2 rounded-lg text-sm font-medium border"
										style="border-color: {theme.border}; color: {theme.text}"
									>
										Secondary Button
									</div>
								</div>
							</div>
						</div>

						<!-- Color Roles -->
						<div>
							<h3 class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Theme Colors</h3>
							<div class="grid grid-cols-2 gap-3">
								<!-- Background -->
								<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
									<div class="w-10 h-10 rounded-md border border-zinc-700" style="background-color: {theme.background}"></div>
									<div>
										<div class="text-xs font-medium text-zinc-300">Background</div>
										<div class="text-[10px] text-zinc-500 font-mono">{theme.background}</div>
									</div>
								</div>

								<!-- Text -->
								<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
									<div class="w-10 h-10 rounded-md border border-zinc-700" style="background-color: {theme.text}"></div>
									<div>
										<div class="text-xs font-medium text-zinc-300">Text</div>
										<div class="text-[10px] text-zinc-500 font-mono">{theme.text}</div>
									</div>
								</div>

								<!-- Muted -->
								<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
									<div class="w-10 h-10 rounded-md border border-zinc-700" style="background-color: {theme.muted}"></div>
									<div>
										<div class="text-xs font-medium text-zinc-300">Muted</div>
										<div class="text-[10px] text-zinc-500 font-mono">{theme.muted}</div>
									</div>
								</div>

								<!-- Accent -->
								<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
									<div class="w-10 h-10 rounded-md border border-zinc-700" style="background-color: {theme.accent}"></div>
									<div>
										<div class="text-xs font-medium text-zinc-300">Accent</div>
										<div class="text-[10px] text-zinc-500 font-mono">{theme.accent}</div>
									</div>
								</div>

								<!-- Accent Text -->
								<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
									<div class="w-10 h-10 rounded-md border border-zinc-700" style="background-color: {theme.accentText}"></div>
									<div>
										<div class="text-xs font-medium text-zinc-300">Accent Text</div>
										<div class="text-[10px] text-zinc-500 font-mono">{theme.accentText}</div>
									</div>
								</div>

								<!-- Border -->
								<div class="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
									<div class="w-10 h-10 rounded-md border border-zinc-700" style="background-color: {theme.border}"></div>
									<div>
										<div class="text-xs font-medium text-zinc-300">Border</div>
										<div class="text-[10px] text-zinc-500 font-mono">{theme.border}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/if}
			</main>

				<!-- Right Sidebar -->
			{#if rightSidebarOpen}
				<aside class="w-60 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
					<!-- Sidebar Header -->
					<div class="h-10 px-3 flex items-center border-b border-zinc-800">
						<span class="text-xs font-medium text-zinc-400">
							{activeMode === 'palette' ? 'Properties' : 'Theme'}
						</span>
					</div>

					<!-- Sidebar Content -->
					<div class="flex-1 overflow-y-auto">
						{#if activeMode === 'palette'}
							{#if displayColor}
								<!-- Color Preview -->
								<div class="p-3">
									<div
										class="w-full aspect-square rounded-lg shadow-inner"
										style="background-color: {displayColor.hex}"
									></div>
								</div>

								<!-- Color Info -->
								<div class="px-3 pb-3">
									<div class="space-y-3">
										<!-- Name -->
										<div>
											<label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Color</label>
											<div class="text-sm text-zinc-200 mt-0.5">{displayColor.name}</div>
										</div>

										<!-- Shade -->
										<div>
											<label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Shade</label>
											<div class="text-sm text-zinc-200 mt-0.5">{displayColor.shade}</div>
										</div>

										<div class="h-px bg-zinc-800"></div>

										<!-- Hex -->
										<div>
											<label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Hex</label>
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

										<!-- RGB -->
										{#if colorRGB}
											<div>
												<label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">RGB</label>
												<div class="text-sm text-zinc-200 font-mono mt-0.5">{colorRGB.r}, {colorRGB.g}, {colorRGB.b}</div>
											</div>
										{/if}

										<!-- HSL -->
										{#if colorHSL}
											<div>
												<label class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">HSL</label>
												<div class="text-sm text-zinc-200 font-mono mt-0.5">{colorHSL.h}, {colorHSL.s}%, {colorHSL.l}%</div>
											</div>
										{/if}
									</div>
								</div>
							{:else}
								<!-- Empty state -->
								<div class="p-4 text-center">
									<div class="text-zinc-600 text-xs">Hover or select a color to see details</div>
								</div>
							{/if}
						{:else}
							<!-- Theme Builder Sidebar -->
							<div class="p-3 space-y-4">
								<div class="text-xs text-zinc-500">
									Click colors in the palette view to assign them to your theme.
								</div>

								<div class="h-px bg-zinc-800"></div>

								<div>
									<h4 class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">Export</h4>
									<button class="w-full px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors">
										Copy CSS Variables
									</button>
								</div>
							</div>
						{/if}
					</div>

					<!-- Sidebar Footer -->
					<div class="p-3 border-t border-zinc-800">
						<div class="text-[10px] text-zinc-600">
							{#if activeMode === 'palette'}
								{selectedPalette.groups.length} colors &middot; {getMaxShades(selectedPalette)} shades
							{:else}
								6 color roles
							{/if}
						</div>
					</div>
				</aside>
			{/if}
		</div>
	</div>

	<!-- Toast -->
	{#if copiedColor}
		<div
			class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium"
		>
			<div class="w-4 h-4 rounded shadow-inner" style="background-color: {copiedColor}"></div>
			<span>{copiedName}</span>
			<span class="text-zinc-500 uppercase">{copiedColor}</span>
		</div>
	{/if}
</div>
