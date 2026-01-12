export type ColorShade = {
	shade: string;
	hex: string;
};

export type ColorGroup = {
	name: string;
	colors: ColorShade[];
};

export type ShadeLabel = {
	shade: string;
	hint?: string;
};

export type Palette = {
	name: string;
	groups: ColorGroup[];
	shadeLabels: ShadeLabel[];
};

export const tailwindPalette: Palette = {
	name: 'Tailwind',
	shadeLabels: [
		{ shade: '50', hint: 'bg' },
		{ shade: '100', hint: 'bg' },
		{ shade: '200', hint: 'border' },
		{ shade: '300', hint: 'border' },
		{ shade: '400', hint: 'muted' },
		{ shade: '500', hint: 'default' },
		{ shade: '600', hint: 'accent' },
		{ shade: '700', hint: 'accent' },
		{ shade: '800', hint: 'text' },
		{ shade: '900', hint: 'text' },
		{ shade: '950', hint: 'text' }
	],
	groups: [
		{
			name: 'Slate',
			colors: [
				{ shade: '50', hex: '#f8fafc' },
				{ shade: '100', hex: '#f1f5f9' },
				{ shade: '200', hex: '#e2e8f0' },
				{ shade: '300', hex: '#cbd5e1' },
				{ shade: '400', hex: '#94a3b8' },
				{ shade: '500', hex: '#64748b' },
				{ shade: '600', hex: '#475569' },
				{ shade: '700', hex: '#334155' },
				{ shade: '800', hex: '#1e293b' },
				{ shade: '900', hex: '#0f172a' },
				{ shade: '950', hex: '#020617' }
			]
		},
		{
			name: 'Gray',
			colors: [
				{ shade: '50', hex: '#f9fafb' },
				{ shade: '100', hex: '#f3f4f6' },
				{ shade: '200', hex: '#e5e7eb' },
				{ shade: '300', hex: '#d1d5db' },
				{ shade: '400', hex: '#9ca3af' },
				{ shade: '500', hex: '#6b7280' },
				{ shade: '600', hex: '#4b5563' },
				{ shade: '700', hex: '#374151' },
				{ shade: '800', hex: '#1f2937' },
				{ shade: '900', hex: '#111827' },
				{ shade: '950', hex: '#030712' }
			]
		},
		{
			name: 'Zinc',
			colors: [
				{ shade: '50', hex: '#fafafa' },
				{ shade: '100', hex: '#f4f4f5' },
				{ shade: '200', hex: '#e4e4e7' },
				{ shade: '300', hex: '#d4d4d8' },
				{ shade: '400', hex: '#a1a1aa' },
				{ shade: '500', hex: '#71717a' },
				{ shade: '600', hex: '#52525b' },
				{ shade: '700', hex: '#3f3f46' },
				{ shade: '800', hex: '#27272a' },
				{ shade: '900', hex: '#18181b' },
				{ shade: '950', hex: '#09090b' }
			]
		},
		{
			name: 'Neutral',
			colors: [
				{ shade: '50', hex: '#fafafa' },
				{ shade: '100', hex: '#f5f5f5' },
				{ shade: '200', hex: '#e5e5e5' },
				{ shade: '300', hex: '#d4d4d4' },
				{ shade: '400', hex: '#a3a3a3' },
				{ shade: '500', hex: '#737373' },
				{ shade: '600', hex: '#525252' },
				{ shade: '700', hex: '#404040' },
				{ shade: '800', hex: '#262626' },
				{ shade: '900', hex: '#171717' },
				{ shade: '950', hex: '#0a0a0a' }
			]
		},
		{
			name: 'Stone',
			colors: [
				{ shade: '50', hex: '#fafaf9' },
				{ shade: '100', hex: '#f5f5f4' },
				{ shade: '200', hex: '#e7e5e4' },
				{ shade: '300', hex: '#d6d3d1' },
				{ shade: '400', hex: '#a8a29e' },
				{ shade: '500', hex: '#78716c' },
				{ shade: '600', hex: '#57534e' },
				{ shade: '700', hex: '#44403c' },
				{ shade: '800', hex: '#292524' },
				{ shade: '900', hex: '#1c1917' },
				{ shade: '950', hex: '#0c0a09' }
			]
		},
		{
			name: 'Red',
			colors: [
				{ shade: '50', hex: '#fef2f2' },
				{ shade: '100', hex: '#fee2e2' },
				{ shade: '200', hex: '#fecaca' },
				{ shade: '300', hex: '#fca5a5' },
				{ shade: '400', hex: '#f87171' },
				{ shade: '500', hex: '#ef4444' },
				{ shade: '600', hex: '#dc2626' },
				{ shade: '700', hex: '#b91c1c' },
				{ shade: '800', hex: '#991b1b' },
				{ shade: '900', hex: '#7f1d1d' },
				{ shade: '950', hex: '#450a0a' }
			]
		},
		{
			name: 'Orange',
			colors: [
				{ shade: '50', hex: '#fff7ed' },
				{ shade: '100', hex: '#ffedd5' },
				{ shade: '200', hex: '#fed7aa' },
				{ shade: '300', hex: '#fdba74' },
				{ shade: '400', hex: '#fb923c' },
				{ shade: '500', hex: '#f97316' },
				{ shade: '600', hex: '#ea580c' },
				{ shade: '700', hex: '#c2410c' },
				{ shade: '800', hex: '#9a3412' },
				{ shade: '900', hex: '#7c2d12' },
				{ shade: '950', hex: '#431407' }
			]
		},
		{
			name: 'Amber',
			colors: [
				{ shade: '50', hex: '#fffbeb' },
				{ shade: '100', hex: '#fef3c7' },
				{ shade: '200', hex: '#fde68a' },
				{ shade: '300', hex: '#fcd34d' },
				{ shade: '400', hex: '#fbbf24' },
				{ shade: '500', hex: '#f59e0b' },
				{ shade: '600', hex: '#d97706' },
				{ shade: '700', hex: '#b45309' },
				{ shade: '800', hex: '#92400e' },
				{ shade: '900', hex: '#78350f' },
				{ shade: '950', hex: '#451a03' }
			]
		},
		{
			name: 'Yellow',
			colors: [
				{ shade: '50', hex: '#fefce8' },
				{ shade: '100', hex: '#fef9c3' },
				{ shade: '200', hex: '#fef08a' },
				{ shade: '300', hex: '#fde047' },
				{ shade: '400', hex: '#facc15' },
				{ shade: '500', hex: '#eab308' },
				{ shade: '600', hex: '#ca8a04' },
				{ shade: '700', hex: '#a16207' },
				{ shade: '800', hex: '#854d0e' },
				{ shade: '900', hex: '#713f12' },
				{ shade: '950', hex: '#422006' }
			]
		},
		{
			name: 'Lime',
			colors: [
				{ shade: '50', hex: '#f7fee7' },
				{ shade: '100', hex: '#ecfccb' },
				{ shade: '200', hex: '#d9f99d' },
				{ shade: '300', hex: '#bef264' },
				{ shade: '400', hex: '#a3e635' },
				{ shade: '500', hex: '#84cc16' },
				{ shade: '600', hex: '#65a30d' },
				{ shade: '700', hex: '#4d7c0f' },
				{ shade: '800', hex: '#3f6212' },
				{ shade: '900', hex: '#365314' },
				{ shade: '950', hex: '#1a2e05' }
			]
		},
		{
			name: 'Green',
			colors: [
				{ shade: '50', hex: '#f0fdf4' },
				{ shade: '100', hex: '#dcfce7' },
				{ shade: '200', hex: '#bbf7d0' },
				{ shade: '300', hex: '#86efac' },
				{ shade: '400', hex: '#4ade80' },
				{ shade: '500', hex: '#22c55e' },
				{ shade: '600', hex: '#16a34a' },
				{ shade: '700', hex: '#15803d' },
				{ shade: '800', hex: '#166534' },
				{ shade: '900', hex: '#14532d' },
				{ shade: '950', hex: '#052e16' }
			]
		},
		{
			name: 'Emerald',
			colors: [
				{ shade: '50', hex: '#ecfdf5' },
				{ shade: '100', hex: '#d1fae5' },
				{ shade: '200', hex: '#a7f3d0' },
				{ shade: '300', hex: '#6ee7b7' },
				{ shade: '400', hex: '#34d399' },
				{ shade: '500', hex: '#10b981' },
				{ shade: '600', hex: '#059669' },
				{ shade: '700', hex: '#047857' },
				{ shade: '800', hex: '#065f46' },
				{ shade: '900', hex: '#064e3b' },
				{ shade: '950', hex: '#022c22' }
			]
		},
		{
			name: 'Teal',
			colors: [
				{ shade: '50', hex: '#f0fdfa' },
				{ shade: '100', hex: '#ccfbf1' },
				{ shade: '200', hex: '#99f6e4' },
				{ shade: '300', hex: '#5eead4' },
				{ shade: '400', hex: '#2dd4bf' },
				{ shade: '500', hex: '#14b8a6' },
				{ shade: '600', hex: '#0d9488' },
				{ shade: '700', hex: '#0f766e' },
				{ shade: '800', hex: '#115e59' },
				{ shade: '900', hex: '#134e4a' },
				{ shade: '950', hex: '#042f2e' }
			]
		},
		{
			name: 'Cyan',
			colors: [
				{ shade: '50', hex: '#ecfeff' },
				{ shade: '100', hex: '#cffafe' },
				{ shade: '200', hex: '#a5f3fc' },
				{ shade: '300', hex: '#67e8f9' },
				{ shade: '400', hex: '#22d3ee' },
				{ shade: '500', hex: '#06b6d4' },
				{ shade: '600', hex: '#0891b2' },
				{ shade: '700', hex: '#0e7490' },
				{ shade: '800', hex: '#155e75' },
				{ shade: '900', hex: '#164e63' },
				{ shade: '950', hex: '#083344' }
			]
		},
		{
			name: 'Sky',
			colors: [
				{ shade: '50', hex: '#f0f9ff' },
				{ shade: '100', hex: '#e0f2fe' },
				{ shade: '200', hex: '#bae6fd' },
				{ shade: '300', hex: '#7dd3fc' },
				{ shade: '400', hex: '#38bdf8' },
				{ shade: '500', hex: '#0ea5e9' },
				{ shade: '600', hex: '#0284c7' },
				{ shade: '700', hex: '#0369a1' },
				{ shade: '800', hex: '#075985' },
				{ shade: '900', hex: '#0c4a6e' },
				{ shade: '950', hex: '#082f49' }
			]
		},
		{
			name: 'Blue',
			colors: [
				{ shade: '50', hex: '#eff6ff' },
				{ shade: '100', hex: '#dbeafe' },
				{ shade: '200', hex: '#bfdbfe' },
				{ shade: '300', hex: '#93c5fd' },
				{ shade: '400', hex: '#60a5fa' },
				{ shade: '500', hex: '#3b82f6' },
				{ shade: '600', hex: '#2563eb' },
				{ shade: '700', hex: '#1d4ed8' },
				{ shade: '800', hex: '#1e40af' },
				{ shade: '900', hex: '#1e3a8a' },
				{ shade: '950', hex: '#172554' }
			]
		},
		{
			name: 'Indigo',
			colors: [
				{ shade: '50', hex: '#eef2ff' },
				{ shade: '100', hex: '#e0e7ff' },
				{ shade: '200', hex: '#c7d2fe' },
				{ shade: '300', hex: '#a5b4fc' },
				{ shade: '400', hex: '#818cf8' },
				{ shade: '500', hex: '#6366f1' },
				{ shade: '600', hex: '#4f46e5' },
				{ shade: '700', hex: '#4338ca' },
				{ shade: '800', hex: '#3730a3' },
				{ shade: '900', hex: '#312e81' },
				{ shade: '950', hex: '#1e1b4b' }
			]
		},
		{
			name: 'Violet',
			colors: [
				{ shade: '50', hex: '#f5f3ff' },
				{ shade: '100', hex: '#ede9fe' },
				{ shade: '200', hex: '#ddd6fe' },
				{ shade: '300', hex: '#c4b5fd' },
				{ shade: '400', hex: '#a78bfa' },
				{ shade: '500', hex: '#8b5cf6' },
				{ shade: '600', hex: '#7c3aed' },
				{ shade: '700', hex: '#6d28d9' },
				{ shade: '800', hex: '#5b21b6' },
				{ shade: '900', hex: '#4c1d95' },
				{ shade: '950', hex: '#2e1065' }
			]
		},
		{
			name: 'Purple',
			colors: [
				{ shade: '50', hex: '#faf5ff' },
				{ shade: '100', hex: '#f3e8ff' },
				{ shade: '200', hex: '#e9d5ff' },
				{ shade: '300', hex: '#d8b4fe' },
				{ shade: '400', hex: '#c084fc' },
				{ shade: '500', hex: '#a855f7' },
				{ shade: '600', hex: '#9333ea' },
				{ shade: '700', hex: '#7e22ce' },
				{ shade: '800', hex: '#6b21a8' },
				{ shade: '900', hex: '#581c87' },
				{ shade: '950', hex: '#3b0764' }
			]
		},
		{
			name: 'Fuchsia',
			colors: [
				{ shade: '50', hex: '#fdf4ff' },
				{ shade: '100', hex: '#fae8ff' },
				{ shade: '200', hex: '#f5d0fe' },
				{ shade: '300', hex: '#f0abfc' },
				{ shade: '400', hex: '#e879f9' },
				{ shade: '500', hex: '#d946ef' },
				{ shade: '600', hex: '#c026d3' },
				{ shade: '700', hex: '#a21caf' },
				{ shade: '800', hex: '#86198f' },
				{ shade: '900', hex: '#701a75' },
				{ shade: '950', hex: '#4a044e' }
			]
		},
		{
			name: 'Pink',
			colors: [
				{ shade: '50', hex: '#fdf2f8' },
				{ shade: '100', hex: '#fce7f3' },
				{ shade: '200', hex: '#fbcfe8' },
				{ shade: '300', hex: '#f9a8d4' },
				{ shade: '400', hex: '#f472b6' },
				{ shade: '500', hex: '#ec4899' },
				{ shade: '600', hex: '#db2777' },
				{ shade: '700', hex: '#be185d' },
				{ shade: '800', hex: '#9d174d' },
				{ shade: '900', hex: '#831843' },
				{ shade: '950', hex: '#500724' }
			]
		},
		{
			name: 'Rose',
			colors: [
				{ shade: '50', hex: '#fff1f2' },
				{ shade: '100', hex: '#ffe4e6' },
				{ shade: '200', hex: '#fecdd3' },
				{ shade: '300', hex: '#fda4af' },
				{ shade: '400', hex: '#fb7185' },
				{ shade: '500', hex: '#f43f5e' },
				{ shade: '600', hex: '#e11d48' },
				{ shade: '700', hex: '#be123c' },
				{ shade: '800', hex: '#9f1239' },
				{ shade: '900', hex: '#881337' },
				{ shade: '950', hex: '#4c0519' }
			]
		}
	]
};

