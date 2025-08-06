import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { AlertComponent } from "./alert.component";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { messageActions } from "../../state/actions";
import { ToastMessage } from "../../models/toastMessage.model";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { ToastModule } from "primeng/toast"; // Importa ToastModule

describe("AlertComponent", () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let store: MockStore;
  let messageService: jasmine.SpyObj<MessageService>;

  const initialState = { messages: [] };

  beforeEach(() => {
    messageService = jasmine.createSpyObj("MessageService", ["add"]);

    TestBed.configureTestingModule({
      imports: [AlertComponent, ToastModule], // Importa ToastModule
      providers: [
        provideMockStore({ initialState }),
        { provide: MessageService, useValue: messageService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should call store.dispatch when a message is closed", () => {
    const mockToastCloseEvent = {
      message: { id: "1" },
    };

    spyOn(store, "dispatch");

    component.onMessageClose(mockToastCloseEvent);

    expect(store.dispatch).toHaveBeenCalledWith(
      messageActions.removeMessage({ id: "1" })
    );
  });
});
