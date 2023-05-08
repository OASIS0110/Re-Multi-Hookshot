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
		if (hitBlock == undefined) {
			//source.runCommandAsync(`tellraw @p {"rawtext": [{"text": "HitEntity:${hitEntity} Source:${source}"}]}`);
		}
	}
});

//Entityが撃たれた時
world.events.entityHurt.subscribe(ev => {
	const hurtEntity = ev.hurtEntity;
	hurtEntity.runCommandAsync(`tag @s add test`);
})