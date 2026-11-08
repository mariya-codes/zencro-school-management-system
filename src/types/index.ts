export * from './auth';
export * from './school';
export * from './academics';
export * from './student';
export * from './attendance';
export * from './fees';
export * from './exams';
export * from './report-cards';
export * from './communication';
export * from './import-export';
export * from './dashboard';
export * from './privacy';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
