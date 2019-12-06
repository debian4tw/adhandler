define(["require", "exports", "./AdHandler"], function (require, exports, AdHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //console.log('commands pre', window.adHandler.cmd);
    var _adHandler = new AdHandler_1.AdHandler(window.adHandler.cmd);
    //console.log('created adHandler', _adHandler);
    //console.log(_adHandler.displaySlot);
    /*window.adHandler.cmd.forEach(element => {
        element();
    });*/
    window.adHandler = _adHandler;
    document.dispatchEvent(new Event('adHandlerReady'));
});
