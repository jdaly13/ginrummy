import { rummy } from './rummy';
import { oneTimeEvents } from './rummy/onetimeevents';
import { player } from './rummy/player';
import { joshua } from './rummy/joshua';
import { junkPileMargin } from './constants';
rummy.store.subscribe(arg => {
  console.log(arg);
  console.log(rummy.store.getState());
});

oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();
player.userEvents(junkPileMargin);
joshua.takeCardProcess();
