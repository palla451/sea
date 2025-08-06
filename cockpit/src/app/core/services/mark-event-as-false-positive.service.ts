import { inject, Injectable } from "@angular/core";
import {
  MarkEventAsFalsePositiveRequest,
  MarkEventAsFalsePositiveResponse,
} from "../models/mark-event-as-false-positive.model";
import { ApiService } from "./api.service";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { API_ENDPOINTS } from "../../../environments/api-endpoints";

@Injectable({
  providedIn: "root",
})
export class MarkEventAsFalsePositiveService {
  private apiService = inject(ApiService);

  mockedResponseMarkEventAsFalsePositive: MarkEventAsFalsePositiveResponse = {
    id: 74,
    status: "Rejected",
    note: "prova false positive",
  };

  markEventAsFalsePositive(
    markEventAsFalsePositiveRequest: MarkEventAsFalsePositiveRequest
  ): Observable<MarkEventAsFalsePositiveResponse> {
    if (environment.isMockActive) {
      return of(this.mockedResponseMarkEventAsFalsePositive);
    } else {
      const apiurl = API_ENDPOINTS["mark_event_as_false_positive"];
      return this.apiService.patch<MarkEventAsFalsePositiveResponse>(
        apiurl,
        markEventAsFalsePositiveRequest
      );
    }
  }
}
