import { Request, Response, NextFunction, Router } from "express";
import { UnitOfWorkFactory } from "./../../../../lib/unitOfWork/unitOfWorkFactory";
import { unitOfWorkSymbols } from "./../../../../lib/unitOfWork/symbols";
import { BearerToken } from "./../../../httpRouter/middlewares/bearerTokenMiddleware";
import { ResponseBuilder } from "../../../../common/helpers";
import { AdminService } from "../application/services/admin/adminService";
import { adminSymbols } from "../symbols";
import { Inject, Injectable } from "../../../../lib/dependencyInjection";
import { HttpStatusCode } from "../../../../common/types";
import { HttpController } from "../../../../common/http/httpController";
import { AdminRoleSlug } from "../domain/adminRole";

@Injectable()
export class AdminController implements HttpController {
  public readonly basePath: string = "";
  public readonly router: Router = Router();

  constructor(
    @Inject(adminSymbols.adminService)
    private readonly adminService: AdminService,
    @Inject(unitOfWorkSymbols.unitOfWorkFactory)
    private readonly unitOfWorkFactory: UnitOfWorkFactory
  ) {
    this.router.get(
      `${this.basePath}/profile`,
      BearerToken.authorize([
        AdminRoleSlug.OWNER,
        AdminRoleSlug.MANAGER,
        AdminRoleSlug.LEADER,
        AdminRoleSlug.CASHIER,
      ]),
      this.getProfile
    );

    this.router
      .route(`${this.basePath}/admins`)
      .get(BearerToken.authorize([AdminRoleSlug.OWNER]), this.getAllAdmins)
      .post(BearerToken.authorize([AdminRoleSlug.OWNER]), this.createAdmin);

    this.router
      .route(`${this.basePath}/admins/:adminId`)
      .put(BearerToken.authorize([AdminRoleSlug.OWNER]), this.updateAdmin)
      .get(BearerToken.authorize([AdminRoleSlug.OWNER]), this.getAdmin)
      .delete(BearerToken.authorize([AdminRoleSlug.OWNER]), this.deleteAdmin);

    this.router
      .route(`/branches`)
      .get(
        BearerToken.authorize([
          AdminRoleSlug.OWNER,
          AdminRoleSlug.MANAGER,
          AdminRoleSlug.LEADER,
          AdminRoleSlug.CASHIER,
        ]),
        this.assignedBranches
      );
  }

  private createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.adminService.createAdmin({
          unitOfWork,
          draft: req.body,
        });
      });

      const response = ResponseBuilder.json({ id: payload.id });

      res.status(HttpStatusCode.created).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private getAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { adminId } = req.params;

      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.adminService.getAdmin({
          adminId,
          unitOfWork,
          query: req.query,
        });
      });

      const response = ResponseBuilder.json(payload);

      res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private updateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { adminId } = req.params;

      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.adminService.updateAdmin({
          unitOfWork,
          adminId,
          draft: req.body,
        });
      });

      const response = ResponseBuilder.json(payload);

      res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.adminService.getAdmin({
          unitOfWork,
          adminId: req.adminId,
          query: req.query,
        });
      });

      const response = ResponseBuilder.json(payload);

      return res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private getAllAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const { admins, count } = await unitOfWork.runInTransaction(async () => {
        return await this.adminService.getAdmins({
          unitOfWork,
          query: req.query as any,
        });
      });

      const response = ResponseBuilder.paginate(admins, count, req.query);

      return res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };

  private deleteAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { adminId } = req.params;

      const unitOfWork = await this.unitOfWorkFactory.create();

      await unitOfWork.runInTransaction(async () => {
        return await this.adminService.deleteAdmin({ adminId, unitOfWork });
      });

      return res.status(HttpStatusCode.noContent).json(null);
    } catch (error) {
      return next(error);
    }
  };

  private assignedBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const unitOfWork = await this.unitOfWorkFactory.create();

      const payload = await unitOfWork.runInTransaction(async () => {
        return await this.adminService.assignedBranches({
          adminId: req.adminId,
          unitOfWork,
        });
      });

      const response = ResponseBuilder.json(payload);

      return res.status(HttpStatusCode.ok).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
