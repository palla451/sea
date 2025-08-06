import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CyberProductPageComponent } from "./cyber-product-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { getTranslocoModule } from "../../../shared/transloco-testing.module";

describe("CyberProductPageComponent", () => {
  let component: CyberProductPageComponent;
  let fixture: ComponentFixture<CyberProductPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CyberProductPageComponent,
        HttpClientTestingModule,
        getTranslocoModule(),
      ],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CyberProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
