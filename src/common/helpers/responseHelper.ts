import { JsonResponse, PageDto } from "../types";
import { PageOptionsDto } from "../validators/shared.validator";

// Shared response helper
export class ResponseBuilder {
  // Result of array
  public static paginate<T>(
    data: T[],
    total: number,
    options: Partial<PageOptionsDto>
  ): PageDto<T> {
    const limit = parseInt(options.limit!, 10);
    const page = parseInt(options.page!, 10);

    const totalPages = Math.ceil(total / limit);

    const from = (page - 1) * limit + 1;
    const to = Math.min(from + limit - 1, total);

    return {
      data,
      meta: {
        total,
        current_page: parseInt(options?.page!, 10),
        per_page: parseInt(options.limit!, 10),
        from,
        to,
        last_page: totalPages,
      },
    };
  }

  public static json<T>(data: T): JsonResponse<T> {
    return {
      data,
    };
  }
}
