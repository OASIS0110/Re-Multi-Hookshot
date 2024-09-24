//@ts-check
/// <reference path ="./references/index.d.ts" />
import { world, system, ItemStack } from '@minecraft/server'
import { addScore, getScore, resetScore, setScore } from './scoreboards';

if (!world.scoreboard.getObjective('floatTime')) world.scoreboard.addObjective('floatTime', 'float time');
if (!world.scoreboard.getObjective('noFallingDamage')) world.scoreboard.addObjective('noFallingDamage', 'no falling damage');

/**
 * ロードされているディメンション(プレイヤーがいるディメンション)のリストを取得
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
 * フックの引き寄せ終了
 * @author OASIS0110
 * @param {import ('@minecraft/server').Entity} seat 
 * @returns 
 */
function end_attract(seat) {
	const rider = seat.getComponent('minecraft:rideable')?.getRiders()[0];
	seat.runCommand('execute as @s at @s run tp @s ~ ~ ~');
	// riderがいない場合終了
	if (rider == undefined) {
		seat.triggerEvent('instant_kill');
		return;
	}
	// player乗車時
	if (rider.typeId == 'minecraft:player') {
		seat.addTag('kill_phase');
		system.runTimeout(() => {
			seat.triggerEvent('instant_kill');
		},4);
		system.runTimeout(() => {
			rider?.applyKnockback(0.0, 0.0, 0.0, 0.7);
			// 落下ダメージ無効化
			setScore(rider, 'noFallingDamage', 40);
			rider.setDynamicProperty('hookshot:cooldown', 5);
			// animation終了
			rider.playAnimation('animation.armor_stand.no_pose', {blendOutTime: 0});
			return;
		},6);
	}
	// player以外
	else {
		seat.triggerEvent('instant_kill');
		system.runTimeout(() => {
			rider?.applyKnockback(0.0, 0.0, 0.0, 0.2);
			// 落下ダメージ無効化
			setScore(rider, 'noFallingDamage', 40);
			// animation終了
			rider.playAnimation('animation.armor_stand.no_pose', {blendOutTime: 0});
			return;
		},3);
	}
}

/**
 * 引き寄せ開始
 * @param {import ('@minecraft/server').Vector3} target 
 * @param {import ('@minecraft/server').Entity} seat 
 */
function startHook(target, seat) {
	let posDiff = { x: target.x - seat.location.x, y: target.y - seat.location.y + 0.3, z: target.z - seat.location.z};
	const posDist = Math.sqrt(posDiff.x ** 2 + posDiff.y ** 2 + posDiff.z ** 2);
	const vector = { x: (2 / posDist) * posDiff.x, y: (2 / posDist) * posDiff.y, z: (2 / posDist) * posDiff.z};
	seat.applyImpulse(vector);
	const riders = seat.getComponent('minecraft:rideable').getRiders()[0];
	if (!riders) return;
	world.scoreboard.getObjective('floatTime')?.setScore(riders, 30);
	riders.playAnimation('animation.armor_stand.salute_pose', {blendOutTime: 100});
}

// 常時実行
system.runInterval(() => {
	// ロード中のディメンションに対して実行
	for (const dimension of loadingDimension()) {
		// bullet particle
		for (const bullet of world.getDimension(dimension).getEntities({ type: 're_hookshot:bullet' })) {
			bullet.runCommand('particle minecraft:basic_crit_particle ~ ~ ~');
		}
		// 落下ダメージ無効化
		for (const entity of world.getDimension(dimension).getEntities({scoreOptions: [{objective: 'noFallingDamage', minScore: 0}]})) {
			if ((getScore(entity, 'noFallingDamage') ?? 1) % 3 == 0) entity.addEffect('slow_falling', 1, {showParticles: false});
			addScore(entity, 'noFallingDamage', -1);
			if ((getScore(entity, 'noFallingDamage') ?? 0) == 1 && entity.typeId == 'minecraft:player') entity.playSound('crossbow.loading.end', { volume: 0.8, pitch: 1 });
			if ((getScore(entity, 'noFallingDamage') ?? 0) == 0) resetScore(entity, 'noFallingDamage');
		}
		// すべてのseatに対して実行
		for (const seat of world.getDimension(dimension).getEntities({ type: 're_hookshot:seat', excludeTags: ['kill_phase'] })) {
			// 目的地到着検知
			const nowLoc = seat.location;
			const destination = seat.getDynamicProperty('re_hookshot:destination');
			if (destination == undefined) return;
			const distance = Math.sqrt((destination.x - nowLoc.x) ** 2 + (destination.y - nowLoc.y) ** 2 + (destination.z - nowLoc.z) ** 2);
			if (distance <= 1.5) end_attract(seat);
			const rider = seat.getComponent('minecraft:rideable')?.getRiders()[0];
			// プレイヤーが乗車している場合
			if (rider?.typeId == 'minecraft:player') {
				rider.setDynamicProperty('hookshot:cooldown', 20);
			}
		}
	}
	// すべてのプレイヤーに対して実行
	for (const player of world.getAllPlayers()) {
		// クールダウン
		const cooldown = Number(player.getDynamicProperty('hookshot:cooldown') ?? 0)
		const inv = /**@type {import('@minecraft/server').EntityInventoryComponent} */  player.getComponent('minecraft:inventory');
		if (!inv) return;
		const item = inv.container?.getItem(player.selectedSlotIndex);
		if (!item) return;
		if (cooldown > 0) {
			player.setDynamicProperty('hookshot:cooldown', cooldown - 1);
			if (item.typeId == 're_hookshot:hookshot') inv.container?.setItem(player.selectedSlotIndex, new ItemStack('re_hookshot:hookshot_empty', 1));
		}
		if (cooldown == 1) player.playSound('crossbow.loading.end', { volume: 0.8, pitch: 1 });;
		if (cooldown == 0 && item.typeId == 're_hookshot:hookshot_empty') inv.container?.setItem(player.selectedSlotIndex, new ItemStack('re_hookshot:hookshot', 1));
		// particle
		if ((getScore(player, 'noFallingDamage') ?? 0) > 0) {
			player.runCommand(`particle minecraft:electric_spark_particle ${player.location.x - 0.5 + Math.random()} ${player.location.y - 1 + (Math.random() /2)} ${player.location.z - 0.5 + Math.random()}`);
			player.runCommand(`particle minecraft:electric_spark_particle ${player.location.x - 0.5 + Math.random()} ${player.location.y - 1 + (Math.random() /2)} ${player.location.z - 0.5 + Math.random()}`);
		}
		if ((getScore(player, 'noFallingDamage') ?? 0) < 30 && player.isOnGround) {
			// 着地するとダメージ無効化解除
			if (player.isOnGround) resetScore(player, 'noFallingDamage');
		}
	}
})

