/**
 * @param {import('mojang-minecraft').Entity} entity
 * @param {object} [options]
 * @param {number} [options.distance]
 * @param {boolean} [options.passable]
 * @param {boolean} [options.liquid]
 */
export function getVuewBlock(entity,options) {
	const {distance=32, passable=false, liquid=false} = options;
	const option = new BlockRaycastOptions();
	option.maxDistance = distance;
	option.includePassableBlocks = passable;
	option.includeLiquidBlocks = liquid;
	try {
		return entity.getBlockFromViewVector(option);
	}
	catch {
		return null;
	}
}

/**
 * @param {import('mojang-minecraft').Entity} entity
 * @param {object} [options]
 * @param {number} [options.distance]
 */
export function getVuewEntity(entity,options) {
	const {distance=32} = options;
	const option = new EntityRaycastOptions();
	option.maxDistance = distance;
	try {
		return entity.getEntitiesFromViewVector(option);
	}
	catch {
		return null;
	}
}