import { ClickOutsideDirective } from "./click-outside.directive";
import { ElementRef } from "@angular/core";

describe("ClickOutsideDirective", () => {
  let mockElementRef: ElementRef;

  beforeEach(() => {
    mockElementRef = {
      nativeElement: document.createElement("div"),
    };
  });

  it("should create an instance", () => {
    const directive = new ClickOutsideDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
