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
  
  constructor(containerId: string, context: Object, opts: any) {
    opts = opts || {};
    //this.id = dfpSlot.getSlotId().getId();
    this.domId = containerId;
    //this.dfpSlot =;
    this.events = [];
    this.created = window.performance.now();
    this.context = context;
    this.visibility = 0;
    this.isSticky = opts.isSticky || false;
    this.isLazy = opts.isLazy || false;
    this.viewed = false;
  }

  setup(slotCode, sizes, containerId, opts) {
    let gslot;
    console.log('setup slot', slotCode, sizes, containerId, opts);
    if (typeof opts  !== "undefined" && opts.isOutOfPage) {
      gslot = googletag.defineOutOfPageSlot(slotCode, containerId);
    } else {
      gslot = googletag.defineSlot(slotCode, sizes, containerId);
    }
    gslot.addService(googletag.pubads());
    this.id = gslot.getSlotId().getId();
    this.dfpSlot = gslot;
  }

  display() {
    googletag.cmd.push(() => {
      googletag.display(this.domId);
      googletag.pubads().refresh([this.dfpSlot]);
    });
  }

  getId() {
    return this.id;
  }

  getDomId() {
    return this.domId;
  }

  logEvent(eventObj: Object) {
    this.events.push(eventObj);
  }
}