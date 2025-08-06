import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";

@Directive({
  selector: "[appClickOutside]",
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener("document:click", ["$event.target"])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