export const radixPalette: Palette = {
	name: 'Radix',
	shadeLabels: [
		{ shade: '1', hint: 'bg' },
		{ shade: '2', hint: 'bg' },
		{ shade: '3', hint: 'ui' },
		{ shade: '4', hint: 'ui' },
		{ shade: '5', hint: 'ui' },
		{ shade: '6', hint: 'border' },
		{ shade: '7', hint: 'border' },
		{ shade: '8', hint: 'border' },
		{ shade: '9', hint: 'solid' },
		{ shade: '10', hint: 'solid' },
		{ shade: '11', hint: 'text' },
		{ shade: '12', hint: 'text' }
	],
	groups: [
		{
			name: 'Gray',
			colors: [
				{ shade: '1', hex: '#fcfcfc' },
				{ shade: '2', hex: '#f9f9f9' },
				{ shade: '3', hex: '#f0f0f0' },
				{ shade: '4', hex: '#e8e8e8' },
				{ shade: '5', hex: '#e0e0e0' },
				{ shade: '6', hex: '#d9d9d9' },
				{ shade: '7', hex: '#cecece' },
				{ shade: '8', hex: '#bbbbbb' },
				{ shade: '9', hex: '#8d8d8d' },
				{ shade: '10', hex: '#838383' },
				{ shade: '11', hex: '#646464' },
				{ shade: '12', hex: '#202020' }
			]
		},
		{
			name: 'Mauve',
			colors: [
				{ shade: '1', hex: '#fdfcfd' },
				{ shade: '2', hex: '#faf9fb' },
				{ shade: '3', hex: '#f2eff3' },
				{ shade: '4', hex: '#eae7ec' },
				{ shade: '5', hex: '#e3dfe6' },
				{ shade: '6', hex: '#dbd8e0' },
				{ shade: '7', hex: '#d0cdd7' },
				{ shade: '8', hex: '#bcbac7' },
				{ shade: '9', hex: '#8e8c99' },
				{ shade: '10', hex: '#84828e' },
				{ shade: '11', hex: '#65636d' },
				{ shade: '12', hex: '#211f26' }
			]
		},
		{
			name: 'Slate',
			colors: [
				{ shade: '1', hex: '#fcfcfd' },
				{ shade: '2', hex: '#f9f9fb' },
				{ shade: '3', hex: '#f0f0f3' },
				{ shade: '4', hex: '#e8e8ec' },
				{ shade: '5', hex: '#e0e1e6' },
				{ shade: '6', hex: '#d9d9e0' },
				{ shade: '7', hex: '#cdced6' },
				{ shade: '8', hex: '#b9bbc6' },
				{ shade: '9', hex: '#8b8d98' },
				{ shade: '10', hex: '#80838d' },
				{ shade: '11', hex: '#60646c' },
				{ shade: '12', hex: '#1c2024' }
			]
		},
		{
			name: 'Sage',
			colors: [
				{ shade: '1', hex: '#fbfdfc' },
				{ shade: '2', hex: '#f7f9f8' },
				{ shade: '3', hex: '#eef1f0' },
				{ shade: '4', hex: '#e6e9e8' },
				{ shade: '5', hex: '#dfe2e0' },
				{ shade: '6', hex: '#d7dad9' },
				{ shade: '7', hex: '#cbcfcd' },
				{ shade: '8', hex: '#b8bcba' },
				{ shade: '9', hex: '#868e8b' },
				{ shade: '10', hex: '#7c8480' },
				{ shade: '11', hex: '#5f6563' },
				{ shade: '12', hex: '#1a211e' }
			]
		},
		{
			name: 'Olive',
			colors: [
				{ shade: '1', hex: '#fcfdfc' },
				{ shade: '2', hex: '#f8faf8' },
				{ shade: '3', hex: '#eff1ef' },
				{ shade: '4', hex: '#e7e9e7' },
				{ shade: '5', hex: '#dfe2df' },
				{ shade: '6', hex: '#d7dad7' },
				{ shade: '7', hex: '#cccfcc' },
				{ shade: '8', hex: '#b9bcb8' },
				{ shade: '9', hex: '#898e87' },
				{ shade: '10', hex: '#7f847d' },
				{ shade: '11', hex: '#60655f' },
				{ shade: '12', hex: '#1d211c' }
			]
		},
		{
			name: 'Sand',
			colors: [
				{ shade: '1', hex: '#fdfdfc' },
				{ shade: '2', hex: '#f9f9f8' },
				{ shade: '3', hex: '#f1f0ef' },
				{ shade: '4', hex: '#e9e8e6' },
				{ shade: '5', hex: '#e2e1de' },
				{ shade: '6', hex: '#dad9d6' },
				{ shade: '7', hex: '#cfceca' },
				{ shade: '8', hex: '#bcbbb5' },
				{ shade: '9', hex: '#8d8d86' },
				{ shade: '10', hex: '#82827c' },
				{ shade: '11', hex: '#63635e' },
				{ shade: '12', hex: '#21201c' }
			]
		},
		{
			name: 'Tomato',
			colors: [
				{ shade: '1', hex: '#fffcfc' },
				{ shade: '2', hex: '#fff8f7' },
				{ shade: '3', hex: '#feebe7' },
				{ shade: '4', hex: '#ffdcd3' },
				{ shade: '5', hex: '#ffcdc2' },
				{ shade: '6', hex: '#fdbdaf' },
				{ shade: '7', hex: '#f5a898' },
				{ shade: '8', hex: '#ec8e7b' },
				{ shade: '9', hex: '#e54d2e' },
				{ shade: '10', hex: '#dd4425' },
				{ shade: '11', hex: '#d13415' },
				{ shade: '12', hex: '#5c271f' }
			]
		},
		{
			name: 'Red',
			colors: [
				{ shade: '1', hex: '#fffcfc' },
				{ shade: '2', hex: '#fff7f7' },
				{ shade: '3', hex: '#feebec' },
				{ shade: '4', hex: '#ffdbdc' },
				{ shade: '5', hex: '#ffcdce' },
				{ shade: '6', hex: '#fdbdbe' },
				{ shade: '7', hex: '#f4a9aa' },
				{ shade: '8', hex: '#eb8e90' },
				{ shade: '9', hex: '#e5484d' },
				{ shade: '10', hex: '#dc3e42' },
				{ shade: '11', hex: '#ce2c31' },
				{ shade: '12', hex: '#641723' }
			]
		},
		{
			name: 'Ruby',
			colors: [
				{ shade: '1', hex: '#fffcfd' },
				{ shade: '2', hex: '#fff7f8' },
				{ shade: '3', hex: '#feeaed' },
				{ shade: '4', hex: '#ffdce1' },
				{ shade: '5', hex: '#ffced6' },
				{ shade: '6', hex: '#f8bfc8' },
				{ shade: '7', hex: '#efacb8' },
				{ shade: '8', hex: '#e592a3' },
				{ shade: '9', hex: '#e54666' },
				{ shade: '10', hex: '#dc3b5d' },
				{ shade: '11', hex: '#ca244d' },
				{ shade: '12', hex: '#64172b' }
			]
		},
		{
			name: 'Crimson',
			colors: [
				{ shade: '1', hex: '#fffcfd' },
				{ shade: '2', hex: '#fef7f9' },
				{ shade: '3', hex: '#ffe9f0' },
				{ shade: '4', hex: '#fedce7' },
				{ shade: '5', hex: '#facedd' },
				{ shade: '6', hex: '#f3bed1' },
				{ shade: '7', hex: '#eaacc3' },
				{ shade: '8', hex: '#e093b2' },
				{ shade: '9', hex: '#e93d82' },
				{ shade: '10', hex: '#df3478' },
				{ shade: '11', hex: '#cb1d63' },
				{ shade: '12', hex: '#621639' }
			]
		},
		{
			name: 'Pink',
			colors: [
				{ shade: '1', hex: '#fffcfe' },
				{ shade: '2', hex: '#fef7fb' },
				{ shade: '3', hex: '#fee9f5' },
				{ shade: '4', hex: '#fbdcef' },
				{ shade: '5', hex: '#f6cee7' },
				{ shade: '6', hex: '#efbfdd' },
				{ shade: '7', hex: '#e7acd0' },
				{ shade: '8', hex: '#dd93c2' },
				{ shade: '9', hex: '#d6409f' },
				{ shade: '10', hex: '#cf3897' },
				{ shade: '11', hex: '#c2298a' },
				{ shade: '12', hex: '#651249' }
			]
		},
		{
			name: 'Plum',
			colors: [
				{ shade: '1', hex: '#fefcff' },
				{ shade: '2', hex: '#fdf7fd' },
				{ shade: '3', hex: '#fbebfb' },
				{ shade: '4', hex: '#f7def8' },
				{ shade: '5', hex: '#f2d1f3' },
				{ shade: '6', hex: '#e9c2ec' },
				{ shade: '7', hex: '#deafe3' },
				{ shade: '8', hex: '#cf91d8' },
				{ shade: '9', hex: '#ab4aba' },
				{ shade: '10', hex: '#a144af' },
				{ shade: '11', hex: '#953ea3' },
				{ shade: '12', hex: '#53195d' }
			]
		},
		{
			name: 'Purple',
			colors: [
				{ shade: '1', hex: '#fefcfe' },
				{ shade: '2', hex: '#fbf7fe' },
				{ shade: '3', hex: '#f7edfe' },
				{ shade: '4', hex: '#f2e2fc' },
				{ shade: '5', hex: '#ead5f9' },
				{ shade: '6', hex: '#e0c4f4' },
				{ shade: '7', hex: '#d1afec' },
				{ shade: '8', hex: '#be93e4' },
				{ shade: '9', hex: '#8e4ec6' },
				{ shade: '10', hex: '#8347b9' },
				{ shade: '11', hex: '#8145b5' },
				{ shade: '12', hex: '#402060' }
			]
		},
		{
			name: 'Violet',
			colors: [
				{ shade: '1', hex: '#fdfcfe' },
				{ shade: '2', hex: '#faf8ff' },
				{ shade: '3', hex: '#f4f0fe' },
				{ shade: '4', hex: '#ebe4ff' },
				{ shade: '5', hex: '#e1d9ff' },
				{ shade: '6', hex: '#d4cafe' },
				{ shade: '7', hex: '#c2b5f5' },
				{ shade: '8', hex: '#aa99ec' },
				{ shade: '9', hex: '#6e56cf' },
				{ shade: '10', hex: '#654dc4' },
				{ shade: '11', hex: '#6550b9' },
				{ shade: '12', hex: '#2f265f' }
			]
		},
		{
			name: 'Iris',
			colors: [
				{ shade: '1', hex: '#fdfdff' },
				{ shade: '2', hex: '#f8f8ff' },
				{ shade: '3', hex: '#f0f1fe' },
				{ shade: '4', hex: '#e6e7ff' },
				{ shade: '5', hex: '#dadcff' },
				{ shade: '6', hex: '#cbcdff' },
				{ shade: '7', hex: '#b8baf8' },
				{ shade: '8', hex: '#9b9ef0' },
				{ shade: '9', hex: '#5b5bd6' },
				{ shade: '10', hex: '#5151cd' },
				{ shade: '11', hex: '#5753c6' },
				{ shade: '12', hex: '#272962' }
			]
		},
		{
			name: 'Indigo',
			colors: [
				{ shade: '1', hex: '#fdfdfe' },
				{ shade: '2', hex: '#f7f9ff' },
				{ shade: '3', hex: '#edf2fe' },
				{ shade: '4', hex: '#e1e9ff' },
				{ shade: '5', hex: '#d2deff' },
				{ shade: '6', hex: '#c1d0ff' },
				{ shade: '7', hex: '#abbdf9' },
				{ shade: '8', hex: '#8da4ef' },
				{ shade: '9', hex: '#3e63dd' },
				{ shade: '10', hex: '#3358d4' },
				{ shade: '11', hex: '#3a5bc7' },
				{ shade: '12', hex: '#1f2d5c' }
			]
		},
		{
			name: 'Blue',
			colors: [
				{ shade: '1', hex: '#fbfdff' },
				{ shade: '2', hex: '#f4faff' },
				{ shade: '3', hex: '#e6f4fe' },
				{ shade: '4', hex: '#d5efff' },
				{ shade: '5', hex: '#c2e5ff' },
				{ shade: '6', hex: '#acd8fc' },
				{ shade: '7', hex: '#8ec8f6' },
				{ shade: '8', hex: '#5eb1ef' },
				{ shade: '9', hex: '#0090ff' },
				{ shade: '10', hex: '#0588f0' },
				{ shade: '11', hex: '#0d74ce' },
				{ shade: '12', hex: '#113264' }
			]
		},
		{
			name: 'Cyan',
			colors: [
				{ shade: '1', hex: '#fafdfe' },
				{ shade: '2', hex: '#f2fafb' },
				{ shade: '3', hex: '#def7f9' },
				{ shade: '4', hex: '#caf1f6' },
				{ shade: '5', hex: '#b5e9f0' },
				{ shade: '6', hex: '#9ddde7' },
				{ shade: '7', hex: '#7dcedc' },
				{ shade: '8', hex: '#3db9cf' },
				{ shade: '9', hex: '#00a2c7' },
				{ shade: '10', hex: '#0797b9' },
				{ shade: '11', hex: '#107d98' },
				{ shade: '12', hex: '#0d3c48' }
			]
		},
		{
			name: 'Teal',
			colors: [
				{ shade: '1', hex: '#fafefd' },
				{ shade: '2', hex: '#f3fbf9' },
				{ shade: '3', hex: '#e0f8f3' },
				{ shade: '4', hex: '#ccf3ea' },
				{ shade: '5', hex: '#b8eae0' },
				{ shade: '6', hex: '#a1ded2' },
				{ shade: '7', hex: '#83cdc1' },
				{ shade: '8', hex: '#53b9ab' },
				{ shade: '9', hex: '#12a594' },
				{ shade: '10', hex: '#0d9b8a' },
				{ shade: '11', hex: '#008573' },
				{ shade: '12', hex: '#0d3d38' }
			]
		},
		{
			name: 'Jade',
			colors: [
				{ shade: '1', hex: '#fbfefd' },
				{ shade: '2', hex: '#f4fbf7' },
				{ shade: '3', hex: '#e6f7ed' },
				{ shade: '4', hex: '#d6f1e3' },
				{ shade: '5', hex: '#c3e9d7' },
				{ shade: '6', hex: '#acdec8' },
				{ shade: '7', hex: '#8bceb6' },
				{ shade: '8', hex: '#56ba9f' },
				{ shade: '9', hex: '#29a383' },
				{ shade: '10', hex: '#26997b' },
				{ shade: '11', hex: '#208368' },
				{ shade: '12', hex: '#1d3b31' }
			]
		},
		{
			name: 'Green',
			colors: [
				{ shade: '1', hex: '#fbfefc' },
				{ shade: '2', hex: '#f4fbf6' },
				{ shade: '3', hex: '#e6f6eb' },
				{ shade: '4', hex: '#d6f1df' },
				{ shade: '5', hex: '#c4e8d1' },
				{ shade: '6', hex: '#adddc0' },
				{ shade: '7', hex: '#8eceaa' },
				{ shade: '8', hex: '#5bb98b' },
				{ shade: '9', hex: '#30a46c' },
				{ shade: '10', hex: '#2b9a66' },
				{ shade: '11', hex: '#218358' },
				{ shade: '12', hex: '#193b2d' }
			]
		},
		{
			name: 'Grass',
			colors: [
				{ shade: '1', hex: '#fbfefb' },
				{ shade: '2', hex: '#f5fbf5' },
				{ shade: '3', hex: '#e9f6e9' },
				{ shade: '4', hex: '#daf1db' },
				{ shade: '5', hex: '#c9e8ca' },
				{ shade: '6', hex: '#b2ddb5' },
				{ shade: '7', hex: '#94ce9a' },
				{ shade: '8', hex: '#65ba74' },
				{ shade: '9', hex: '#46a758' },
				{ shade: '10', hex: '#3e9b4f' },
				{ shade: '11', hex: '#2a7e3b' },
				{ shade: '12', hex: '#203c25' }
			]
		},
		{
			name: 'Orange',
			colors: [
				{ shade: '1', hex: '#fefcfb' },
				{ shade: '2', hex: '#fff7ed' },
				{ shade: '3', hex: '#ffefd6' },
				{ shade: '4', hex: '#ffdfb5' },
				{ shade: '5', hex: '#ffd19a' },
				{ shade: '6', hex: '#ffc182' },
				{ shade: '7', hex: '#f5ae73' },
				{ shade: '8', hex: '#ec9455' },
				{ shade: '9', hex: '#f76b15' },
				{ shade: '10', hex: '#ef5f00' },
				{ shade: '11', hex: '#cc4e00' },
				{ shade: '12', hex: '#582d1d' }
			]
		},
		{
			name: 'Amber',
			colors: [
				{ shade: '1', hex: '#fefdfb' },
				{ shade: '2', hex: '#fefbe9' },
				{ shade: '3', hex: '#fff7c2' },
				{ shade: '4', hex: '#ffee9c' },
				{ shade: '5', hex: '#fbe577' },
				{ shade: '6', hex: '#f3d673' },
				{ shade: '7', hex: '#e9c162' },
				{ shade: '8', hex: '#e2a336' },
				{ shade: '9', hex: '#ffc53d' },
				{ shade: '10', hex: '#ffba18' },
				{ shade: '11', hex: '#ab6400' },
				{ shade: '12', hex: '#4f3422' }
			]
		},
		{
			name: 'Yellow',
			colors: [
				{ shade: '1', hex: '#fdfdf9' },
				{ shade: '2', hex: '#fefce9' },
				{ shade: '3', hex: '#fffab8' },
				{ shade: '4', hex: '#fff394' },
				{ shade: '5', hex: '#ffe770' },
				{ shade: '6', hex: '#f3d768' },
				{ shade: '7', hex: '#e4c767' },
				{ shade: '8', hex: '#d5ae39' },
				{ shade: '9', hex: '#ffe629' },
				{ shade: '10', hex: '#ffdc00' },
				{ shade: '11', hex: '#9e6c00' },
				{ shade: '12', hex: '#473b1f' }
			]
		},
		{
			name: 'Lime',
			colors: [
				{ shade: '1', hex: '#fcfdfa' },
				{ shade: '2', hex: '#f8faf3' },
				{ shade: '3', hex: '#eef6d6' },
				{ shade: '4', hex: '#e2f0bd' },
				{ shade: '5', hex: '#d3e7a6' },
				{ shade: '6', hex: '#c2da91' },
				{ shade: '7', hex: '#abc978' },
				{ shade: '8', hex: '#8db654' },
				{ shade: '9', hex: '#bdee63' },
				{ shade: '10', hex: '#b0e64c' },
				{ shade: '11', hex: '#5c7c2f' },
				{ shade: '12', hex: '#37401c' }
			]
		},
		{
			name: 'Mint',
			colors: [
				{ shade: '1', hex: '#f9fefd' },
				{ shade: '2', hex: '#f2fbf9' },
				{ shade: '3', hex: '#ddf9f2' },
				{ shade: '4', hex: '#c8f4e9' },
				{ shade: '5', hex: '#b3ecde' },
				{ shade: '6', hex: '#9ce0d0' },
				{ shade: '7', hex: '#7ecfbd' },
				{ shade: '8', hex: '#4cbba5' },
				{ shade: '9', hex: '#86ead4' },
				{ shade: '10', hex: '#7de0cb' },
				{ shade: '11', hex: '#027864' },
				{ shade: '12', hex: '#16433c' }
			]
		},
		{
			name: 'Sky',
			colors: [
				{ shade: '1', hex: '#f9feff' },
				{ shade: '2', hex: '#f1fafd' },
				{ shade: '3', hex: '#e1f6fd' },
				{ shade: '4', hex: '#d1f0fa' },
				{ shade: '5', hex: '#bee7f5' },
				{ shade: '6', hex: '#a9daed' },
				{ shade: '7', hex: '#8dcae3' },
				{ shade: '8', hex: '#60b3d7' },
				{ shade: '9', hex: '#7ce2fe' },
				{ shade: '10', hex: '#74daf8' },
				{ shade: '11', hex: '#00749e' },
				{ shade: '12', hex: '#1d3e56' }
			]
		},
		{
			name: 'Gold',
			colors: [
				{ shade: '1', hex: '#fdfdfc' },
				{ shade: '2', hex: '#faf9f2' },
				{ shade: '3', hex: '#f2f0e7' },
				{ shade: '4', hex: '#eae6db' },
				{ shade: '5', hex: '#e1dccf' },
				{ shade: '6', hex: '#d8d0bf' },
				{ shade: '7', hex: '#cbc0aa' },
				{ shade: '8', hex: '#b9a88d' },
				{ shade: '9', hex: '#978365' },
				{ shade: '10', hex: '#8c795d' },
				{ shade: '11', hex: '#71624b' },
				{ shade: '12', hex: '#3b352b' }
			]
		},
		{
			name: 'Bronze',
			colors: [
				{ shade: '1', hex: '#fdfcfc' },
				{ shade: '2', hex: '#fdf7f5' },
				{ shade: '3', hex: '#f6edea' },
				{ shade: '4', hex: '#efe4df' },
				{ shade: '5', hex: '#e7d9d3' },
				{ shade: '6', hex: '#dfcdc5' },
				{ shade: '7', hex: '#d3beb3' },
				{ shade: '8', hex: '#c2a797' },
				{ shade: '9', hex: '#a18072' },
				{ shade: '10', hex: '#957468' },
				{ shade: '11', hex: '#7d5e54' },
				{ shade: '12', hex: '#43302b' }
			]
		},
		{
			name: 'Brown',
			colors: [
				{ shade: '1', hex: '#fefdfc' },
				{ shade: '2', hex: '#fcf9f6' },
				{ shade: '3', hex: '#f6eee7' },
				{ shade: '4', hex: '#f0e4d9' },
				{ shade: '5', hex: '#ebdaca' },
				{ shade: '6', hex: '#e4cdb7' },
				{ shade: '7', hex: '#dcbc9f' },
				{ shade: '8', hex: '#cea37e' },
				{ shade: '9', hex: '#ad7f58' },
				{ shade: '10', hex: '#a07553' },
				{ shade: '11', hex: '#815e46' },
				{ shade: '12', hex: '#3e332e' }
			]
		}
	]
};

