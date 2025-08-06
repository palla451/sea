export interface MarkEventAsFalsePositiveResponse
  extends MarkEventAsFalsePositiveRequest {
  status: string;
  incidentId?: number;
}

export interface MarkEventAsFalsePositiveRequest {
  id: number;
  note?: string;
}
