<script lang="ts">
	import { Select } from 'bits-ui';
	import { copyToClipboard } from '$lib/utils';
	import { allPalettes, radixPalette, tailwindPalette, type Palette } from '$lib/palettes';
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

	// Icon search state
	let searchOpen = $state<boolean>(false);
	let searchQuery = $state<string>('');
	let searchResults = $state<string[]>([]);
	let searchLoading = $state<boolean>(false);
	let searchTotal = $state<number>(0);
	let searchPreviewSize = $state<number>(88);
	let searchFilter = $state<string>('');
	let searchInputRef = $state<HTMLInputElement | null>(null);
	let searchHoveredIcon = $state<string | null>(null);
	let searchCollections = $state<Record<string, { name: string; total: number }>>({});
	let searchDebounceTimer: ReturnType<typeof setTimeout>;

	// Get friendly name for icon set prefix
	function getIconSetName(prefix: string): string {
		// First check collections from search results
		if (searchCollections[prefix]?.name) {
			return searchCollections[prefix].name;
		}
		// Fallback to static list
		const set = iconSets.find(s => s.prefix === prefix);
		return set?.name || prefix;
	}

	// Dynamic filter options based on search results
	const availableFilters = $derived.by(() => {
		const filters: { prefix: string; name: string; count: number }[] = [
			{ prefix: '', name: 'All Sets', count: searchTotal }
		];

		// Sort collections by count (most results first)
		const sorted = Object.entries(searchCollections)
			.sort((a, b) => (b[1].total || 0) - (a[1].total || 0));

		for (const [prefix, info] of sorted) {
			filters.push({
				prefix,
				name: info.name || prefix,
				count: info.total || 0
			});
		}

		return filters;
	});

	// Focus search input when modal opens
	$effect(() => {
		if (searchOpen && searchInputRef) {
			searchInputRef.focus();
		}
	});

	// Popular icon sets for filtering
	const iconSets = [
		{ prefix: '', name: 'All Sets' },
		{ prefix: 'mdi', name: 'Material Design' },
		{ prefix: 'lucide', name: 'Lucide' },
		{ prefix: 'tabler', name: 'Tabler' },
		{ prefix: 'heroicons', name: 'Heroicons' },
		{ prefix: 'ph', name: 'Phosphor' },
		{ prefix: 'ri', name: 'Remix Icon' },
		{ prefix: 'bi', name: 'Bootstrap' },
		{ prefix: 'fa6-solid', name: 'Font Awesome' },
		{ prefix: 'ion', name: 'Ionicons' },
		{ prefix: 'fluent', name: 'Fluent UI' },
		{ prefix: 'carbon', name: 'Carbon' },
		{ prefix: 'octicon', name: 'Octicons' },
		{ prefix: 'simple-icons', name: 'Simple Icons' },
		{ prefix: 'logos', name: 'SVG Logos' },
	];

	// Computed grid columns based on preview size
	const searchGridCols = $derived.by(() => {
		if (searchPreviewSize <= 32) return 'grid-cols-8 sm:grid-cols-10 md:grid-cols-12';
		if (searchPreviewSize <= 48) return 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10';
		if (searchPreviewSize <= 64) return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8';
		if (searchPreviewSize <= 96) return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6';
		return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
	});

	// Iconify API functions
	async function searchIcons(query: string, prefix: string = '') {
		if (!query.trim()) {
			searchResults = [];
			searchTotal = 0;
			searchCollections = {};
			return;
		}
		searchLoading = true;
		try {
			let url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=100`;
			if (prefix) {
				url += `&prefix=${encodeURIComponent(prefix)}`;
			}
			const res = await fetch(url);
			const data = await res.json();
			searchResults = data.icons || [];
			searchTotal = data.total || 0;
			// Store collections for dynamic filtering (only on unfiltered search)
			if (!prefix && data.collections) {
				searchCollections = data.collections;
			}
		} catch {
			searchResults = [];
			searchTotal = 0;
			searchCollections = {};
		}
		searchLoading = false;
	}

	async function fetchIconSvg(iconName: string) {
		const [prefix, name] = iconName.split(':');
		try {
			const res = await fetch(`https://api.iconify.design/${prefix}/${name}.svg`);
			const svg = await res.text();
			return svg;
		} catch {
			return null;
		}
	}

	async function selectIcon(iconName: string) {
		const svg = await fetchIconSvg(iconName);
		if (svg) {
			const parsed = parseSvgContent(svg);
			if (parsed) {
				svgContent = parsed;
				searchOpen = false;
				searchQuery = '';
				searchResults = [];
				showToast(`Loaded: ${iconName}`);
			}
		}
	}

	function handleSearchInput(query: string, prefix: string) {
		clearTimeout(searchDebounceTimer);
		searchDebounceTimer = setTimeout(() => {
			searchIcons(query, prefix);
		}, 300);
	}

	$effect(() => {
		handleSearchInput(searchQuery, searchFilter);
	});

	// Toast state
	let toastMessage = $state<string | null>(null);
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Size presets
	const sizePresets = [16, 24, 32, 48, 64, 96, 128, 256, 512];

	// Color palette state
	let colorPalette = $state<Palette>(radixPalette);

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

	function handleDownloadSvg() {
		if (!processedSvg) return;
		const blob = new Blob([processedSvg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `icon-${iconSize}px.svg`;
		a.click();
		URL.revokeObjectURL(url);
		showToast('SVG downloaded');
		svgMenuOpen = false;
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

	let svgMenuOpen = $state(false);
	let pngMenuOpen = $state(false);
	let colorPickerTab = $state<'solid' | 'gradient'>('solid');

	// Preset gradients
	const presetGradients = [
		// Warm gradients
		{ name: 'Sunset', start: '#f97316', end: '#ec4899', angle: 135 },
		{ name: 'Fire', start: '#ef4444', end: '#f97316', angle: 180 },
		{ name: 'Ember', start: '#dc2626', end: '#7c2d12', angle: 180 },
		{ name: 'Gold', start: '#fbbf24', end: '#f97316', angle: 135 },
		{ name: 'Rose', start: '#fb7185', end: '#f472b6', angle: 135 },
		{ name: 'Peach', start: '#fdba74', end: '#f472b6', angle: 135 },
		// Cool gradients
		{ name: 'Ocean', start: '#06b6d4', end: '#3b82f6', angle: 135 },
		{ name: 'Ice', start: '#67e8f9', end: '#a5b4fc', angle: 180 },
		{ name: 'Sky', start: '#38bdf8', end: '#818cf8', angle: 135 },
		{ name: 'Midnight', start: '#1e3a8a', end: '#7c3aed', angle: 135 },
		{ name: 'Arctic', start: '#e0f2fe', end: '#a5f3fc', angle: 135 },
		{ name: 'Deep Sea', start: '#0369a1', end: '#0f766e', angle: 180 },
		// Purple/Pink gradients
		{ name: 'Purple Haze', start: '#8b5cf6', end: '#ec4899', angle: 135 },
		{ name: 'Lavender', start: '#c4b5fd', end: '#f9a8d4', angle: 135 },
		{ name: 'Grape', start: '#7c3aed', end: '#4f46e5', angle: 180 },
		{ name: 'Berry', start: '#a855f7', end: '#ec4899', angle: 135 },
		{ name: 'Plum', start: '#9333ea', end: '#be185d', angle: 180 },
		{ name: 'Orchid', start: '#d946ef', end: '#8b5cf6', angle: 135 },
		// Green gradients
		{ name: 'Forest', start: '#22c55e', end: '#14b8a6', angle: 135 },
		{ name: 'Lime', start: '#84cc16', end: '#22c55e', angle: 135 },
		{ name: 'Mint', start: '#a7f3d0', end: '#67e8f9', angle: 135 },
		{ name: 'Jungle', start: '#15803d', end: '#0d9488', angle: 180 },
		{ name: 'Spring', start: '#bef264', end: '#4ade80', angle: 135 },
		{ name: 'Seaweed', start: '#10b981', end: '#0891b2', angle: 135 },
		// Monochrome gradients
		{ name: 'Slate', start: '#64748b', end: '#1e293b', angle: 180 },
		{ name: 'Silver', start: '#e5e7eb', end: '#6b7280', angle: 180 },
		{ name: 'Charcoal', start: '#374151', end: '#111827', angle: 180 },
		// Special combinations
		{ name: 'Aurora', start: '#22d3ee', end: '#a855f7', angle: 135 },
		{ name: 'Candy', start: '#f472b6', end: '#fb923c', angle: 135 },
		{ name: 'Neon', start: '#4ade80', end: '#22d3ee', angle: 135 },
	];

	function applyPresetGradient(preset: typeof presetGradients[0]) {
		gradientStart = preset.start;
		gradientEnd = preset.end;
		gradientAngle = preset.angle;
		gradientType = 'linear';
		fillMode = 'gradient';
		showToast(preset.name);
	}

	// Chromatic color groups (excluding grays) in color wheel order
	const chromaticGroups = tailwindPalette.groups.filter(g =>
		!['Slate', 'Gray', 'Zinc', 'Neutral', 'Stone'].includes(g.name)
	);

	function randomizeGradient() {
		// Pick a random strategy
		const strategy = Math.random();

		if (strategy < 0.4) {
			// Same color group, different shades (always looks good)
			const group = chromaticGroups[Math.floor(Math.random() * chromaticGroups.length)];
			const shadeIndices = [2, 3, 4, 5, 6, 7, 8]; // 200-800 range looks best
			const startIdx = shadeIndices[Math.floor(Math.random() * shadeIndices.length)];
			let endIdx = shadeIndices[Math.floor(Math.random() * shadeIndices.length)];
			// Ensure different shades with at least 2 steps apart
			while (Math.abs(endIdx - startIdx) < 2) {
				endIdx = shadeIndices[Math.floor(Math.random() * shadeIndices.length)];
			}
			gradientStart = group.colors[Math.min(startIdx, endIdx)].hex;
			gradientEnd = group.colors[Math.max(startIdx, endIdx)].hex;
			showToast(`${group.name} gradient`);
		} else if (strategy < 0.8) {
			// Adjacent color groups (analogous - always harmonious)
			const groupIdx = Math.floor(Math.random() * chromaticGroups.length);
			const adjacentOffset = Math.random() < 0.5 ? 1 : -1;
			const adjacentIdx = (groupIdx + adjacentOffset + chromaticGroups.length) % chromaticGroups.length;
			const shadeOptions = [4, 5, 6]; // 400-600 look best for cross-color
			const startShade = shadeOptions[Math.floor(Math.random() * shadeOptions.length)];
			const endShade = shadeOptions[Math.floor(Math.random() * shadeOptions.length)];
			gradientStart = chromaticGroups[groupIdx].colors[startShade].hex;
			gradientEnd = chromaticGroups[adjacentIdx].colors[endShade].hex;
			showToast(`${chromaticGroups[groupIdx].name} → ${chromaticGroups[adjacentIdx].name}`);
		} else {
			// Random preset (curated combinations)
			const preset = presetGradients[Math.floor(Math.random() * presetGradients.length)];
			gradientStart = preset.start;
			gradientEnd = preset.end;
			gradientAngle = preset.angle;
			showToast(preset.name);
			fillMode = 'gradient';
			return;
		}

		// Random angle
		const angles = [135, 180, 45, 90, 0];
		gradientAngle = angles[Math.floor(Math.random() * angles.length)];
		gradientType = 'linear';
		fillMode = 'gradient';
	}

	function handleQuickColor(hex: string) {
		solidColor = hex;
		if (fillMode !== 'solid') {
			fillMode = 'solid';
		}
		showToast(`Color: ${hex}`);
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Escape to close search modal
		if (event.key === 'Escape' && searchOpen) {
			searchOpen = false;
			searchQuery = '';
			searchResults = [];
			searchFilter = '';
			searchCollections = {};
			return;
		}

		// Ctrl/Cmd+K to open search
		if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
			event.preventDefault();
			searchOpen = true;
			return;
		}

		// Ctrl+V / Cmd+V to paste SVG
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
			onclick={() => (searchOpen = true)}
			class="inline-flex items-center gap-1.5 px-2.5 py-1.5 h-7 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			Search Icons
		</button>

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
		<div class="relative">
			<div class="flex">
				<button
					onclick={handleCopySvg}
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
					SVG
				</button>
				<button
					onclick={() => (svgMenuOpen = !svgMenuOpen)}
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
			{#if svgMenuOpen}
				<div class="absolute right-0 top-full mt-1 py-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-50 whitespace-nowrap">
					<button
						onclick={handleDownloadSvg}
						class="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
					>
						Download SVG
					</button>
				</div>
			{/if}
		</div>

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
							<!-- Randomize Button -->
							<button
								onclick={randomizeGradient}
								class="w-full h-7 mb-2 rounded text-[10px] font-medium bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors flex items-center justify-center gap-1.5"
							>
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								Randomize
							</button>
							<!-- Gradient Presets -->
							<div class="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
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

<!-- Icon Search Modal -->
{#if searchOpen}
	<div class="fixed inset-0 z-50 flex items-start justify-center pt-16">
		<!-- Backdrop -->
		<button
			class="absolute inset-0 bg-black/70"
			onclick={() => {
				searchOpen = false;
				searchQuery = '';
				searchResults = [];
				searchFilter = '';
				searchCollections = {};
			}}
		></button>

		<!-- Modal -->
		<div class="relative w-full max-w-3xl mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
			<!-- Search Header -->
			<div class="p-4 border-b border-zinc-800">
				<div class="relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search 200,000+ icons from Iconify..."
						class="w-full h-12 pl-11 pr-4 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						bind:this={searchInputRef}
					/>
					{#if searchLoading}
						<div class="absolute right-3 top-1/2 -translate-y-1/2">
							<svg class="w-5 h-5 text-zinc-500 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</div>
					{/if}
				</div>
				<div class="mt-3 flex items-center gap-3">
					<!-- Icon set filter (dynamic based on search results) -->
					{#if Object.keys(searchCollections).length > 0}
						<select
							bind:value={searchFilter}
							class="h-7 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-600"
						>
							{#each availableFilters as filter}
								<option value={filter.prefix}>
									{filter.name} ({filter.count})
								</option>
							{/each}
						</select>
					{:else}
						<select
							bind:value={searchFilter}
							class="h-7 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-600"
						>
							{#each iconSets as set}
								<option value={set.prefix}>{set.name}</option>
							{/each}
						</select>
					{/if}

					{#if searchResults.length > 0}
						<p class="text-xs text-zinc-500">
							{searchResults.length} of {searchTotal.toLocaleString()}
						</p>
					{/if}

					<div class="flex-1"></div>

					<!-- Preview size slider -->
					<div class="flex items-center gap-2">
						<svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
						</svg>
						<input
							type="range"
							bind:value={searchPreviewSize}
							min="24"
							max="128"
							step="8"
							class="w-24 h-1.5 rounded-full bg-zinc-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-400"
						/>
						<span class="text-[10px] text-zinc-500 w-8">{searchPreviewSize}px</span>
					</div>
				</div>
			</div>

			<!-- Results -->
			<div class="max-h-[60vh] overflow-y-auto p-4">
				{#if searchResults.length > 0}
					<div class="grid {searchGridCols} gap-2">
						{#each searchResults as icon}
							{@const [prefix, name] = icon.split(':')}
							<button
								onclick={() => selectIcon(icon)}
								onmouseenter={() => (searchHoveredIcon = icon)}
								onmouseleave={() => (searchHoveredIcon = null)}
								class="group aspect-square flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all"
							>
								<img
									src="https://api.iconify.design/{prefix}/{name}.svg"
									alt={icon}
									class="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
									style="filter: invert(1); width: {searchPreviewSize * 0.5}px; height: {searchPreviewSize * 0.5}px;"
								/>
							</button>
						{/each}
					</div>
				{:else if searchQuery && !searchLoading}
					<div class="text-center py-12 text-zinc-500">
						<svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p class="text-sm">No icons found for "{searchQuery}"</p>
					</div>
				{:else}
					<div class="text-center py-12 text-zinc-500">
						<svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<p class="text-sm">Search for icons by name</p>
						<p class="text-xs mt-1 text-zinc-600">Try "arrow", "home", "user", "settings"...</p>
					</div>
				{/if}
			</div>

			<!-- Footer hint / hover details -->
			<div class="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 h-9 flex items-center justify-center">
				{#if searchHoveredIcon}
					{@const [prefix, name] = searchHoveredIcon.split(':')}
					<div class="flex items-center gap-2 text-xs">
						<span class="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 font-medium">{getIconSetName(prefix)}</span>
						<span class="text-zinc-400">{name}</span>
					</div>
				{:else}
					<p class="text-[10px] text-zinc-600">
						Powered by <a href="https://iconify.design" target="_blank" class="text-zinc-500 hover:text-zinc-400">Iconify</a> — Click an icon to insert
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

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
