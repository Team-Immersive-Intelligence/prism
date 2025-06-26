/**
 * Like Object.assign() but preserves accessors
 *
 * @param target
 * @param sources
 */
export function betterAssign (
	target: Record<string, unknown>,
	...sources: Record<string, unknown>[]
) {
	for (const source of sources) {
		const descriptors = Object.getOwnPropertyDescriptors(source);
		for (const key in descriptors) {
			if (Object.hasOwn(target, key)) {
				continue;
			}

			const descriptor = descriptors[key];
			Object.defineProperty(target, key, descriptor);
		}
	}

	return target;
}
