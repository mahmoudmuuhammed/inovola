// We can extend this with more properties if we need extra metadata.
export type PageMetaDto = Readonly<{
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}>;

export interface PaginationData {
  readonly skip: number;
  readonly limit: number;
}
