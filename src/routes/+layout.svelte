<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);
	let activeMode = $derived(
		currentPath.startsWith('/theme') ? 'theme' :
		currentPath.startsWith('/icons') ? 'icons' : 'palette'
	);
</script>

<div class="h-screen w-screen bg-zinc-950 flex overflow-hidden">
	<!-- Left Icon Sidebar -->
	<nav class="w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-2 shrink-0">
		<!-- Mode: Palette -->
		<button
			onclick={() => goto('/')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors {activeMode === 'palette' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Palette"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
		</button>

		<!-- Mode: Theme Builder -->
		<button
			onclick={() => goto('/theme')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors mt-1 {activeMode === 'theme' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Theme Builder"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
			</svg>
		</button>

		<!-- Mode: Icon Studio -->
		<button
			onclick={() => goto('/icons')}
			class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors mt-1 {activeMode === 'icons' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}"
			title="Icon Studio"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
			</svg>
		</button>

		<div class="flex-1"></div>
	</nav>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col min-h-0 min-w-0">
		{@render children()}
	</div>
</div>
