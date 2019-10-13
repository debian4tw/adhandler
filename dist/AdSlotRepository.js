define(["require", "exports", './AdSlot'], function (require, exports, AdSlot_1) {
    "use strict";
    var AdSlotRepository = (function () {
        function AdSlotRepository() {
            this.adSlots = [];
        }
        AdSlotRepository.prototype.insert = function (dfpSlot, context, opts) {
            if (this.isSlotDefined(dfpSlot.getSlotId().getId())) {
                return false;
            }
            var s = new AdSlot_1.AdSlot(dfpSlot, context, opts);
            console.log('created AdSlot', s);
            this.adSlots[s.getId()] = s;
            this.adSlots.push(s);
            console.log('count;', this.adSlots.length);
            return true;
        };
        AdSlotRepository.prototype.isSlotDefined = function (slotId) {
            return this.adSlots.hasOwnProperty(slotId);
        };
        AdSlotRepository.prototype.getById = function (id) {
            return this.adSlots[id];
        };
        AdSlotRepository.prototype.getCount = function () {
            return this.adSlots.length;
        };
        return AdSlotRepository;
    }());
    exports.AdSlotRepository = AdSlotRepository;
});
