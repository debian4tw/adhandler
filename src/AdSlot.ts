export class AdSlot {
  id: string;
  domId: string;
  dfpSlot: googletag.Slot;
  events: Array<Object>;
  created: Number;
  context: Object;
  visibility: Number;
  viewed: boolean;
  isSticky: boolean;
  isLazy: boolean;
  onViewed: undefined | Function;
  
  constructor(dfpSlot: googletag.Slot, context: Object, opts: any) {
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

  getId() {
    return this.id;
  }

  logEvent(eventObj: Object) {
    this.events.push(eventObj);
  }
}