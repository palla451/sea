import { TestBed } from "@angular/core/testing";

import {
  AssetSidebarService,
  AssetsTableColumns,
} from "./asset-sidebar.service";

describe("AssetSidebarService", () => {
  let service: AssetSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetSidebarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
