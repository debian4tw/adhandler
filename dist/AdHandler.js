define(["require", "exports", './AdSlotRepository'], function (require, exports, AdSlotRepository_1) {
    "use strict";
    var AdHandler = (function () {
        function AdHandler(commandBuffer) {
            var _this = this;
            this.devices = {
                Desktop: 'desktop', Mobile: 'mobile', All: 'all'
            };
            this.globalContext = {};
            this.cmd = commandBuffer;
            this.commandBuffer = commandBuffer;
            this.slotRepository = new AdSlotRepository_1.AdSlotRepository();
            googletag.cmd.push(function () {
                googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                    if (event.isEmpty) {
                        //console.log(event.slot.getSlotElementId(), ' empty response');
                        _this.addEvent({ name: 'Empty' }, event.slot.getSlotId().getId());
                    }
                    else {
                        //console.log('Creative with id: ' + event.creativeId + ' is rendered to slot of size: ' + event.size[0] + 'x' + event.size[1], ' id: '+event.slot.getSlotElementId(), event);
                        _this.addEvent({ name: 'Rendered', size: [event.size[0], event.size[1]] }, event.slot.getSlotId().getId());
                    }
                });
                googletag.pubads().addEventListener('slotRequested', function (event) {
                    //console.log('Slot has been requested:', event.slot.getSlotId().getId(), event.slot.getSlotElementId());
                    //console.log(event, event.slot.getSlotId().getId());
                    _this.addEvent({ name: 'slotRequested' }, event.slot.getSlotId().getId());
                });
                googletag.pubads().addEventListener('impressionViewable', function (event) {
                    _this.addEvent({ name: 'impressionViewable' }, event.slot.getSlotId().getId());
                });
                googletag.pubads().addEventListener('slotVisibilityChanged', function (event) {
                    //console.log(event.slot.getSlotId().getId(),'slotVisibilityChanged',event, event.inViewPercentage);
                    var slotId = event.slot.getSlotId().getId();
                    //addEvent({name: 'SlotVisibilityChangedEvent'}, event.slot.getSlotId().getId());
                    if (_this.slotRepository.adSlots[slotId]) {
                        _this.slotRepository.adSlots[slotId].visibility = event.inViewPercentage;
                    }
                });
                //startRefreshInterval();
            });
        }
        AdHandler.prototype.init = function (googletag, pubads) {
            var _this = this;
            console.log('init', googletag, pubads);
            this.commandBuffer = this.cmd;
            this.cmd.push = function (cb) {
                console.log('call from adhandler');
                cb();
            };
            this.commandBuffer.forEach(function (command) {
                _this.cmd.push(command);
            });
        };
        AdHandler.prototype.displaySlot = function (targetDevice, slotCode, sizes, containerId, opts) {
            console.log('display slot', window.google_DisableInitialLoad, googletag.pubadsReady);
            if (this.slotIdIsDefined(containerId)) {
                return;
            }
            if (targetDevice !== this.devices.All && targetDevice !== this.getCurrentDevice()) {
                return;
            }
            var that = this;
            googletag.cmd.push(function () {
                var slot;
                console.log('define slot', slotCode, sizes, containerId, window.performance.now());
                //console.log('container for: '+containerId, document.getElementById(containerId));
                if (opts && opts.isOutOfPage) {
                    slot = googletag.defineOutOfPageSlot(slotCode, containerId).addService(googletag.pubads());
                }
                else {
                    slot = googletag.defineSlot(slotCode, sizes, containerId).addService(googletag.pubads());
                }
                //googletag.pubads().disableInitialLoad();
                //slot.setTargeting(context);
                that.addAdSlot(slot, this.globalContext, opts);
                googletag.cmd.push(function () {
                    console.log('display', containerId);
                    googletag.display(containerId);
                    googletag.pubads().refresh([slot]);
                });
            });
        };
        AdHandler.prototype.addAdSlot = function (dfpSlot, context, opts) {
            this.slotRepository.insert(dfpSlot, context, opts);
            //let s = new AdSlot(dfpSlot, context, opts);
        };
        AdHandler.prototype.slotIdIsDefined = function (containerId) {
            return false;
        };
        AdHandler.prototype.isMobile = function () {
            return (window.screen.width <= 600);
        };
        AdHandler.prototype.getCurrentDevice = function () {
            return (window.screen.width <= 600) ? 'mobile' : 'desktop';
        };
        AdHandler.prototype.addEvent = function (event, slotId) {
            //console.log(event, slotId);
            if (this.slotRepository.adSlots[slotId]) {
                event.time = window.performance.now();
                this.slotRepository.adSlots[slotId].events.push(event);
            }
            else {
                //console.log(this.slotRepository.adSlots[slotId]);
                console.log('slot not defined on adEvent', event, slotId, window.performance.now());
            }
        };
        return AdHandler;
    }());
    exports.AdHandler = AdHandler;
});
