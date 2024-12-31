import { PageMetaDto } from "./pagination";

export type PageDto<T> = Readonly<{
  data: T[];
  meta: PageMetaDto;
}>;

export type JsonResponse<T> = Readonly<{
  data: T;
}>;
