define(["require", "exports", "./AdSlotRepository"], function (require, exports, AdSlotRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AdHandler = /** @class */ (function () {
        function AdHandler(commandBuffer) {
            var _this = this;
            this.devices = {
                Desktop: 'desktop', Mobile: 'mobile', All: 'all'
            };
            this.globalContextRegistry = [];
            this.lazySlots = [];
            this.refreshRate = this.isMobile() ? 25 : 30;
            this.cmd = commandBuffer;
            this.commandBuffer = commandBuffer;
            this.slotRepository = new AdSlotRepository_1.AdSlotRepository();
            this.initLazySlotsObserver();
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
                    _this.addEvent({ name: 'slotRequested' }, event.slot.getSlotId().getId());
                });
                googletag.pubads().addEventListener('impressionViewable', function (event) {
                    _this.addEvent({ name: 'impressionViewable' }, event.slot.getSlotId().getId());
                    //this.slotRepository.adSlots[event.slot.getSlotId().getId()].viewed = true;
                    if (_this.slotRepository.adSlots.hasOwnProperty(event.slot.getSlotId().getId())) {
                        var slotId = event.slot.getSlotId().getId();
                        _this.slotRepository.adSlots[slotId].viewed = true;
                        if (typeof _this.slotRepository.adSlots[slotId].onViewed === "function") {
                            _this.slotRepository.adSlots[slotId].onViewed();
                        }
                    }
                });
                googletag.pubads().addEventListener('slotVisibilityChanged', function (event) {
                    //console.log(event.slot.getSlotId().getId(),'slotVisibilityChanged',event, event.inViewPercentage);
                    var slotId = event.slot.getSlotId().getId();
                    //this.addEvent({name: 'SlotVisibilityChangedEvent'}, event.slot.getSlotId().getId());
                    if (_this.slotRepository.adSlots[slotId]) {
                        _this.slotRepository.adSlots[slotId].visibility = event.inViewPercentage;
                    }
                });
            });
        }
        AdHandler.prototype.init = function (googletag, pubads) {
            var _this = this;
            //console.log('init', googletag, pubads);
            this.commandBuffer = this.cmd;
            this.cmd.push = function (cb) {
                //console.log('call from adhandler');
                cb();
            };
            this.commandBuffer.forEach(function (command) {
                _this.cmd.push(command);
            });
            this.startRefreshInterval();
        };
        AdHandler.prototype.displaySlot = function (targetDevice, slotCode, sizes, containerId, opts) {
            var _this = this;
            //console.log('display slot', window.google_DisableInitialLoad, googletag.pubadsReady);
            if (this.slotIdIsDefined(containerId)) {
                return;
            }
            if (targetDevice !== this.devices.All && targetDevice !== this.getCurrentDevice()) {
                return;
            }
            if (typeof opts !== "undefined" && opts.isLazy === true) {
                delete opts.isLazy;
                this.lazySlots[containerId] = function () {
                    _this.displaySlot(targetDevice, slotCode, sizes, containerId, opts);
                };
                this.attachLazyslot(containerId);
                return;
            }
            var that = this;
            googletag.cmd.push(function () {
                var slot;
                //console.log('define slot', slotCode, sizes, containerId, window.performance.now());
                //console.log('container for: '+containerId, document.getElementById(containerId));
                if (opts && opts.isOutOfPage) {
                    slot = googletag.defineOutOfPageSlot(slotCode, containerId).addService(googletag.pubads());
                }
                else {
                    slot = googletag.defineSlot(slotCode, sizes, containerId).addService(googletag.pubads());
                }
                //googletag.pubads().disableInitialLoad();
                //slot.setTargeting(context);
                //console.log('addadslot', this.globalContext, this);
                that.addAdSlot(slot, _this.globalContext, opts);
                googletag.cmd.push(function () {
                    //console.log('display', containerId, slot);
                    googletag.display(containerId);
                    googletag.pubads().refresh([slot]);
                });
            });
        };
        AdHandler.prototype.addAdSlot = function (dfpSlot, context, opts) {
            this.slotRepository.insert(dfpSlot, context, opts);
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
                //console.log('slot not defined on adEvent', event, slotId, window.performance.now());
            }
        };
        AdHandler.prototype.initLazySlotsObserver = function () {
            var _this = this;
            var options = {
                root: null,
                rootMargin: '150px',
                threshold: 0
            };
            this.lazySlotsObserver = new IntersectionObserver(function (entries, observer) {
                //console.log(observer);
                entries.forEach(function (entry) {
                    //console.log(entry);
                    if (entry.isIntersecting) {
                        //console.log('ok ', entry.target);
                        observer.unobserve(entry.target);
                        _this.lazySlots[entry.target.id]();
                        delete _this.lazySlots[entry.target.id];
                    }
                });
            }, options);
        };
        AdHandler.prototype.attachLazyslot = function (domId) {
            //console.log('attachingLazysSlot');
            this.lazySlotsObserver.observe(document.getElementById(domId));
        };
        AdHandler.prototype.processContext = function (context) {
            return;
            //find slots by context
            //count viewed
            //track to analytics
            //context url, device, slots, viewed slots, refreshed slots
            console.log('process context', context);
            var slots = this.slotRepository.findByContext(context);
            console.log('slots found for ctx', slots);
            var viewedSlots = slots.reduce(function (acc, obj) {
                return acc + obj.viewed;
            }, 0);
            console.log('viewed/slots', viewedSlots + '/' + slots.length);
            console.log('viewability: ', Math.round((viewedSlots / slots.length) * 100));
        };
        AdHandler.prototype.setContext = function (ctx) {
            if (this.globalContextRegistry.length > 0) {
                this.processContext(this.globalContextRegistry[this.globalContextRegistry.length - 1]);
            }
            this.globalContext = ctx;
            this.globalContextRegistry.push(ctx);
            //console.log('context', ctx);  
            googletag.cmd.push(function () {
                //console.log('gooogpush',ctx);
                for (var x in ctx) {
                    //console.log('settarg',ctx[x]);
                    googletag.pubads().setTargeting(x, ctx[x]);
                }
            });
        };
        AdHandler.prototype.startRefreshInterval = function () {
            var _this = this;
            //console.log('start refresh inverval');
            this.refreshInterval = setInterval(function () {
                var url = window.location.href;
                if (document.hasFocus()) {
                    _this.refreshSlotsByUrl(url);
                }
            }, this.refreshRate * 1000);
        };
        AdHandler.prototype.refreshSlotsByUrl = function (currentUrl) {
            for (var x in this.slotRepository.adSlots) {
                if (this.slotIsVisible(this.slotRepository.adSlots[x])) {
                    //console.log('refreshSlot', this.slotRepository.adSlots[x].id);
                    var height = document.getElementById(this.slotRepository.adSlots[x].domId).getBoundingClientRect().height;
                    document.getElementById('ad-inarticle-1-3467448').style.height = height + 'px';
                    googletag.pubads().refresh([this.slotRepository.adSlots[x].dfpSlot]);
                }
            }
        };
        AdHandler.prototype.slotIsVisible = function (slot) {
            return slot.visibility > 50;
        };
        return AdHandler;
    }());
    exports.AdHandler = AdHandler;
});
