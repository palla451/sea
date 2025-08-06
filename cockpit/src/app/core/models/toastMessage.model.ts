export interface ToastMessage {
  id: string;
  severity: string;
  summary: string;
  detail: string;
  life?: number;
  sticky?: boolean;
}
