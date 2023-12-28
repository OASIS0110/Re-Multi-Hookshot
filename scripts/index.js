//@ts-check
import { world, system, ItemStack } from '@minecraft/server'

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

system.run(function tick() {
	system.run(tick);
	for (const dimension of loadingDimension()) {
		for (const hookshotSeat of world.getDimension(dimension).getEntities({ type: 're_hookshot:seat' })) {
			// 目的地に到着検知
			const marker = world.getDimension(dimension).getEntities({ type: 're_hookshot:marker', location: hookshotSeat.location, maxDistance: 1.0 })[0]
			if (marker !== undefined) {
				marker.addTag('kill');
				hookshotSeat.addTag('kill');
			}
		}
		// bullet particle
		for (const bullet of world.getDimension(dimension).getEntities({ type: 're_hookshot:bullet' })) {
			bullet.runCommand('particle minecraft:basic_crit_particle ~ ~ ~');
		}
		// marker kill
		for (const marker of world.getDimension(dimension).getEntities({ type: 're_hookshot:marker', tags: ['kill'] })) {
			marker.triggerEvent("instant_kill");
		}
		// seat関係
		for (const hookshotSeat of world.getDimension(dimension).getEntities({ type: 're_hookshot:seat', tags: ['kill'] })) {
			const rider = hookshotSeat.getComponent('minecraft:rideable').getRiders()[0];
			// プレイヤーが乗っていた場合
			if (rider?.typeId === 'minecraft:player') {
				system.runTimeout(() => {
					for (const entity of world.getDimension(dimension).getEntities()) {
						if (entity.id === hookshotSeat.id) {
							entity.triggerEvent("instant_kill");
						}
					}
				}, 4);
				system.runTimeout(() => {
					rider?.applyKnockback(0, 0, 0, 0.4)
				}, 6);
			}
			// エンティティが乗っていた場合
			else {
				hookshotSeat.triggerEvent("instant_kill");
				system.runTimeout(() => {
					rider?.applyKnockback(0, 0, 0, 0)
					rider?.applyKnockback(0, 0, 0, 0.4)
				}, 1);
			}
		}
	}
	for (const player of world.getAllPlayers()) {
		const floatTime = world.scoreboard.getObjective('floatTime')?.getScore(player) ?? 0
		const hasItem = player.getComponent('minecraft:inventory').container.getSlot(player.selectedSlot)
		if (hasItem?.typeId == 're_hookshot:hookshot') {
			// 説明追加
			let lore = [
				'',
				'§fUsing item : Shoot a hook',
				'§fSneak : Float',
				'',
				'§7Palm Tech社によって作られたフックショット。',
				'§7同社が生み出した最新技術によって、',
				'§7旧モデルの欠点をすべて修正、改良することに成功したらしい。',
			]
			lore = lore.map(function (item) {
				return '§r' + item
			})
			hasItem.setLore(lore)

		}
		// Float
		if (hasItem?.typeId == 're_hookshot:hookshot' && player.isSneaking === true) {
			if ((0 <= floatTime)) {
				world.scoreboard.getObjective('floatTime')?.addScore(player, -1);
				if ((0 < floatTime) && (floatTime <= 30)) {
					//player.applyKnockback(0,0,0,0.1)
					player.runCommandAsync('effect @s levitation 1 1 true')
				}
				if ((20 <= floatTime) && (floatTime <= 30)) {
					player.runCommand(`particle re_hookshot:float_safe`)
				}
				if (floatTime === 20) player.runCommand('playsound note.pling @s ~ ~ ~ 0.1 1.5 0.1')
				if ((10 <= floatTime) && (floatTime <= 20)) {
					player.runCommand(`particle re_hookshot:float_warm`)
				}
				if (floatTime === 10) player.runCommand('playsound note.pling @s ~ ~ ~ 0.1 1.5 0.1')
				if ((0 <= floatTime) && (floatTime <= 10)) {
					player.runCommand(`particle re_hookshot:float_danger`)
				}
				if (floatTime === 0) {
					player.runCommand(`particle minecraft:large_smoke`);
					player.runCommand('playsound random.fizz @s ~ ~ ~ 0.3 2 0.3');
				}
				system.runTimeout(() => {
					player.runCommandAsync('effect @s levitation 0 2 true')
				},5)
			}
		}
		else if (player.isOnGround === true) {
			world.scoreboard.getObjective('floatTime')?.setScore(player, 30);
		}
	}
})

