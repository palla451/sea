// import { TestBed } from '@angular/core/testing';
// import { AppComponent } from './app.component';

// describe('AppComponent', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AppComponent],
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it(`should have the 'nacyse' title`, () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app.title).toEqual('nacyse');
//   });

//   it('should render title', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('h1')?.textContent).toContain('Hello, nacyse');
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Store } from '@ngrx/store';
import { AlertComponent } from './core/components/alert/alert.component';
import { LoaderComponent } from './core/components/loader/loader.component';
import { SpinnerService } from './core/services/spinner.service';
import { BehaviorSubject, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

// Mock services
class MockStore {
  selectSignal = jasmine.createSpy().and.returnValue(() => []);
}

class MockSpinnerService {
  getLoading = jasmine.createSpy().and.returnValue(of(false));
}
class MockActivatedRoute {
  navigateByUrl(url: string) {
    return url;
  }

  serializeUrl(url: string) {
    return url;
  }
}
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store;
  let spinnerService: SpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent, LoaderComponent],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: MessageService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    spinnerService = TestBed.inject(SpinnerService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "nacyse"', () => {
    expect(component.title).toEqual('nacyse');
  });

  it('should initialize messages from store', () => {
    expect(component.messages).toBeDefined();
    expect(store.selectSignal).toHaveBeenCalled();
  });

  it('should initialize spinner signal', () => {
    expect(component.showSpinner).toBeDefined();
    expect(spinnerService.getLoading).toHaveBeenCalled();
    expect(component.showSpinner()).toBeFalse();
  });

  it('should update spinner signal when service emits', () => {
    // Arrange
    const mockSpinnerService = TestBed.inject(
      SpinnerService
    ) as jasmine.SpyObj<SpinnerService>;
    const mockBSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
    mockSpinnerService.getLoading.and.returnValue(mockBSubject);

    // Recreate component to get new observable
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Assert
    expect(component.showSpinner()).toBeTrue();
  });
});
