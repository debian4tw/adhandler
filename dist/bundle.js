!function(t){var e={};function o(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(n,i,function(e){return t[e]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){var n,i;n=[o,e,o(1)],void 0===(i=function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=new o.AdHandler(window.adHandler.cmd);window.adHandler=n,document.dispatchEvent(new Event("adHandlerReady"))}.apply(e,n))||(t.exports=i)},function(t,e,o){var n,i;n=[o,e,o(2)],void 0===(i=function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t){var e=this;this.devices={Desktop:"desktop",Mobile:"mobile",All:"all"},this.globalContextRegistry=[],this.lazySlots=[],this.refreshRate=this.isMobile()?15:20,this.cmd=t,this.commandBuffer=t,this.slotRepository=new o.AdSlotRepository,this.initLazySlotsObserver(),googletag.cmd.push((function(){googletag.pubads().addEventListener("slotRenderEnded",(function(t){t.isEmpty?e.addEvent({name:"Empty"},t.slot.getSlotId().getId()):e.addEvent({name:"Rendered",size:[t.size[0],t.size[1]]},t.slot.getSlotId().getId())})),googletag.pubads().addEventListener("slotRequested",(function(t){e.addEvent({name:"slotRequested"},t.slot.getSlotId().getId())})),googletag.pubads().addEventListener("impressionViewable",(function(t){e.addEvent({name:"impressionViewable"},t.slot.getSlotId().getId()),e.slotRepository.adSlots[t.slot.getSlotId().getId()].viewed=!0})),googletag.pubads().addEventListener("slotVisibilityChanged",(function(t){var o=t.slot.getSlotId().getId();e.addEvent({name:"SlotVisibilityChangedEvent"},t.slot.getSlotId().getId()),e.slotRepository.adSlots[o]&&(e.slotRepository.adSlots[o].visibility=t.inViewPercentage)}))}))}return t.prototype.init=function(t,e){var o=this;this.commandBuffer=this.cmd,this.cmd.push=function(t){t()},this.commandBuffer.forEach((function(t){o.cmd.push(t)})),this.startRefreshInterval()},t.prototype.displaySlot=function(t,e,o,n,i){var s=this;if(!this.slotIdIsDefined(n)&&(t===this.devices.All||t===this.getCurrentDevice())){if(!0===i.isLazy)return delete i.isLazy,this.lazySlots[n]=function(){s.displaySlot(t,e,o,n,i)},void this.attachLazyslot(n);var r=this;googletag.cmd.push((function(){var t;t=i&&i.isOutOfPage?googletag.defineOutOfPageSlot(e,n).addService(googletag.pubads()):googletag.defineSlot(e,o,n).addService(googletag.pubads()),console.log("addadslot",s.globalContext,s),r.addAdSlot(t,s.globalContext,i),googletag.cmd.push((function(){googletag.display(n),googletag.pubads().refresh([t])}))}))}},t.prototype.addAdSlot=function(t,e,o){this.slotRepository.insert(t,e,o)},t.prototype.slotIdIsDefined=function(t){return!1},t.prototype.isMobile=function(){return window.screen.width<=600},t.prototype.getCurrentDevice=function(){return window.screen.width<=600?"mobile":"desktop"},t.prototype.addEvent=function(t,e){this.slotRepository.adSlots[e]?(t.time=window.performance.now(),this.slotRepository.adSlots[e].events.push(t)):console.log("slot not defined on adEvent",t,e,window.performance.now())},t.prototype.initLazySlotsObserver=function(){var t=this;this.lazySlotsObserver=new IntersectionObserver((function(e,o){e.forEach((function(e){e.isIntersecting&&(o.unobserve(e.target),t.lazySlots[e.target.id](),delete t.lazySlots[e.target.id])}))}),{root:null,rootMargin:"150px",threshold:0})},t.prototype.attachLazyslot=function(t){this.lazySlotsObserver.observe(document.getElementById(t))},t.prototype.processContext=function(t){},t.prototype.setContext=function(t){this.globalContextRegistry.length>0&&this.processContext(this.globalContextRegistry[this.globalContextRegistry.length-1]),this.globalContext=t,this.globalContextRegistry.push(t),googletag.cmd.push((function(){for(var e in t)googletag.pubads().setTargeting(e,t[e])}))},t.prototype.startRefreshInterval=function(){var t=this;this.refreshInterval=setInterval((function(){var e=window.location.href;document.hasFocus()&&t.refreshSlotsByUrl(e)}),1e3*this.refreshRate)},t.prototype.refreshSlotsByUrl=function(t){for(var e in this.slotRepository.adSlots)this.slotIsVisible(this.slotRepository.adSlots[e])&&(console.log("refreshSlot",this.slotRepository.adSlots[e].id),googletag.pubads().refresh([this.slotRepository.adSlots[e].dfpSlot]))},t.prototype.slotIsVisible=function(t){return t.visibility>50},t}();e.AdHandler=n}.apply(e,n))||(t.exports=i)},function(t,e,o){var n,i;n=[o,e,o(3)],void 0===(i=function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(){this.adSlots=[]}return t.prototype.insert=function(t,e,n){if(this.isSlotDefined(t.getSlotId().getId()))return!1;var i=new o.AdSlot(t,e,n);return this.adSlots[i.getId()]=i,!0},t.prototype.isSlotDefined=function(t){return this.adSlots.hasOwnProperty(t)},t.prototype.getById=function(t){return this.adSlots[t]},t.prototype.findByDomId=function(t){var e=this.adSlots.findIndex((function(e){return e.domId==t}));return e>-1&&this.adSlots[e]},t.prototype.findByContext=function(t){var e=[];for(var o in this.adSlots)this.adSlots[o].context==t&&e.push(this.adSlots[o]);return e},t.prototype.getCount=function(){return this.adSlots.length},t}();e.AdSlotRepository=n}.apply(e,n))||(t.exports=i)},function(t,e,o){var n;void 0===(n=function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e,o){this.id=t.getSlotId().getId(),this.domId=t.getSlotElementId(),this.dfpSlot=t,this.events=[],this.created=window.performance.now(),this.context=e,this.visibility=0,this.isSticky=o.isSticky||!1,this.isLazy=o.isLazy||!1,this.viewed=!1}return t.prototype.getId=function(){return this.id},t.prototype.logEvent=function(t){this.events.push(t)},t}();e.AdSlot=o}.apply(e,[o,e]))||(t.exports=n)}]);