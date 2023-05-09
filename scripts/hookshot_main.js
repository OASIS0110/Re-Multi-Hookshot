import { world } from '@minecraft/server'

world.events.projectileHit.subscribe(ev => {
	if (ev.projectile.typeId == "re_hookshot:hookshot_bullet") {
		//location(Hitした場所)
		const { x, y, z } = ev.location;
		//Source(撃ったentity)
		const source = ev.source;
		//hitEntity(撃たれたentity)
		const hitBlock = ev.getBlockHit();

		//ブロックに当たったら
		if (hitBlock !== undefined) {
			source.sendMessage(`x:${x} y:${y} z:${z}`)
		}
	}
});

//Entityが撃たれた時
world.events.entityHurt.subscribe(ev => {
	const hurtEntity = ev.hurtEntity;
	const source = ev.damageSource
	hurtEntity.runCommandAsync(`tag @s add test`);
})