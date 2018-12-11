import { oneTimeEvents } from './rummy/onetimeevents';
import { player } from './rummy/player';
import { joshua } from './rummy/joshua';
import helpfulhints from './rummy/helpfulhints';
console.log(helpfulhints);
//rummy.store.subscribe(arg => {
  //console.log(rummy.store.getState());
//});

oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();
player.userEvents();
joshua.takeCardProcess();
helpfulhints.initiateSubscribe();
