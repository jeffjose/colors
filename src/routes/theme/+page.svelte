<script lang="ts">
	import { getContrastColor, copyToClipboard } from '$lib/utils';

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
		accentMuted: '#3b82f6',      // accent at lower opacity (we'll use opacity)
		accentBorder: '#3b82f6',     // for outlines
		accentGlow: '#3b82f6',       // for shadows/glows
		// Secondary accent
		secondary: '#8b5cf6',        // purple
		tertiary: '#10b981',         // emerald
	});

	// Slide state
	let selectedSlideIndex = $state(0);
	let copiedColor = $state<string | null>(null);
	let copiedLabel = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Slide definitions - expanded with experiments
	const slides = [
		{ id: 'title', name: 'Title Slide' },
		{ id: 'content', name: 'Content' },
		{ id: 'neon-boxes', name: 'Neon Boxes' },
		{ id: 'outlined', name: 'Outlined Style' },
		{ id: 'icons-grid', name: 'Icons Grid' },
		{ id: 'icon-cards', name: 'Icon Cards' },
		{ id: 'gradient-cards', name: 'Gradient Cards' },
		{ id: 'pills-badges', name: 'Pills & Badges' },
		{ id: 'flow', name: 'Flow Diagram' },
		{ id: 'stats', name: 'Stats & Numbers' },
		{ id: 'buttons', name: 'Buttons' },
		{ id: 'callouts', name: 'Callouts & Alerts' },
		{ id: 'lists', name: 'Lists & Checks' },
		{ id: 'avatars', name: 'Avatars & Profiles' },
		{ id: 'progress', name: 'Progress & Steps' },
		{ id: 'quotes', name: 'Quotes & Testimonials' },
		{ id: 'dividers', name: 'Dividers & Separators' },
		{ id: 'highlights', name: 'Text Highlights' },
	];

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

	function isColorDark(hex: string): boolean {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance < 0.5;
	}

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
	<!-- Slides Sidebar (Figma layers style) -->
	<aside class="w-44 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
		<div class="h-10 px-3 flex items-center border-b border-zinc-800">
			<span class="text-xs font-medium text-zinc-400">Slides</span>
		</div>
		<div class="flex-1 overflow-y-auto py-1">
			{#each slides as slide, index}
				<button
					onclick={() => (selectedSlideIndex = index)}
					class="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors {selectedSlideIndex === index ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'}"
				>
					<svg class="w-4 h-4 shrink-0 {selectedSlideIndex === index ? 'text-blue-400' : 'text-zinc-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
					</svg>
					<span class="text-xs truncate">{slide.name}</span>
				</button>
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
			{#if slides[selectedSlideIndex].id === 'title'}
				<!-- Title Slide -->
				<div class="w-full h-full flex flex-col items-center justify-center p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Title Text')}
						class="text-4xl font-bold mb-4 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Presentation Title
					</button>
					<button
						onclick={() => handleColorClick(theme.muted, 'Subtitle/Muted')}
						class="text-xl hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer"
						style="color: {theme.muted}; --tw-ring-offset-color: {theme.background}"
					>
						Subtitle or tagline goes here
					</button>
				</div>

			{:else if slides[selectedSlideIndex].id === 'content'}
				<!-- Content Slide -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Content Heading
					</button>
					<div class="space-y-4 flex-1">
						<button
							onclick={() => handleColorClick(theme.muted, 'Body Text')}
							class="block text-lg hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer text-left"
							style="color: {theme.muted}; --tw-ring-offset-color: {theme.background}"
						>
							• First bullet point with important information
						</button>
						<button
							onclick={() => handleColorClick(theme.muted, 'Body Text')}
							class="block text-lg hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer text-left"
							style="color: {theme.muted}; --tw-ring-offset-color: {theme.background}"
						>
							• Second point explaining key concepts
						</button>
						<button
							onclick={() => handleColorClick(theme.muted, 'Body Text')}
							class="block text-lg hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer text-left"
							style="color: {theme.muted}; --tw-ring-offset-color: {theme.background}"
						>
							• Third point with additional details
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'neon-boxes'}
				<!-- Neon Boxes - Border + tinted background + colored text -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Neon Style Boxes
					</button>
					<div class="flex-1 grid grid-cols-3 gap-6">
						<!-- Blue neon -->
						<button
							onclick={() => handleColorClick(theme.accent, 'Accent (border + text)')}
							class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col"
							style="border-color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.1)}; box-shadow: 0 0 20px {hexToRgba(theme.accent, 0.3)}, inset 0 0 20px {hexToRgba(theme.accent, 0.05)}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.accent}">Feature One</div>
							<div class="text-sm" style="color: {theme.muted}">Neon glow with tinted background.</div>
						</button>
						<!-- Purple neon -->
						<button
							onclick={() => handleColorClick(theme.secondary, 'Secondary (border + text)')}
							class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col"
							style="border-color: {theme.secondary}; background-color: {hexToRgba(theme.secondary, 0.1)}; box-shadow: 0 0 20px {hexToRgba(theme.secondary, 0.3)}, inset 0 0 20px {hexToRgba(theme.secondary, 0.05)}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.secondary}">Feature Two</div>
							<div class="text-sm" style="color: {theme.muted}">Secondary accent color glow.</div>
						</button>
						<!-- Green neon -->
						<button
							onclick={() => handleColorClick(theme.tertiary, 'Tertiary (border + text)')}
							class="rounded-xl p-6 border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col"
							style="border-color: {theme.tertiary}; background-color: {hexToRgba(theme.tertiary, 0.1)}; box-shadow: 0 0 20px {hexToRgba(theme.tertiary, 0.3)}, inset 0 0 20px {hexToRgba(theme.tertiary, 0.05)}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.tertiary}">Feature Three</div>
							<div class="text-sm" style="color: {theme.muted}">Tertiary accent for variety.</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'outlined'}
				<!-- Outlined Style - Just borders, no fills -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Outlined Cards
					</button>
					<div class="flex-1 grid grid-cols-3 gap-6">
						<button
							onclick={() => handleColorClick(theme.border, 'Border color')}
							class="rounded-xl p-6 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col text-left"
							style="border-color: {theme.border}"
						>
							<div class="w-10 h-10 rounded-lg border-2 mb-4 flex items-center justify-center" style="border-color: {theme.accent}">
								<svg class="w-5 h-5" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div class="text-lg font-semibold mb-2" style="color: {theme.text}">Fast</div>
							<div class="text-sm" style="color: {theme.muted}">Lightning quick performance.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.border, 'Border color')}
							class="rounded-xl p-6 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col text-left"
							style="border-color: {theme.border}"
						>
							<div class="w-10 h-10 rounded-lg border-2 mb-4 flex items-center justify-center" style="border-color: {theme.secondary}">
								<svg class="w-5 h-5" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<div class="text-lg font-semibold mb-2" style="color: {theme.text}">Secure</div>
							<div class="text-sm" style="color: {theme.muted}">Enterprise-grade security.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.border, 'Border color')}
							class="rounded-xl p-6 border hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col text-left"
							style="border-color: {theme.border}"
						>
							<div class="w-10 h-10 rounded-lg border-2 mb-4 flex items-center justify-center" style="border-color: {theme.tertiary}">
								<svg class="w-5 h-5" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
							</div>
							<div class="text-lg font-semibold mb-2" style="color: {theme.text}">Sync</div>
							<div class="text-sm" style="color: {theme.muted}">Real-time synchronization.</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'icons-grid'}
				<!-- Icons Grid - Showcase of icon styles -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Icon Styles
					</button>
					<div class="flex-1 grid grid-cols-4 gap-4">
						<!-- Solid circle bg -->
						<button onclick={() => handleColorClick(theme.accent, 'Solid icon bg')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-full flex items-center justify-center" style="background-color: {theme.accent}">
								<svg class="w-7 h-7" style="color: {theme.accentText}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Solid Circle</span>
						</button>
						<!-- Outlined circle -->
						<button onclick={() => handleColorClick(theme.accent, 'Outlined icon')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-full border-2 flex items-center justify-center" style="border-color: {theme.accent}">
								<svg class="w-7 h-7" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Outlined</span>
						</button>
						<!-- Tinted bg -->
						<button onclick={() => handleColorClick(theme.secondary, 'Tinted icon bg')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background-color: {hexToRgba(theme.secondary, 0.15)}">
								<svg class="w-7 h-7" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Tinted Square</span>
						</button>
						<!-- Glow effect -->
						<button onclick={() => handleColorClick(theme.tertiary, 'Glow icon')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background-color: {hexToRgba(theme.tertiary, 0.2)}; box-shadow: 0 0 20px {hexToRgba(theme.tertiary, 0.4)}">
								<svg class="w-7 h-7" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Glow Effect</span>
						</button>
						<!-- Gradient bg -->
						<button onclick={() => handleColorClick(theme.accent, 'Gradient icon')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
								<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Gradient</span>
						</button>
						<!-- Double border -->
						<button onclick={() => handleColorClick(theme.accent, 'Double border')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-xl border-2 flex items-center justify-center" style="border-color: {theme.accent}; box-shadow: inset 0 0 0 3px {theme.background}, inset 0 0 0 5px {theme.accent}">
								<svg class="w-6 h-6" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Double Border</span>
						</button>
						<!-- Surface card icon -->
						<button onclick={() => handleColorClick(theme.surface, 'Surface icon card')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background-color: {theme.surface}">
								<svg class="w-7 h-7" style="color: {theme.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Surface Card</span>
						</button>
						<!-- Muted icon -->
						<button onclick={() => handleColorClick(theme.muted, 'Muted icon')} class="flex flex-col items-center gap-2 p-4 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
							<div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background-color: {hexToRgba(theme.muted, 0.1)}">
								<svg class="w-7 h-7" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
							</div>
							<span class="text-xs" style="color: {theme.muted}">Muted</span>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'icon-cards'}
				<!-- Icon Cards - Cards with prominent icons -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Feature Cards with Icons
					</button>
					<div class="flex-1 grid grid-cols-2 gap-6">
						<button
							onclick={() => handleColorClick(theme.surface, 'Card surface')}
							class="rounded-2xl p-8 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex gap-6 text-left"
							style="background-color: {theme.surface}"
						>
							<div class="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">
								<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div>
								<div class="text-xl font-semibold mb-2" style="color: {theme.text}">Lightning Fast</div>
								<div class="text-sm" style="color: {theme.muted}">Optimized for speed with instant load times and responsive interactions.</div>
							</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.surface, 'Card surface')}
							class="rounded-2xl p-8 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex gap-6 text-left"
							style="background-color: {theme.surface}"
						>
							<div class="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center" style="background: linear-gradient(135deg, {theme.secondary}, {theme.tertiary})">
								<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<div>
								<div class="text-xl font-semibold mb-2" style="color: {theme.text}">Secure by Default</div>
								<div class="text-sm" style="color: {theme.muted}">Built with security in mind, featuring encryption and compliance.</div>
							</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.accent, 'Accent border card')}
							class="rounded-2xl p-8 border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex gap-6 text-left"
							style="border-color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.05)}"
						>
							<div class="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border-2" style="border-color: {theme.accent}">
								<svg class="w-8 h-8" style="color: {theme.accent}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
							</div>
							<div>
								<div class="text-xl font-semibold mb-2" style="color: {theme.accent}">Auto Sync</div>
								<div class="text-sm" style="color: {theme.muted}">Seamless synchronization across all your devices in real-time.</div>
							</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.tertiary, 'Tertiary border card')}
							class="rounded-2xl p-8 border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex gap-6 text-left"
							style="border-color: {theme.tertiary}; background-color: {hexToRgba(theme.tertiary, 0.05)}"
						>
							<div class="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border-2" style="border-color: {theme.tertiary}">
								<svg class="w-8 h-8" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<div>
								<div class="text-xl font-semibold mb-2" style="color: {theme.tertiary}">Analytics</div>
								<div class="text-sm" style="color: {theme.muted}">Deep insights and analytics to track your progress and growth.</div>
							</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'gradient-cards'}
				<!-- Gradient Cards -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Gradient Backgrounds
					</button>
					<div class="flex-1 grid grid-cols-3 gap-6">
						<button
							onclick={() => handleColorClick(theme.accent, 'Blue-Purple gradient')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col justify-end"
							style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})"
						>
							<div class="text-lg font-bold text-white">Primary Flow</div>
							<div class="text-sm text-white/80">Blue to purple gradient.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.secondary, 'Purple-Green gradient')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col justify-end"
							style="background: linear-gradient(135deg, {theme.secondary}, {theme.tertiary})"
						>
							<div class="text-lg font-bold text-white">Creative Blend</div>
							<div class="text-sm text-white/80">Purple to green flow.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.tertiary, 'Green-Blue gradient')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col justify-end"
							style="background: linear-gradient(135deg, {theme.tertiary}, {theme.accent})"
						>
							<div class="text-lg font-bold text-white">Fresh Start</div>
							<div class="text-sm text-white/80">Green to blue energy.</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'pills-badges'}
				<!-- Pills & Badges -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Pills & Badges
					</button>
					<div class="flex-1 flex flex-col gap-8">
						<!-- Row 1: Solid pills -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Solid Pills</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Solid pill')} class="px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">Feature</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Solid pill')} class="px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.secondary}; color: white">New</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Solid pill')} class="px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.tertiary}; color: white">Active</button>
							</div>
						</div>
						<!-- Row 2: Outlined pills -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Outlined Pills</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Outlined pill')} class="px-4 py-1.5 rounded-full text-sm font-medium border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.accent}; color: {theme.accent}">Feature</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Outlined pill')} class="px-4 py-1.5 rounded-full text-sm font-medium border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.secondary}; color: {theme.secondary}">Beta</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Outlined pill')} class="px-4 py-1.5 rounded-full text-sm font-medium border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.tertiary}; color: {theme.tertiary}">Pro</button>
							</div>
						</div>
						<!-- Row 3: Tinted pills -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Tinted Pills (Subtle)</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Tinted pill')} class="px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.accent, 0.15)}; color: {theme.accent}">Available</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Tinted pill')} class="px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.secondary, 0.15)}; color: {theme.secondary}">Coming Soon</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Tinted pill')} class="px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.tertiary, 0.15)}; color: {theme.tertiary}">Success</button>
							</div>
						</div>
						<!-- Row 4: Icon badges -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Icon Badges</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Icon badge')} class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.accent, 0.15)}; color: {theme.accent}">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
									Verified
								</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Icon badge')} class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.secondary, 0.15)}; color: {theme.secondary}">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
									Featured
								</button>
							</div>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'flow'}
				<!-- Flow Diagram - Neon style -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Process Flow
					</button>
					<div class="flex-1 flex items-center justify-center">
						<div class="flex items-center gap-4">
							<!-- Step 1 -->
							<button
								onclick={() => handleColorClick(theme.accent, 'Flow step (neon)')}
								class="w-28 h-28 rounded-2xl flex flex-col items-center justify-center border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer"
								style="border-color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.1)}; box-shadow: 0 0 25px {hexToRgba(theme.accent, 0.4)}"
							>
								<div class="text-2xl font-bold" style="color: {theme.accent}">1</div>
								<div class="text-sm mt-1" style="color: {theme.accent}">Start</div>
							</button>

							<!-- Arrow -->
							<button onclick={() => handleColorClick(theme.accent, 'Arrow')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer p-2">
								<svg class="w-8 h-8" style="color: {theme.accent}; filter: drop-shadow(0 0 6px {theme.accent})" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</button>

							<!-- Step 2 -->
							<button
								onclick={() => handleColorClick(theme.secondary, 'Flow step (neon)')}
								class="w-28 h-28 rounded-2xl flex flex-col items-center justify-center border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer"
								style="border-color: {theme.secondary}; background-color: {hexToRgba(theme.secondary, 0.1)}; box-shadow: 0 0 25px {hexToRgba(theme.secondary, 0.4)}"
							>
								<div class="text-2xl font-bold" style="color: {theme.secondary}">2</div>
								<div class="text-sm mt-1" style="color: {theme.secondary}">Process</div>
							</button>

							<!-- Arrow -->
							<button onclick={() => handleColorClick(theme.secondary, 'Arrow')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer p-2">
								<svg class="w-8 h-8" style="color: {theme.secondary}; filter: drop-shadow(0 0 6px {theme.secondary})" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</button>

							<!-- Step 3 -->
							<button
								onclick={() => handleColorClick(theme.tertiary, 'Flow step (neon)')}
								class="w-28 h-28 rounded-2xl flex flex-col items-center justify-center border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer"
								style="border-color: {theme.tertiary}; background-color: {hexToRgba(theme.tertiary, 0.1)}; box-shadow: 0 0 25px {hexToRgba(theme.tertiary, 0.4)}"
							>
								<div class="text-2xl font-bold" style="color: {theme.tertiary}">3</div>
								<div class="text-sm mt-1" style="color: {theme.tertiary}">Done</div>
							</button>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'stats'}
				<!-- Stats & Numbers -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Key Metrics
					</button>
					<div class="flex-1 grid grid-cols-4 gap-6">
						<button
							onclick={() => handleColorClick(theme.accent, 'Stat card accent')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
							style="background-color: {hexToRgba(theme.accent, 0.1)}; border: 1px solid {hexToRgba(theme.accent, 0.3)}"
						>
							<div class="text-4xl font-bold mb-1" style="color: {theme.accent}">99%</div>
							<div class="text-sm" style="color: {theme.muted}">Uptime</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.secondary, 'Stat card secondary')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
							style="background-color: {hexToRgba(theme.secondary, 0.1)}; border: 1px solid {hexToRgba(theme.secondary, 0.3)}"
						>
							<div class="text-4xl font-bold mb-1" style="color: {theme.secondary}">50K+</div>
							<div class="text-sm" style="color: {theme.muted}">Users</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.tertiary, 'Stat card tertiary')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
							style="background-color: {hexToRgba(theme.tertiary, 0.1)}; border: 1px solid {hexToRgba(theme.tertiary, 0.3)}"
						>
							<div class="text-4xl font-bold mb-1" style="color: {theme.tertiary}">4.9</div>
							<div class="text-sm" style="color: {theme.muted}">Rating</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.text, 'Stat card text')}
							class="rounded-2xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
							style="background-color: {theme.surface}"
						>
							<div class="text-4xl font-bold mb-1" style="color: {theme.text}">24/7</div>
							<div class="text-sm" style="color: {theme.muted}">Support</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'buttons'}
				<!-- Buttons - Various button styles -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Button Styles
					</button>
					<div class="flex-1 flex flex-col gap-6">
						<!-- Row 1: Solid buttons -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Solid Buttons</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Solid primary')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">Primary</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Solid secondary')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.secondary}; color: white">Secondary</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Solid success')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.tertiary}; color: white">Success</button>
								<button onclick={() => handleColorClick(theme.surface, 'Solid muted')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}; color: {theme.text}">Muted</button>
							</div>
						</div>
						<!-- Row 2: Outline buttons -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Outline Buttons</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Outline primary')} class="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.accent}; color: {theme.accent}">Primary</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Outline secondary')} class="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.secondary}; color: {theme.secondary}">Secondary</button>
								<button onclick={() => handleColorClick(theme.text, 'Outline default')} class="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.border}; color: {theme.text}">Default</button>
							</div>
						</div>
						<!-- Row 3: Ghost/Tinted buttons -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Ghost / Tinted Buttons</div>
							<div class="flex gap-3 flex-wrap">
								<button onclick={() => handleColorClick(theme.accent, 'Ghost primary')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.accent, 0.1)}; color: {theme.accent}">Primary</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Ghost secondary')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.secondary, 0.1)}; color: {theme.secondary}">Secondary</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Ghost success')} class="px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {hexToRgba(theme.tertiary, 0.1)}; color: {theme.tertiary}">Success</button>
							</div>
						</div>
						<!-- Row 4: Icon buttons & Special -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Icon Buttons & Gradients</div>
							<div class="flex gap-3 flex-wrap items-center">
								<button onclick={() => handleColorClick(theme.accent, 'Icon button')} class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
									Add New
								</button>
								<button onclick={() => handleColorClick(theme.accent, 'Gradient button')} class="px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">Gradient</button>
								<button onclick={() => handleColorClick(theme.accent, 'Neon button')} class="px-5 py-2.5 rounded-lg text-sm font-semibold border-2 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="border-color: {theme.accent}; color: {theme.accent}; background-color: {hexToRgba(theme.accent, 0.1)}; box-shadow: 0 0 15px {hexToRgba(theme.accent, 0.3)}">Neon</button>
								<button onclick={() => handleColorClick(theme.surface, 'Icon only')} class="w-10 h-10 rounded-lg flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}; color: {theme.text}">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
								</button>
								<button onclick={() => handleColorClick(theme.accent, 'Circle icon')} class="w-10 h-10 rounded-full flex items-center justify-center hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
								</button>
							</div>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'callouts'}
				<!-- Callouts & Alerts -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
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

			{:else if slides[selectedSlideIndex].id === 'lists'}
				<!-- Lists & Checks -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Lists & Check Items
					</button>
					<div class="flex-1 grid grid-cols-3 gap-8">
						<!-- Checkmark list -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Feature Checklist</div>
							<div class="space-y-3">
								<button onclick={() => handleColorClick(theme.tertiary, 'Check item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: {hexToRgba(theme.tertiary, 0.2)}">
										<svg class="w-3 h-3" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
									</div>
									<span style="color: {theme.text}">Unlimited projects</span>
								</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Check item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: {hexToRgba(theme.tertiary, 0.2)}">
										<svg class="w-3 h-3" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
									</div>
									<span style="color: {theme.text}">Priority support</span>
								</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Check item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<div class="w-5 h-5 rounded-full flex items-center justify-center" style="background-color: {hexToRgba(theme.tertiary, 0.2)}">
										<svg class="w-3 h-3" style="color: {theme.tertiary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
									</div>
									<span style="color: {theme.text}">Advanced analytics</span>
								</button>
							</div>
						</div>
						<!-- Numbered list -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Numbered Steps</div>
							<div class="space-y-3">
								<button onclick={() => handleColorClick(theme.accent, 'Numbered item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {theme.accent}; color: {theme.accentText}">1</div>
									<span style="color: {theme.text}">Create account</span>
								</button>
								<button onclick={() => handleColorClick(theme.accent, 'Numbered item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {theme.accent}; color: {theme.accentText}">2</div>
									<span style="color: {theme.text}">Set up profile</span>
								</button>
								<button onclick={() => handleColorClick(theme.accent, 'Numbered item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background-color: {theme.accent}; color: {theme.accentText}">3</div>
									<span style="color: {theme.text}">Start building</span>
								</button>
							</div>
						</div>
						<!-- Icon list -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Icon List</div>
							<div class="space-y-3">
								<button onclick={() => handleColorClick(theme.secondary, 'Icon list item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<svg class="w-5 h-5" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
									<span style="color: {theme.text}">Lightning fast</span>
								</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Icon list item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<svg class="w-5 h-5" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
									<span style="color: {theme.text}">Secure by default</span>
								</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Icon list item')} class="flex items-center gap-3 hover:ring-2 hover:ring-blue-500 rounded-lg p-2 -m-2 transition-all cursor-pointer w-full text-left">
									<svg class="w-5 h-5" style="color: {theme.secondary}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
									<span style="color: {theme.text}">Global CDN</span>
								</button>
							</div>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'avatars'}
				<!-- Avatars & Profiles -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Avatars & Profiles
					</button>
					<div class="flex-1 flex flex-col gap-8">
						<!-- Avatar styles -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Avatar Styles</div>
							<div class="flex items-center gap-6">
								<button onclick={() => handleColorClick(theme.accent, 'Initial avatar')} class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.accent}; color: {theme.accentText}">JD</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Initial avatar')} class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.secondary}; color: white">AK</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Initial avatar')} class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background-color: {theme.tertiary}; color: white">MR</button>
								<button onclick={() => handleColorClick(theme.accent, 'Gradient avatar')} class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white hover:ring-2 hover:ring-white/30 transition-all cursor-pointer" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary})">SM</button>
								<button onclick={() => handleColorClick(theme.surface, 'Placeholder avatar')} class="w-12 h-12 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
									<svg class="w-6 h-6" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
								</button>
							</div>
						</div>
						<!-- Avatar with status -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">With Status Indicator</div>
							<div class="flex items-center gap-6">
								<button onclick={() => handleColorClick(theme.tertiary, 'Online status')} class="relative hover:ring-2 hover:ring-blue-500 rounded-full transition-all cursor-pointer">
									<div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style="background-color: {theme.accent}; color: {theme.accentText}">JD</div>
									<div class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2" style="background-color: {theme.tertiary}; border-color: {theme.background}"></div>
								</button>
								<button onclick={() => handleColorClick('#f59e0b', 'Away status')} class="relative hover:ring-2 hover:ring-blue-500 rounded-full transition-all cursor-pointer">
									<div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style="background-color: {theme.secondary}; color: white">AK</div>
									<div class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 bg-amber-500" style="border-color: {theme.background}"></div>
								</button>
								<button onclick={() => handleColorClick(theme.muted, 'Offline status')} class="relative hover:ring-2 hover:ring-blue-500 rounded-full transition-all cursor-pointer">
									<div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style="background-color: {theme.tertiary}; color: white">MR</div>
									<div class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2" style="background-color: {theme.muted}; border-color: {theme.background}"></div>
								</button>
							</div>
						</div>
						<!-- Stacked avatars -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Stacked Avatars</div>
							<button onclick={() => handleColorClick(theme.accent, 'Stacked avatars')} class="flex items-center hover:ring-2 hover:ring-blue-500 rounded-full transition-all cursor-pointer p-1 -m-1">
								<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2" style="background-color: {theme.accent}; color: {theme.accentText}; border-color: {theme.background}">JD</div>
								<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 -ml-3" style="background-color: {theme.secondary}; color: white; border-color: {theme.background}">AK</div>
								<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 -ml-3" style="background-color: {theme.tertiary}; color: white; border-color: {theme.background}">MR</div>
								<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 -ml-3" style="background-color: {theme.surface}; color: {theme.muted}; border-color: {theme.background}">+5</div>
							</button>
						</div>
						<!-- Profile card -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Profile Card</div>
							<button onclick={() => handleColorClick(theme.surface, 'Profile card')} class="flex items-center gap-4 p-4 rounded-xl hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.surface}">
								<div class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary}); color: white">JD</div>
								<div class="text-left">
									<div class="font-semibold" style="color: {theme.text}">John Doe</div>
									<div class="text-sm" style="color: {theme.muted}">Product Designer</div>
									<div class="flex gap-2 mt-2">
										<span class="px-2 py-0.5 rounded text-xs" style="background-color: {hexToRgba(theme.accent, 0.15)}; color: {theme.accent}">Design</span>
										<span class="px-2 py-0.5 rounded text-xs" style="background-color: {hexToRgba(theme.secondary, 0.15)}; color: {theme.secondary}">UX</span>
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'progress'}
				<!-- Progress & Steps -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Progress & Steps
					</button>
					<div class="flex-1 flex flex-col gap-8">
						<!-- Progress bars -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Progress Bars</div>
							<div class="space-y-4">
								<button onclick={() => handleColorClick(theme.accent, 'Progress bar')} class="w-full hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2">
									<div class="flex justify-between text-sm mb-1">
										<span style="color: {theme.text}">Progress</span>
										<span style="color: {theme.accent}">75%</span>
									</div>
									<div class="h-2 rounded-full" style="background-color: {theme.surface}">
										<div class="h-full rounded-full" style="width: 75%; background-color: {theme.accent}"></div>
									</div>
								</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Success progress')} class="w-full hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2">
									<div class="flex justify-between text-sm mb-1">
										<span style="color: {theme.text}">Completed</span>
										<span style="color: {theme.tertiary}">100%</span>
									</div>
									<div class="h-2 rounded-full" style="background-color: {theme.surface}">
										<div class="h-full rounded-full" style="width: 100%; background-color: {theme.tertiary}"></div>
									</div>
								</button>
								<button onclick={() => handleColorClick(theme.accent, 'Gradient progress')} class="w-full hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2">
									<div class="flex justify-between text-sm mb-1">
										<span style="color: {theme.text}">Upload</span>
										<span style="color: {theme.muted}">60%</span>
									</div>
									<div class="h-2 rounded-full" style="background-color: {theme.surface}">
										<div class="h-full rounded-full" style="width: 60%; background: linear-gradient(90deg, {theme.accent}, {theme.secondary})"></div>
									</div>
								</button>
							</div>
						</div>
						<!-- Step indicator -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Step Indicator</div>
							<button onclick={() => handleColorClick(theme.accent, 'Step indicator')} class="flex items-center w-full hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2">
								<div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style="background-color: {theme.accent}; color: {theme.accentText}">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
								</div>
								<div class="flex-1 h-1 mx-2" style="background-color: {theme.accent}"></div>
								<div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style="background-color: {theme.accent}; color: {theme.accentText}">2</div>
								<div class="flex-1 h-1 mx-2" style="background-color: {theme.surface}"></div>
								<div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style="background-color: {theme.surface}; color: {theme.muted}">3</div>
								<div class="flex-1 h-1 mx-2" style="background-color: {theme.surface}"></div>
								<div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style="background-color: {theme.surface}; color: {theme.muted}">4</div>
							</button>
						</div>
						<!-- Circular progress -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Circular Progress</div>
							<div class="flex gap-8">
								<button onclick={() => handleColorClick(theme.accent, 'Circular progress')} class="hover:ring-2 hover:ring-blue-500 rounded-full transition-all cursor-pointer p-2">
									<div class="relative w-20 h-20">
										<svg class="w-20 h-20 -rotate-90">
											<circle cx="40" cy="40" r="36" stroke-width="8" fill="none" style="stroke: {theme.surface}" />
											<circle cx="40" cy="40" r="36" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="56" style="stroke: {theme.accent}" />
										</svg>
										<div class="absolute inset-0 flex items-center justify-center text-lg font-bold" style="color: {theme.text}">75%</div>
									</div>
								</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Circular progress')} class="hover:ring-2 hover:ring-blue-500 rounded-full transition-all cursor-pointer p-2">
									<div class="relative w-20 h-20">
										<svg class="w-20 h-20 -rotate-90">
											<circle cx="40" cy="40" r="36" stroke-width="8" fill="none" style="stroke: {theme.surface}" />
											<circle cx="40" cy="40" r="36" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="113" style="stroke: {theme.secondary}" />
										</svg>
										<div class="absolute inset-0 flex items-center justify-center text-lg font-bold" style="color: {theme.text}">50%</div>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'quotes'}
				<!-- Quotes & Testimonials -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Quotes & Testimonials
					</button>
					<div class="flex-1 grid grid-cols-2 gap-6">
						<!-- Large quote -->
						<button onclick={() => handleColorClick(theme.accent, 'Quote accent')} class="rounded-2xl p-8 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left col-span-2" style="background-color: {theme.surface}">
							<svg class="w-10 h-10 mb-4" style="color: {theme.accent}" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
							<p class="text-xl leading-relaxed mb-6" style="color: {theme.text}">This product has completely transformed how we work. The attention to detail is remarkable.</p>
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style="background: linear-gradient(135deg, {theme.accent}, {theme.secondary}); color: white">SM</div>
								<div>
									<div class="font-semibold" style="color: {theme.text}">Sarah Miller</div>
									<div class="text-sm" style="color: {theme.muted}">CEO at TechCorp</div>
								</div>
							</div>
						</button>
						<!-- Bordered quote -->
						<button onclick={() => handleColorClick(theme.secondary, 'Quote border')} class="rounded-xl p-6 border-l-4 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.secondary, 0.05)}; border-color: {theme.secondary}">
							<p class="text-lg mb-4" style="color: {theme.text}">"The best investment we've made this year. Highly recommended."</p>
							<div class="text-sm font-medium" style="color: {theme.secondary}">— Alex Chen, Designer</div>
						</button>
						<!-- Simple quote -->
						<button onclick={() => handleColorClick(theme.tertiary, 'Quote simple')} class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left" style="background-color: {hexToRgba(theme.tertiary, 0.1)}">
							<div class="flex gap-1 mb-3">
								{#each [1,2,3,4,5] as _}
									<svg class="w-4 h-4" style="color: {theme.tertiary}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
								{/each}
							</div>
							<p class="text-lg mb-4" style="color: {theme.text}">"Five stars! Absolutely love it."</p>
							<div class="text-sm" style="color: {theme.muted}">Mike R. - Verified Buyer</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'dividers'}
				<!-- Dividers & Separators -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Dividers & Separators
					</button>
					<div class="flex-1 flex flex-col gap-8">
						<!-- Simple line -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Simple Line</div>
							<button onclick={() => handleColorClick(theme.border, 'Divider')} class="w-full h-px hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background-color: {theme.border}"></button>
						</div>
						<!-- With text -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">With Text</div>
							<button onclick={() => handleColorClick(theme.border, 'Divider with text')} class="flex items-center gap-4 hover:ring-2 hover:ring-blue-500 rounded-lg transition-all cursor-pointer p-2 -m-2 w-full">
								<div class="flex-1 h-px" style="background-color: {theme.border}"></div>
								<span class="text-sm" style="color: {theme.muted}">OR</span>
								<div class="flex-1 h-px" style="background-color: {theme.border}"></div>
							</button>
						</div>
						<!-- Gradient line -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Gradient</div>
							<button onclick={() => handleColorClick(theme.accent, 'Gradient divider')} class="w-full h-0.5 rounded hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="background: linear-gradient(90deg, transparent, {theme.accent}, {theme.secondary}, transparent)"></button>
						</div>
						<!-- Dashed -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">Dashed</div>
							<button onclick={() => handleColorClick(theme.border, 'Dashed divider')} class="w-full border-t-2 border-dashed hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer" style="border-color: {theme.border}"></button>
						</div>
						<!-- With icon -->
						<div>
							<div class="text-sm mb-4" style="color: {theme.muted}">With Icon</div>
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
							<div class="text-sm mb-4" style="color: {theme.muted}">Decorative</div>
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

			{:else if slides[selectedSlideIndex].id === 'highlights'}
				<!-- Text Highlights -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Text Highlights
					</button>
					<div class="flex-1 flex flex-col gap-8">
						<!-- Background highlight -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Background Highlight</div>
							<p class="text-xl" style="color: {theme.text}">
								This is regular text with
								<button onclick={() => handleColorClick(theme.accent, 'Highlight bg')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer px-1" style="background-color: {hexToRgba(theme.accent, 0.2)}; color: {theme.accent}">highlighted words</button>
								in the middle.
							</p>
						</div>
						<!-- Underline styles -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Underline Styles</div>
							<div class="flex gap-8 text-xl">
								<button onclick={() => handleColorClick(theme.accent, 'Solid underline')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer px-1 border-b-2" style="color: {theme.text}; border-color: {theme.accent}">Solid line</button>
								<button onclick={() => handleColorClick(theme.secondary, 'Wavy underline')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer px-1" style="color: {theme.text}; text-decoration: underline wavy; text-decoration-color: {theme.secondary}">Wavy line</button>
								<button onclick={() => handleColorClick(theme.tertiary, 'Dotted underline')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer px-1 border-b-2 border-dotted" style="color: {theme.text}; border-color: {theme.tertiary}">Dotted line</button>
							</div>
						</div>
						<!-- Gradient text -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Gradient Text</div>
							<button onclick={() => handleColorClick(theme.accent, 'Gradient text')} class="text-3xl font-bold hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer px-1 bg-clip-text text-transparent" style="background-image: linear-gradient(135deg, {theme.accent}, {theme.secondary}, {theme.tertiary})">Beautiful Gradient Text</button>
						</div>
						<!-- Marker style -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Marker / Strikethrough</div>
							<p class="text-xl" style="color: {theme.text}">
								<button onclick={() => handleColorClick(theme.accent, 'Marker highlight')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer relative inline-block px-1">
									<span class="relative z-10">Important text</span>
									<span class="absolute bottom-1 left-0 right-0 h-3 -z-0" style="background-color: {hexToRgba(theme.accent, 0.3)}"></span>
								</button>
								and
								<button onclick={() => handleColorClick(theme.muted, 'Strikethrough')} class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer px-1 line-through" style="color: {theme.muted}">deleted text</button>
							</p>
						</div>
						<!-- Inline code -->
						<div>
							<div class="text-sm mb-3" style="color: {theme.muted}">Inline Code / Kbd</div>
							<p class="text-xl" style="color: {theme.text}">
								Press
								<button onclick={() => handleColorClick(theme.surface, 'Kbd style')} class="hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer px-2 py-0.5 rounded text-sm font-mono border" style="background-color: {theme.surface}; color: {theme.text}; border-color: {theme.border}">⌘</button>
								+
								<button onclick={() => handleColorClick(theme.surface, 'Kbd style')} class="hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer px-2 py-0.5 rounded text-sm font-mono border" style="background-color: {theme.surface}; color: {theme.text}; border-color: {theme.border}">K</button>
								or use
								<button onclick={() => handleColorClick(theme.accent, 'Code style')} class="hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer px-2 py-0.5 rounded text-sm font-mono" style="background-color: {hexToRgba(theme.accent, 0.15)}; color: {theme.accent}">npm install</button>
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<!-- Right Sidebar - Theme Colors -->
	<aside class="w-60 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
		<div class="h-10 px-3 flex items-center border-b border-zinc-800">
			<span class="text-xs font-medium text-zinc-400">Theme Colors</span>
		</div>
		<div class="flex-1 overflow-y-auto p-3 space-y-2">
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
