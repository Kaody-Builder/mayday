import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Intervention } from '../../entities/Intervention';

export default class InterventionController extends Controller {

    interventionRepository: Repository<Intervention>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.interventionRepository = connection.getRepository(Intervention)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postIntervention(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllIntervention(router)
        await this.getSingleIntervention(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editIntervention(router);
    }

    private async getAllIntervention(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var interventions: Intervention[] = await this.fetchInterventionsFromDatabase()
                await this.sendResponse(res, 200, { data: interventions })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchInterventionsFromDatabase(): Promise<Intervention[]> {
        return await this.interventionRepository.find()
    }

    private async getSingleIntervention(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var intervention: Intervention = await this.fetchInterventionFromDatabase(req.params.id)
                if (await this.isInterventionExist(intervention)) {
                    await this.sendResponse(res, 200, { data: intervention })
                } else {
                    await this.sendResponse(res, 404, { message: "Intervention Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchInterventionFromDatabase(id: string): Promise<Intervention> {
        return this.interventionRepository.findOne(id)
    }
    private async isInterventionExist(intervention: Intervention): Promise<boolean> {
        return intervention !== undefined
    }

    async postIntervention(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var interventionToSave: Intervention = await this.createInterventionFromRequest(req)
                var interventionSaved: Intervention = await this.saveInterventionToDatabase(interventionToSave)
                await this.sendResponse(res, 201, { message: "Intervention Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Intervention Not Added", error: error })
            }
            next()
        })
    }
    private async createInterventionFromRequest(req: Request): Promise<Intervention> {
        return this.interventionRepository.create(req.body as Object)
    }
    private async saveInterventionToDatabase(intervention: Intervention): Promise<Intervention> {
        return await this.interventionRepository.save(intervention);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idIntervention", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var intervention: Intervention = await this.interventionRepository.findOne(req.params.idIntervention)
                await this.interventionRepository.remove(intervention)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editIntervention(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var interventionToModify: Intervention = await this.interventionRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Intervention Not Found" });
                    return
                }
                try {
                    var interventionModifiedReadyToSave: Intervention = await this.mergeInterventionFromRequest(interventionToModify, req);
                    await this.updateInterventionInDatabase(interventionModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Intervention Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Intervention Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeInterventionFromRequest(interventionToModify: Intervention, req: Request): Promise<Intervention> {
        return this.interventionRepository.merge(interventionToModify, req.body)
    }
    private async updateInterventionInDatabase(interventionToUpdate: Intervention): Promise<Intervention> {
        return await this.interventionRepository.save(interventionToUpdate)
    }

}