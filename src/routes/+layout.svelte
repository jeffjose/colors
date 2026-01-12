<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);
	let isThemeMode = $derived(currentPath.startsWith('/theme'));
</script>

<div class="h-screen w-screen bg-zinc-950 flex overflow-hidden">
	<!-- Left Icon Sidebar -->
	<nav class="w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-2 shrink-0">
		<!-- Mode: Palette -->
		<button
			onclick={() => goto('/')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors {!isThemeMode ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Palette"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
		</button>

		<!-- Mode: Theme Builder -->
		<button
			onclick={() => goto('/theme')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors mt-1 {isThemeMode ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Theme Builder"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
			</svg>
		</button>

		<div class="flex-1"></div>
	</nav>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col min-h-0 min-w-0">
		{@render children()}
	</div>
</div>