export const materialPalette: Palette = {
	name: 'Material',
	shadeLabels: [
		{ shade: '50', hint: 'bg' },
		{ shade: '100', hint: 'bg' },
		{ shade: '200', hint: 'light' },
		{ shade: '300', hint: 'light' },
		{ shade: '400', hint: 'accent' },
		{ shade: '500', hint: 'primary' },
		{ shade: '600', hint: 'primary' },
		{ shade: '700', hint: 'dark' },
		{ shade: '800', hint: 'dark' },
		{ shade: '900', hint: 'text' }
	],
	groups: [
		{
			name: 'Red',
			colors: [
				{ shade: '50', hex: '#ffebee' },
				{ shade: '100', hex: '#ffcdd2' },
				{ shade: '200', hex: '#ef9a9a' },
				{ shade: '300', hex: '#e57373' },
				{ shade: '400', hex: '#ef5350' },
				{ shade: '500', hex: '#f44336' },
				{ shade: '600', hex: '#e53935' },
				{ shade: '700', hex: '#d32f2f' },
				{ shade: '800', hex: '#c62828' },
				{ shade: '900', hex: '#b71c1c' }
			]
		},
		{
			name: 'Pink',
			colors: [
				{ shade: '50', hex: '#fce4ec' },
				{ shade: '100', hex: '#f8bbd9' },
				{ shade: '200', hex: '#f48fb1' },
				{ shade: '300', hex: '#f06292' },
				{ shade: '400', hex: '#ec407a' },
				{ shade: '500', hex: '#e91e63' },
				{ shade: '600', hex: '#d81b60' },
				{ shade: '700', hex: '#c2185b' },
				{ shade: '800', hex: '#ad1457' },
				{ shade: '900', hex: '#880e4f' }
			]
		},
		{
			name: 'Purple',
			colors: [
				{ shade: '50', hex: '#f3e5f5' },
				{ shade: '100', hex: '#e1bee7' },
				{ shade: '200', hex: '#ce93d8' },
				{ shade: '300', hex: '#ba68c8' },
				{ shade: '400', hex: '#ab47bc' },
				{ shade: '500', hex: '#9c27b0' },
				{ shade: '600', hex: '#8e24aa' },
				{ shade: '700', hex: '#7b1fa2' },
				{ shade: '800', hex: '#6a1b9a' },
				{ shade: '900', hex: '#4a148c' }
			]
		},
		{
			name: 'Deep Purple',
			colors: [
				{ shade: '50', hex: '#ede7f6' },
				{ shade: '100', hex: '#d1c4e9' },
				{ shade: '200', hex: '#b39ddb' },
				{ shade: '300', hex: '#9575cd' },
				{ shade: '400', hex: '#7e57c2' },
				{ shade: '500', hex: '#673ab7' },
				{ shade: '600', hex: '#5e35b1' },
				{ shade: '700', hex: '#512da8' },
				{ shade: '800', hex: '#4527a0' },
				{ shade: '900', hex: '#311b92' }
			]
		},
		{
			name: 'Indigo',
			colors: [
				{ shade: '50', hex: '#e8eaf6' },
				{ shade: '100', hex: '#c5cae9' },
				{ shade: '200', hex: '#9fa8da' },
				{ shade: '300', hex: '#7986cb' },
				{ shade: '400', hex: '#5c6bc0' },
				{ shade: '500', hex: '#3f51b5' },
				{ shade: '600', hex: '#3949ab' },
				{ shade: '700', hex: '#303f9f' },
				{ shade: '800', hex: '#283593' },
				{ shade: '900', hex: '#1a237e' }
			]
		},
		{
			name: 'Blue',
			colors: [
				{ shade: '50', hex: '#e3f2fd' },
				{ shade: '100', hex: '#bbdefb' },
				{ shade: '200', hex: '#90caf9' },
				{ shade: '300', hex: '#64b5f6' },
				{ shade: '400', hex: '#42a5f5' },
				{ shade: '500', hex: '#2196f3' },
				{ shade: '600', hex: '#1e88e5' },
				{ shade: '700', hex: '#1976d2' },
				{ shade: '800', hex: '#1565c0' },
				{ shade: '900', hex: '#0d47a1' }
			]
		},
		{
			name: 'Light Blue',
			colors: [
				{ shade: '50', hex: '#e1f5fe' },
				{ shade: '100', hex: '#b3e5fc' },
				{ shade: '200', hex: '#81d4fa' },
				{ shade: '300', hex: '#4fc3f7' },
				{ shade: '400', hex: '#29b6f6' },
				{ shade: '500', hex: '#03a9f4' },
				{ shade: '600', hex: '#039be5' },
				{ shade: '700', hex: '#0288d1' },
				{ shade: '800', hex: '#0277bd' },
				{ shade: '900', hex: '#01579b' }
			]
		},
		{
			name: 'Cyan',
			colors: [
				{ shade: '50', hex: '#e0f7fa' },
				{ shade: '100', hex: '#b2ebf2' },
				{ shade: '200', hex: '#80deea' },
				{ shade: '300', hex: '#4dd0e1' },
				{ shade: '400', hex: '#26c6da' },
				{ shade: '500', hex: '#00bcd4' },
				{ shade: '600', hex: '#00acc1' },
				{ shade: '700', hex: '#0097a7' },
				{ shade: '800', hex: '#00838f' },
				{ shade: '900', hex: '#006064' }
			]
		},
		{
			name: 'Teal',
			colors: [
				{ shade: '50', hex: '#e0f2f1' },
				{ shade: '100', hex: '#b2dfdb' },
				{ shade: '200', hex: '#80cbc4' },
				{ shade: '300', hex: '#4db6ac' },
				{ shade: '400', hex: '#26a69a' },
				{ shade: '500', hex: '#009688' },
				{ shade: '600', hex: '#00897b' },
				{ shade: '700', hex: '#00796b' },
				{ shade: '800', hex: '#00695c' },
				{ shade: '900', hex: '#004d40' }
			]
		},
		{
			name: 'Green',
			colors: [
				{ shade: '50', hex: '#e8f5e9' },
				{ shade: '100', hex: '#c8e6c9' },
				{ shade: '200', hex: '#a5d6a7' },
				{ shade: '300', hex: '#81c784' },
				{ shade: '400', hex: '#66bb6a' },
				{ shade: '500', hex: '#4caf50' },
				{ shade: '600', hex: '#43a047' },
				{ shade: '700', hex: '#388e3c' },
				{ shade: '800', hex: '#2e7d32' },
				{ shade: '900', hex: '#1b5e20' }
			]
		},
		{
			name: 'Light Green',
			colors: [
				{ shade: '50', hex: '#f1f8e9' },
				{ shade: '100', hex: '#dcedc8' },
				{ shade: '200', hex: '#c5e1a5' },
				{ shade: '300', hex: '#aed581' },
				{ shade: '400', hex: '#9ccc65' },
				{ shade: '500', hex: '#8bc34a' },
				{ shade: '600', hex: '#7cb342' },
				{ shade: '700', hex: '#689f38' },
				{ shade: '800', hex: '#558b2f' },
				{ shade: '900', hex: '#33691e' }
			]
		},
		{
			name: 'Lime',
			colors: [
				{ shade: '50', hex: '#f9fbe7' },
				{ shade: '100', hex: '#f0f4c3' },
				{ shade: '200', hex: '#e6ee9c' },
				{ shade: '300', hex: '#dce775' },
				{ shade: '400', hex: '#d4e157' },
				{ shade: '500', hex: '#cddc39' },
				{ shade: '600', hex: '#c0ca33' },
				{ shade: '700', hex: '#afb42b' },
				{ shade: '800', hex: '#9e9d24' },
				{ shade: '900', hex: '#827717' }
			]
		},
		{
			name: 'Yellow',
			colors: [
				{ shade: '50', hex: '#fffde7' },
				{ shade: '100', hex: '#fff9c4' },
				{ shade: '200', hex: '#fff59d' },
				{ shade: '300', hex: '#fff176' },
				{ shade: '400', hex: '#ffee58' },
				{ shade: '500', hex: '#ffeb3b' },
				{ shade: '600', hex: '#fdd835' },
				{ shade: '700', hex: '#fbc02d' },
				{ shade: '800', hex: '#f9a825' },
				{ shade: '900', hex: '#f57f17' }
			]
		},
		{
			name: 'Amber',
			colors: [
				{ shade: '50', hex: '#fff8e1' },
				{ shade: '100', hex: '#ffecb3' },
				{ shade: '200', hex: '#ffe082' },
				{ shade: '300', hex: '#ffd54f' },
				{ shade: '400', hex: '#ffca28' },
				{ shade: '500', hex: '#ffc107' },
				{ shade: '600', hex: '#ffb300' },
				{ shade: '700', hex: '#ffa000' },
				{ shade: '800', hex: '#ff8f00' },
				{ shade: '900', hex: '#ff6f00' }
			]
		},
		{
			name: 'Orange',
			colors: [
				{ shade: '50', hex: '#fff3e0' },
				{ shade: '100', hex: '#ffe0b2' },
				{ shade: '200', hex: '#ffcc80' },
				{ shade: '300', hex: '#ffb74d' },
				{ shade: '400', hex: '#ffa726' },
				{ shade: '500', hex: '#ff9800' },
				{ shade: '600', hex: '#fb8c00' },
				{ shade: '700', hex: '#f57c00' },
				{ shade: '800', hex: '#ef6c00' },
				{ shade: '900', hex: '#e65100' }
			]
		},
		{
			name: 'Deep Orange',
			colors: [
				{ shade: '50', hex: '#fbe9e7' },
				{ shade: '100', hex: '#ffccbc' },
				{ shade: '200', hex: '#ffab91' },
				{ shade: '300', hex: '#ff8a65' },
				{ shade: '400', hex: '#ff7043' },
				{ shade: '500', hex: '#ff5722' },
				{ shade: '600', hex: '#f4511e' },
				{ shade: '700', hex: '#e64a19' },
				{ shade: '800', hex: '#d84315' },
				{ shade: '900', hex: '#bf360c' }
			]
		},
		{
			name: 'Brown',
			colors: [
				{ shade: '50', hex: '#efebe9' },
				{ shade: '100', hex: '#d7ccc8' },
				{ shade: '200', hex: '#bcaaa4' },
				{ shade: '300', hex: '#a1887f' },
				{ shade: '400', hex: '#8d6e63' },
				{ shade: '500', hex: '#795548' },
				{ shade: '600', hex: '#6d4c41' },
				{ shade: '700', hex: '#5d4037' },
				{ shade: '800', hex: '#4e342e' },
				{ shade: '900', hex: '#3e2723' }
			]
		},
		{
			name: 'Gray',
			colors: [
				{ shade: '50', hex: '#fafafa' },
				{ shade: '100', hex: '#f5f5f5' },
				{ shade: '200', hex: '#eeeeee' },
				{ shade: '300', hex: '#e0e0e0' },
				{ shade: '400', hex: '#bdbdbd' },
				{ shade: '500', hex: '#9e9e9e' },
				{ shade: '600', hex: '#757575' },
				{ shade: '700', hex: '#616161' },
				{ shade: '800', hex: '#424242' },
				{ shade: '900', hex: '#212121' }
			]
		},
		{
			name: 'Blue Gray',
			colors: [
				{ shade: '50', hex: '#eceff1' },
				{ shade: '100', hex: '#cfd8dc' },
				{ shade: '200', hex: '#b0bec5' },
				{ shade: '300', hex: '#90a4ae' },
				{ shade: '400', hex: '#78909c' },
				{ shade: '500', hex: '#607d8b' },
				{ shade: '600', hex: '#546e7a' },
				{ shade: '700', hex: '#455a64' },
				{ shade: '800', hex: '#37474f' },
				{ shade: '900', hex: '#263238' }
			]
		}
	]
};

