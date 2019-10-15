import {AdSlotRepository} from './AdSlotRepository';
import { AdSlot } from './AdSlot';
declare var window: any;

export class AdHandler {
  public slotRepository: AdSlotRepository;
  cmd: Array<Function>;
  commandBuffer: Array<Function>;
  googletag: googletag.Googletag;
  pubads: googletag.PubAdsService;
  devices = {
    Desktop: 'desktop', Mobile: 'mobile', All: 'all'
  };

  globalContext;
  globalContextRegistry =[];

  lazySlotsObserver: IntersectionObserver;
  lazySlots = [];

  refreshInterval;
  refreshRate = this.isMobile() ? 15 : 20;

  constructor(commandBuffer: Array<Function>) {
    this.cmd = commandBuffer;
    this.commandBuffer = commandBuffer;
    this.slotRepository = new AdSlotRepository();
    this.initLazySlotsObserver();

    googletag.cmd.push(() => {
      googletag.pubads().addEventListener('slotRenderEnded', (event) => {
        if (event.isEmpty) {
          //console.log(event.slot.getSlotElementId(), ' empty response');
          this.addEvent({name:'Empty'}, event.slot.getSlotId().getId());
        } else {
          //console.log('Creative with id: ' + event.creativeId + ' is rendered to slot of size: ' + event.size[0] + 'x' + event.size[1], ' id: '+event.slot.getSlotElementId(), event);
          this.addEvent({name:'Rendered' , size: [event.size[0], event.size[1]]}, event.slot.getSlotId().getId());
        }
      });
      googletag.pubads().addEventListener('slotRequested', (event) => {
        this.addEvent({name: 'slotRequested'}, event.slot.getSlotId().getId());
      });
      googletag.pubads().addEventListener('impressionViewable', (event) => {
        this.addEvent({name: 'impressionViewable'}, event.slot.getSlotId().getId());
        this.slotRepository.adSlots[event.slot.getSlotId().getId()].viewed = true;
      });
      googletag.pubads().addEventListener('slotVisibilityChanged', (event) => {
        //console.log(event.slot.getSlotId().getId(),'slotVisibilityChanged',event, event.inViewPercentage);
        let slotId = event.slot.getSlotId().getId();
        //this.addEvent({name: 'SlotVisibilityChangedEvent'}, event.slot.getSlotId().getId());
        if (this.slotRepository.adSlots[slotId]) {
          this.slotRepository.adSlots[slotId].visibility = event.inViewPercentage;
        }
      });

    });
  }

  public init(googletag: googletag.Googletag, pubads: googletag.PubAdsService) {
    //console.log('init', googletag, pubads);
    this.commandBuffer = this.cmd;
    (this.cmd as any).push = (cb: Function) => {
      //console.log('call from adhandler');
      cb();
    }

    this.commandBuffer.forEach(command => {
      this.cmd.push(command);
    });

    this.startRefreshInterval();
  }

  displaySlot(targetDevice, slotCode, sizes, containerId, opts) {

    //console.log('display slot', window.google_DisableInitialLoad, googletag.pubadsReady);
    if (this.slotIdIsDefined(containerId)) {
      return;
    }

    if (targetDevice !== this.devices.All && targetDevice !== this.getCurrentDevice()) {
      return;
    }
    if (typeof opts !== "undefined" && opts.isLazy === true) {
      delete opts.isLazy;
      this.lazySlots[containerId] = () => {
        this.displaySlot(targetDevice, slotCode, sizes, containerId, opts);
      }
      this.attachLazyslot(containerId);
      return;
    }

    let slot  = new AdSlot(containerId, this.globalContextRegistry, opts);

    slot.setup(slotCode, sizes, containerId, opts);

    this.addAdSlot(slot);

    slot.display();

    var that = this;
  }

  addAdSlot(s: AdSlot) {
    return this.slotRepository.insert(s);
  }

  slotIdIsDefined(containerId){
    return false;
  }

  isMobile() {
    return (window.screen.width <= 600);
  }

  getCurrentDevice() {
    return (window.screen.width <= 600) ? 'mobile' : 'desktop';
  }

  addEvent(event, slotId) {
    //console.log(event, slotId);
    if (this.slotRepository.adSlots[slotId]) {
      event.time = window.performance.now();
      this.slotRepository.adSlots[slotId].events.push(event);
    } else {
      //console.log(this.slotRepository.adSlots[slotId]);
      console.log('slot not defined on adEvent', event, slotId, window.performance.now());
    }
  }

  initLazySlotsObserver(){

    const options = {
      root: null,
      rootMargin: '150px',
      threshold: 0
    };

    this.lazySlotsObserver = new IntersectionObserver( (entries, observer) =>{
      //console.log(observer);
      entries.forEach(entry => {
        //console.log(entry);
        if (entry.isIntersecting) {
          //console.log('ok ', entry.target);
          observer.unobserve(entry.target);
          this.lazySlots[entry.target.id]();
          delete this.lazySlots[entry.target.id];
        }
      });
    }, options);
  }

  attachLazyslot(domId){
    //console.log('attachingLazysSlot');
    this.lazySlotsObserver.observe(document.getElementById(domId));
  }

  processContext(context){
    return;
    //find slots by context
    //count viewed
    //track to analytics
    //context url, device, slots, viewed slots, refreshed slots
    console.log('process context', context);
    let slots = this.slotRepository.findByContext(context);
    console.log('slots found for ctx',slots);
    let viewedSlots = slots.reduce(function (acc, obj) { 
      return acc + obj.viewed; }, 
    0);

    console.log('viewed/slots', viewedSlots +'/'+slots.length );
    console.log('viewability: ', Math.round((viewedSlots/slots.length) * 100));
  }

  setContext(ctx) {
    if(this.globalContextRegistry.length > 0) {
      this.processContext(this.globalContextRegistry[this.globalContextRegistry.length-1]);
    }
    this.globalContext = ctx;
    this.globalContextRegistry.push(ctx);
    //console.log('context', ctx);  
    googletag.cmd.push(() => {
      //console.log('gooogpush',ctx);
      for(var x in ctx) {
        //console.log('settarg',ctx[x]);
        googletag.pubads().setTargeting(x, ctx[x]);
      }
    });
  }

  startRefreshInterval() {
    //console.log('start refresh inverval');
    this.refreshInterval = setInterval( ()=> {
      let url = window.location.href;
      if (document.hasFocus()) {
        this.refreshSlotsByUrl(url);
      }
    }, this.refreshRate * 1000);
  }

  refreshSlotsByUrl(currentUrl) {
    for (let x in this.slotRepository.adSlots) {
      if (this.slotIsVisible(this.slotRepository.adSlots[x])) {
        //console.log('refreshSlot', this.slotRepository.adSlots[x].id);
        googletag.pubads().refresh([this.slotRepository.adSlots[x].dfpSlot]);
      }
    }
  }

  slotIsVisible(slot) {
    return slot.visibility > 50;
  }

}


