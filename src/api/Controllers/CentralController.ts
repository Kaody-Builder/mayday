import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Central } from '../../entities/Central';

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
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
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
                next()
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
                    if (await this.isCentralSaved(centralSaved))
                        await this.sendResponse(res, 201, { message: "Central Added Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Central Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async isCentralSaved(central: Central): Promise<boolean> {
        return central !== undefined
    }

    private async createCentralFromRequest(req: Request): Promise<Central> {
        return this.centralRepository.create(req.body as Object)
    }
    private async saveCentralToDatabase(central: Central): Promise<Central> {
        return await this.centralRepository.save(central);
    }


    
    private async deleteById(router: Router): Promise<void>{
        router.delete("/:idCentral", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var central: Central = await this.centralRepository.findOne(req.params.idCentral)
                await this.centralRepository.remove(central)
                res.status(204).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }



    private async editCentral(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                var centralToModify: Central = await this.fetchCentralFromDatabase(req.params.id);
                if (this.isCentralExist(centralToModify)) {
                    var centralModifiedReadyToSave: Central = await this.mergeCentralFromRequest(centralToModify, req);
                    var centralModified: Central = await this.updateCentralInDatabase(centralModifiedReadyToSave);
                    if (await this.isCentralExist(centralModified))
                        await this.sendResponse(res, 204, { message: "Central Modified Successfully" });
                    else
                        await this.sendResponse(res, 403, { message: "Central Not Modified" });
                }
                else {
                    await this.sendResponse(res, 404, { message: "Central Not Found" });
                }
                next();
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