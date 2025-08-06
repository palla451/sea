import { Directive, ElementRef, Input, OnInit, OnDestroy } from "@angular/core";

@Directive({
  selector: "[appCountUp]",
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input("appCountUp") endValue = 0;
  @Input() duration = 1000; // in ms

  private frameId: number | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const startTime = performance.now();
    const start = 0;
    const end = this.endValue;
    const duration = this.duration;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      this.el.nativeElement.textContent = current;
      if (progress < 1) {
        this.frameId = requestAnimationFrame(step);
      }
    };

    this.frameId = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
