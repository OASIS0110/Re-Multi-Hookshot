//@ts-check
import { world, system } from '@minecraft/server'

// ロードされているディメンション(プレイヤーがいるディメンション)のリストを取得
/**
 * @author OASIS0110
 * @returns {Array} Loading Dimensions
 */
function loadingDimension() {
	let loadingDimension = []
	for (const player of world.getAllPlayers()) {
		loadingDimension.push(player.dimension.id);
	}
	return [...new Set(loadingDimension)]
}

/**
 * 
 * @param {import ('@minecraft/server').Vector3} target 
 * @param {import ('@minecraft/server').Entity} seat 
 */
function startHook(target, seat) {
	let posDiff = { x: target.x - seat.location.x, y: target.y - seat.location.y + 0.3, z: target.z - seat.location.z};
	const posDist = Math.sqrt(posDiff.x ** 2 + posDiff.y ** 2 + posDiff.z ** 2);
	const vector = { x: (2 / posDist) * posDiff.x, y: (2 / posDist) * posDiff.y, z: (2 / posDist) * posDiff.z};
	seat.applyImpulse(vector);
	const rider = seat.getComponent('minecraft:rideable');
	if (rider !== undefined) world.scoreboard.getObjective('floatTime')?.setScore(rider.getRiders()[0], 30);
}

if (!world.scoreboard.getObjective('floatTime')) world.scoreboard.addObjective('floatTime', 'float time');
if (!world.scoreboard.getObjective('noFallingDamage')) world.scoreboard.addObjective('noFallingDamage', 'no falling damage');

system.runInterval(() => {
	//目的地到着検知
})

world.afterEvents.projectileHitEntity.subscribe(ev => {
	const hitEntity = ev.getEntityHit().entity;
	const projectile = ev.projectile;
	const source = ev.source;
	if (source !== undefined && projectile.typeId === 're_hookshot:bullet') {
		hitEntity?.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
		//hitEntity?.runCommand(`summon re_hookshot:marker ~ ~ ~`);
		const seat = hitEntity?.dimension.getEntities({ type: 're_hookshot:seat', location: hitEntity?.location, closest: 1, maxDistance: 1.0 })[0];
		if (seat == undefined) return;
		seat?.setDynamicProperty('re_hookshot:target_loc', source?.location);
		startHook(source?.location, seat);
	}
})