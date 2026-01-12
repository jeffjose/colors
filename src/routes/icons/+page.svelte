<script lang="ts">
	import { Select } from 'bits-ui';
	import { copyToClipboard } from '$lib/utils';
	import { allPalettes, radixPalette, type Palette } from '$lib/palettes';
	import {
		parseSvgContent,
		applySolidColor,
		applyGradient,
		setSvgSize,
		svgToPng,
		downloadDataUrl
	} from '$lib/icon-utils';

	// State
	let svgContent = $state<string>('');
	let iconSize = $state<number>(512);
	let fillMode = $state<'solid' | 'gradient'>('solid');
	let solidColor = $state<string>('#000000');
	let gradientType = $state<'linear' | 'radial'>('linear');
	let gradientStart = $state<string>('#3b82f6');
	let gradientEnd = $state<string>('#8b5cf6');
	let gradientAngle = $state<number>(180);
	let rightSidebarOpen = $state<boolean>(true);

	// Toast state
	let toastMessage = $state<string | null>(null);
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Size presets
	const sizePresets = [16, 24, 32, 48, 64, 96, 128, 256, 512];

	// All colors from selected palette organized by group
	const paletteColors = $derived.by(() => {
		return colorPalette.groups.map((group) => ({
			name: group.name,
			colors: group.colors.map((c) => ({ shade: c.shade, hex: c.hex }))
		}));
	});

	// Processed SVG with all modifications applied
	let processedSvg = $derived.by(() => {
		if (!svgContent) return '';

		let result = svgContent;

		// Apply color or gradient
		if (fillMode === 'solid') {
			result = applySolidColor(result, solidColor);
		} else {
			result = applyGradient(result, gradientType, gradientStart, gradientEnd, gradientAngle);
		}

		// Apply size
		result = setSvgSize(result, iconSize);

		return result;
	});

	function showToast(message: string) {
		toastMessage = message;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastMessage = null;
		}, 1500);
	}

	async function handlePaste() {
		try {
			const text = await navigator.clipboard.readText();
			const parsed = parseSvgContent(text);
			if (parsed) {
				svgContent = parsed;
				showToast('SVG pasted');
			} else {
				showToast('No valid SVG found');
			}
		} catch {
			showToast('Failed to read clipboard');
		}
	}

	async function handleCopySvg() {
		if (!processedSvg) return;
		const success = await copyToClipboard(processedSvg);
		if (success) {
			showToast('SVG copied');
		}
	}

	async function handleCopyPng() {
		if (!processedSvg) return;
		try {
			const dataUrl = await svgToPng(processedSvg, iconSize);
			// Convert data URL to blob
			const response = await fetch(dataUrl);
			const blob = await response.blob();
			await navigator.clipboard.write([
				new ClipboardItem({ 'image/png': blob })
			]);
			showToast('PNG copied');
		} catch {
			showToast('Failed to copy PNG');
		}
	}

	async function handleDownloadPng() {
		if (!processedSvg) return;
		try {
			const dataUrl = await svgToPng(processedSvg, iconSize);
			downloadDataUrl(dataUrl, `icon-${iconSize}px.png`);
			showToast('PNG downloaded');
		} catch {
			showToast('Failed to export PNG');
		}
		pngMenuOpen = false;
	}

	let pngMenuOpen = $state(false);
	let colorPalette = $state<Palette>(radixPalette);
	let colorPickerTab = $state<'solid' | 'gradient'>('solid');

	// Preset gradients
	const presetGradients = [
		{ name: 'Sunset', start: '#f97316', end: '#ec4899', angle: 135 },
		{ name: 'Ocean', start: '#06b6d4', end: '#3b82f6', angle: 135 },
		{ name: 'Forest', start: '#22c55e', end: '#14b8a6', angle: 135 },
		{ name: 'Purple Haze', start: '#8b5cf6', end: '#ec4899', angle: 135 },
		{ name: 'Fire', start: '#ef4444', end: '#f97316', angle: 180 },
		{ name: 'Ice', start: '#67e8f9', end: '#a5b4fc', angle: 180 },
		{ name: 'Midnight', start: '#1e3a8a', end: '#7c3aed', angle: 135 },
		{ name: 'Gold', start: '#fbbf24', end: '#f97316', angle: 135 },
		{ name: 'Rose', start: '#fb7185', end: '#f472b6', angle: 135 },
		{ name: 'Lime', start: '#84cc16', end: '#22c55e', angle: 135 },
		{ name: 'Sky', start: '#38bdf8', end: '#818cf8', angle: 135 },
		{ name: 'Ember', start: '#dc2626', end: '#7c2d12', angle: 180 },
	];

	function applyPresetGradient(preset: typeof presetGradients[0]) {
		gradientStart = preset.start;
		gradientEnd = preset.end;
		gradientAngle = preset.angle;
		gradientType = 'linear';
		fillMode = 'gradient';
		showToast(preset.name);
	}

	function handleQuickColor(hex: string) {
		solidColor = hex;
		if (fillMode !== 'solid') {
			fillMode = 'solid';
		}
		showToast(`Color: ${hex}`);
	}

	// Handle keyboard paste (Ctrl+V / Cmd+V)
	function handleKeydown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
			// Only handle if not in an input field
			const target = event.target as HTMLElement;
			if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
				event.preventDefault();
				handlePaste();
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>Colors - Icon Studio</title>
</svelte:head>

