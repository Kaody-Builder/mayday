import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Report } from '../../entities/Report';

export default class ReportController extends Controller {

    reportRepository: Repository<Report>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.reportRepository = connection.getRepository(Report)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postReport(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllReport(router)
        await this.getSingleReport(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editReport(router);
    }

    private async getAllReport(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reports: Report[] = await this.fetchReportsFromDatabase()
                await this.sendResponse(res, 200, { data: reports })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchReportsFromDatabase(): Promise<Report[]> {
        return await this.reportRepository.find()
    }

    private async getSingleReport(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var report: Report = await this.fetchReportFromDatabase(req.params.id)
                if (await this.isReportExist(report)) {
                    await this.sendResponse(res, 200, { data: report })
                } else {
                    await this.sendResponse(res, 404, { message: "Report Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchReportFromDatabase(id: string): Promise<Report> {
        return this.reportRepository.findOne(id)
    }
    private async isReportExist(report: Report): Promise<boolean> {
        return report !== undefined
    }

    async postReport(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reportToSave: Report = await this.createReportFromRequest(req)
                var reportSaved: Report = await this.saveReportToDatabase(reportToSave)
                await this.sendResponse(res, 201, { message: "Report Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Report Not Added", error: error })
            }
            next()
        })
    }
    private async createReportFromRequest(req: Request): Promise<Report> {
        return this.reportRepository.create(req.body as Object)
    }
    private async saveReportToDatabase(report: Report): Promise<Report> {
        return await this.reportRepository.save(report);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idReport", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var report: Report = await this.reportRepository.findOne(req.params.idReport)
                await this.reportRepository.remove(report)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editReport(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var reportToModify: Report = await this.reportRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Report Not Found" });
                    return
                }
                try {
                    var reportModifiedReadyToSave: Report = await this.mergeReportFromRequest(reportToModify, req);
                    await this.updateReportInDatabase(reportModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Report Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Report Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeReportFromRequest(reportToModify: Report, req: Request): Promise<Report> {
        return this.reportRepository.merge(reportToModify, req.body)
    }
    private async updateReportInDatabase(reportToUpdate: Report): Promise<Report> {
        return await this.reportRepository.save(reportToUpdate)
    }

}