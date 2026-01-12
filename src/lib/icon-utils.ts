/**
 * Utility functions for SVG icon manipulation and export
 */

/**
 * Parse and clean SVG content from raw input
 * Handles both full SVG elements and SVG code with extra whitespace
 */
export function parseSvgContent(raw: string): string | null {
	const trimmed = raw.trim();

	// Check if it starts with <svg
	const svgMatch = trimmed.match(/<svg[\s\S]*<\/svg>/i);
	if (svgMatch) {
		return svgMatch[0];
	}

	return null;
}

/**
 * Extract the inner content of an SVG (everything inside <svg>...</svg>)
 */
export function getSvgInnerContent(svg: string): string {
	const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
	return match ? match[1] : '';
}

/**
 * Get SVG attributes as an object
 */
export function getSvgAttributes(svg: string): Record<string, string> {
	const match = svg.match(/<svg([^>]*)>/i);
	if (!match) return {};

	const attrs: Record<string, string> = {};
	const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g;
	let attrMatch;

	while ((attrMatch = attrRegex.exec(match[1])) !== null) {
		attrs[attrMatch[1]] = attrMatch[2];
	}

	return attrs;
}

/**
 * Apply solid color to SVG by modifying fill attributes
 * Replaces currentColor and existing fills with the new color
 */
export function applySolidColor(svg: string, color: string): string {
	let result = svg;

	// Replace fill="currentColor" with the new color
	result = result.replace(/fill=["']currentColor["']/gi, `fill="${color}"`);

	// Replace stroke="currentColor" with the new color
	result = result.replace(/stroke=["']currentColor["']/gi, `stroke="${color}"`);

	// If there's no fill attribute on paths/shapes, we need to set color via style or fill
	// Check if SVG has any fill attributes
	const hasFill = /fill=["'][^"']*["']/i.test(result);

	if (!hasFill) {
		// Add fill to the SVG element itself
		result = result.replace(/<svg([^>]*)>/i, `<svg$1 fill="${color}">`);
	}

	return result;
}

/**
 * Generate a unique ID for gradient definitions
 */
function generateGradientId(): string {
	return 'grad-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Apply gradient to SVG
 */
export function applyGradient(
	svg: string,
	type: 'linear' | 'radial',
	startColor: string,
	endColor: string,
	angle: number = 180
): string {
	const gradientId = generateGradientId();

	// Calculate gradient direction from angle (for linear)
	const angleRad = (angle - 90) * (Math.PI / 180);
	const x1 = Math.round(50 + Math.cos(angleRad + Math.PI) * 50);
	const y1 = Math.round(50 + Math.sin(angleRad + Math.PI) * 50);
	const x2 = Math.round(50 + Math.cos(angleRad) * 50);
	const y2 = Math.round(50 + Math.sin(angleRad) * 50);

	let gradientDef: string;

	if (type === 'linear') {
		gradientDef = `
			<defs>
				<linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
					<stop offset="0%" stop-color="${startColor}" />
					<stop offset="100%" stop-color="${endColor}" />
				</linearGradient>
			</defs>`;
	} else {
		gradientDef = `
			<defs>
				<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
					<stop offset="0%" stop-color="${startColor}" />
					<stop offset="100%" stop-color="${endColor}" />
				</radialGradient>
			</defs>`;
	}

	// Remove any existing defs
	let result = svg.replace(/<defs>[\s\S]*?<\/defs>/gi, '');

	// Insert gradient def after opening svg tag
	result = result.replace(/<svg([^>]*)>/i, `<svg$1>${gradientDef}`);

	// Replace fill values with gradient reference
	result = result.replace(/fill=["']currentColor["']/gi, `fill="url(#${gradientId})"`);
	result = result.replace(/fill=["']#[0-9a-fA-F]{3,6}["']/gi, `fill="url(#${gradientId})"`);
	result = result.replace(/fill=["']rgb[^"']*["']/gi, `fill="url(#${gradientId})"`);

	// If no fill was replaced, add fill to svg element
	if (!result.includes(`url(#${gradientId})`)) {
		result = result.replace(/<svg([^>]*)>/i, `<svg$1 fill="url(#${gradientId})">`);
	}

	return result;
}

/**
 * Set SVG size by updating width/height attributes
 */
export function setSvgSize(svg: string, size: number): string {
	let result = svg;

	// Update or add width attribute
	if (/width=["'][^"']*["']/i.test(result)) {
		result = result.replace(/width=["'][^"']*["']/i, `width="${size}"`);
	} else {
		result = result.replace(/<svg/i, `<svg width="${size}"`);
	}

	// Update or add height attribute
	if (/height=["'][^"']*["']/i.test(result)) {
		result = result.replace(/height=["'][^"']*["']/i, `height="${size}"`);
	} else {
		result = result.replace(/<svg/i, `<svg height="${size}"`);
	}

	return result;
}

/**
 * Convert SVG string to PNG data URL using Canvas API
 */
export function svgToPng(svg: string, size: number): Promise<string> {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			reject(new Error('Could not get canvas context'));
			return;
		}

		const img = new Image();

		// Create a blob URL from the SVG
		const svgWithSize = setSvgSize(svg, size);
		const blob = new Blob([svgWithSize], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);

		img.onload = () => {
			ctx.drawImage(img, 0, 0, size, size);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL('image/png'));
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to load SVG'));
		};

		img.src = url;
	});
}

/**
 * Download a data URL as a file
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
	const link = document.createElement('a');
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Download SVG as a file
 */
export function downloadSvg(svg: string, filename: string): void {
	const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	downloadDataUrl(url, filename);
	URL.revokeObjectURL(url);
}