export const openColorPalette: Palette = {
	name: 'Open Color',
	shadeLabels: [
		{ shade: '0', hint: 'bg' },
		{ shade: '1', hint: 'bg' },
		{ shade: '2', hint: 'light' },
		{ shade: '3', hint: 'light' },
		{ shade: '4', hint: 'accent' },
		{ shade: '5', hint: 'accent' },
		{ shade: '6', hint: 'primary' },
		{ shade: '7', hint: 'primary' },
		{ shade: '8', hint: 'dark' },
		{ shade: '9', hint: 'text' }
	],
	groups: [
		{
			name: 'Gray',
			colors: [
				{ shade: '0', hex: '#f8f9fa' },
				{ shade: '1', hex: '#f1f3f5' },
				{ shade: '2', hex: '#e9ecef' },
				{ shade: '3', hex: '#dee2e6' },
				{ shade: '4', hex: '#ced4da' },
				{ shade: '5', hex: '#adb5bd' },
				{ shade: '6', hex: '#868e96' },
				{ shade: '7', hex: '#495057' },
				{ shade: '8', hex: '#343a40' },
				{ shade: '9', hex: '#212529' }
			]
		},
		{
			name: 'Red',
			colors: [
				{ shade: '0', hex: '#fff5f5' },
				{ shade: '1', hex: '#ffe3e3' },
				{ shade: '2', hex: '#ffc9c9' },
				{ shade: '3', hex: '#ffa8a8' },
				{ shade: '4', hex: '#ff8787' },
				{ shade: '5', hex: '#ff6b6b' },
				{ shade: '6', hex: '#fa5252' },
				{ shade: '7', hex: '#f03e3e' },
				{ shade: '8', hex: '#e03131' },
				{ shade: '9', hex: '#c92a2a' }
			]
		},
		{
			name: 'Pink',
			colors: [
				{ shade: '0', hex: '#fff0f6' },
				{ shade: '1', hex: '#ffdeeb' },
				{ shade: '2', hex: '#fcc2d7' },
				{ shade: '3', hex: '#faa2c1' },
				{ shade: '4', hex: '#f783ac' },
				{ shade: '5', hex: '#f06595' },
				{ shade: '6', hex: '#e64980' },
				{ shade: '7', hex: '#d6336c' },
				{ shade: '8', hex: '#c2255c' },
				{ shade: '9', hex: '#a61e4d' }
			]
		},
		{
			name: 'Grape',
			colors: [
				{ shade: '0', hex: '#f8f0fc' },
				{ shade: '1', hex: '#f3d9fa' },
				{ shade: '2', hex: '#eebefa' },
				{ shade: '3', hex: '#e599f7' },
				{ shade: '4', hex: '#da77f2' },
				{ shade: '5', hex: '#cc5de8' },
				{ shade: '6', hex: '#be4bdb' },
				{ shade: '7', hex: '#ae3ec9' },
				{ shade: '8', hex: '#9c36b5' },
				{ shade: '9', hex: '#862e9c' }
			]
		},
		{
			name: 'Violet',
			colors: [
				{ shade: '0', hex: '#f3f0ff' },
				{ shade: '1', hex: '#e5dbff' },
				{ shade: '2', hex: '#d0bfff' },
				{ shade: '3', hex: '#b197fc' },
				{ shade: '4', hex: '#9775fa' },
				{ shade: '5', hex: '#845ef7' },
				{ shade: '6', hex: '#7950f2' },
				{ shade: '7', hex: '#7048e8' },
				{ shade: '8', hex: '#6741d9' },
				{ shade: '9', hex: '#5f3dc4' }
			]
		},
		{
			name: 'Indigo',
			colors: [
				{ shade: '0', hex: '#edf2ff' },
				{ shade: '1', hex: '#dbe4ff' },
				{ shade: '2', hex: '#bac8ff' },
				{ shade: '3', hex: '#91a7ff' },
				{ shade: '4', hex: '#748ffc' },
				{ shade: '5', hex: '#5c7cfa' },
				{ shade: '6', hex: '#4c6ef5' },
				{ shade: '7', hex: '#4263eb' },
				{ shade: '8', hex: '#3b5bdb' },
				{ shade: '9', hex: '#364fc7' }
			]
		},
		{
			name: 'Blue',
			colors: [
				{ shade: '0', hex: '#e7f5ff' },
				{ shade: '1', hex: '#d0ebff' },
				{ shade: '2', hex: '#a5d8ff' },
				{ shade: '3', hex: '#74c0fc' },
				{ shade: '4', hex: '#4dabf7' },
				{ shade: '5', hex: '#339af0' },
				{ shade: '6', hex: '#228be6' },
				{ shade: '7', hex: '#1c7ed6' },
				{ shade: '8', hex: '#1971c2' },
				{ shade: '9', hex: '#1864ab' }
			]
		},
		{
			name: 'Cyan',
			colors: [
				{ shade: '0', hex: '#e3fafc' },
				{ shade: '1', hex: '#c5f6fa' },
				{ shade: '2', hex: '#99e9f2' },
				{ shade: '3', hex: '#66d9e8' },
				{ shade: '4', hex: '#3bc9db' },
				{ shade: '5', hex: '#22b8cf' },
				{ shade: '6', hex: '#15aabf' },
				{ shade: '7', hex: '#1098ad' },
				{ shade: '8', hex: '#0c8599' },
				{ shade: '9', hex: '#0b7285' }
			]
		},
		{
			name: 'Teal',
			colors: [
				{ shade: '0', hex: '#e6fcf5' },
				{ shade: '1', hex: '#c3fae8' },
				{ shade: '2', hex: '#96f2d7' },
				{ shade: '3', hex: '#63e6be' },
				{ shade: '4', hex: '#38d9a9' },
				{ shade: '5', hex: '#20c997' },
				{ shade: '6', hex: '#12b886' },
				{ shade: '7', hex: '#0ca678' },
				{ shade: '8', hex: '#099268' },
				{ shade: '9', hex: '#087f5b' }
			]
		},
		{
			name: 'Green',
			colors: [
				{ shade: '0', hex: '#ebfbee' },
				{ shade: '1', hex: '#d3f9d8' },
				{ shade: '2', hex: '#b2f2bb' },
				{ shade: '3', hex: '#8ce99a' },
				{ shade: '4', hex: '#69db7c' },
				{ shade: '5', hex: '#51cf66' },
				{ shade: '6', hex: '#40c057' },
				{ shade: '7', hex: '#37b24d' },
				{ shade: '8', hex: '#2f9e44' },
				{ shade: '9', hex: '#2b8a3e' }
			]
		},
		{
			name: 'Lime',
			colors: [
				{ shade: '0', hex: '#f4fce3' },
				{ shade: '1', hex: '#e9fac8' },
				{ shade: '2', hex: '#d8f5a2' },
				{ shade: '3', hex: '#c0eb75' },
				{ shade: '4', hex: '#a9e34b' },
				{ shade: '5', hex: '#94d82d' },
				{ shade: '6', hex: '#82c91e' },
				{ shade: '7', hex: '#74b816' },
				{ shade: '8', hex: '#66a80f' },
				{ shade: '9', hex: '#5c940d' }
			]
		},
		{
			name: 'Yellow',
			colors: [
				{ shade: '0', hex: '#fff9db' },
				{ shade: '1', hex: '#fff3bf' },
				{ shade: '2', hex: '#ffec99' },
				{ shade: '3', hex: '#ffe066' },
				{ shade: '4', hex: '#ffd43b' },
				{ shade: '5', hex: '#fcc419' },
				{ shade: '6', hex: '#fab005' },
				{ shade: '7', hex: '#f59f00' },
				{ shade: '8', hex: '#f08c00' },
				{ shade: '9', hex: '#e67700' }
			]
		},
		{
			name: 'Orange',
			colors: [
				{ shade: '0', hex: '#fff4e6' },
				{ shade: '1', hex: '#ffe8cc' },
				{ shade: '2', hex: '#ffd8a8' },
				{ shade: '3', hex: '#ffc078' },
				{ shade: '4', hex: '#ffa94d' },
				{ shade: '5', hex: '#ff922b' },
				{ shade: '6', hex: '#fd7e14' },
				{ shade: '7', hex: '#f76707' },
				{ shade: '8', hex: '#e8590c' },
				{ shade: '9', hex: '#d9480f' }
			]
		}
	]
};