// item use アイテム使用時にアイテム切り替え+クールダウン
world.afterEvents.itemUse.subscribe(ev => {
	const source = ev.source;
	const item = ev.itemStack;
	if (source?.typeId == 'minecraft:player' && item.typeId == 're_hookshot:hookshot') {
		const inv = /**@type {import('@minecraft/server').EntityInventoryComponent} */  source.getComponent('minecraft:inventory');
		if (!inv) return;
		source.playSound('random.door_open', { volume: 0.6, pitch: 3 });
		source.playSound('tile.piston.in', { volume: 0.8, pitch: 1 });
		source.playSound('item.open.iron_door', { volume: 1, pitch: 1 });
		inv.container?.setItem(source.selectedSlotIndex, new ItemStack('re_hookshot:hookshot_empty', 1));
		source.setDynamicProperty('hookshot:cooldown', 20);
	}
})

// hit entity
world.afterEvents.projectileHitEntity.subscribe(ev => {
	const hitEntity = ev.getEntityHit().entity;
	const projectile = ev.projectile;
	const source = ev.source;
	// sourceがplayer、projectileがre_hookshot:bulletの場合引き寄せ開始
	if (source?.typeId == 'minecraft:player' && projectile.typeId === 're_hookshot:bullet' && hitEntity !== undefined) {
		// entityに引き寄せられる場合
		if (hitEntity.hasTag('attractor')) {
			source?.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			const seat = hitEntity?.dimension.getEntities({ type: 're_hookshot:seat', location: source.location, closest: 1, maxDistance: 1.0 })[0];
			if (seat == undefined) return;
			seat.setDynamicProperty("re_hookshot:destination", source.location);
			startHook(hitEntity.location, seat);
		}
		// entityを引き寄せる場合
		else {
			hitEntity?.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			const seat = hitEntity?.dimension.getEntities({ type: 're_hookshot:seat', location: hitEntity.location, closest: 1, maxDistance: 1.0 })[0];
			if (seat == undefined) return;
			seat.setDynamicProperty("re_hookshot:destination", source.location);
			startHook(source.location, seat);
			system.runTimeout(() => {
				if (source.typeId == 'minecraft:player') source.setDynamicProperty('hookshot:cooldown', 20);
			},1);
		}
	}
})

// hit block
world.afterEvents.projectileHitBlock.subscribe(ev => {
	const block = ev.getBlockHit().block;
	const projectile = ev.projectile;
	const source = ev.source;
	// seatがブロックに当たったら終了
	if (projectile?.typeId == 're_hookshot:seat') end_attract(projectile);
	// sourceがplayerでprojectileがre_hookshot:bulletの場合引き寄せ開始
	if (projectile?.typeId == 're_hookshot:bullet' && source?.typeId == 'minecraft:player') {
		source.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
		const seat = source?.dimension.getEntities({ type: 're_hookshot:seat', location: source.location, closest: 1, maxDistance: 1.0 })[0];
		if (seat == undefined) return;
		seat.setDynamicProperty("re_hookshot:destination", block.location);
		startHook(block.location, seat);
		projectile.triggerEvent('instant_kill')
	}
})