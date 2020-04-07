import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Pays } from '../../entities/Pays';

export default class PaysController extends Controller {

    paysRepository: Repository<Pays>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.paysRepository = connection.getRepository(Pays)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postPays(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllPays(router)
        await this.getSinglePays(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editPays(router);
    }

    private async getAllPays(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var payss: Pays[] = await this.fetchPayssFromDatabase()
                await this.sendResponse(res, 200, { data: payss })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchPayssFromDatabase(): Promise<Pays[]> {
        return await this.paysRepository.find()
    }

    private async getSinglePays(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var pays: Pays = await this.fetchPaysFromDatabase(req.params.id)
                if (await this.isPaysExist(pays)) {
                    await this.sendResponse(res, 200, { data: pays })
                } else {
                    await this.sendResponse(res, 404, { message: "Pays Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchPaysFromDatabase(id: string): Promise<Pays> {
        return this.paysRepository.findOne(id)
    }
    private async isPaysExist(pays: Pays): Promise<boolean> {
        return pays !== undefined
    }

    async postPays(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var paysToSave: Pays = await this.createPaysFromRequest(req)
                var paysSaved: Pays = await this.savePaysToDatabase(paysToSave)
                await this.sendResponse(res, 201, { message: "Pays Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Pays Not Added", error: error })
            }
            next()
        })
    }
    private async createPaysFromRequest(req: Request): Promise<Pays> {
        return this.paysRepository.create(req.body as Object)
    }
    private async savePaysToDatabase(pays: Pays): Promise<Pays> {
        return await this.paysRepository.save(pays);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idPays", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var pays: Pays = await this.paysRepository.findOne(req.params.idPays)
                await this.paysRepository.remove(pays)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editPays(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var paysToModify: Pays = await this.paysRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Pays Not Found" });
                    return
                }
                try {
                    var paysModifiedReadyToSave: Pays = await this.mergePaysFromRequest(paysToModify, req);
                    await this.updatePaysInDatabase(paysModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Pays Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Pays Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergePaysFromRequest(paysToModify: Pays, req: Request): Promise<Pays> {
        return this.paysRepository.merge(paysToModify, req.body)
    }
    private async updatePaysInDatabase(paysToUpdate: Pays): Promise<Pays> {
        return await this.paysRepository.save(paysToUpdate)
    }

}