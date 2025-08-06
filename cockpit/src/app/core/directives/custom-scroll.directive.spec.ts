import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomScrollDirective } from './custom-scroll.directive';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CustomScrollDirective],
  template: `<div custom-scroll style="width: 200px; height: 200px;"></div>`,
})
class TestComponent {}

describe('CustomScrollDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugEl: DebugElement;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, CustomScrollDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    debugEl = fixture.debugElement.query(By.directive(CustomScrollDirective));
    element = debugEl.nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance of the directive', () => {
    const directive = debugEl.injector.get(CustomScrollDirective);
    expect(directive).toBeTruthy();
  });

  it('should add class on mousemove near right edge', () => {
    spyOn(element, 'getBoundingClientRect').and.returnValue({
      right: 210,
    } as DOMRect);

    const event = new MouseEvent('mousemove', { clientX: 205 });
    element.dispatchEvent(event);
    fixture.detectChanges();

    expect(
      element.classList.contains('custom-scroll-vertical-hover')
    ).toBeTrue();
  });

  it('should remove class if mouse moves away from right edge', () => {
    spyOn(element, 'getBoundingClientRect').and.returnValue({
      right: 210,
    } as DOMRect);

    // Prima aggiunge
    let event = new MouseEvent('mousemove', { clientX: 205 });
    element.dispatchEvent(event);
    fixture.detectChanges();

    // Poi si allontana
    event = new MouseEvent('mousemove', { clientX: 100 });
    element.dispatchEvent(event);
    fixture.detectChanges();

    expect(
      element.classList.contains('custom-scroll-vertical-hover')
    ).toBeFalse();
  });

  it('should remove class on mouseout', () => {
    spyOn(element, 'getBoundingClientRect').and.returnValue({
      right: 210,
    } as DOMRect);

    // Simula mousemove prima, per settare hostElement
    const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 205 });
    element.dispatchEvent(mouseMoveEvent);
    fixture.detectChanges();

    // Adesso il mouse esce
    const mouseOutEvent = new MouseEvent('mouseout');
    element.dispatchEvent(mouseOutEvent);
    fixture.detectChanges();

    expect(
      element.classList.contains('custom-scroll-vertical-hover')
    ).toBeFalse();
  });
});
