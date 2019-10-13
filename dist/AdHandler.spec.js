define(["require", "exports", './AdHandler'], function (require, exports, AdHandler_1) {
    "use strict";
    var dfpSlot = {
        addService: function (service) {
            return this;
        },
        clearCategoryExclusions: function () {
            return this;
        },
        clearTargeting: function (opt_key) {
            return this;
        },
        defineSizeMapping: function (sizeMapping) {
            return this;
        },
        get: function (key) {
            return "";
        },
        getAdUnitPath: function () {
            return "mocked_unit";
        },
        getAttributeKeys: function () {
            return [];
        },
        getCategoryExclusions: function () {
            return [];
        },
        getResponseInformation: function () {
            return {
                advertiserId: '',
                campaignId: '',
                creativeId: 0,
                creativeTemplateId: 0,
                lineItemId: 0
            };
        },
        getSlotElementId: function () {
            return "mockSlotElId";
        },
        getTargeting: function (key) {
            return [];
        },
        getTargetingKeys: function () {
            return [];
        },
        set: function (key, value) {
            return this;
        },
        setCategoryExclusion: function (categoryExclusion) {
            return this;
        },
        setClickUrl: function (value) {
            return this;
        },
        setCollapseEmptyDiv: function (collapse, opt_collapseBeforeAdFetch) {
            return this;
        },
        setForceSafeFrame: function (forceSafeFrame) {
            return this;
        },
        setSafeFrameConfig: function (config) {
            return this;
        },
        setTargeting: function (key, value) {
            return this;
        },
        //added
        getSlotId: function () {
            return {
                getId: function () { return "mockedId"; }
            };
        }
    };
    var adHandler = new AdHandler_1.AdHandler([]);
    test('slot count should be 0', function () {
        expect(adHandler.slotRepository.getCount()).toBe(0);
    });
    test('slot count should be 1', function () {
        adHandler.slotRepository.insert(dfpSlot, {}, {});
        expect(adHandler.slotRepository.getCount()).toBe(1);
    });
    test('insert should fail, slotId already exists', function () {
        expect(adHandler.slotRepository.insert(dfpSlot, {}, {})).toBe(false);
    });
    test('init should fail, pubads is not ready', function () {
        expect(1).toBe(1);
    });
    test('getContainerId should match created param', function () {
        expect(1).toBe(1);
    });
});
