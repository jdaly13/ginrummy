import { rummy } from './rummy';
import { oneTimeEvents } from './rummy/onetimeevents'
rummy.store.subscribe(()=> {
    console.log(rummy.store.getState())
})


oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();

