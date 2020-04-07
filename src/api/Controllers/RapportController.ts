import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Rapport } from '../../entities/Rapport';

export default class RapportController extends Controller {

    rapportRepository: Repository<Rapport>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.rapportRepository = connection.getRepository(Rapport)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postRapport(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllRapport(router)
        await this.getSingleRapport(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editRapport(router);
    }

    private async getAllRapport(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var rapports: Rapport[] = await this.fetchRapportsFromDatabase()
                await this.sendResponse(res, 200, { data: rapports })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchRapportsFromDatabase(): Promise<Rapport[]> {
        return await this.rapportRepository.find()
    }

    private async getSingleRapport(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var rapport: Rapport = await this.fetchRapportFromDatabase(req.params.id)
                if (await this.isRapportExist(rapport)) {
                    await this.sendResponse(res, 200, { data: rapport })
                } else {
                    await this.sendResponse(res, 404, { message: "Rapport Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchRapportFromDatabase(id: string): Promise<Rapport> {
        return this.rapportRepository.findOne(id)
    }
    private async isRapportExist(rapport: Rapport): Promise<boolean> {
        return rapport !== undefined
    }

    async postRapport(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var rapportToSave: Rapport = await this.createRapportFromRequest(req)
                var rapportSaved: Rapport = await this.saveRapportToDatabase(rapportToSave)
                await this.sendResponse(res, 201, { message: "Rapport Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Rapport Not Added", error: error })
            }
            next()
        })
    }
    private async createRapportFromRequest(req: Request): Promise<Rapport> {
        return this.rapportRepository.create(req.body as Object)
    }
    private async saveRapportToDatabase(rapport: Rapport): Promise<Rapport> {
        return await this.rapportRepository.save(rapport);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idRapport", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var rapport: Rapport = await this.rapportRepository.findOne(req.params.idRapport)
                await this.rapportRepository.remove(rapport)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editRapport(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var rapportToModify: Rapport = await this.rapportRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Rapport Not Found" });
                    return
                }
                try {
                    var rapportModifiedReadyToSave: Rapport = await this.mergeRapportFromRequest(rapportToModify, req);
                    await this.updateRapportInDatabase(rapportModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Rapport Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Rapport Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeRapportFromRequest(rapportToModify: Rapport, req: Request): Promise<Rapport> {
        return this.rapportRepository.merge(rapportToModify, req.body)
    }
    private async updateRapportInDatabase(rapportToUpdate: Rapport): Promise<Rapport> {
        return await this.rapportRepository.save(rapportToUpdate)
    }

}