export const chakraPalette: Palette = {
	name: 'Chakra',
	shadeLabels: [
		{ shade: '50', hint: 'bg' },
		{ shade: '100', hint: 'bg' },
		{ shade: '200', hint: 'border' },
		{ shade: '300', hint: 'border' },
		{ shade: '400', hint: 'muted' },
		{ shade: '500', hint: 'default' },
		{ shade: '600', hint: 'accent' },
		{ shade: '700', hint: 'accent' },
		{ shade: '800', hint: 'text' },
		{ shade: '900', hint: 'text' }
	],
	groups: [
		{
			name: 'Gray',
			colors: [
				{ shade: '50', hex: '#f7fafc' },
				{ shade: '100', hex: '#edf2f7' },
				{ shade: '200', hex: '#e2e8f0' },
				{ shade: '300', hex: '#cbd5e0' },
				{ shade: '400', hex: '#a0aec0' },
				{ shade: '500', hex: '#718096' },
				{ shade: '600', hex: '#4a5568' },
				{ shade: '700', hex: '#2d3748' },
				{ shade: '800', hex: '#1a202c' },
				{ shade: '900', hex: '#171923' }
			]
		},
		{
			name: 'Red',
			colors: [
				{ shade: '50', hex: '#fff5f5' },
				{ shade: '100', hex: '#fed7d7' },
				{ shade: '200', hex: '#feb2b2' },
				{ shade: '300', hex: '#fc8181' },
				{ shade: '400', hex: '#f56565' },
				{ shade: '500', hex: '#e53e3e' },
				{ shade: '600', hex: '#c53030' },
				{ shade: '700', hex: '#9b2c2c' },
				{ shade: '800', hex: '#822727' },
				{ shade: '900', hex: '#63171b' }
			]
		},
		{
			name: 'Orange',
			colors: [
				{ shade: '50', hex: '#fffaf0' },
				{ shade: '100', hex: '#feebc8' },
				{ shade: '200', hex: '#fbd38d' },
				{ shade: '300', hex: '#f6ad55' },
				{ shade: '400', hex: '#ed8936' },
				{ shade: '500', hex: '#dd6b20' },
				{ shade: '600', hex: '#c05621' },
				{ shade: '700', hex: '#9c4221' },
				{ shade: '800', hex: '#7b341e' },
				{ shade: '900', hex: '#652b19' }
			]
		},
		{
			name: 'Yellow',
			colors: [
				{ shade: '50', hex: '#fffff0' },
				{ shade: '100', hex: '#fefcbf' },
				{ shade: '200', hex: '#faf089' },
				{ shade: '300', hex: '#f6e05e' },
				{ shade: '400', hex: '#ecc94b' },
				{ shade: '500', hex: '#d69e2e' },
				{ shade: '600', hex: '#b7791f' },
				{ shade: '700', hex: '#975a16' },
				{ shade: '800', hex: '#744210' },
				{ shade: '900', hex: '#5f370e' }
			]
		},
		{
			name: 'Green',
			colors: [
				{ shade: '50', hex: '#f0fff4' },
				{ shade: '100', hex: '#c6f6d5' },
				{ shade: '200', hex: '#9ae6b4' },
				{ shade: '300', hex: '#68d391' },
				{ shade: '400', hex: '#48bb78' },
				{ shade: '500', hex: '#38a169' },
				{ shade: '600', hex: '#2f855a' },
				{ shade: '700', hex: '#276749' },
				{ shade: '800', hex: '#22543d' },
				{ shade: '900', hex: '#1c4532' }
			]
		},
		{
			name: 'Teal',
			colors: [
				{ shade: '50', hex: '#e6fffa' },
				{ shade: '100', hex: '#b2f5ea' },
				{ shade: '200', hex: '#81e6d9' },
				{ shade: '300', hex: '#4fd1c5' },
				{ shade: '400', hex: '#38b2ac' },
				{ shade: '500', hex: '#319795' },
				{ shade: '600', hex: '#2c7a7b' },
				{ shade: '700', hex: '#285e61' },
				{ shade: '800', hex: '#234e52' },
				{ shade: '900', hex: '#1d4044' }
			]
		},
		{
			name: 'Cyan',
			colors: [
				{ shade: '50', hex: '#edfdfd' },
				{ shade: '100', hex: '#c4f1f9' },
				{ shade: '200', hex: '#9decf9' },
				{ shade: '300', hex: '#76e4f7' },
				{ shade: '400', hex: '#0bc5ea' },
				{ shade: '500', hex: '#00b5d8' },
				{ shade: '600', hex: '#00a3c4' },
				{ shade: '700', hex: '#0987a0' },
				{ shade: '800', hex: '#086f83' },
				{ shade: '900', hex: '#065666' }
			]
		},
		{
			name: 'Blue',
			colors: [
				{ shade: '50', hex: '#ebf8ff' },
				{ shade: '100', hex: '#bee3f8' },
				{ shade: '200', hex: '#90cdf4' },
				{ shade: '300', hex: '#63b3ed' },
				{ shade: '400', hex: '#4299e1' },
				{ shade: '500', hex: '#3182ce' },
				{ shade: '600', hex: '#2b6cb0' },
				{ shade: '700', hex: '#2c5282' },
				{ shade: '800', hex: '#2a4365' },
				{ shade: '900', hex: '#1a365d' }
			]
		},
		{
			name: 'Purple',
			colors: [
				{ shade: '50', hex: '#faf5ff' },
				{ shade: '100', hex: '#e9d8fd' },
				{ shade: '200', hex: '#d6bcfa' },
				{ shade: '300', hex: '#b794f4' },
				{ shade: '400', hex: '#9f7aea' },
				{ shade: '500', hex: '#805ad5' },
				{ shade: '600', hex: '#6b46c1' },
				{ shade: '700', hex: '#553c9a' },
				{ shade: '800', hex: '#44337a' },
				{ shade: '900', hex: '#322659' }
			]
		},
		{
			name: 'Pink',
			colors: [
				{ shade: '50', hex: '#fff5f7' },
				{ shade: '100', hex: '#fed7e2' },
				{ shade: '200', hex: '#fbb6ce' },
				{ shade: '300', hex: '#f687b3' },
				{ shade: '400', hex: '#ed64a6' },
				{ shade: '500', hex: '#d53f8c' },
				{ shade: '600', hex: '#b83280' },
				{ shade: '700', hex: '#97266d' },
				{ shade: '800', hex: '#702459' },
				{ shade: '900', hex: '#521b41' }
			]
		}
	]
};

