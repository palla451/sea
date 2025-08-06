import { TestBed } from "@angular/core/testing";

import { RetrieveCyberProductsService } from "./retrieve-cyber-products.service";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("RetrieveCyberProductsService", () => {
  let service: RetrieveCyberProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RetrieveCyberProductsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
