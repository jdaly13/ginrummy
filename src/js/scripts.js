import { rummy } from './rummy';
import { oneTimeEvents } from './rummy/onetimeevents';
import {player} from './rummy/player';
rummy.store.subscribe(()=> {
    console.log(rummy.store.getState())
})


oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();
player.userEvents();

