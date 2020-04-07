import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Equipe } from '../../entities/Equipe';

export default class EquipeController extends Controller {

    equipeRepository: Repository<Equipe>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.equipeRepository = connection.getRepository(Equipe)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postEquipe(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllEquipe(router)
        await this.getSingleEquipe(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editEquipe(router);
    }

    private async getAllEquipe(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var equipes: Equipe[] = await this.fetchEquipesFromDatabase()
                await this.sendResponse(res, 200, { data: equipes })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchEquipesFromDatabase(): Promise<Equipe[]> {
        return await this.equipeRepository.find()
    }

    private async getSingleEquipe(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var equipe: Equipe = await this.fetchEquipeFromDatabase(req.params.id)
                if (await this.isEquipeExist(equipe)) {
                    await this.sendResponse(res, 200, { data: equipe })
                } else {
                    await this.sendResponse(res, 404, { message: "Equipe Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchEquipeFromDatabase(id: string): Promise<Equipe> {
        return this.equipeRepository.findOne(id)
    }
    private async isEquipeExist(equipe: Equipe): Promise<boolean> {
        return equipe !== undefined
    }

    async postEquipe(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var equipeToSave: Equipe = await this.createEquipeFromRequest(req)
                var equipeSaved: Equipe = await this.saveEquipeToDatabase(equipeToSave)
                await this.sendResponse(res, 201, { message: "Equipe Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Equipe Not Added", error: error })
            }
            next()
        })
    }
    private async createEquipeFromRequest(req: Request): Promise<Equipe> {
        return this.equipeRepository.create(req.body as Object)
    }
    private async saveEquipeToDatabase(equipe: Equipe): Promise<Equipe> {
        return await this.equipeRepository.save(equipe);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idEquipe", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var equipe: Equipe = await this.equipeRepository.findOne(req.params.idEquipe)
                await this.equipeRepository.remove(equipe)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editEquipe(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var equipeToModify: Equipe = await this.equipeRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Equipe Not Found" });
                    return
                }
                try {
                    var equipeModifiedReadyToSave: Equipe = await this.mergeEquipeFromRequest(equipeToModify, req);
                    await this.updateEquipeInDatabase(equipeModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Equipe Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Equipe Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeEquipeFromRequest(equipeToModify: Equipe, req: Request): Promise<Equipe> {
        return this.equipeRepository.merge(equipeToModify, req.body)
    }
    private async updateEquipeInDatabase(equipeToUpdate: Equipe): Promise<Equipe> {
        return await this.equipeRepository.save(equipeToUpdate)
    }

}