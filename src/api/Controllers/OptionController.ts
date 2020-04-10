import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Option } from '../../entities/Option';
import { Question } from '../../entities/Question';

export default class OptionController extends Controller {

    optionRepository: Repository<Option>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.optionRepository = connection.getRepository(Option)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postOption(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllOption(router)
        await this.getSingleOption(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editOption(router);
    }

    private async getAllOption(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var options: Option[] = await this.fetchOptionsFromDatabase()
                await this.sendResponse(res, 200, { data: options })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchOptionsFromDatabase(): Promise<Option[]> {
        return await this.optionRepository.find()
    }

    private async getSingleOption(router: Router) {
        router.get("/:idQuest", async (req, res, next) => {
            try {
                var option: Option[] = await this.fetchOptionFromDatabase(req.params.idQuest)
                    await this.sendResponse(res, 200, { data: option })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchOptionFromDatabase(id: string): Promise<Option[]> {
        return this.optionRepository.find({ where: {question: id} })
    }
    private async isOptionExist(option: Option): Promise<boolean> {
        return option !== undefined
    }

    async postOption(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var optionToSave: Option = await this.createOptionFromRequest(req)
                var optionSaved: Option = await this.saveOptionToDatabase(optionToSave)
                await this.sendResponse(res, 201, { message: "Option Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Option Not Added", error: error })
            }
            next()
        })
    }
    private async createOptionFromRequest(req: Request): Promise<Option> {
        return this.optionRepository.create(req.body as Object)
    }
    private async saveOptionToDatabase(option: Option): Promise<Option> {
        return await this.optionRepository.save(option);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idOption", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var option: Option = await this.optionRepository.findOne(req.params.idOption)
                await this.optionRepository.remove(option)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editOption(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var optionToModify: Option = await this.optionRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Option Not Found" });
                    return
                }
                try {
                    var optionModifiedReadyToSave: Option = await this.mergeOptionFromRequest(optionToModify, req);
                    await this.updateOptionInDatabase(optionModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Option Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Option Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeOptionFromRequest(optionToModify: Option, req: Request): Promise<Option> {
        return this.optionRepository.merge(optionToModify, req.body)
    }
    private async updateOptionInDatabase(optionToUpdate: Option): Promise<Option> {
        return await this.optionRepository.save(optionToUpdate)
    }

}