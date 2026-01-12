<script lang="ts">
	import { getContrastColor, copyToClipboard } from '$lib/utils';

	// Theme colors
	let theme = $state({
		background: '#18181b',
		text: '#fafafa',
		muted: '#a1a1aa',
		accent: '#3b82f6',
		accentText: '#ffffff',
		border: '#3f3f46',
		surface: '#27272a'
	});

	// Slide state
	let selectedSlideIndex = $state(0);
	let copiedColor = $state<string | null>(null);
	let copiedLabel = $state<string>('');
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Slide definitions
	const slides = [
		{ id: 'title', name: 'Title Slide' },
		{ id: 'content', name: 'Content' },
		{ id: 'two-column', name: 'Two Column' },
		{ id: 'boxes', name: 'Boxes' },
		{ id: 'flow', name: 'Flow Diagram' }
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
	<!-- Slide Thumbnails Sidebar -->
	<aside class="w-48 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
		<div class="h-10 px-3 flex items-center border-b border-zinc-800">
			<span class="text-xs font-medium text-zinc-400">Slides</span>
		</div>
		<div class="flex-1 overflow-y-auto p-2 space-y-2">
			{#each slides as slide, index}
				<button
					onclick={() => (selectedSlideIndex = index)}
					class="w-full aspect-[16/10] rounded-lg border-2 transition-all overflow-hidden {selectedSlideIndex === index ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-700 hover:border-zinc-600'}"
				>
					<!-- Mini slide preview -->
					<div class="w-full h-full p-2" style="background-color: {theme.background}">
						{#if slide.id === 'title'}
							<div class="h-full flex flex-col items-center justify-center">
								<div class="w-3/4 h-2 rounded" style="background-color: {theme.text}"></div>
								<div class="w-1/2 h-1 rounded mt-1" style="background-color: {theme.muted}"></div>
							</div>
						{:else if slide.id === 'content'}
							<div class="h-full flex flex-col">
								<div class="w-2/3 h-1.5 rounded mb-2" style="background-color: {theme.text}"></div>
								<div class="space-y-1">
									<div class="w-full h-1 rounded" style="background-color: {theme.muted}"></div>
									<div class="w-5/6 h-1 rounded" style="background-color: {theme.muted}"></div>
									<div class="w-4/6 h-1 rounded" style="background-color: {theme.muted}"></div>
								</div>
							</div>
						{:else if slide.id === 'two-column'}
							<div class="h-full flex flex-col">
								<div class="w-1/2 h-1.5 rounded mb-2" style="background-color: {theme.text}"></div>
								<div class="flex-1 flex gap-1">
									<div class="flex-1 rounded" style="background-color: {theme.surface}"></div>
									<div class="flex-1 rounded" style="background-color: {theme.surface}"></div>
								</div>
							</div>
						{:else if slide.id === 'boxes'}
							<div class="h-full flex flex-col">
								<div class="w-1/2 h-1.5 rounded mb-2" style="background-color: {theme.text}"></div>
								<div class="flex-1 grid grid-cols-3 gap-1">
									<div class="rounded" style="background-color: {theme.accent}"></div>
									<div class="rounded" style="background-color: {theme.accent}"></div>
									<div class="rounded" style="background-color: {theme.accent}"></div>
								</div>
							</div>
						{:else if slide.id === 'flow'}
							<div class="h-full flex flex-col">
								<div class="w-1/2 h-1.5 rounded mb-2" style="background-color: {theme.text}"></div>
								<div class="flex-1 flex items-center justify-center gap-1">
									<div class="w-4 h-4 rounded" style="background-color: {theme.accent}"></div>
									<div class="w-2 h-0.5" style="background-color: {theme.muted}"></div>
									<div class="w-4 h-4 rounded" style="background-color: {theme.accent}"></div>
									<div class="w-2 h-0.5" style="background-color: {theme.muted}"></div>
									<div class="w-4 h-4 rounded" style="background-color: {theme.accent}"></div>
								</div>
							</div>
						{/if}
					</div>
				</button>
				<div class="text-[10px] text-zinc-500 text-center -mt-1">{slide.name}</div>
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

			{:else if slides[selectedSlideIndex].id === 'two-column'}
				<!-- Two Column Slide -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Two Column Layout
					</button>
					<div class="flex-1 grid grid-cols-2 gap-6">
						<button
							onclick={() => handleColorClick(theme.surface, 'Surface/Card')}
							class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left"
							style="background-color: {theme.surface}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.text}">Left Column</div>
							<div class="text-sm" style="color: {theme.muted}">Content for the left side of the slide with supporting information.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.surface, 'Surface/Card')}
							class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer text-left"
							style="background-color: {theme.surface}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.text}">Right Column</div>
							<div class="text-sm" style="color: {theme.muted}">Content for the right side of the slide with additional details.</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'boxes'}
				<!-- Boxes Slide -->
				<div class="w-full h-full flex flex-col p-12">
					<button
						onclick={() => handleColorClick(theme.text, 'Heading')}
						class="text-3xl font-bold mb-8 hover:ring-2 hover:ring-blue-500 hover:ring-offset-4 rounded px-2 py-1 transition-all cursor-pointer self-start"
						style="color: {theme.text}; --tw-ring-offset-color: {theme.background}"
					>
						Feature Highlights
					</button>
					<div class="flex-1 grid grid-cols-3 gap-6">
						<button
							onclick={() => handleColorClick(theme.accent, 'Accent/Primary')}
							class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col"
							style="background-color: {theme.accent}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.accentText}">Feature One</div>
							<div class="text-sm opacity-90" style="color: {theme.accentText}">Description of the first feature.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.accent, 'Accent/Primary')}
							class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col"
							style="background-color: {theme.accent}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.accentText}">Feature Two</div>
							<div class="text-sm opacity-90" style="color: {theme.accentText}">Description of the second feature.</div>
						</button>
						<button
							onclick={() => handleColorClick(theme.accent, 'Accent/Primary')}
							class="rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex flex-col"
							style="background-color: {theme.accent}"
						>
							<div class="text-lg font-semibold mb-2" style="color: {theme.accentText}">Feature Three</div>
							<div class="text-sm opacity-90" style="color: {theme.accentText}">Description of the third feature.</div>
						</button>
					</div>
				</div>

			{:else if slides[selectedSlideIndex].id === 'flow'}
				<!-- Flow Diagram Slide -->
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
								onclick={() => handleColorClick(theme.accent, 'Accent/Primary')}
								class="w-32 h-32 rounded-xl flex flex-col items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
								style="background-color: {theme.accent}"
							>
								<div class="text-2xl font-bold" style="color: {theme.accentText}">1</div>
								<div class="text-sm mt-1" style="color: {theme.accentText}">Start</div>
							</button>

							<!-- Arrow -->
							<button
								onclick={() => handleColorClick(theme.muted, 'Muted/Arrow')}
								class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer p-2"
							>
								<svg class="w-8 h-8" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</button>

							<!-- Step 2 -->
							<button
								onclick={() => handleColorClick(theme.accent, 'Accent/Primary')}
								class="w-32 h-32 rounded-xl flex flex-col items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
								style="background-color: {theme.accent}"
							>
								<div class="text-2xl font-bold" style="color: {theme.accentText}">2</div>
								<div class="text-sm mt-1" style="color: {theme.accentText}">Process</div>
							</button>

							<!-- Arrow -->
							<button
								onclick={() => handleColorClick(theme.muted, 'Muted/Arrow')}
								class="hover:ring-2 hover:ring-blue-500 rounded transition-all cursor-pointer p-2"
							>
								<svg class="w-8 h-8" style="color: {theme.muted}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</button>

							<!-- Step 3 -->
							<button
								onclick={() => handleColorClick(theme.accent, 'Accent/Primary')}
								class="w-32 h-32 rounded-xl flex flex-col items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
								style="background-color: {theme.accent}"
							>
								<div class="text-2xl font-bold" style="color: {theme.accentText}">3</div>
								<div class="text-sm mt-1" style="color: {theme.accentText}">Done</div>
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
