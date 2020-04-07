import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Signalement } from '../../entities/Signalement';
import * as wkx from "wkx"



export default class SignalementController extends Controller {

    signalementRepository: Repository<Signalement>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
             var connection: Connection = await createConnection(ormconfig)
             this.signalementRepository = connection.getRepository(Signalement)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postSignalement(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllSignalement(router)
        await this.getSingleSignalement(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editSignalement(router);
    }

    private async getAllSignalement(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var signalements: Signalement[] = await this.fetchSignalementsFromDatabase()
                await this.sendResponse(res, 200, { data: signalements })
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchSignalementsFromDatabase(): Promise<Signalement[]> {
        return await this.signalementRepository.find()
    }

    private async getSingleSignalement(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var signalement: Signalement = await this.fetchSignalementFromDatabase(req.params.id)
                if (await this.isSignalementExist(signalement)) {
                    await this.sendResponse(res, 200, { data: signalement })
                } else {
                    await this.sendResponse(res, 404, { message: "Signalement Not Found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchSignalementFromDatabase(id: string): Promise<Signalement> {
        return this.signalementRepository.findOne(id)
    }
    private async isSignalementExist(signalement: Signalement): Promise<boolean> {
        return signalement !== undefined
    }

    async postSignalement(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var signalementToSave: Signalement = await this.createSignalementFromRequest(req)
                var signalementSaved: Signalement = await this.saveSignalementToDatabase(signalementToSave)
                await this.sendResponse(res, 201, { message: "Signalement Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Signalement Not Added", error: error })
            }
            next()
        })
    }
    private async createSignalementFromRequest(req: Request): Promise<Signalement> {
        return this.signalementRepository.create(req.body as Object)
    }
    private async saveSignalementToDatabase(signalement: Signalement): Promise<Signalement> {
        return await this.signalementRepository.save(signalement);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idSignalement", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var signalement: Signalement = await this.signalementRepository.findOne(req.params.idSignalement)
                await this.signalementRepository.remove(signalement)
                await this.sendResponse(res, 200, { message: "Signalement delete succesfully"});
            }
            catch (error) {
                await this.sendResponse(res, 403, { message: "Signalement Not deleted", error: error });
            }
        });
    }

    private async editSignalement(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var signalementToModify: Signalement = await this.signalementRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Signalement Not Found" });
                    return
                }
                try {
                    var signalementModifiedReadyToSave: Signalement = await this.mergeSignalementFromRequest(signalementToModify, req);
                    await this.updateSignalementInDatabase(signalementModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Signalement Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Signalement Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeSignalementFromRequest(signalementToModify: Signalement, req: Request): Promise<Signalement> {
        return this.signalementRepository.merge(signalementToModify, req.body)
    }
    private async updateSignalementInDatabase(signalementToUpdate: Signalement): Promise<Signalement> {
        return await this.signalementRepository.save(signalementToUpdate)
    }

}