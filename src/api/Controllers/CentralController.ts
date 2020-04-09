import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Central } from '../../entities/Central';
import * as wkx from "wkx"



export default class CentralController extends Controller {

    centralRepository: Repository<Central>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
             var connection: Connection = await createConnection(ormconfig)
             this.centralRepository = connection.getRepository(Central)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postCentral(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllCentral(router)
        await this.getSingleCentral(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editCentral(router);
    }

    private async getAllCentral(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var centrals: Central[] = await this.fetchCentralsFromDatabase()
                await this.sendResponse(res, 200, { data: centrals })
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async getAllAttente(router: Router): Promise<void> {
        router.get("/:idCent/attente", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var attentes: Attente[] = await this.fetchAttentesFromDatabase()
                await this.sendResponse(res, 200, { data: attentes })
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchAttentesFromDatabase(): Promise<Attente[]> {
        return await this.attenteRepository.find()
    }

    private async getSingleAttente(router: Router) {
        router.get("/:idCent/attente/:numTel", async (req, res, next) => {
            try {
                var attente: Attente = await this.fetchAttenteFromDatabase(req.params.id)
                if (await this.isAttenteExist(attente)) {
                    await this.sendResponse(res, 200, { data: attente })
                } else {
                    await this.sendResponse(res, 404, { message: "Attente Not Found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchAttenteFromDatabase(id: string): Promise<Attente> {
        return this.attenteRepository.findOne(id)
    }


    private async fetchCentralsFromDatabase(): Promise<Central[]> {
        return await this.centralRepository.find()
    }

    private async getSingleCentral(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var central: Central = await this.fetchCentralFromDatabase(req.params.id)
                if (await this.isCentralExist(central)) {
                    await this.sendResponse(res, 200, { data: central })
                } else {
                    await this.sendResponse(res, 404, { message: "Central Not Found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchCentralFromDatabase(id: string): Promise<Central> {
        return this.centralRepository.findOne(id)
    }
    private async isCentralExist(central: Central): Promise<boolean> {
        return central !== undefined
    }

    async postCentral(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var centralToSave: Central = await this.createCentralFromRequest(req)
                var centralSaved: Central = await this.saveCentralToDatabase(centralToSave)
                await this.sendResponse(res, 201, { message: "Central Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Central Not Added", error: error })
            }
            next()
        })
    }
    private async createCentralFromRequest(req: Request): Promise<Central> {
        return this.centralRepository.create(req.body as Object)
    }
    private async saveCentralToDatabase(central: Central): Promise<Central> {
        return await this.centralRepository.save(central);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idCentral", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var central: Central = await this.centralRepository.findOne(req.params.idCentral)
                await this.centralRepository.remove(central)
                await this.sendResponse(res, 200, { message: "Central delete succesfully"});
            }
            catch (error) {
                await this.sendResponse(res, 403, { message: "Central Not deleted", error: error });
            }
        });
    }

    private async editCentral(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var centralToModify: Central = await this.centralRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Central Not Found" });
                    return
                }
                try {
                    var centralModifiedReadyToSave: Central = await this.mergeCentralFromRequest(centralToModify, req);
                    await this.updateCentralInDatabase(centralModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Central Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Central Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeCentralFromRequest(centralToModify: Central, req: Request): Promise<Central> {
        return this.centralRepository.merge(centralToModify, req.body)
    }
    private async updateCentralInDatabase(centralToUpdate: Central): Promise<Central> {
        return await this.centralRepository.save(centralToUpdate)
    }

}