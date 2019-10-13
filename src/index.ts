import {AdHandler} from './AdHandler';
declare var window: any;

//console.log('commands pre', window.adHandler.cmd);
let _adHandler = new AdHandler(window.adHandler.cmd);

//console.log('created adHandler', _adHandler);
//console.log(_adHandler.displaySlot);
/*window.adHandler.cmd.forEach(element => {
    element();
});*/

window.adHandler = _adHandler;
document.dispatchEvent(new Event('adHandlerReady'));