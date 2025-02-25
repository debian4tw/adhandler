import {AdSlot} from './AdSlot';

export class AdSlotRepository {

  adSlots: Array<AdSlot>;

  constructor() {
    this.adSlots = [];
    
  }

  insert(dfpSlot: googletag.Slot, context: any, opts: any) {
    if (this.isSlotDefined(dfpSlot.getSlotId().getId())) {
      return false;
    }
    let s = new AdSlot(dfpSlot, context, opts);
    //console.log('created AdSlot', s);
    this.adSlots[s.getId()] = s;
    //this.adSlots.push(s);
    //console.log('count;', this.adSlots.length);
    return true;
  }

  private isSlotDefined(slotId) {
    return this.adSlots.hasOwnProperty(slotId);
  }

  getById(id: string) {
    return this.adSlots[id];
  }

  findByDomId(domId) {
    var index = this.adSlots.findIndex(function(item){ return item.domId == domId});
    if (index > -1) {
      return this.adSlots[index];
    }
    return false;
  }

  findByContext(context){
    let ctx = [];
    for (let x in this.adSlots) {
      if(this.adSlots[x].context ==context ) {
        ctx.push(this.adSlots[x]);
      }
    }
    return ctx;
  }

  getCount(): Number {
    return this.adSlots.length;
  }
}