<script lang="ts">
	import { getContrastColor, copyToClipboard } from '$lib/utils';

	// Helper to check if color is dark (needed early for palette generation)
	function isColorDark(hex: string): boolean {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance < 0.5;
	}

	// Base colors to choose from (the starting point for theme generation)
	const baseColors = [
		{ hex: '#ef4444', name: 'Red' },
		{ hex: '#f97316', name: 'Orange' },
		{ hex: '#f59e0b', name: 'Amber' },
		{ hex: '#eab308', name: 'Yellow' },
		{ hex: '#84cc16', name: 'Lime' },
		{ hex: '#22c55e', name: 'Green' },
		{ hex: '#10b981', name: 'Emerald' },
		{ hex: '#14b8a6', name: 'Teal' },
		{ hex: '#06b6d4', name: 'Cyan' },
		{ hex: '#0ea5e9', name: 'Sky' },
		{ hex: '#3b82f6', name: 'Blue' },
		{ hex: '#6366f1', name: 'Indigo' },
		{ hex: '#8b5cf6', name: 'Violet' },
		{ hex: '#a855f7', name: 'Purple' },
		{ hex: '#d946ef', name: 'Fuchsia' },
		{ hex: '#ec4899', name: 'Pink' },
		{ hex: '#f43f5e', name: 'Rose' },
		{ hex: '#64748b', name: 'Slate' },
	];

	// Generate a full theme from a single base color
	function generateThemeFromBase(baseHex: string) {
		// Convert hex to HSL for manipulation
		const hsl = hexToHsl(baseHex);

		// Create a dark background with a subtle tint of the base color
		const bgHsl = { h: hsl.h, s: Math.min(hsl.s * 0.3, 15), l: 5 };
		const surfaceHsl = { h: hsl.h, s: Math.min(hsl.s * 0.25, 12), l: 10 };
		const borderHsl = { h: hsl.h, s: Math.min(hsl.s * 0.2, 10), l: 20 };

		// Generate complementary and analogous colors
		const secondaryHue = (hsl.h + 60) % 360;  // Analogous
		const tertiaryHue = (hsl.h + 180) % 360;  // Complementary

		// Generate solid color set - spread across the color wheel with base as anchor
		const solidHues = [
			hsl.h,
			(hsl.h + 40) % 360,
			(hsl.h + 120) % 360,
			(hsl.h + 180) % 360,
			(hsl.h + 240) % 360,
			(hsl.h + 300) % 360,
		];

		const solids = solidHues.map(h => hslToHex({ h, s: Math.max(hsl.s, 70), l: 55 }));

		// Accent text based on brightness
		const accentText = hsl.l < 55 ? '#ffffff' : '#000000';

		theme = {
			background: hslToHex(bgHsl),
			text: '#fafafa',
			muted: lightenColor(baseHex, 0.4),
			accent: baseHex,
			accentText: accentText,
			border: hslToHex(borderHsl),
			surface: hslToHex(surfaceHsl),
			accentMuted: baseHex,
			accentBorder: baseHex,
			accentGlow: baseHex,
			secondary: hslToHex({ h: secondaryHue, s: hsl.s, l: hsl.l }),
			tertiary: hslToHex({ h: tertiaryHue, s: Math.max(hsl.s - 10, 50), l: Math.min(hsl.l + 5, 60) }),
			solids: solids,
		};
	}

	// HSL conversion helpers
	function hexToHsl(hex: string): { h: number; s: number; l: number } {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;

		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h = 0, s = 0;
		const l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
				case g: h = ((b - r) / d + 2) / 6; break;
				case b: h = ((r - g) / d + 4) / 6; break;
			}
		}

		return { h: h * 360, s: s * 100, l: l * 100 };
	}

	function hslToHex(hsl: { h: number; s: number; l: number }): string {
		const h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			const hue2rgb = (p: number, q: number, t: number) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}

	// Preset palettes with solid color sets
	const presetPalettes = [
		{
			name: 'Midnight Blue',
			background: '#0f0f0f', text: '#fafafa', muted: '#a1a1aa',
			accent: '#3b82f6', accentText: '#ffffff', border: '#3f3f46',
			surface: '#1a1a1a', secondary: '#8b5cf6', tertiary: '#10b981',
			solids: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
		},
		{
			name: 'Deep Purple',
			background: '#0c0a1a', text: '#f5f3ff', muted: '#a78bfa',
			accent: '#8b5cf6', accentText: '#ffffff', border: '#3b3363',
			surface: '#1a1730', secondary: '#ec4899', tertiary: '#06b6d4',
			solids: ['#8b5cf6', '#ec4899', '#06b6d4', '#a855f7', '#6366f1', '#14b8a6']
		},
		{
			name: 'Forest',
			background: '#0a0f0d', text: '#ecfdf5', muted: '#6ee7b7',
			accent: '#10b981', accentText: '#ffffff', border: '#2d4a3e',
			surface: '#132720', secondary: '#14b8a6', tertiary: '#f59e0b',
			solids: ['#10b981', '#14b8a6', '#22c55e', '#84cc16', '#06b6d4', '#f59e0b']
		},
		{
			name: 'Crimson',
			background: '#0f0a0a', text: '#fef2f2', muted: '#fca5a5',
			accent: '#ef4444', accentText: '#ffffff', border: '#4a2d2d',
			surface: '#1a1212', secondary: '#f97316', tertiary: '#eab308',
			solids: ['#ef4444', '#f97316', '#eab308', '#f43f5e', '#ec4899', '#fb923c']
		},
		{
			name: 'Ocean',
			background: '#0a0f14', text: '#ecfeff', muted: '#67e8f9',
			accent: '#06b6d4', accentText: '#ffffff', border: '#2d4a52',
			surface: '#0f1a20', secondary: '#3b82f6', tertiary: '#10b981',
			solids: ['#06b6d4', '#3b82f6', '#0ea5e9', '#14b8a6', '#6366f1', '#10b981']
		},
		{
			name: 'Amber Glow',
			background: '#0f0d0a', text: '#fffbeb', muted: '#fcd34d',
			accent: '#f59e0b', accentText: '#000000', border: '#4a4226',
			surface: '#1a1710', secondary: '#ef4444', tertiary: '#84cc16',
			solids: ['#f59e0b', '#eab308', '#ef4444', '#f97316', '#84cc16', '#fb923c']
		},
		{
			name: 'Rose',
			background: '#0f0a0c', text: '#fdf2f8', muted: '#f9a8d4',
			accent: '#ec4899', accentText: '#ffffff', border: '#4a2d3d',
			surface: '#1a1015', secondary: '#8b5cf6', tertiary: '#14b8a6',
			solids: ['#ec4899', '#f43f5e', '#d946ef', '#8b5cf6', '#a855f7', '#14b8a6']
		},
		{
			name: 'Slate',
			background: '#0f1115', text: '#f1f5f9', muted: '#94a3b8',
			accent: '#64748b', accentText: '#ffffff', border: '#334155',
			surface: '#1e293b', secondary: '#6366f1', tertiary: '#22c55e',
			solids: ['#64748b', '#6366f1', '#22c55e', '#0ea5e9', '#8b5cf6', '#f59e0b']
		},
	];

	// Accent color options for randomization (vibrant, saturated colors)
	const accentColors = [
		{ hex: '#ef4444', name: 'red' },
		{ hex: '#f97316', name: 'orange' },
		{ hex: '#f59e0b', name: 'amber' },
		{ hex: '#eab308', name: 'yellow' },
		{ hex: '#84cc16', name: 'lime' },
		{ hex: '#22c55e', name: 'green' },
		{ hex: '#10b981', name: 'emerald' },
		{ hex: '#14b8a6', name: 'teal' },
		{ hex: '#06b6d4', name: 'cyan' },
		{ hex: '#0ea5e9', name: 'sky' },
		{ hex: '#3b82f6', name: 'blue' },
		{ hex: '#6366f1', name: 'indigo' },
		{ hex: '#8b5cf6', name: 'violet' },
		{ hex: '#a855f7', name: 'purple' },
		{ hex: '#d946ef', name: 'fuchsia' },
		{ hex: '#ec4899', name: 'pink' },
		{ hex: '#f43f5e', name: 'rose' },
	];

	// Dark background tints (800-950 range)
	const darkBackgrounds = [
		{ bg: '#0a0a0a', surface: '#171717', border: '#262626' }, // neutral 950/900/800
		{ bg: '#0c0a09', surface: '#1c1917', border: '#292524' }, // stone
		{ bg: '#0f0f0f', surface: '#1a1a1a', border: '#3f3f46' }, // zinc
		{ bg: '#0a0a0b', surface: '#18181b', border: '#27272a' }, // zinc alt
		{ bg: '#0c0a1a', surface: '#1a1730', border: '#3b3363' }, // purple tint
		{ bg: '#0a0f0d', surface: '#132720', border: '#2d4a3e' }, // green tint
		{ bg: '#0a0f14', surface: '#0f1a20', border: '#2d4a52' }, // blue tint
		{ bg: '#0f0a0a', surface: '#1a1212', border: '#4a2d2d' }, // red tint
	];

	function randomizePalette() {
		// Pick random dark background
		const bgSet = darkBackgrounds[Math.floor(Math.random() * darkBackgrounds.length)];

		// Pick 3 different accent colors
		const shuffled = [...accentColors].sort(() => Math.random() - 0.5);
		const primary = shuffled[0];
		const secondary = shuffled[1];
		const tertiary = shuffled[2];

		// Generate muted color from primary accent (lighter, desaturated)
		const mutedHex = lightenColor(primary.hex, 0.3);

		// Determine accent text color based on accent brightness
		const accentText = isColorDark(primary.hex) ? '#ffffff' : '#000000';

		// Light text colors (slightly tinted toward primary accent)
		const textHex = '#fafafa';

		// Generate harmonious solids from the shuffled colors
		const solids = shuffled.slice(0, 6).map(c => c.hex);

		theme = {
			background: bgSet.bg,
			text: textHex,
			muted: mutedHex,
			accent: primary.hex,
			accentText: accentText,
			border: bgSet.border,
			surface: bgSet.surface,
			accentMuted: primary.hex,
			accentBorder: primary.hex,
			accentGlow: primary.hex,
			secondary: secondary.hex,
			tertiary: tertiary.hex,
			solids: solids,
		};
	}

	function applyPalette(palette: typeof presetPalettes[0]) {
		theme = {
			...palette,
			accentMuted: palette.accent,
			accentBorder: palette.accent,
			accentGlow: palette.accent,
			solids: palette.solids,
		};
	}

	function lightenColor(hex: string, amount: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const newR = Math.min(255, Math.round(r + (255 - r) * amount));
		const newG = Math.min(255, Math.round(g + (255 - g) * amount));
		const newB = Math.min(255, Math.round(b + (255 - b) * amount));
		return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
	}

	// Theme colors - expanded palette
	let theme = $state({
		background: '#0f0f0f',
		text: '#fafafa',
		muted: '#a1a1aa',
		accent: '#3b82f6',
		accentText: '#ffffff',
		border: '#3f3f46',
		surface: '#1a1a1a',
		// Derived/tinted colors for neon effects
		accentMuted: '#3b82f6',
		accentBorder: '#3b82f6',
		accentGlow: '#3b82f6',
		// Secondary accent
		secondary: '#8b5cf6',
		tertiary: '#10b981',
		// Harmonious solid colors for multi-color displays
		solids: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'] as string[],
	});

	// Slide state
	let selectedSlideIndex = $state(0);
	let copiedColor = $state<string | null>(null);
	let copiedLabel = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Slide definitions - multiple variations per concept
	const slides = [
		// Title Slides (5 variations)
		{ id: 'title-1', name: 'Title #1 - Centered' },
		{ id: 'title-2', name: 'Title #2 - Left Aligned' },
		{ id: 'title-3', name: 'Title #3 - Gradient' },
		{ id: 'title-4', name: 'Title #4 - Split' },
		{ id: 'title-5', name: 'Title #5 - Minimal' },
		// Section Slides (5 variations)
		{ id: 'section-1', name: 'Section #1 - Numbered' },
		{ id: 'section-2', name: 'Section #2 - Line' },
		{ id: 'section-3', name: 'Section #3 - Gradient' },
		{ id: 'section-4', name: 'Section #4 - Icon' },
		{ id: 'section-5', name: 'Section #5 - Bold' },
		// Content Slides (5 variations)
		{ id: 'content-1', name: 'Content #1 - Bullets' },
		{ id: 'content-2', name: 'Content #2 - Two Column' },
		{ id: 'content-3', name: 'Content #3 - Sidebar' },
		{ id: 'content-4', name: 'Content #4 - Numbered' },
		{ id: 'content-5', name: 'Content #5 - Cards' },
		// Feature Cards (5 variations)
		{ id: 'features-1', name: 'Features #1 - Icon Grid' },
		{ id: 'features-2', name: 'Features #2 - Horizontal' },
		{ id: 'features-3', name: 'Features #3 - Neon' },
		{ id: 'features-4', name: 'Features #4 - Gradient' },
		{ id: 'features-5', name: 'Features #5 - Minimal' },
		// Image + Text (5 variations)
		{ id: 'image-1', name: 'Image #1 - Left' },
		{ id: 'image-2', name: 'Image #2 - Right' },
		{ id: 'image-3', name: 'Image #3 - Top' },
		{ id: 'image-4', name: 'Image #4 - Overlay' },
		{ id: 'image-5', name: 'Image #5 - Gallery' },
		// Stats/Metrics (5 variations)
		{ id: 'stats-1', name: 'Stats #1 - Grid' },
		{ id: 'stats-2', name: 'Stats #2 - Row' },
		{ id: 'stats-3', name: 'Stats #3 - Icons' },
		{ id: 'stats-4', name: 'Stats #4 - Progress' },
		{ id: 'stats-5', name: 'Stats #5 - Comparison' },
		// Testimonials (5 variations)
		{ id: 'quote-1', name: 'Quote #1 - Large' },
		{ id: 'quote-2', name: 'Quote #2 - Cards' },
		{ id: 'quote-3', name: 'Quote #3 - Profile' },
		{ id: 'quote-4', name: 'Quote #4 - Rating' },
		{ id: 'quote-5', name: 'Quote #5 - Minimal' },
		// Process/Flow (3 variations)
		{ id: 'flow-1', name: 'Flow #1 - Horizontal' },
		{ id: 'flow-2', name: 'Flow #2 - Vertical' },
		{ id: 'flow-3', name: 'Flow #3 - Connected' },
		// Lists (3 variations)
		{ id: 'list-1', name: 'List #1 - Checks' },
		{ id: 'list-2', name: 'List #2 - Icons' },
		{ id: 'list-3', name: 'List #3 - Numbered' },
		// Tables (3 variations)
		{ id: 'table-1', name: 'Table #1 - Comparison' },
		{ id: 'table-2', name: 'Table #2 - Pricing' },
		{ id: 'table-3', name: 'Table #3 - Data' },
		// UI Components
		{ id: 'color-boxes', name: 'Color Boxes' },
		{ id: 'color-icons', name: 'Color Icons' },
		{ id: 'pills-badges', name: 'Pills & Badges' },
		{ id: 'callouts', name: 'Callouts' },
		{ id: 'dividers', name: 'Dividers' },
	];

	// Slide categories for grouped sidebar
	const slideCategories = [
		{ name: 'Titles', range: [0, 5] },
		{ name: 'Sections', range: [5, 10] },
		{ name: 'Content', range: [10, 15] },
		{ name: 'Features', range: [15, 20] },
		{ name: 'Images', range: [20, 25] },
		{ name: 'Stats', range: [25, 30] },
		{ name: 'Quotes', range: [30, 35] },
		{ name: 'Flow', range: [35, 38] },
		{ name: 'Lists', range: [38, 41] },
		{ name: 'Tables', range: [41, 44] },
		{ name: 'UI', range: [44, 49] },
	];

	let expandedCategories = $state<Set<string>>(new Set(['Titles']));

	async function handleColorClick(hex: string, label: string) {
		const success = await copyToClipboard(hex);
		if (success) {
			copiedColor = hex;
			copiedLabel = label;
			clearTimeout(toastTimeout);
			toastTimeout = setTimeout(() => {
				copiedColor = null;
			}, 1500);
		}
	}

	let isDarkTheme = $derived(isColorDark(theme.background));

	// Helper to create rgba from hex
	function hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
