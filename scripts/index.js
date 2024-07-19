//@ts-check
import { world, system } from '@minecraft/server'

if (!world.scoreboard.getObjective('floatTime')) world.scoreboard.addObjective('floatTime', 'float time');
if (!world.scoreboard.getObjective('noFallingDamage')) world.scoreboard.addObjective('noFallingDamage', 'no falling damage');

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

// フックの引き寄せ終了
/**
 * 
 * @param {import ('@minecraft/server').Entity} seat 
 * @returns 
 */
function end_attract(seat) {
	const rider = seat.getComponent('minecraft:rideable')?.getRiders()[0];
	// riderがいない場合終了
	if (rider == {}) return;
	// player乗車時
	if (rider.typeId == 'minecraft:player') {
		system.runTimeout(() => {
			seat.triggerEvent('instant_kill');
		},4)
		system.runTimeout(() => {
			rider?.applyKnockback(0.0, 0.0, 0.0, 0.4)
		},6)
	}
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

// 常時実行
system.runInterval(() => {
	// ロード中のディメンションに対して実行
	for (const dimension of loadingDimension()) {
		// bullet particle
		for (const bullet of world.getDimension(dimension).getEntities({ type: 're_hookshot:bullet' })) {
			bullet.runCommand('particle minecraft:basic_crit_particle ~ ~ ~');
		}
		//目的地到着、終了実行
		for (const seat of world.getDimension(dimension).getEntities({ type: 're_hookshot:seat' })) {
			const destination = seat.getDynamicProperty('re_hookshot:destination');
			const nowLoc = seat.location;
			const distance = Math.sqrt((destination?.x - nowLoc.x) ** 2 + (destination?.y - nowLoc.y) ** 2 (destination?.z - nowLoc.z) ** 2)
			if (distance <= 1) end_attract(seat)
		}
	}
})

// hit entity
world.afterEvents.projectileHitEntity.subscribe(ev => {
	const hitEntity = ev.getEntityHit().entity;
	const projectile = ev.projectile;
	const source = ev.source;
	if (source !== undefined && projectile.typeId === 're_hookshot:bullet' && hitEntity !== undefined) {
		if (hitEntity.hasTag('attractor')) {
			source?.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			const seat = hitEntity?.dimension.getEntities({ type: 're_hookshot:seat', location: source.location, closest: 1, maxDistance: 1.0 })[0];
			if (seat == undefined) return;
			seat.setDynamicProperty("re_hookshot:destination", hitEntity.location)
			startHook(hitEntity.location, seat);
		}
		else {
			hitEntity?.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			const seat = hitEntity?.dimension.getEntities({ type: 're_hookshot:seat', location: hitEntity.location, closest: 1, maxDistance: 1.0 })[0];
			if (seat == undefined) return;
			seat.setDynamicProperty("re_hookshot:destination", source.location)
			startHook(source.location, seat);
		}
	}
})

// hit block
world.afterEvents.projectileHitBlock.subscribe(ev => {
	const block = ev.getBlockHit().block;
	const projectile = ev.projectile;
	const source = ev.source;
	// seatがブロックに当たったら終了
	if (source?.typeId == 're_hookshot:seat') {
		end_attract(projectile)
	}
})