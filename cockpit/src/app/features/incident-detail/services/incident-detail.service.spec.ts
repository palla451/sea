import { TestBed } from "@angular/core/testing";

import { IncidentDetailService } from "./incident-detail.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("IncidentDetailService", () => {
  let service: IncidentDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(IncidentDetailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
