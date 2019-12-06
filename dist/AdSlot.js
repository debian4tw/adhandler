define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AdSlot = /** @class */ (function () {
        function AdSlot(dfpSlot, context, opts) {
            opts = opts || {};
            this.id = dfpSlot.getSlotId().getId();
            this.domId = dfpSlot.getSlotElementId();
            this.dfpSlot = dfpSlot;
            this.events = [],
                this.created = window.performance.now(),
                this.context = context,
                this.visibility = 0;
            this.isSticky = opts.isSticky || false;
            this.isLazy = opts.isLazy || false;
            this.viewed = false;
            if (typeof opts.onViewed === "function") {
                this.onViewed = opts.onViewed;
            }
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
