// import { ComponentFixture, TestBed } from "@angular/core/testing";

// import { GenericModalComponent } from "./generic-modal.component";
// import { on } from "@ngrx/store";

// describe("GenericModalComponent", () => {
//   let component: GenericModalComponent;
//   let fixture: ComponentFixture<GenericModalComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [GenericModalComponent],
//     }).compileComponents();

//     fixture = TestBed.createComponent(GenericModalComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should call modalInstance.onClose when close() is called", () => {
//     const onCloseSpy = jasmine.createSpy("onClose");
//     component.modalInstance = {
//       onClose: onCloseSpy,
//       onSave: () => {},
//       translationModalName: "",
//       translationParams: {},
//     };
//     component.close();
//     expect(onCloseSpy).toHaveBeenCalled();
//   });

//   it("should call modalInstance.onSave when confirm() is called", () => {
//     const onSaveSpy = jasmine.createSpy("onSave");
//     component.modalInstance = {
//       onClose: () => {},
//       onSave: onSaveSpy,
//       translationModalName: "",
//       translationParams: {},
//     };
//     component.confirm();
//     expect(onSaveSpy).toHaveBeenCalled();
//   });

//   it("should emit false and set visible to false on onHideDialog()", () => {
//     spyOn(component.visibleChange, "emit");
//     component.visible = true;
//     component.onHideDialog();
//     expect(component.visible).toBeFalse();
//     expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
//   });
// });
