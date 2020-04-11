import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Distress } from '../../entities/Distress';
import Utils from '../SendEmail';

export default class DistressController extends Controller {

    distressRepository: Repository<Distress>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
             var connection: Connection = await createConnection(ormconfig)
             this.distressRepository = connection.getRepository(Distress)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postDistress(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllDistress(router)
        await this.getSingleDistress(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editDistress(router);
    }

    private async getAllDistress(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var distresss: Distress[] = await this.fetchDistresssFromDatabase()
                await this.sendResponse(res, 200, { data: distresss})
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchDistresssFromDatabase(): Promise<Distress[]> {
        return await this.distressRepository.find()
    }

    private async getSingleDistress(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var distress: Distress = await this.fetchDistressFromDatabase(req.params.id)
                if (await this.isDistressExist(distress)) {
                    await this.sendResponse(res, 200, { data: distress })
                } else {
                    await this.sendResponse(res, 404, { message: "Distress Not Found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchDistressFromDatabase(id: string): Promise<Distress> {
        return this.distressRepository.findOne(id)
    }
    private async isDistressExist(distress: Distress): Promise<boolean> {
        return distress !== undefined
    }

    async postDistress(router: Router) {
        router.post("/",async (req: Request, res: Response, next: NextFunction) => {
            var isOk = true
            try {
                var distressToSave: Distress = await this.createDistressFromRequest(req)
                distressToSave.codeDist = Math.floor(Math.random() * (9999 - 1000) + 1000).toString()
                distressToSave.levelDist = 0
                if(distressToSave.idUser == undefined || distressToSave.idUser == null)
                    throw "idUser not Provided";
                    
                var distressSaved: Distress = await this.saveDistressToDatabase(distressToSave)
                await this.sendResponse(res, 201, { message: "Distress Added Successfully"})
            } catch (error) {
                isOk = false
                await this.sendResponse(res, 403, { message: "Distress Not Added", error: error })
            }
            if(isOk)
                Utils.sendEmail(distressSaved.idUser.mailUser,distressSaved.codeDist)
            next()
        })
    }
    private async createDistressFromRequest(req: Request): Promise<Distress> {
        return this.distressRepository.create(req.body as Object)
    }
    private async saveDistressToDatabase(distress: Distress): Promise<Distress> {
        return await this.distressRepository.save(distress);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idDistress", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var distress: Distress = await this.distressRepository.findOne(req.params.idDistress)
                await this.distressRepository.remove(distress)
                await this.sendResponse(res, 200, { message: "Distress delete succesfully"});
            }
            catch (error) {
                await this.sendResponse(res, 403, { message: "Distress Not deleted", error: error });
            }
        });
    }

    private async editDistress(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var distressToModify: Distress = await this.distressRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Distress Not Found" });
                    return
                }
                try {
                    var distressModifiedReadyToSave: Distress = await this.mergeDistressFromRequest(distressToModify, req);
                    await this.updateDistressInDatabase(distressModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Distress Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Distress Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeDistressFromRequest(distressToModify: Distress, req: Request): Promise<Distress> {
        return this.distressRepository.merge(distressToModify, req.body)
    }
    private async updateDistressInDatabase(distressToUpdate: Distress): Promise<Distress> {
        return await this.distressRepository.save(distressToUpdate)
    }

}