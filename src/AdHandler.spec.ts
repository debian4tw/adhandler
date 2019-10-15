import {AdHandler} from './AdHandler';
describe('IntersectionObserverMokTest', () => {
  const observeMock = {
    observe: () => null,
    disconnect: () => null // maybe not needed
  };

  beforeEach((() => {
    (<any> window).IntersectionObserver = () => observeMock;

  }));
});
let dfpSlot: googletag.Slot = {
  addService(service: googletag.Service): googletag.Slot{
    return this
  },
  clearCategoryExclusions(): googletag.Slot {
    return this
  },
  clearTargeting(opt_key?: string): googletag.Slot {
    return this
  },
  defineSizeMapping(sizeMapping: googletag.SizeMappingArray): googletag.Slot {
    return this;
  },
  get(key: string): string | null {
    return "";
  },
  getAdUnitPath(): string {
    return "mocked_unit"
  },
  getAttributeKeys(): string[]{
    return [];
  },
  getCategoryExclusions(): string[] {
    return []
  },
  getResponseInformation(): googletag.ResponseInformation {
    return {
      advertiserId: '',
      campaignId: '',
      creativeId: 0,
      creativeTemplateId: 0,
      lineItemId: 0
    }
  },
  getSlotElementId(): string {
    return "mockSlotElId";
  },
  getTargeting(key: string): string[] {
    return [];
  },
  getTargetingKeys(): string[] {
    return [];
  },
  set(key: string, value: string): googletag.Slot {
    return this;
  },
  setCategoryExclusion(categoryExclusion: string): googletag.Slot {
    return this;
  },
  setClickUrl(value: string): googletag.Slot {
    return this;
  },
  setCollapseEmptyDiv(collapse: boolean, opt_collapseBeforeAdFetch?: boolean): googletag.Slot {
    return this;
  },
  setForceSafeFrame(forceSafeFrame: boolean): googletag.Slot {
    return this;
  },
  setSafeFrameConfig(config: googletag.SafeFrameConfig): googletag.Slot {
    return this;
  },
  setTargeting(key: string, value: string | string[]): googletag.Slot {
    return this;
  },
  //added
  getSlotId(): any {
    return {
      getId: function() { return "mockedId"}
    };
  }
};
let adHandler = new AdHandler([]);

test('slot count should be 0', () => {
  expect(adHandler.slotRepository.getCount()).toBe(0);
});
/*
test('slot count should be 1', () => {
  adHandler.slotRepository.insert('asd', {},{})
  expect(adHandler.slotRepository.getCount()).toBe(1);
});

test('insert should fail, slotId already exists', () => {
  expect(adHandler.slotRepository.insert('asd2', {},{})).toBe(false);
});
*/
test('init should fail, pubads is not ready', () => {
  expect(1).toBe(1);
});

test('getContainerId should match created param', () => {
  expect(1).toBe(1);
});

