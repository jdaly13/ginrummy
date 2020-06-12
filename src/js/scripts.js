import { oneTimeEvents } from './rummy/onetimeevents';
import { player } from './rummy/player';
import { joshua } from './rummy/joshua';
import helpfulhints from './rummy/helpfulhints';
import '../scss/style.scss';
//rummy.store.subscribe(arg => {
  //console.log(rummy.store.getState());
//});

oneTimeEvents.fillinmaincontent(oneTimeEvents.createarrayofcards(false));
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();
player.userEvents();
joshua.takeCardProcess();
helpfulhints.initiateSubscribe();
oneTimeEvents.overlay();
oneTimeEvents.checkLocalStorage();
