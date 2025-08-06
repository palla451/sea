import { TestBed } from "@angular/core/testing";
import { AssetManagementService } from "./asset-management.service";
import { ApiService } from "../../../core/services/api.service";

describe("AssetManagementService", () => {
  let service: AssetManagementService;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj("ApiService", ["get", "patch"]);

    TestBed.configureTestingModule({
      providers: [
        AssetManagementService,
        { provide: ApiService, useValue: apiSpy },
      ],
    });

    service = TestBed.inject(AssetManagementService);
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getAssets", () => {
    it("should return mocked asset array", (done) => {
      service.getAssets().subscribe((assets) => {
        expect(assets.length).toBe(16);
        expect(assets[0].id).toBe(1);
        done();
      });
    });
  });

  // describe("patchAsset", () => {
  //   it("should return mocked asset array on patch", (done) => {
  //     const mockState = JSON.stringify({ id: 1, name: "UpdatedAsset1" });

  //     service.patchAsset(mockState).subscribe((response) => {
  //       expect(response.length).toBe(16);
  //       expect(response[0].name).toBe("Asset1");
  //       done();
  //     });
  //   });
  // });
});