export const antPalette: Palette = {
	name: 'Ant Design',
	shadeLabels: [
		{ shade: '1', hint: 'bg' },
		{ shade: '2', hint: 'bg' },
		{ shade: '3', hint: 'border' },
		{ shade: '4', hint: 'border' },
		{ shade: '5', hint: 'hover' },
		{ shade: '6', hint: 'primary' },
		{ shade: '7', hint: 'active' },
		{ shade: '8', hint: 'dark' },
		{ shade: '9', hint: 'dark' },
		{ shade: '10', hint: 'text' }
	],
	groups: [
		{
			name: 'Red',
			colors: [
				{ shade: '1', hex: '#fff1f0' },
				{ shade: '2', hex: '#ffccc7' },
				{ shade: '3', hex: '#ffa39e' },
				{ shade: '4', hex: '#ff7875' },
				{ shade: '5', hex: '#ff4d4f' },
				{ shade: '6', hex: '#f5222d' },
				{ shade: '7', hex: '#cf1322' },
				{ shade: '8', hex: '#a8071a' },
				{ shade: '9', hex: '#820014' },
				{ shade: '10', hex: '#5c0011' }
			]
		},
		{
			name: 'Volcano',
			colors: [
				{ shade: '1', hex: '#fff2e8' },
				{ shade: '2', hex: '#ffd8bf' },
				{ shade: '3', hex: '#ffbb96' },
				{ shade: '4', hex: '#ff9c6e' },
				{ shade: '5', hex: '#ff7a45' },
				{ shade: '6', hex: '#fa541c' },
				{ shade: '7', hex: '#d4380d' },
				{ shade: '8', hex: '#ad2102' },
				{ shade: '9', hex: '#871400' },
				{ shade: '10', hex: '#610b00' }
			]
		},
		{
			name: 'Orange',
			colors: [
				{ shade: '1', hex: '#fff7e6' },
				{ shade: '2', hex: '#ffe7ba' },
				{ shade: '3', hex: '#ffd591' },
				{ shade: '4', hex: '#ffc069' },
				{ shade: '5', hex: '#ffa940' },
				{ shade: '6', hex: '#fa8c16' },
				{ shade: '7', hex: '#d46b08' },
				{ shade: '8', hex: '#ad4e00' },
				{ shade: '9', hex: '#873800' },
				{ shade: '10', hex: '#612500' }
			]
		},
		{
			name: 'Gold',
			colors: [
				{ shade: '1', hex: '#fffbe6' },
				{ shade: '2', hex: '#fff1b8' },
				{ shade: '3', hex: '#ffe58f' },
				{ shade: '4', hex: '#ffd666' },
				{ shade: '5', hex: '#ffc53d' },
				{ shade: '6', hex: '#faad14' },
				{ shade: '7', hex: '#d48806' },
				{ shade: '8', hex: '#ad6800' },
				{ shade: '9', hex: '#874d00' },
				{ shade: '10', hex: '#613400' }
			]
		},
		{
			name: 'Yellow',
			colors: [
				{ shade: '1', hex: '#feffe6' },
				{ shade: '2', hex: '#ffffb8' },
				{ shade: '3', hex: '#fffb8f' },
				{ shade: '4', hex: '#fff566' },
				{ shade: '5', hex: '#ffec3d' },
				{ shade: '6', hex: '#fadb14' },
				{ shade: '7', hex: '#d4b106' },
				{ shade: '8', hex: '#ad8b00' },
				{ shade: '9', hex: '#876800' },
				{ shade: '10', hex: '#614700' }
			]
		},
		{
			name: 'Lime',
			colors: [
				{ shade: '1', hex: '#fcffe6' },
				{ shade: '2', hex: '#f4ffb8' },
				{ shade: '3', hex: '#eaff8f' },
				{ shade: '4', hex: '#d3f261' },
				{ shade: '5', hex: '#bae637' },
				{ shade: '6', hex: '#a0d911' },
				{ shade: '7', hex: '#7cb305' },
				{ shade: '8', hex: '#5b8c00' },
				{ shade: '9', hex: '#3f6600' },
				{ shade: '10', hex: '#254000' }
			]
		},
		{
			name: 'Green',
			colors: [
				{ shade: '1', hex: '#f6ffed' },
				{ shade: '2', hex: '#d9f7be' },
				{ shade: '3', hex: '#b7eb8f' },
				{ shade: '4', hex: '#95de64' },
				{ shade: '5', hex: '#73d13d' },
				{ shade: '6', hex: '#52c41a' },
				{ shade: '7', hex: '#389e0d' },
				{ shade: '8', hex: '#237804' },
				{ shade: '9', hex: '#135200' },
				{ shade: '10', hex: '#092b00' }
			]
		},
		{
			name: 'Cyan',
			colors: [
				{ shade: '1', hex: '#e6fffb' },
				{ shade: '2', hex: '#b5f5ec' },
				{ shade: '3', hex: '#87e8de' },
				{ shade: '4', hex: '#5cdbd3' },
				{ shade: '5', hex: '#36cfc9' },
				{ shade: '6', hex: '#13c2c2' },
				{ shade: '7', hex: '#08979c' },
				{ shade: '8', hex: '#006d75' },
				{ shade: '9', hex: '#00474f' },
				{ shade: '10', hex: '#002329' }
			]
		},
		{
			name: 'Blue',
			colors: [
				{ shade: '1', hex: '#e6f4ff' },
				{ shade: '2', hex: '#bae0ff' },
				{ shade: '3', hex: '#91caff' },
				{ shade: '4', hex: '#69b1ff' },
				{ shade: '5', hex: '#4096ff' },
				{ shade: '6', hex: '#1677ff' },
				{ shade: '7', hex: '#0958d9' },
				{ shade: '8', hex: '#003eb3' },
				{ shade: '9', hex: '#002c8c' },
				{ shade: '10', hex: '#001d66' }
			]
		},
		{
			name: 'Geek Blue',
			colors: [
				{ shade: '1', hex: '#f0f5ff' },
				{ shade: '2', hex: '#d6e4ff' },
				{ shade: '3', hex: '#adc6ff' },
				{ shade: '4', hex: '#85a5ff' },
				{ shade: '5', hex: '#597ef7' },
				{ shade: '6', hex: '#2f54eb' },
				{ shade: '7', hex: '#1d39c4' },
				{ shade: '8', hex: '#10239e' },
				{ shade: '9', hex: '#061178' },
				{ shade: '10', hex: '#030852' }
			]
		},
		{
			name: 'Purple',
			colors: [
				{ shade: '1', hex: '#f9f0ff' },
				{ shade: '2', hex: '#efdbff' },
				{ shade: '3', hex: '#d3adf7' },
				{ shade: '4', hex: '#b37feb' },
				{ shade: '5', hex: '#9254de' },
				{ shade: '6', hex: '#722ed1' },
				{ shade: '7', hex: '#531dab' },
				{ shade: '8', hex: '#391085' },
				{ shade: '9', hex: '#22075e' },
				{ shade: '10', hex: '#120338' }
			]
		},
		{
			name: 'Magenta',
			colors: [
				{ shade: '1', hex: '#fff0f6' },
				{ shade: '2', hex: '#ffd6e7' },
				{ shade: '3', hex: '#ffadd2' },
				{ shade: '4', hex: '#ff85c0' },
				{ shade: '5', hex: '#f759ab' },
				{ shade: '6', hex: '#eb2f96' },
				{ shade: '7', hex: '#c41d7f' },
				{ shade: '8', hex: '#9e1068' },
				{ shade: '9', hex: '#780650' },
				{ shade: '10', hex: '#520339' }
			]
		},
		{
			name: 'Gray',
			colors: [
				{ shade: '1', hex: '#ffffff' },
				{ shade: '2', hex: '#fafafa' },
				{ shade: '3', hex: '#f5f5f5' },
				{ shade: '4', hex: '#f0f0f0' },
				{ shade: '5', hex: '#d9d9d9' },
				{ shade: '6', hex: '#bfbfbf' },
				{ shade: '7', hex: '#8c8c8c' },
				{ shade: '8', hex: '#595959' },
				{ shade: '9', hex: '#434343' },
				{ shade: '10', hex: '#262626' }
			]
		}
	]
};

export const allPalettes: Palette[] = [
	tailwindPalette,
	radixPalette,
	materialPalette,
	openColorPalette,
	chakraPalette,
	antPalette
];