system.runInterval(() => {
	for (const player of world.getAllPlayers()) {
		if (player.hasTag('test')) {
			player.runCommand('effect @s slow_falling 1 1 true');
			system.runTimeout(() => {
				player.runCommand('effect @s slow_falling 0 1 true');
			},1)
		}
	}
},3)

world.afterEvents.projectileHitEntity.subscribe(ev => {
	const source = ev.source; // source entity (Entity)
	const hitEntity = ev.getEntityHit().entity; // hit entity (Entity)
	if (ev.projectile.typeId === 're_hookshot:bullet' && source?.typeId === "minecraft:player") {
		// 弾を当てた相手がheavyタグを持っていた場合(つまり当てた側が引き寄せられる)
		if (hitEntity.hasTag('heavy')) {
			source.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			hitEntity.runCommand(`summon re_hookshot:marker ~ ~ ~`);
			const seat = world.getDimension(source.dimension.id).getEntities({ type: 're_hookshot:seat', location: source.location, closest: 1, maxDistance: 1.0 })[0];
			const marker = world.getDimension(source.dimension.id).getEntities({ type: 're_hookshot:marker', location: hitEntity.location, closest: 1, maxDistance: 1.0 })[0];
			startHook(marker, seat)
		}
		// その他(当てたエンティティを引き寄せる)
		else {
			hitEntity.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			source.runCommand(`summon re_hookshot:marker ~ ~ ~`);
			const seat = world.getDimension(source.dimension.id).getEntities({ type: 're_hookshot:seat', location: hitEntity.location, closest: 1, maxDistance: 1.0 })[0];
			const marker = world.getDimension(source.dimension.id).getEntities({ type: 're_hookshot:marker', location: source.location, closest: 1, maxDistance: 1.0 })[0];
			startHook(marker, seat)
		}
	}
})

world.afterEvents.projectileHitBlock.subscribe(ev => {
	const source = ev.source; // source entity (Entity)
	const projectile = ev.projectile // hit projectile (Entity)
	if (projectile.typeId === "re_hookshot:bullet" && source?.typeId === "minecraft:player") {
		source.runCommand(`summon re_hookshot:marker ${projectile.location.x} ${projectile.location.y + 0.3} ${projectile.location.z}`);
		system.runTimeout(() => {
			source.runCommand(`ride @s summon_ride re_hookshot:seat reassign_rides`);
			const marker = world.getDimension(source.dimension.id).getEntities({ type: 're_hookshot:marker', location: projectile.location, closest: 1, maxDistance: 1.0 })[0];
			const seat = world.getDimension(source.dimension.id).getEntities({ type: 're_hookshot:seat', location: source.location, closest: 1, maxDistance: 1.0 })[0];
			startHook(marker, seat)
			ev.projectile.kill()
		}, 4)
	}
	// re_hookshot:seatがブロックに当たったらkill
	if (projectile.typeId === "re_hookshot:seat") {
		for (const dimension of loadingDimension()) {
			for (const entity of world.getDimension(dimension).getEntities()) {
				if (entity.id === projectile.id) projectile.addTag('kill');
			}
		}
	}
})

/**
 * 
 * @param {import ('@minecraft/server').Entity} marker 
 * @param {import ('@minecraft/server').Entity} seat 
 */
function startHook(marker, seat) {
	let posDiff = { x: marker.location.x - seat.location.x, y: marker.location.y - seat.location.y + 0.3, z: marker.location.z - seat.location.z };
	const posDist = Math.sqrt(posDiff.x ** 2 + posDiff.y ** 2 + posDiff.z ** 2)
	posDiff = { x: (2 / posDist) * posDiff.x, y: (2 / posDist) * posDiff.y, z: (2 / posDist) * posDiff.z }
	seat?.applyImpulse(posDiff)
	world.scoreboard.getObjective('floatTime')?.setScore(seat.getComponent('minecraft:rideable').getRiders()[0], 30);
}