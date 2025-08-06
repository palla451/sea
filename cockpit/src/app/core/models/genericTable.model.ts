export interface TableState {
  [tableId: string]: {
    columns: TableColumn[];
    rows: number;
    heightClass: string;
  };
}

export interface TableColumn {
  field: string;
  header: string;
  visible: boolean;
  sortable?: boolean;
}
