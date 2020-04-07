import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Reponse } from '../../entities/Reponse';

export default class ReponseController extends Controller {

    reponseRepository: Repository<Reponse>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.reponseRepository = connection.getRepository(Reponse)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postReponse(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllReponse(router)
        await this.getSingleReponse(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editReponse(router);
    }

    private async getAllReponse(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reponses: Reponse[] = await this.fetchReponsesFromDatabase()
                await this.sendResponse(res, 200, { data: reponses })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchReponsesFromDatabase(): Promise<Reponse[]> {
        return await this.reponseRepository.find()
    }

    private async getSingleReponse(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var reponse: Reponse = await this.fetchReponseFromDatabase(req.params.id)
                if (await this.isReponseExist(reponse)) {
                    await this.sendResponse(res, 200, { data: reponse })
                } else {
                    await this.sendResponse(res, 404, { message: "Reponse Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchReponseFromDatabase(id: string): Promise<Reponse> {
        return this.reponseRepository.findOne(id)
    }
    private async isReponseExist(reponse: Reponse): Promise<boolean> {
        return reponse !== undefined
    }

    async postReponse(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reponseToSave: Reponse = await this.createReponseFromRequest(req)
                var reponseSaved: Reponse = await this.saveReponseToDatabase(reponseToSave)
                await this.sendResponse(res, 201, { message: "Reponse Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Reponse Not Added", error: error })
            }
            next()
        })
    }
    private async createReponseFromRequest(req: Request): Promise<Reponse> {
        return this.reponseRepository.create(req.body as Object)
    }
    private async saveReponseToDatabase(reponse: Reponse): Promise<Reponse> {
        return await this.reponseRepository.save(reponse);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idReponse", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reponse: Reponse = await this.reponseRepository.findOne(req.params.idReponse)
                await this.reponseRepository.remove(reponse)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editReponse(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var reponseToModify: Reponse = await this.reponseRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reponse Not Found" });
                    return
                }
                try {
                    var reponseModifiedReadyToSave: Reponse = await this.mergeReponseFromRequest(reponseToModify, req);
                    await this.updateReponseInDatabase(reponseModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Reponse Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Reponse Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeReponseFromRequest(reponseToModify: Reponse, req: Request): Promise<Reponse> {
        return this.reponseRepository.merge(reponseToModify, req.body)
    }
    private async updateReponseInDatabase(reponseToUpdate: Reponse): Promise<Reponse> {
        return await this.reponseRepository.save(reponseToUpdate)
    }

}