<!-- Toolbar -->
<header class="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 shrink-0">
	<div class="flex items-center gap-2">
		<button
			onclick={handlePaste}
			class="inline-flex items-center gap-1.5 px-2.5 py-1.5 h-7 rounded-md text-xs font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
				/>
			</svg>
			Paste SVG
		</button>

		<div class="w-px h-5 bg-zinc-700"></div>

		<Select.Root
			type="single"
			value={String(iconSize)}
			onValueChange={(value) => (iconSize = Number(value))}
		>
			<Select.Trigger
				class="inline-flex items-center gap-2 px-2.5 py-1.5 h-7 rounded-md text-xs font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
			>
				<span>{iconSize}px</span>
				<svg class="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					class="z-50 min-w-[100px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/50"
					sideOffset={4}
				>
					<Select.Viewport class="p-1">
						{#each sizePresets as size}
							<Select.Item
								value={String(size)}
								class="relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-7 pr-2 text-xs outline-none text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 data-[highlighted]:bg-zinc-800"
							>
								{#snippet children({ selected })}
									{#if selected}
										<span class="absolute left-2 flex items-center justify-center">
											<svg
												class="h-3 w-3 text-zinc-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</span>
									{/if}
									{size}px
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	</div>

	<div class="flex-1"></div>

	<div class="flex items-center gap-2">
		<button
			onclick={handleCopySvg}
			disabled={!processedSvg}
			class="inline-flex items-center gap-1.5 px-2.5 py-1.5 h-7 rounded-md text-xs font-medium transition-colors {processedSvg
				? 'text-zinc-300 hover:bg-zinc-800'
				: 'text-zinc-600 cursor-not-allowed'}"
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
				/>
			</svg>
			Copy SVG
		</button>

		<div class="relative">
			<div class="flex">
				<button
					onclick={handleCopyPng}
					disabled={!processedSvg}
					class="inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 h-7 rounded-l-md text-xs font-medium transition-colors {processedSvg
						? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
						: 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'}"
				>
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					PNG
				</button>
				<button
					onclick={() => (pngMenuOpen = !pngMenuOpen)}
					disabled={!processedSvg}
					class="inline-flex items-center px-1.5 py-1.5 h-7 rounded-r-md border-l border-zinc-700 text-xs font-medium transition-colors {processedSvg
						? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
						: 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'}"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</div>
			{#if pngMenuOpen}
				<div class="absolute right-0 top-full mt-1 py-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-50 whitespace-nowrap">
					<button
						onclick={handleDownloadPng}
						class="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
					>
						Download PNG
					</button>
				</div>
			{/if}
		</div>

		<div class="w-px h-5 bg-zinc-700"></div>

		<button
			onclick={() => (rightSidebarOpen = !rightSidebarOpen)}
			class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-zinc-800 transition-colors {rightSidebarOpen
				? 'bg-zinc-800 text-zinc-300'
				: 'text-zinc-500'}"
			title="Toggle sidebar"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
				/>
			</svg>
		</button>
	</div>
</header>

<!-- Content Area -->
<div class="flex-1 flex min-h-0">
	<!-- Main Canvas -->
	<main class="flex-1 flex flex-col min-h-0 min-w-0 bg-zinc-950">
		<div class="flex-1 flex items-center justify-center p-8">
			{#if processedSvg}
				<!-- Icon Preview with checkered background -->
				<div
					class="relative rounded-lg shadow-2xl shadow-black/50"
					style="
						width: {Math.max(iconSize + 64, 200)}px;
						height: {Math.max(iconSize + 64, 200)}px;
						background-image: linear-gradient(45deg, #27272a 25%, transparent 25%),
							linear-gradient(-45deg, #27272a 25%, transparent 25%),
							linear-gradient(45deg, transparent 75%, #27272a 75%),
							linear-gradient(-45deg, transparent 75%, #27272a 75%);
						background-size: 20px 20px;
						background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
						background-color: #18181b;
					"
				>
					<div class="absolute inset-0 flex items-center justify-center">
						{@html processedSvg}
					</div>
				</div>
			{:else}
				<!-- Empty state -->
				<div class="text-center">
					<p class="text-zinc-500 text-sm">Paste an SVG</p>
				</div>
			{/if}
		</div>
	</main>

	<!-- Right Sidebar -->
	{#if rightSidebarOpen}
		<aside class="w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 overflow-hidden">
			<div class="h-10 px-3 flex items-center border-b border-zinc-800">
				<span class="text-xs font-medium text-zinc-400">Properties</span>
			</div>

			<div class="flex-1 overflow-y-auto">
				<div class="p-3 space-y-4">
					<!-- Size -->
					<div>
						<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
							Size
						</div>
						<div class="flex items-center gap-2">
							<input
								type="number"
								bind:value={iconSize}
								min="8"
								max="512"
								class="flex-1 h-7 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
							/>
							<span class="text-xs text-zinc-500">px</span>
						</div>
					</div>

					<div class="h-px bg-zinc-800"></div>

					<!-- Fill Mode -->
					<div>
						<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
							Fill Mode
						</div>
						<div class="flex gap-1">
							<button
								onclick={() => (fillMode = 'solid')}
								class="flex-1 h-7 rounded-md text-xs font-medium transition-colors {fillMode ===
								'solid'
									? 'bg-zinc-700 text-zinc-100'
									: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'}"
							>
								Solid
							</button>
							<button
								onclick={() => (fillMode = 'gradient')}
								class="flex-1 h-7 rounded-md text-xs font-medium transition-colors {fillMode ===
								'gradient'
									? 'bg-zinc-700 text-zinc-100'
									: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'}"
							>
								Gradient
							</button>
						</div>
					</div>

					{#if fillMode === 'solid'}
						<!-- Solid Color -->
						<div>
							<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
								Color
							</div>
							<div class="flex items-center gap-2">
								<div
									class="w-7 h-7 rounded-md border border-zinc-700 shrink-0"
									style="background-color: {solidColor}"
								></div>
								<input
									type="text"
									bind:value={solidColor}
									class="flex-1 h-7 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
								/>
							</div>
						</div>
					{:else}
						<!-- Gradient Settings -->
						<div>
							<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
								Gradient Type
							</div>
							<div class="flex gap-1">
								<button
									onclick={() => (gradientType = 'linear')}
									class="flex-1 h-7 rounded-md text-xs font-medium transition-colors {gradientType ===
									'linear'
										? 'bg-zinc-700 text-zinc-100'
										: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'}"
								>
									Linear
								</button>
								<button
									onclick={() => (gradientType = 'radial')}
									class="flex-1 h-7 rounded-md text-xs font-medium transition-colors {gradientType ===
									'radial'
										? 'bg-zinc-700 text-zinc-100'
										: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'}"
								>
									Radial
								</button>
							</div>
						</div>

						<div>
							<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
								Start Color
							</div>
							<div class="flex items-center gap-2">
								<div
									class="w-7 h-7 rounded-md border border-zinc-700 shrink-0"
									style="background-color: {gradientStart}"
								></div>
								<input
									type="text"
									bind:value={gradientStart}
									class="flex-1 h-7 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
								/>
							</div>
						</div>

						<div>
							<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
								End Color
							</div>
							<div class="flex items-center gap-2">
								<div
									class="w-7 h-7 rounded-md border border-zinc-700 shrink-0"
									style="background-color: {gradientEnd}"
								></div>
								<input
									type="text"
									bind:value={gradientEnd}
									class="flex-1 h-7 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
								/>
							</div>
						</div>

						{#if gradientType === 'linear'}
							<div>
								<div class="flex items-center justify-between mb-2">
									<div class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
										Angle
									</div>
									<div class="text-xs text-zinc-400">{gradientAngle}°</div>
								</div>
								<input
									type="range"
									bind:value={gradientAngle}
									min="0"
									max="360"
									class="w-full h-1.5 rounded-full bg-zinc-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-400"
								/>
							</div>
						{/if}
					{/if}

					<div class="h-px bg-zinc-800"></div>

					<!-- Color Picker with Tabs -->
					<div>
						<div class="flex gap-1 mb-3">
							<button
								onclick={() => (colorPickerTab = 'solid')}
								class="flex-1 h-6 rounded text-[10px] font-medium transition-colors {colorPickerTab === 'solid'
									? 'bg-zinc-700 text-zinc-100'
									: 'text-zinc-500 hover:text-zinc-300'}"
							>
								Solid
							</button>
							<button
								onclick={() => (colorPickerTab = 'gradient')}
								class="flex-1 h-6 rounded text-[10px] font-medium transition-colors {colorPickerTab === 'gradient'
									? 'bg-zinc-700 text-zinc-100'
									: 'text-zinc-500 hover:text-zinc-300'}"
							>
								Gradients
							</button>
						</div>

						{#if colorPickerTab === 'solid'}
							<!-- Palette Selector -->
							<div class="mb-2">
								<select
									bind:value={colorPalette}
									class="w-full h-6 px-2 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-600"
								>
									{#each allPalettes as palette}
										<option value={palette}>{palette.name}</option>
									{/each}
								</select>
							</div>

							<!-- Color Grid -->
							<div class="max-h-48 overflow-y-auto rounded bg-zinc-800/50 p-1">
								{#each paletteColors as group}
									<div class="flex gap-px mb-px">
										{#each group.colors as color}
											<button
												onclick={() => handleQuickColor(color.hex)}
												class="flex-1 h-4 hover:scale-y-150 hover:z-10 transition-transform first:rounded-l last:rounded-r"
												style="background-color: {color.hex}"
												title="{group.name} {color.shade}"
											></button>
										{/each}
									</div>
								{/each}
							</div>
						{:else}
							<!-- Gradient Presets -->
							<div class="grid grid-cols-3 gap-1">
								{#each presetGradients as preset}
									<button
										onclick={() => applyPresetGradient(preset)}
										class="h-8 rounded hover:scale-105 hover:z-10 transition-transform"
										style="background: linear-gradient({preset.angle}deg, {preset.start}, {preset.end})"
										title={preset.name}
									></button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</aside>
	{/if}
</div>

<!-- Toast -->
{#if toastMessage}
	<div
		class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium z-50"
	>
		<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
		</svg>
		<span>{toastMessage}</span>
	</div>
{/if}
