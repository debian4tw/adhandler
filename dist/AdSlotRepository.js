define(["require", "exports", "./AdSlot"], function (require, exports, AdSlot_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AdSlotRepository = /** @class */ (function () {
        function AdSlotRepository() {
            this.adSlots = [];
        }
        AdSlotRepository.prototype.insert = function (dfpSlot, context, opts) {
            if (this.isSlotDefined(dfpSlot.getSlotId().getId())) {
                return false;
            }
            var s = new AdSlot_1.AdSlot(dfpSlot, context, opts);
            //console.log('created AdSlot', s);
            this.adSlots[s.getId()] = s;
            //this.adSlots.push(s);
            //console.log('count;', this.adSlots.length);
            return true;
        };
        AdSlotRepository.prototype.isSlotDefined = function (slotId) {
            return this.adSlots.hasOwnProperty(slotId);
        };
        AdSlotRepository.prototype.getById = function (id) {
            return this.adSlots[id];
        };
        AdSlotRepository.prototype.findByDomId = function (domId) {
            var index = this.adSlots.findIndex(function (item) { return item.domId == domId; });
            if (index > -1) {
                return this.adSlots[index];
            }
            return false;
        };
        AdSlotRepository.prototype.findByContext = function (context) {
            var ctx = [];
            for (var x in this.adSlots) {
                if (this.adSlots[x].context == context) {
                    ctx.push(this.adSlots[x]);
                }
            }
            return ctx;
        };
        AdSlotRepository.prototype.getCount = function () {
            return this.adSlots.length;
        };
        return AdSlotRepository;
    }());
    exports.AdSlotRepository = AdSlotRepository;
});
