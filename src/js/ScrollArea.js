import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll'
import Typed from 'typed.js';
import gsap from 'gsap';

Scrollbar.use(OverscrollPlugin)

const map = (value, min1, max1, min2, max2) => min2 + (max2 - min2) * (value - min1) / (max1 - min1);
function ScrollArea() {
    this.progress = 0;
    this.$els = {
        progressCurrent: document.querySelector('.scroll-progress-current')
    }

    this.init();
    this.bindEvents();

}


ScrollArea.prototype.init = function() {
    this.Scroll = Scrollbar.init(document.querySelector('.scrollarea'), {
        delegateTo: document,
        continuousScrolling : false,
        overscrollEffect: 'bounce',
        damping: 0.05,
        
    })

    this.Scroll.track.xAxis.element.remove()
    this.Scroll.track.yAxis.element.remove()

    Scrollbar.detachStyle()

    this.updateScrollBar();

    new Typed('.typed', {
      strings: ["portfolio"],
      typeSpeed: 60
    });

}
ScrollArea.prototype.bindEvents = function() {
    this.Scroll.addListener(s => this.onScroll(s));
}
ScrollArea.prototype.updateScrollBar = function() {
    const progress = 100 - map(this.progress * 100, 0, 100, 3, 100);
    gsap.to(this.$els.progressCurrent, 0.3, { yPercent: -progress, force3D: true })
}

ScrollArea.prototype.onScroll = function(status) {

    this.progress = status.offset.y / status.limit.y

    // Tween.to(this.$els.title, 0.3, { x: -this.progress * offsetTitle, force3D: true })
    this.updateScrollBar()
}

export default ScrollArea;
