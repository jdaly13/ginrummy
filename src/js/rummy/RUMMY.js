import configureStore from '../store';
const store = configureStore();
function RUMMY () {};
RUMMY.prototype = {
    test: 'test',
    testFunc:function () {
        return this.test
    },
    store


}
export default RUMMY;