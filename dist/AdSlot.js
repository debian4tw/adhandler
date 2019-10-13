define(["require", "exports"], function (require, exports) {
    "use strict";
    var AdSlot = (function () {
        function AdSlot(dfpSlot, context, opts) {
            this.id = dfpSlot.getSlotId().getId();
            this.domId = dfpSlot.getSlotElementId();
            this.dfpSlot = dfpSlot;
            this.events = [],
                this.created = window.performance.now(),
                this.context = context,
                this.visibility = 0;
            this.isSticky = opts.isSticky || false;
            this.isLazy = opts.isLazy || false;
        }
        AdSlot.prototype.getId = function () {
            return this.id;
        };
        AdSlot.prototype.logEvent = function (eventObj) {
            this.events.push(eventObj);
        };
        return AdSlot;
    }());
    exports.AdSlot = AdSlot;
});
