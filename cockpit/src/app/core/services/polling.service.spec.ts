import { TestBed } from "@angular/core/testing";

import { PollingService } from "./polling.service";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

describe("PollingService", () => {
  let service: PollingService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: {} })],
    });
    service = TestBed.inject(PollingService);
    store = TestBed.inject(MockStore);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
