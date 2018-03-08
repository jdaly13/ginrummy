import { rummy } from './rummy';
import { oneTimeEvents } from './rummy/onetimeevents';
import { player } from './rummy/player';
import { joshua } from './rummy/joshua';

rummy.store.subscribe(arg => {
  //console.log(rummy.store.getState());
});

oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();
player.userEvents();
joshua.takeCardProcess();
