import { rummy, oneTimeEvents } from './rummy';
rummy.store.subscribe(()=> {
    console.log(rummy.store.getState())
})


oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();
oneTimeEvents.userEvents();