</script>

<svelte:head>
	<title>Colors - Theme Builder</title>
</svelte:head>

<!-- Toolbar -->
<header class="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 shrink-0">
	<div class="flex items-center gap-2">
		<span class="text-xs font-medium text-zinc-300">Theme Builder</span>
		<span class="text-[10px] text-zinc-500">Click any element to copy its color</span>
	</div>
	<div class="flex-1"></div>
</header>

<!-- Content Area -->
<div class="flex-1 flex min-h-0">
	<!-- Slides Sidebar -->
	<aside class="w-48 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
		<div class="h-10 px-3 flex items-center border-b border-zinc-800">
			<span class="text-xs font-medium text-zinc-400">Slides</span>
			<span class="ml-auto text-[10px] text-zinc-600">{slides.length}</span>
		</div>
		<div class="flex-1 overflow-y-auto py-1 sidebar-scroll">
			{#each slideCategories as category}
				{@const categorySlides = slides.slice(category.range[0], category.range[1])}
				{@const isExpanded = expandedCategories.has(category.name)}
				{@const hasSelectedSlide = selectedSlideIndex >= category.range[0] && selectedSlideIndex < category.range[1]}
				<div class="mb-0.5">
					<!-- Category Header -->
					<button
						onclick={() => {
							const newSet = new Set(expandedCategories);
							if (isExpanded) {
								newSet.delete(category.name);
							} else {
								newSet.add(category.name);
							}
							expandedCategories = newSet;
						}}
						class="w-full flex items-center gap-1.5 px-2 py-1.5 text-left transition-colors hover:bg-zinc-800/50 {hasSelectedSlide ? 'text-zinc-200' : 'text-zinc-500'}"
					>
						<svg class="w-3 h-3 shrink-0 transition-transform {isExpanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
						<span class="text-[11px] font-medium">{category.name}</span>
						<span class="ml-auto text-[10px] text-zinc-600">{categorySlides.length}</span>
					</button>
					<!-- Category Items -->
					{#if isExpanded}
						<div class="ml-2">
							{#each categorySlides as slide, i}
								{@const globalIndex = category.range[0] + i}
								<button
									onclick={() => (selectedSlideIndex = globalIndex)}
									class="w-full flex items-center gap-2 pl-3 pr-2 py-1 text-left transition-colors {selectedSlideIndex === globalIndex ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'}"
								>
									<svg class="w-3.5 h-3.5 shrink-0 {selectedSlideIndex === globalIndex ? 'text-blue-400' : 'text-zinc-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
									</svg>
									<span class="text-[11px] truncate">{slide.name.split(' - ')[1] || slide.name}</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</aside>

	<!-- Main Slide Canvas -->
	<main class="flex-1 bg-zinc-800 flex items-center justify-center p-8 overflow-auto">
		<!-- Slide Container -->
		<div
			class="w-full max-w-4xl aspect-[16/10] rounded-lg shadow-2xl overflow-hidden"
			style="background-color: {theme.background}"
		>
			{#if slides[selectedSlideIndex].id === 'title-1'}
				<!-- Title #1 - Centered Classic -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-5xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-3 py-2 transition-all cursor-pointer text-center" style="color: {theme.text}; --tw-ring-offset-color: {theme.background}">
						Presentation Title
					</button>
					<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-xl hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.muted}">
						A compelling subtitle that captures attention
					</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'title-2'}
				<!-- Title #2 - Left Aligned with Accent -->
				<div class="w-full h-full flex flex-col justify-center p-12">
					<div class="w-24 h-1 rounded mb-8" style="background-color: {theme.accent}"></div>
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-5xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-3 py-2 transition-all cursor-pointer self-start" style="color: {theme.text}; --tw-ring-offset-color: {theme.background}">
						Bold Statement
					</button>
					<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-xl hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start max-w-xl" style="color: {theme.muted}">
						Supporting text that provides context and draws the audience in
					</button>
					<div class="flex gap-4 mt-8">
						<button onclick={() => handleColorClick(theme.accent, 'CTA Button')} class="px-6 py-3 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">Get Started</button>
						<button onclick={() => handleColorClick(theme.border, 'Secondary Button')} class="px-6 py-3 rounded-lg text-sm font-semibold border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.border}; color: {theme.text}">Learn More</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'title-3'}
				<!-- Title #3 - Gradient Text -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12 relative overflow-hidden">
					<div class="absolute inset-0 opacity-20" style="background: radial-gradient(circle at 30% 50%, {theme.accent} 0%, transparent 50%), radial-gradient(circle at 70% 50%, {theme.secondary} 0%, transparent 50%)"></div>
					<button onclick={() => handleColorClick(theme.accent, 'Gradient Title')} class="relative text-6xl font-black mb-6 hover:ring-2 hover:ring-blue-500 rounded px-3 py-2 transition-all cursor-pointer bg-clip-text text-transparent" style="background-image: linear-gradient(135deg, {theme.accent}, {theme.secondary}, {theme.tertiary})">
						Creative Vision
					</button>
					<button onclick={() => handleColorClick(theme.text, 'Subtitle')} class="relative text-2xl hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.text}">
						Where innovation meets design
					</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'title-4'}
				<!-- Title #4 - Split Layout -->
				<div class="w-full h-full flex">
					<div class="w-1/2 flex flex-col justify-center p-12" style="background-color: {theme.surface}">
						<button onclick={() => handleColorClick(theme.accent, 'Label')} class="text-sm font-semibold uppercase tracking-widest mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.accent}">Welcome</button>
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-4xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Company<br/>Overview</button>
						<button onclick={() => handleColorClick(theme.muted, 'Description')} class="text-base hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.muted}">Annual Report 2024</button>
					</div>
					<button onclick={() => handleColorClick(theme.accent, 'Accent Panel')} class="w-1/2 hover:ring-2 hover:ring-white/30 hover:ring-inset transition-all cursor-pointer flex items-center justify-center" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
						<svg class="w-32 h-32 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
					</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'title-5'}
				<!-- Title #5 - Minimal -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12">
					<button onclick={() => handleColorClick(theme.muted, 'Small Label')} class="text-xs uppercase tracking-[0.3em] mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.muted}">Introducing</button>
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-7xl font-extralight tracking-tight mb-4 hover:ring-2 hover:ring-blue-500 rounded px-3 py-2 transition-all cursor-pointer" style="color: {theme.text}">Simplicity</button>
					<div class="w-16 h-px mt-8" style="background-color: {theme.border}"></div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'section-1'}
				<!-- Section #1 - Numbered -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12 relative">
					<div class="absolute top-8 left-12">
						<button onclick={() => handleColorClick(theme.muted, 'Section number')} class="text-8xl font-black hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer" style="color: {hexToRgba(theme.muted, 0.15)}">02</button>
					</div>
					<button onclick={() => handleColorClick(theme.accent, 'Label')} class="text-sm font-semibold uppercase tracking-widest mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.accent}">Part Two</button>
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-4xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-3 py-1 transition-all cursor-pointer text-center" style="color: {theme.text}">Getting Started</button>
					<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-lg hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer text-center" style="color: {theme.muted}">Setting up your environment</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'section-2'}
				<!-- Section #2 - Line Accent -->
				<div class="w-full h-full flex items-center p-12">
					<div class="w-1 h-32 rounded mr-8" style="background: linear-gradient(to bottom, {theme.accent}, {theme.secondary})"></div>
					<div>
						<button onclick={() => handleColorClick(theme.muted, 'Label')} class="text-xs uppercase tracking-widest mb-2 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer block" style="color: {theme.muted}">Chapter 02</button>
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-5xl font-bold mb-2 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer block" style="color: {theme.text}">The Process</button>
						<button onclick={() => handleColorClick(theme.muted, 'Description')} class="text-lg hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer block" style="color: {theme.muted}">How we approach every project</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'section-3'}
				<!-- Section #3 - Gradient Background -->
				<button onclick={() => handleColorClick(theme.accent, 'Gradient BG')} class="w-full h-full flex flex-col items-center justify-center p-12 hover:ring-2 hover:ring-white/30 hover:ring-inset transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
					<span class="text-white/60 text-sm uppercase tracking-widest mb-4">Section Three</span>
					<span class="text-white text-5xl font-bold mb-4 text-center">Key Insights</span>
					<span class="text-white/80 text-xl text-center">Data-driven decisions</span>
				</button>

			{:else if slides[selectedSlideIndex].id === 'section-4'}
				<!-- Section #4 - With Icon -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12">
					<button onclick={() => handleColorClick(theme.accent, 'Icon')} class="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.accent, 0.15)}">
						<svg class="w-10 h-10" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
					</button>
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-4xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-3 py-1 transition-all cursor-pointer text-center" style="color: {theme.text}">Innovation</button>
					<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-lg hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer text-center max-w-md" style="color: {theme.muted}">Exploring new ideas and pushing boundaries</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'section-5'}
				<!-- Section #5 - Bold Minimal -->
				<div class="w-full h-full flex flex-col justify-end p-12">
					<button onclick={() => handleColorClick(theme.text, 'Big Title')} class="text-7xl font-black mb-4 hover:ring-2 hover:ring-blue-500 rounded px-3 py-1 transition-all cursor-pointer self-start leading-none" style="color: {theme.text}">Results.</button>
					<div class="flex items-center gap-4 mt-4">
						<div class="w-12 h-1 rounded" style="background-color: {theme.accent}"></div>
						<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-sm uppercase tracking-widest hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.muted}">What we achieved</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'content-1'}
				<!-- Content #1 - Bullets -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-3xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Key Takeaways</button>
					<div class="space-y-4 flex-1">
						<button onclick={() => handleColorClick(theme.muted, 'Bullet')} class="flex items-start gap-3 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left w-full" style="color: {theme.muted}">
							<span class="w-2 h-2 rounded-full mt-2 shrink-0" style="background-color: {theme.accent}"></span>
							<span class="text-lg">First key point with important information</span>
						</button>
						<button onclick={() => handleColorClick(theme.muted, 'Bullet')} class="flex items-start gap-3 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left w-full" style="color: {theme.muted}">
							<span class="w-2 h-2 rounded-full mt-2 shrink-0" style="background-color: {theme.secondary}"></span>
							<span class="text-lg">Second point explaining core concepts</span>
						</button>
						<button onclick={() => handleColorClick(theme.muted, 'Bullet')} class="flex items-start gap-3 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left w-full" style="color: {theme.muted}">
							<span class="w-2 h-2 rounded-full mt-2 shrink-0" style="background-color: {theme.tertiary}"></span>
							<span class="text-lg">Third point with supporting details</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'content-2'}
				<!-- Content #2 - Two Column -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-3xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Two Perspectives</button>
					<div class="flex-1 grid grid-cols-2 gap-8">
						<div class="space-y-3">
							<button onclick={() => handleColorClick(theme.accent, 'Column Title')} class="text-lg font-semibold hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer block" style="color: {theme.accent}">Before</button>
							<button onclick={() => handleColorClick(theme.muted, 'Content')} class="text-base hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer block text-left" style="color: {theme.muted}">Traditional approaches were slow and manual. Teams worked in silos with limited collaboration.</button>
						</div>
						<div class="space-y-3">
							<button onclick={() => handleColorClick(theme.tertiary, 'Column Title')} class="text-lg font-semibold hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer block" style="color: {theme.tertiary}">After</button>
							<button onclick={() => handleColorClick(theme.muted, 'Content')} class="text-base hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer block text-left" style="color: {theme.muted}">Modern solutions enable speed and automation. Teams collaborate seamlessly across boundaries.</button>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'content-3'}
				<!-- Content #3 - Sidebar Highlight -->
				<div class="w-full h-full flex">
					<button onclick={() => handleColorClick(theme.accent, 'Sidebar')} class="w-1/3 h-full flex flex-col justify-center p-8 hover:ring-2 hover:ring-white/30 hover:ring-inset transition-all cursor-pointer" style="background-color: {hexToRgba(theme.accent, 0.1)}">
						<span class="text-6xl font-bold mb-2" style="color: {theme.accent}">01</span>
						<span class="text-lg font-semibold" style="color: {theme.text}">First Step</span>
						<span class="text-sm mt-2" style="color: {theme.muted}">Getting started</span>
					</button>
					<div class="w-2/3 p-10 flex flex-col justify-center">
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Foundation Setup</button>
						<button onclick={() => handleColorClick(theme.muted, 'Body')} class="text-base hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left" style="color: {theme.muted}">Begin by establishing the core framework. This ensures a solid foundation for everything that follows. Take time to understand the fundamental concepts before moving forward.</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'content-4'}
				<!-- Content #4 - Numbered List -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">The Process</button>
					<div class="flex-1 space-y-4">
						<button onclick={() => handleColorClick(theme.accent, 'Step')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded p-3 transition-all cursor-pointer w-full text-left" style="background-color: {hexToRgba(theme.accent, 0.05)}">
							<span class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style="background-color: {theme.accent}; color: {theme.accentText}">1</span>
							<div><span class="font-semibold" style="color: {theme.text}">Research</span><span class="ml-2" style="color: {theme.muted}">— Gather insights and data</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Step')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded p-3 transition-all cursor-pointer w-full text-left" style="background-color: {hexToRgba(theme.secondary, 0.05)}">
							<span class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style="background-color: {theme.secondary}; color: white">2</span>
							<div><span class="font-semibold" style="color: {theme.text}">Design</span><span class="ml-2" style="color: {theme.muted}">— Create the solution</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Step')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded p-3 transition-all cursor-pointer w-full text-left" style="background-color: {hexToRgba(theme.tertiary, 0.05)}">
							<span class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style="background-color: {theme.tertiary}; color: white">3</span>
							<div><span class="font-semibold" style="color: {theme.text}">Execute</span><span class="ml-2" style="color: {theme.muted}">— Bring it to life</span></div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'content-5'}
				<!-- Content #5 - Card Grid -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-3xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Core Principles</button>
					<div class="flex-1 grid grid-cols-3 gap-4">
						<button onclick={() => handleColorClick(theme.surface, 'Card')} class="rounded-xl p-5 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<span class="text-2xl mb-3 block">🎯</span>
							<span class="font-semibold block mb-2" style="color: {theme.text}">Focus</span>
							<span class="text-sm" style="color: {theme.muted}">Stay aligned with core objectives</span>
						</button>
						<button onclick={() => handleColorClick(theme.surface, 'Card')} class="rounded-xl p-5 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<span class="text-2xl mb-3 block">⚡</span>
							<span class="font-semibold block mb-2" style="color: {theme.text}">Speed</span>
							<span class="text-sm" style="color: {theme.muted}">Move fast, iterate quickly</span>
						</button>
						<button onclick={() => handleColorClick(theme.surface, 'Card')} class="rounded-xl p-5 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<span class="text-2xl mb-3 block">✨</span>
							<span class="font-semibold block mb-2" style="color: {theme.text}">Quality</span>
							<span class="text-sm" style="color: {theme.muted}">Never compromise on excellence</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'image-1'}
				<!-- Image #1 - Left -->
				<div class="w-full h-full flex">
					<button onclick={() => handleColorClick(theme.surface, 'Image')} class="w-1/2 h-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 hover:ring-inset transition-all cursor-pointer" style="background-color: {theme.surface}">
						<div class="w-24 h-24 rounded-2xl flex items-center justify-center" style="background-color: {hexToRgba(theme.accent, 0.15)}">
							<svg class="w-12 h-12" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
						</div>
					</button>
					<div class="w-1/2 h-full flex flex-col justify-center p-10">
						<button onclick={() => handleColorClick(theme.accent, 'Label')} class="text-sm font-semibold uppercase tracking-wider mb-3 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.accent}">Featured</button>
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Powerful Features</button>
						<button onclick={() => handleColorClick(theme.muted, 'Description')} class="text-base mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer text-left" style="color: {theme.muted}">Build stunning presentations with our intuitive tools.</button>
						<div class="flex gap-3">
							<button onclick={() => handleColorClick(theme.accent, 'CTA')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">Get Started</button>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'image-2'}
				<!-- Image #2 - Right -->
				<div class="w-full h-full flex">
					<div class="w-1/2 h-full flex flex-col justify-center p-10">
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Design System</button>
						<button onclick={() => handleColorClick(theme.muted, 'Description')} class="text-base mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer text-left" style="color: {theme.muted}">Consistent, scalable, and beautiful components for your next project.</button>
						<button onclick={() => handleColorClick(theme.accent, 'Link')} class="text-sm font-semibold hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start flex items-center gap-2" style="color: {theme.accent}">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
					</div>
					<button onclick={() => handleColorClick(theme.secondary, 'Image')} class="w-1/2 h-full flex items-center justify-center hover:ring-2 hover:ring-white/30 hover:ring-inset transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
						<svg class="w-24 h-24 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
					</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'image-3'}
				<!-- Image #3 - Top -->
				<div class="w-full h-full flex flex-col">
					<button onclick={() => handleColorClick(theme.surface, 'Image')} class="h-1/2 w-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 hover:ring-inset transition-all cursor-pointer" style="background-color: {theme.surface}">
						<svg class="w-16 h-16" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
					</button>
					<div class="h-1/2 p-8 flex flex-col justify-center">
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-3 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Visual Storytelling</button>
						<button onclick={() => handleColorClick(theme.muted, 'Description')} class="text-base hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer text-left max-w-2xl" style="color: {theme.muted}">Let your images speak. Combine powerful visuals with concise messaging to create memorable presentations.</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'image-4'}
				<!-- Image #4 - Overlay -->
				<button onclick={() => handleColorClick(theme.accent, 'Full Image')} class="w-full h-full relative hover:ring-2 hover:ring-white/30 hover:ring-inset transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
					<div class="absolute inset-0 bg-black/40"></div>
					<div class="relative z-10 w-full h-full flex flex-col justify-end p-12">
						<span class="text-sm uppercase tracking-widest mb-3 text-white/70">Case Study</span>
						<span class="text-4xl font-bold mb-4 text-white">Transforming Healthcare</span>
						<span class="text-lg text-white/80 max-w-xl">How we helped modernize patient care with innovative digital solutions.</span>
					</div>
				</button>

			{:else if slides[selectedSlideIndex].id === 'image-5'}
				<!-- Image #5 - Gallery -->
				<div class="w-full h-full flex flex-col p-8">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Gallery View</button>
					<div class="flex-1 grid grid-cols-3 gap-4">
						<button onclick={() => handleColorClick(theme.accent, 'Image 1')} class="rounded-xl hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex items-center justify-center" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})"><svg class="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
						<button onclick={() => handleColorClick(theme.secondary, 'Image 2')} class="rounded-xl hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex items-center justify-center" style="background: linear-gradient(135deg, {theme.secondary}, {theme.tertiary})"><svg class="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Image 3')} class="rounded-xl hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex items-center justify-center" style="background: linear-gradient(135deg, {theme.tertiary}, {theme.accent})"><svg class="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'features-1'}
				<!-- Features #1 - Icon Grid -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Why Choose Us</button>
					<div class="flex-1 grid grid-cols-2 gap-6">
						<button onclick={() => handleColorClick(theme.accent, 'Feature')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.accent, 0.1)}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: {theme.accent}"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
							<span class="font-semibold block mb-2" style="color: {theme.text}">Lightning Fast</span>
							<span class="text-sm" style="color: {theme.muted}">Optimized for speed and performance</span>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Feature')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.secondary, 0.1)}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: {theme.secondary}"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
							<span class="font-semibold block mb-2" style="color: {theme.text}">Secure</span>
							<span class="text-sm" style="color: {theme.muted}">Enterprise-grade security built in</span>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Feature')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.tertiary, 0.1)}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: {theme.tertiary}"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
							<span class="font-semibold block mb-2" style="color: {theme.text}">Scalable</span>
							<span class="text-sm" style="color: {theme.muted}">Grows with your business needs</span>
						</button>
						<button onclick={() => handleColorClick(theme.surface, 'Feature')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: {hexToRgba(theme.text, 0.1)}"><svg class="w-6 h-6" style="color: {theme.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
							<span class="font-semibold block mb-2" style="color: {theme.text}">24/7 Support</span>
							<span class="text-sm" style="color: {theme.muted}">Always here when you need us</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'features-2'}
				<!-- Features #2 - Horizontal Cards -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Key Features</button>
					<div class="flex-1 flex flex-col gap-4">
						<button onclick={() => handleColorClick(theme.accent, 'Card')} class="flex items-center gap-6 p-5 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style="background-color: {hexToRgba(theme.accent, 0.15)}"><svg class="w-7 h-7" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
							<div class="flex-1"><span class="font-semibold block" style="color: {theme.text}">Real-time Analytics</span><span class="text-sm" style="color: {theme.muted}">Track performance with live dashboards</span></div>
							<svg class="w-5 h-5" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Card')} class="flex items-center gap-6 p-5 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style="background-color: {hexToRgba(theme.secondary, 0.15)}"><svg class="w-7 h-7" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
							<div class="flex-1"><span class="font-semibold block" style="color: {theme.text}">Team Collaboration</span><span class="text-sm" style="color: {theme.muted}">Work together seamlessly</span></div>
							<svg class="w-5 h-5" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Card')} class="flex items-center gap-6 p-5 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style="background-color: {hexToRgba(theme.tertiary, 0.15)}"><svg class="w-7 h-7" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
							<div class="flex-1"><span class="font-semibold block" style="color: {theme.text}">Enterprise Security</span><span class="text-sm" style="color: {theme.muted}">Bank-level encryption and compliance</span></div>
							<svg class="w-5 h-5" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'features-3'}
				<!-- Features #3 - Neon Glow -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Neon Features</button>
					<div class="flex-1 grid grid-cols-3 gap-5">
						<button onclick={() => handleColorClick(theme.accent, 'Neon Card')} class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-left" style="border-color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.08)}; box-shadow: 0 0 25px {hexToRgba(theme.accent, 0.3)}">
							<span class="text-lg font-semibold block mb-2" style="color: {theme.accent}">Cloud Native</span>
							<span class="text-sm" style="color: {theme.muted}">Built for modern infrastructure</span>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Neon Card')} class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-left" style="border-color: {theme.secondary}; background-color: {hexToRgba(theme.secondary, 0.08)}; box-shadow: 0 0 25px {hexToRgba(theme.secondary, 0.3)}">
							<span class="text-lg font-semibold block mb-2" style="color: {theme.secondary}">AI Powered</span>
							<span class="text-sm" style="color: {theme.muted}">Intelligent automation</span>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Neon Card')} class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-left" style="border-color: {theme.tertiary}; background-color: {hexToRgba(theme.tertiary, 0.08)}; box-shadow: 0 0 25px {hexToRgba(theme.tertiary, 0.3)}">
							<span class="text-lg font-semibold block mb-2" style="color: {theme.tertiary}">Open API</span>
							<span class="text-sm" style="color: {theme.muted}">Integrate with anything</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'features-4'}
				<!-- Features #4 - Gradient Cards -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Premium Features</button>
					<div class="flex-1 grid grid-cols-3 gap-5">
						<button onclick={() => handleColorClick(theme.accent, 'Gradient')} class="rounded-xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-left text-white" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
							<svg class="w-8 h-8 mb-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
							<span class="font-semibold block mb-2">Performance</span>
							<span class="text-sm text-white/80">Blazing fast execution</span>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Gradient')} class="rounded-xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-left text-white" style="background: linear-gradient(135deg, {theme.secondary}, {theme.tertiary})">
							<svg class="w-8 h-8 mb-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
							<span class="font-semibold block mb-2">Flexibility</span>
							<span class="text-sm text-white/80">Customize everything</span>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Gradient')} class="rounded-xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-left text-white" style="background: linear-gradient(135deg, {theme.tertiary}, {theme.accent})">
							<svg class="w-8 h-8 mb-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
							<span class="font-semibold block mb-2">Security</span>
							<span class="text-sm text-white/80">Enterprise protection</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'features-5'}
				<!-- Features #5 - Minimal Outlined -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Core Capabilities</button>
					<div class="flex-1 grid grid-cols-4 gap-4">
						<button onclick={() => handleColorClick(theme.border, 'Outlined')} class="rounded-xl p-5 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="border-color: {theme.border}">
							<svg class="w-6 h-6 mb-3" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
							<span class="font-medium block text-sm" style="color: {theme.text}">Customizable</span>
						</button>
						<button onclick={() => handleColorClick(theme.border, 'Outlined')} class="rounded-xl p-5 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="border-color: {theme.border}">
							<svg class="w-6 h-6 mb-3" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
							<span class="font-medium block text-sm" style="color: {theme.text}">Themeable</span>
						</button>
						<button onclick={() => handleColorClick(theme.border, 'Outlined')} class="rounded-xl p-5 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="border-color: {theme.border}">
							<svg class="w-6 h-6 mb-3" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
							<span class="font-medium block text-sm" style="color: {theme.text}">Extensible</span>
						</button>
						<button onclick={() => handleColorClick(theme.border, 'Outlined')} class="rounded-xl p-5 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="border-color: {theme.border}">
							<svg class="w-6 h-6 mb-3" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
							<span class="font-medium block text-sm" style="color: {theme.text}">Cloud Ready</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'stats-1'}
				<!-- Stats #1 - Grid -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">By The Numbers</button>
					<div class="flex-1 grid grid-cols-4 gap-5">
						<button onclick={() => handleColorClick(theme.accent, 'Stat')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-center" style="background-color: {hexToRgba(theme.accent, 0.1)}">
							<span class="text-4xl font-bold block mb-2" style="color: {theme.accent}">10M+</span>
							<span class="text-sm" style="color: {theme.muted}">Active Users</span>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Stat')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-center" style="background-color: {hexToRgba(theme.secondary, 0.1)}">
							<span class="text-4xl font-bold block mb-2" style="color: {theme.secondary}">99.9%</span>
							<span class="text-sm" style="color: {theme.muted}">Uptime</span>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Stat')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-center" style="background-color: {hexToRgba(theme.tertiary, 0.1)}">
							<span class="text-4xl font-bold block mb-2" style="color: {theme.tertiary}">500+</span>
							<span class="text-sm" style="color: {theme.muted}">Integrations</span>
						</button>
						<button onclick={() => handleColorClick(theme.surface, 'Stat')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-center" style="background-color: {theme.surface}">
							<span class="text-4xl font-bold block mb-2" style="color: {theme.text}">24/7</span>
							<span class="text-sm" style="color: {theme.muted}">Support</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'stats-2'}
				<!-- Stats #2 - Row -->
				<div class="w-full h-full flex flex-col items-center justify-center p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-12 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.text}">Trusted Worldwide</button>
					<div class="flex gap-12">
						<button onclick={() => handleColorClick(theme.accent, 'Stat')} class="text-center hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer">
							<span class="text-5xl font-bold block mb-2" style="color: {theme.accent}">150+</span>
							<span class="text-sm" style="color: {theme.muted}">Countries</span>
						</button>
						<div class="w-px h-20" style="background-color: {theme.border}"></div>
						<button onclick={() => handleColorClick(theme.secondary, 'Stat')} class="text-center hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer">
							<span class="text-5xl font-bold block mb-2" style="color: {theme.secondary}">$2B+</span>
							<span class="text-sm" style="color: {theme.muted}">Processed</span>
						</button>
						<div class="w-px h-20" style="background-color: {theme.border}"></div>
						<button onclick={() => handleColorClick(theme.tertiary, 'Stat')} class="text-center hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer">
							<span class="text-5xl font-bold block mb-2" style="color: {theme.tertiary}">50K+</span>
							<span class="text-sm" style="color: {theme.muted}">Companies</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'stats-3'}
				<!-- Stats #3 - With Icons -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Performance Metrics</button>
					<div class="flex-1 grid grid-cols-3 gap-6">
						<button onclick={() => handleColorClick(theme.accent, 'Card')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left flex gap-4 items-start" style="background-color: {theme.surface}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: {hexToRgba(theme.accent, 0.15)}"><svg class="w-6 h-6" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
							<div><span class="text-3xl font-bold block" style="color: {theme.text}">45%</span><span class="text-sm" style="color: {theme.muted}">Growth Rate</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Card')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left flex gap-4 items-start" style="background-color: {theme.surface}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: {hexToRgba(theme.secondary, 0.15)}"><svg class="w-6 h-6" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
							<div><span class="text-3xl font-bold block" style="color: {theme.text}">&lt;50ms</span><span class="text-sm" style="color: {theme.muted}">Response Time</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Card')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left flex gap-4 items-start" style="background-color: {theme.surface}">
							<div class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: {hexToRgba(theme.tertiary, 0.15)}"><svg class="w-6 h-6" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
							<div><span class="text-3xl font-bold block" style="color: {theme.text}">99.9%</span><span class="text-sm" style="color: {theme.muted}">Success Rate</span></div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'stats-4'}
				<!-- Stats #4 - Progress Style -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Project Progress</button>
					<div class="flex-1 flex flex-col gap-6">
						<button onclick={() => handleColorClick(theme.accent, 'Progress')} class="hover:ring-2 hover:ring-blue-500 rounded-lg p-4 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<div class="flex justify-between mb-2"><span class="font-medium" style="color: {theme.text}">Development</span><span style="color: {theme.accent}">85%</span></div>
							<div class="h-2 rounded-full" style="background-color: {hexToRgba(theme.accent, 0.2)}"><div class="h-2 rounded-full" style="width: 85%; background-color: {theme.accent}"></div></div>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Progress')} class="hover:ring-2 hover:ring-blue-500 rounded-lg p-4 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<div class="flex justify-between mb-2"><span class="font-medium" style="color: {theme.text}">Design</span><span style="color: {theme.secondary}">92%</span></div>
							<div class="h-2 rounded-full" style="background-color: {hexToRgba(theme.secondary, 0.2)}"><div class="h-2 rounded-full" style="width: 92%; background-color: {theme.secondary}"></div></div>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Progress')} class="hover:ring-2 hover:ring-blue-500 rounded-lg p-4 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<div class="flex justify-between mb-2"><span class="font-medium" style="color: {theme.text}">Testing</span><span style="color: {theme.tertiary}">67%</span></div>
							<div class="h-2 rounded-full" style="background-color: {hexToRgba(theme.tertiary, 0.2)}"><div class="h-2 rounded-full" style="width: 67%; background-color: {theme.tertiary}"></div></div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'stats-5'}
				<!-- Stats #5 - Comparison -->
				<div class="w-full h-full flex p-10">
					<div class="flex-1 flex flex-col items-center justify-center border-r" style="border-color: {theme.border}">
						<button onclick={() => handleColorClick(theme.muted, 'Before')} class="text-center hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer">
							<span class="text-sm uppercase tracking-widest mb-4 block" style="color: {theme.muted}">Before</span>
							<span class="text-5xl font-bold block mb-2" style="color: {theme.muted}">3.2s</span>
							<span class="text-sm" style="color: {theme.muted}">Load Time</span>
						</button>
					</div>
					<div class="flex-1 flex flex-col items-center justify-center">
						<button onclick={() => handleColorClick(theme.tertiary, 'After')} class="text-center hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer">
							<span class="text-sm uppercase tracking-widest mb-4 block" style="color: {theme.tertiary}">After</span>
							<span class="text-5xl font-bold block mb-2" style="color: {theme.tertiary}">0.4s</span>
							<span class="text-sm" style="color: {theme.muted}">Load Time</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'quote-1'}
				<!-- Quote #1 - Large -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12">
					<svg class="w-12 h-12 mb-6" style="color: {theme.accent}" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
					<button onclick={() => handleColorClick(theme.text, 'Quote')} class="text-2xl text-center max-w-2xl mb-8 hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer" style="color: {theme.text}">"This product completely transformed how we work. The results speak for themselves."</button>
					<button onclick={() => handleColorClick(theme.muted, 'Author')} class="hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.muted}">— Sarah Johnson, CEO at TechCorp</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'quote-2'}
				<!-- Quote #2 - Cards -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">What People Say</button>
					<div class="flex-1 grid grid-cols-2 gap-6">
						<button onclick={() => handleColorClick(theme.surface, 'Card')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<span class="text-base mb-4 block" style="color: {theme.muted}">"Incredible experience from start to finish. Highly recommend!"</span>
							<span class="text-sm font-semibold" style="color: {theme.text}">Alex Chen</span>
						</button>
						<button onclick={() => handleColorClick(theme.surface, 'Card')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {theme.surface}">
							<span class="text-base mb-4 block" style="color: {theme.muted}">"The support team went above and beyond. Five stars!"</span>
							<span class="text-sm font-semibold" style="color: {theme.text}">Maria Garcia</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'quote-3'}
				<!-- Quote #3 - With Profile -->
				<div class="w-full h-full flex items-center justify-center p-12">
					<button onclick={() => handleColorClick(theme.surface, 'Card')} class="rounded-2xl p-10 max-w-2xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
						<span class="text-xl mb-8 block leading-relaxed" style="color: {theme.text}">"Working with this team has been a game-changer for our business. Their attention to detail and commitment to quality is unmatched."</span>
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary}); color: white">MK</div>
							<div><span class="font-semibold block" style="color: {theme.text}">Michael Kim</span><span class="text-sm" style="color: {theme.muted}">Director of Engineering</span></div>
						</div>
					</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'quote-4'}
				<!-- Quote #4 - With Rating -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12">
					<div class="flex gap-1 mb-6">
						{#each [1,2,3,4,5] as _}<svg class="w-8 h-8" style="color: {theme.accent}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>{/each}
					</div>
					<button onclick={() => handleColorClick(theme.text, 'Quote')} class="text-xl text-center max-w-xl mb-6 hover:ring-2 hover:ring-blue-500 rounded p-4 transition-all cursor-pointer" style="color: {theme.text}">"Absolutely phenomenal! Best decision we ever made."</button>
					<button onclick={() => handleColorClick(theme.muted, 'Author')} class="hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.muted}">— Emma Wilson, Startup Founder</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'quote-5'}
				<!-- Quote #5 - Minimal -->
				<div class="w-full h-full flex items-center p-12">
					<div class="w-1 h-24 rounded mr-8" style="background-color: {theme.accent}"></div>
					<div>
						<button onclick={() => handleColorClick(theme.text, 'Quote')} class="text-3xl font-light mb-6 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer block max-w-2xl" style="color: {theme.text}">"Simple, elegant, powerful."</button>
						<button onclick={() => handleColorClick(theme.muted, 'Author')} class="text-sm hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.muted}">David Park, Designer</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'flow-1'}
				<!-- Flow #1 - Horizontal -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Our Process</button>
					<div class="flex-1 flex items-center justify-center gap-4">
						<button onclick={() => handleColorClick(theme.accent, 'Step')} class="w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="border-color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.1)}; box-shadow: 0 0 20px {hexToRgba(theme.accent, 0.3)}">
							<span class="text-2xl font-bold" style="color: {theme.accent}">1</span>
							<span class="text-sm mt-1" style="color: {theme.accent}">Discover</span>
						</button>
						<svg class="w-8 h-8" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
						<button onclick={() => handleColorClick(theme.secondary, 'Step')} class="w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="border-color: {theme.secondary}; background-color: {hexToRgba(theme.secondary, 0.1)}; box-shadow: 0 0 20px {hexToRgba(theme.secondary, 0.3)}">
							<span class="text-2xl font-bold" style="color: {theme.secondary}">2</span>
							<span class="text-sm mt-1" style="color: {theme.secondary}">Design</span>
						</button>
						<svg class="w-8 h-8" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
						<button onclick={() => handleColorClick(theme.tertiary, 'Step')} class="w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="border-color: {theme.tertiary}; background-color: {hexToRgba(theme.tertiary, 0.1)}; box-shadow: 0 0 20px {hexToRgba(theme.tertiary, 0.3)}">
							<span class="text-2xl font-bold" style="color: {theme.tertiary}">3</span>
							<span class="text-sm mt-1" style="color: {theme.tertiary}">Deliver</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'flow-2'}
				<!-- Flow #2 - Vertical -->
				<div class="w-full h-full flex p-10">
					<div class="w-1/3 flex flex-col justify-center">
						<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">How It Works</button>
						<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-base hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.muted}">Three simple steps to success</button>
					</div>
					<div class="w-2/3 flex flex-col justify-center gap-4 pl-8">
						<button onclick={() => handleColorClick(theme.accent, 'Step')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded p-3 transition-all cursor-pointer">
							<span class="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0" style="background-color: {theme.accent}; color: {theme.accentText}">1</span>
							<div><span class="font-semibold" style="color: {theme.text}">Sign Up</span><span class="ml-2" style="color: {theme.muted}">Create your account in seconds</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Step')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded p-3 transition-all cursor-pointer">
							<span class="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0" style="background-color: {theme.secondary}; color: white">2</span>
							<div><span class="font-semibold" style="color: {theme.text}">Configure</span><span class="ml-2" style="color: {theme.muted}">Set up your preferences</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Step')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded p-3 transition-all cursor-pointer">
							<span class="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0" style="background-color: {theme.tertiary}; color: white">3</span>
							<div><span class="font-semibold" style="color: {theme.text}">Launch</span><span class="ml-2" style="color: {theme.muted}">Go live and start growing</span></div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'flow-3'}
				<!-- Flow #3 - Connected -->
				<div class="w-full h-full flex flex-col items-center justify-center p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-12 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer" style="color: {theme.text}">The Journey</button>
					<div class="flex items-center">
						<button onclick={() => handleColorClick(theme.accent, 'Step')} class="w-24 h-24 rounded-full flex flex-col items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">
							<span class="text-xl font-bold">1</span>
							<span class="text-xs">Start</span>
						</button>
						<div class="w-16 h-1 rounded" style="background: linear-gradient(to right, {theme.accent}, {theme.secondary})"></div>
						<button onclick={() => handleColorClick(theme.secondary, 'Step')} class="w-24 h-24 rounded-full flex flex-col items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.secondary}; color: white">
							<span class="text-xl font-bold">2</span>
							<span class="text-xs">Build</span>
						</button>
						<div class="w-16 h-1 rounded" style="background: linear-gradient(to right, {theme.secondary}, {theme.tertiary})"></div>
						<button onclick={() => handleColorClick(theme.tertiary, 'Step')} class="w-24 h-24 rounded-full flex flex-col items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.tertiary}; color: white">
							<span class="text-xl font-bold">3</span>
							<span class="text-xs">Scale</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'list-1'}
				<!-- List #1 - Checks -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">What's Included</button>
					<div class="flex-1 grid grid-cols-2 gap-x-12 gap-y-4">
						{#each ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom integrations', 'Team collaboration', 'API access'] as item}
						<button onclick={() => handleColorClick(theme.tertiary, 'Check')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer">
							<svg class="w-5 h-5 shrink-0" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
							<span style="color: {theme.text}">{item}</span>
						</button>
						{/each}
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'list-2'}
				<!-- List #2 - Icons -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Features</button>
					<div class="flex-1 flex flex-col gap-4">
						<button onclick={() => handleColorClick(theme.accent, 'Item')} class="flex items-center gap-4 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
							<div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: {hexToRgba(theme.accent, 0.15)}"><svg class="w-5 h-5" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
							<span class="font-medium" style="color: {theme.text}">Blazing fast performance</span>
						</button>
						<button onclick={() => handleColorClick(theme.secondary, 'Item')} class="flex items-center gap-4 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
							<div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: {hexToRgba(theme.secondary, 0.15)}"><svg class="w-5 h-5" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
							<span class="font-medium" style="color: {theme.text}">Enterprise-grade security</span>
						</button>
						<button onclick={() => handleColorClick(theme.tertiary, 'Item')} class="flex items-center gap-4 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
							<div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: {hexToRgba(theme.tertiary, 0.15)}"><svg class="w-5 h-5" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
							<span class="font-medium" style="color: {theme.text}">Automatic backups</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'list-3'}
				<!-- List #3 - Numbered -->
				<div class="w-full h-full flex flex-col p-10">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Getting Started</button>
					<div class="flex-1 flex flex-col gap-6">
						<button onclick={() => handleColorClick(theme.text, 'Step')} class="flex gap-4 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left">
							<span class="text-4xl font-bold" style="color: {hexToRgba(theme.accent, 0.3)}">01</span>
							<div class="pt-2"><span class="font-semibold block mb-1" style="color: {theme.text}">Create Account</span><span class="text-sm" style="color: {theme.muted}">Sign up in under a minute</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.text, 'Step')} class="flex gap-4 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left">
							<span class="text-4xl font-bold" style="color: {hexToRgba(theme.secondary, 0.3)}">02</span>
							<div class="pt-2"><span class="font-semibold block mb-1" style="color: {theme.text}">Connect Tools</span><span class="text-sm" style="color: {theme.muted}">Integrate with your stack</span></div>
						</button>
						<button onclick={() => handleColorClick(theme.text, 'Step')} class="flex gap-4 hover:ring-2 hover:ring-blue-500 rounded p-2 transition-all cursor-pointer text-left">
							<span class="text-4xl font-bold" style="color: {hexToRgba(theme.tertiary, 0.3)}">03</span>
							<div class="pt-2"><span class="font-semibold block mb-1" style="color: {theme.text}">Start Building</span><span class="text-sm" style="color: {theme.muted}">Launch your first project</span></div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'table-1'}
				<!-- Table #1 - Comparison -->
				<div class="w-full h-full flex flex-col p-8">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Feature Comparison</button>
					<div class="flex-1 rounded-xl overflow-hidden border" style="border-color: {theme.border}">
						<table class="w-full h-full">
							<thead><tr style="background-color: {theme.surface}">
								<th class="text-left px-4 py-3 text-sm font-semibold" style="color: {theme.text}">Feature</th>
								<th class="text-center px-4 py-3 text-sm font-semibold" style="color: {theme.text}">Basic</th>
								<th class="text-center px-4 py-3 text-sm font-semibold" style="color: {theme.accent}">Pro</th>
							</tr></thead>
							<tbody>
								<tr style="border-top: 1px solid {theme.border}"><td class="px-4 py-3 text-sm" style="color: {theme.text}">Users</td><td class="px-4 py-3 text-sm text-center" style="color: {theme.muted}">5</td><td class="px-4 py-3 text-sm text-center font-medium" style="color: {theme.accent}">Unlimited</td></tr>
								<tr style="border-top: 1px solid {theme.border}; background-color: {hexToRgba(theme.surface, 0.5)}"><td class="px-4 py-3 text-sm" style="color: {theme.text}">Storage</td><td class="px-4 py-3 text-sm text-center" style="color: {theme.muted}">10 GB</td><td class="px-4 py-3 text-sm text-center font-medium" style="color: {theme.accent}">1 TB</td></tr>
								<tr style="border-top: 1px solid {theme.border}"><td class="px-4 py-3 text-sm" style="color: {theme.text}">Support</td><td class="px-4 py-3 text-sm text-center"><svg class="w-5 h-5 mx-auto" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></td><td class="px-4 py-3 text-sm text-center"><svg class="w-5 h-5 mx-auto" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></td></tr>
							</tbody>
						</table>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'table-2'}
				<!-- Table #2 - Pricing -->
				<div class="w-full h-full flex flex-col p-8">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-center" style="color: {theme.text}">Choose Your Plan</button>
					<div class="flex-1 grid grid-cols-3 gap-6">
						<button onclick={() => handleColorClick(theme.surface, 'Plan')} class="rounded-xl p-6 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-center" style="border-color: {theme.border}">
							<span class="text-lg font-semibold block mb-2" style="color: {theme.text}">Starter</span>
							<span class="text-3xl font-bold block mb-4" style="color: {theme.text}">Free</span>
							<span class="text-sm" style="color: {theme.muted}">For individuals</span>
						</button>
						<button onclick={() => handleColorClick(theme.accent, 'Plan')} class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer text-center relative" style="border-color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.05)}">
							<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold" style="background-color: {theme.accent}; color: {theme.accentText}">Popular</span>
							<span class="text-lg font-semibold block mb-2" style="color: {theme.text}">Pro</span>
							<span class="text-3xl font-bold block mb-4" style="color: {theme.accent}">$29</span>
							<span class="text-sm" style="color: {theme.muted}">For teams</span>
						</button>
						<button onclick={() => handleColorClick(theme.surface, 'Plan')} class="rounded-xl p-6 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-center" style="border-color: {theme.border}">
							<span class="text-lg font-semibold block mb-2" style="color: {theme.text}">Enterprise</span>
							<span class="text-3xl font-bold block mb-4" style="color: {theme.text}">Custom</span>
							<span class="text-sm" style="color: {theme.muted}">For large orgs</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'table-3'}
				<!-- Table #3 - Data -->
				<div class="w-full h-full flex flex-col p-8">
					<button onclick={() => handleColorClick(theme.text, 'Title')} class="text-2xl font-bold mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Performance Data</button>
					<div class="flex-1 rounded-xl overflow-hidden border" style="border-color: {theme.border}">
						<table class="w-full">
							<thead><tr style="background-color: {theme.surface}">
								<th class="text-left px-4 py-3 text-sm font-semibold" style="color: {theme.text}">Metric</th>
								<th class="text-right px-4 py-3 text-sm font-semibold" style="color: {theme.text}">Q1</th>
								<th class="text-right px-4 py-3 text-sm font-semibold" style="color: {theme.text}">Q2</th>
								<th class="text-right px-4 py-3 text-sm font-semibold" style="color: {theme.text}">Q3</th>
								<th class="text-right px-4 py-3 text-sm font-semibold" style="color: {theme.accent}">Q4</th>
							</tr></thead>
							<tbody>
								<tr style="border-top: 1px solid {theme.border}"><td class="px-4 py-3 text-sm" style="color: {theme.text}">Revenue</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">$1.2M</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">$1.5M</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">$1.8M</td><td class="px-4 py-3 text-sm text-right font-medium" style="color: {theme.tertiary}">$2.4M</td></tr>
								<tr style="border-top: 1px solid {theme.border}; background-color: {hexToRgba(theme.surface, 0.5)}"><td class="px-4 py-3 text-sm" style="color: {theme.text}">Users</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">10K</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">15K</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">22K</td><td class="px-4 py-3 text-sm text-right font-medium" style="color: {theme.tertiary}">35K</td></tr>
								<tr style="border-top: 1px solid {theme.border}"><td class="px-4 py-3 text-sm" style="color: {theme.text}">NPS</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">72</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">75</td><td class="px-4 py-3 text-sm text-right" style="color: {theme.muted}">78</td><td class="px-4 py-3 text-sm text-right font-medium" style="color: {theme.tertiary}">82</td></tr>
							</tbody>
						</table>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'color-boxes'}
				<!-- Color Boxes - 6 colored rounded boxes -->
				<div class="w-full h-full flex flex-col p-8">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-2xl font-bold mb-2 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Color Palette</button>
					<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-sm mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.muted}">Harmonious colors that work together</button>
					<div class="flex-1 grid grid-cols-3 gap-4">
						{#each theme.solids as color, i}
							<button
								onclick={() => handleColorClick(color, `Color ${i + 1}`)}
								class="rounded-2xl flex items-center justify-center hover:ring-2 hover:ring-white/30 hover:scale-[1.02] transition-all cursor-pointer"
								style="background-color: {color}"
							>
								<span class="text-white/90 font-mono text-sm font-medium drop-shadow-md">{color}</span>
							</button>
						{/each}
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'color-icons'}
				<!-- Color Icons - 6 icons with colored backgrounds -->
				<div class="w-full h-full flex flex-col p-8">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-2xl font-bold mb-2 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Our Services</button>
					<button onclick={() => handleColorClick(theme.muted, 'Subtitle')} class="text-sm mb-6 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.muted}">Everything you need to succeed</button>
					<div class="flex-1 grid grid-cols-3 gap-4">
						{#each [
							{ icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Speed' },
							{ icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Security' },
							{ icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', label: 'Layout' },
							{ icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', label: 'Design' },
							{ icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Analytics' },
							{ icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Support' },
						] as item, i}
							<button
								onclick={() => handleColorClick(theme.solids[i], item.label)}
								class="rounded-2xl flex flex-col items-center justify-center gap-3 hover:ring-2 hover:ring-white/30 hover:scale-[1.02] transition-all cursor-pointer p-4"
								style="background-color: {theme.solids[i]}"
							>
								<svg class="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={item.icon} />
								</svg>
								<span class="text-white font-semibold text-sm drop-shadow-md">{item.label}</span>
							</button>
						{/each}
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'pills-badges'}
				<!-- Pills & Badges -->
				<div class="w-full h-full flex flex-col p-8 overflow-y-auto">
					<button onclick={() => handleColorClick(theme.text, 'Heading')} class="text-2xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 rounded px-2 py-1 transition-all cursor-pointer self-start" style="color: {theme.text}">Pills & Badges</button>
					<div class="flex-1 flex flex-col gap-4">
						<div><div class="text-sm mb-2" style="color: {theme.muted}">Solid Pills</div><div class="flex gap-2 flex-wrap">
							<button onclick={() => handleColorClick(theme.accent, 'Solid')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">Feature</button>
							<button onclick={() => handleColorClick(theme.secondary, 'Solid')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.secondary}; color: white">New</button>
							<button onclick={() => handleColorClick(theme.tertiary, 'Solid')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.tertiary}; color: white">Active</button>
							<button onclick={() => handleColorClick('#ef4444', 'Solid')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer bg-red-500 text-white">Error</button>
							<button onclick={() => handleColorClick('#f59e0b', 'Solid')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer bg-amber-500 text-white">Warning</button>
						</div></div>
						<div><div class="text-sm mb-2" style="color: {theme.muted}">Outlined Pills</div><div class="flex gap-2 flex-wrap">
							<button onclick={() => handleColorClick(theme.accent, 'Outlined')} class="px-3 py-1 rounded-full text-xs font-medium border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.accent}; color: {theme.accent}">Feature</button>
							<button onclick={() => handleColorClick(theme.secondary, 'Outlined')} class="px-3 py-1 rounded-full text-xs font-medium border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.secondary}; color: {theme.secondary}">Beta</button>
							<button onclick={() => handleColorClick(theme.tertiary, 'Outlined')} class="px-3 py-1 rounded-full text-xs font-medium border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.tertiary}; color: {theme.tertiary}">Pro</button>
							<button onclick={() => handleColorClick('#ef4444', 'Outlined')} class="px-3 py-1 rounded-full text-xs font-medium border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer border-red-500 text-red-500">Critical</button>
						</div></div>
						<div><div class="text-sm mb-2" style="color: {theme.muted}">Tinted Pills</div><div class="flex gap-2 flex-wrap">
							<button onclick={() => handleColorClick(theme.accent, 'Tinted')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.accent, 0.15)}; color: {theme.accent}">Available</button>
							<button onclick={() => handleColorClick(theme.secondary, 'Tinted')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.secondary, 0.15)}; color: {theme.secondary}">Coming Soon</button>
							<button onclick={() => handleColorClick(theme.tertiary, 'Tinted')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.tertiary, 0.15)}; color: {theme.tertiary}">Success</button>
							<button onclick={() => handleColorClick('#ef4444', 'Tinted')} class="px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer bg-red-500/15 text-red-500">Failed</button>
						</div></div>
						<div><div class="text-sm mb-2" style="color: {theme.muted}">Dot Badges</div><div class="flex gap-2 flex-wrap">
							<button onclick={() => handleColorClick(theme.accent, 'Dot')} class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}; color: {theme.text}"><span class="w-2 h-2 rounded-full" style="background-color: {theme.accent}"></span>Online</button>
							<button onclick={() => handleColorClick(theme.tertiary, 'Dot')} class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}; color: {theme.text}"><span class="w-2 h-2 rounded-full" style="background-color: {theme.tertiary}"></span>Available</button>
							<button onclick={() => handleColorClick('#f59e0b', 'Dot')} class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}; color: {theme.text}"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Busy</button>
							<button onclick={() => handleColorClick('#ef4444', 'Dot')} class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}; color: {theme.text}"><span class="w-2 h-2 rounded-full bg-red-500"></span>Offline</button>
						</div></div>
						<div><div class="text-sm mb-2" style="color: {theme.muted}">Gradient & Neon</div><div class="flex gap-2 flex-wrap">
							<button onclick={() => handleColorClick(theme.accent, 'Gradient')} class="px-3 py-1 rounded-full text-xs font-medium text-white hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">Premium</button>
							<button onclick={() => handleColorClick(theme.secondary, 'Gradient')} class="px-3 py-1 rounded-full text-xs font-medium text-white hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.secondary}, {theme.tertiary})">Pro</button>
							<button onclick={() => handleColorClick(theme.accent, 'Neon')} class="px-3 py-1 rounded-full text-xs font-medium border hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="border-color: {theme.accent}; color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.1)}; box-shadow: 0 0 10px {hexToRgba(theme.accent, 0.3)}">Neon</button>
							<button onclick={() => handleColorClick(theme.secondary, 'Neon')} class="px-3 py-1 rounded-full text-xs font-medium border hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="border-color: {theme.secondary}; color: {theme.secondary}; background-color: {hexToRgba(theme.secondary, 0.1)}; box-shadow: 0 0 10px {hexToRgba(theme.secondary, 0.3)}">Glow</button>
						</div></div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'callouts'}
				<!-- Callouts & Alerts -->
				<div class="w-full h-full flex flex-col p-8">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-2xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Callouts & Alerts
					</button>
					<div class="flex-1 flex flex-col gap-4">
						<!-- Info callout -->
						<button onclick={() => handleColorClick(theme.accent, 'Info callout')} class="flex items-start gap-3 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.accent, 0.1)}; border-left: 4px solid {theme.accent}">
							<svg class="w-5 h-5 shrink-0 mt-0.5" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							<div>
								<div class="font-semibold text-sm" style="color: {theme.accent}">Information</div>
								<div class="text-sm mt-1" style="color: {theme.muted}">This is an informational message with helpful context.</div>
							</div>
						</button>
						<!-- Success callout -->
						<button onclick={() => handleColorClick(theme.tertiary, 'Success callout')} class="flex items-start gap-3 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.tertiary, 0.1)}; border-left: 4px solid {theme.tertiary}">
							<svg class="w-5 h-5 shrink-0 mt-0.5" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							<div>
								<div class="font-semibold text-sm" style="color: {theme.tertiary}">Success</div>
								<div class="text-sm mt-1" style="color: {theme.muted}">Operation completed successfully.</div>
							</div>
						</button>
						<!-- Warning callout -->
						<button onclick={() => handleColorClick('#f59e0b', 'Warning callout')} class="flex items-start gap-3 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b">
							<svg class="w-5 h-5 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
							<div>
								<div class="font-semibold text-sm text-amber-500">Warning</div>
								<div class="text-sm mt-1" style="color: {theme.muted}">Please review before proceeding.</div>
							</div>
						</button>
						<!-- Outlined callout -->
						<button onclick={() => handleColorClick(theme.secondary, 'Outlined callout')} class="flex items-start gap-3 p-4 rounded-xl border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="border-color: {theme.secondary}">
							<svg class="w-5 h-5 shrink-0 mt-0.5" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
							<div>
								<div class="font-semibold text-sm" style="color: {theme.secondary}">Pro Tip</div>
								<div class="text-sm mt-1" style="color: {theme.muted}">Use keyboard shortcuts for faster navigation.</div>
							</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'dividers'}
				<!-- Dividers & Separators -->
				<div class="w-full h-full flex flex-col p-8">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-2xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Dividers & Separators
					</button>
					<div class="flex-1 flex flex-col gap-5">
						<!-- Simple line -->
						<div>
							<div class="text-sm mb-2" style="color: {theme.muted}">Simple Line</div>
							<button onclick={() => handleColorClick(theme.border, 'Divider')} class="w-full h-px hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.border}"></button>
						</div>
						<!-- With text -->
						<div>
							<div class="text-sm mb-2" style="color: {theme.muted}">With Text</div>
							<button onclick={() => handleColorClick(theme.border, 'Divider with text')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2 w-full">
								<div class="flex-1 h-px" style="background-color: {theme.border}"></div>
								<span class="text-sm" style="color: {theme.muted}">OR</span>
								<div class="flex-1 h-px" style="background-color: {theme.border}"></div>
							</button>
						</div>
						<!-- Gradient line -->
						<div>
							<div class="text-sm mb-2" style="color: {theme.muted}">Gradient</div>
							<button onclick={() => handleColorClick(theme.accent, 'Gradient divider')} class="w-full h-0.5 rounded hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background: linear-gradient(90deg, transparent, {theme.accent}, {theme.secondary}, transparent)"></button>
						</div>
						<!-- Dashed -->
						<div>
							<div class="text-sm mb-2" style="color: {theme.muted}">Dashed</div>
							<button onclick={() => handleColorClick(theme.border, 'Dashed divider')} class="w-full border-t-2 border-dashed hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.border}"></button>
						</div>
						<!-- With icon -->
						<div>
							<div class="text-sm mb-2" style="color: {theme.muted}">With Icon</div>
							<button onclick={() => handleColorClick(theme.accent, 'Divider with icon')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2 w-full">
								<div class="flex-1 h-px" style="background-color: {theme.border}"></div>
								<div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: {hexToRgba(theme.accent, 0.1)}">
									<svg class="w-4 h-4" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
								</div>
								<div class="flex-1 h-px" style="background-color: {theme.border}"></div>
							</button>
						</div>
						<!-- Decorative -->
						<div>
							<div class="text-sm mb-2" style="color: {theme.muted}">Decorative</div>
							<button onclick={() => handleColorClick(theme.accent, 'Decorative divider')} class="flex items-center justify-center gap-2 hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2 w-full">
								<div class="w-2 h-2 rounded-full" style="background-color: {theme.accent}"></div>
								<div class="w-1.5 h-1.5 rounded-full" style="background-color: {theme.secondary}"></div>
								<div class="w-1 h-1 rounded-full" style="background-color: {theme.tertiary}"></div>
								<div class="w-16 h-0.5 rounded" style="background-color: {theme.border}"></div>
								<div class="w-1 h-1 rounded-full" style="background-color: {theme.tertiary}"></div>
								<div class="w-1.5 h-1.5 rounded-full" style="background-color: {theme.secondary}"></div>
								<div class="w-2 h-2 rounded-full" style="background-color: {theme.accent}"></div>
							</button>
						</div>
					</div>
				</div>

			{/if}
		</div>
	</main>

	<!-- Right Sidebar - Theme Colors -->
	<aside class="w-60 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
		<div class="h-10 px-3 flex items-center border-b border-zinc-800">
			<span class="text-xs font-medium text-zinc-400">Theme</span>
			<button
				onclick={randomizePalette}
				class="ml-auto p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
				title="Randomize palette"
			>
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
			</button>
		</div>

		<!-- Base Color Picker -->
		<div class="p-2 border-b border-zinc-800">
			<div class="text-[10px] text-zinc-500 mb-1.5 px-1">Base Color</div>
			<div class="grid grid-cols-6 gap-1">
				{#each baseColors as color}
					<button
						onclick={() => generateThemeFromBase(color.hex)}
						class="aspect-square rounded-sm hover:scale-110 transition-all {theme.accent === color.hex ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : ''}"
						style="background-color: {color.hex}"
						title={color.name}
					></button>
				{/each}
			</div>
		</div>

		<!-- Palette Presets -->
		<div class="p-2 border-b border-zinc-800">
			<div class="text-[10px] text-zinc-500 mb-1.5 px-1">Presets</div>
			<div class="grid grid-cols-4 gap-1">
				{#each presetPalettes as palette}
					<button
						onclick={() => applyPalette(palette)}
						class="group relative aspect-square rounded overflow-hidden hover:ring-1 hover:ring-zinc-600 transition-all"
						title={palette.name}
					>
						<div class="absolute inset-0" style="background-color: {palette.background}"></div>
						<div class="absolute bottom-0 left-0 right-0 h-1/2 flex">
							<div class="flex-1" style="background-color: {palette.accent}"></div>
							<div class="flex-1" style="background-color: {palette.secondary}"></div>
							<div class="flex-1" style="background-color: {palette.tertiary}"></div>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<div class="flex-1 overflow-y-auto p-3 space-y-2 sidebar-scroll">
			<!-- Background -->
			<button
				onclick={() => handleColorClick(theme.background, 'Background')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.background}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Background</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.background}</div>
				</div>
			</button>

			<!-- Text -->
			<button
				onclick={() => handleColorClick(theme.text, 'Text')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.text}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Text</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.text}</div>
				</div>
			</button>

			<!-- Muted -->
			<button
				onclick={() => handleColorClick(theme.muted, 'Muted')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.muted}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Muted</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.muted}</div>
				</div>
			</button>

			<!-- Surface -->
			<button
				onclick={() => handleColorClick(theme.surface, 'Surface')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.surface}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Surface</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.surface}</div>
				</div>
			</button>

			<!-- Accent -->
			<button
				onclick={() => handleColorClick(theme.accent, 'Accent')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.accent}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Accent</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.accent}</div>
				</div>
			</button>

			<!-- Accent Text -->
			<button
				onclick={() => handleColorClick(theme.accentText, 'Accent Text')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.accentText}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Accent Text</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.accentText}</div>
				</div>
			</button>

			<!-- Border -->
			<button
				onclick={() => handleColorClick(theme.border, 'Border')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.border}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Border</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.border}</div>
				</div>
			</button>

			<div class="h-px bg-zinc-800 my-2"></div>
			<div class="text-[10px] text-zinc-500 uppercase tracking-wider px-2 mb-1">Accents</div>

			<!-- Secondary -->
			<button
				onclick={() => handleColorClick(theme.secondary, 'Secondary')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.secondary}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Secondary</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.secondary}</div>
				</div>
			</button>

			<!-- Tertiary -->
			<button
				onclick={() => handleColorClick(theme.tertiary, 'Tertiary')}
				class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
			>
				<div class="w-8 h-8 rounded-md border border-zinc-700 shrink-0" style="background-color: {theme.tertiary}"></div>
				<div class="text-left">
					<div class="text-xs font-medium text-zinc-300">Tertiary</div>
					<div class="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-400">{theme.tertiary}</div>
				</div>
			</button>
		</div>

		<div class="p-3 border-t border-zinc-800">
			<button class="w-full px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors">
				Export Theme
			</button>
		</div>
	</aside>
</div>

<!-- Toast -->
{#if copiedColor}
	<div
		class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium z-50"
	>
		<div class="w-4 h-4 rounded shadow-inner" style="background-color: {copiedColor}"></div>
		<span>{copiedLabel}</span>
		<span class="text-zinc-500 uppercase">{copiedColor}</span>
	</div>
{/if}

<style>
	.sidebar-scroll {
		scrollbar-width: thin;
		scrollbar-color: #3f3f46 transparent;
	}
	.sidebar-scroll::-webkit-scrollbar {
		width: 4px;
	}
	.sidebar-scroll::-webkit-scrollbar-track {
		background: transparent;
	}
	.sidebar-scroll::-webkit-scrollbar-thumb {
		background-color: #3f3f46;
		border-radius: 2px;
	}
	.sidebar-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #52525b;
	}
</style>
