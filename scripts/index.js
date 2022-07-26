//おまじない( ᐛ )
import {world} from 'mojang-minecraft';
import { getVuewBlock, getVuewEntity } from './modules/utils';

world.events.beforeItemUse.subscribe(event => {
	/**@type {import('mojang-minecraft').Player} */
    const used_player = event.source;
    if(event.item.id === 're_hookshot:hookshot') {
        const block = getVuewBlock(used_player,{distance:100});
        const entity = getVuewEntity(used_player,{distance:100});
        if(entity && entity.length) {
        }
        else if (block) {
        }
        else {
        }
    }
})