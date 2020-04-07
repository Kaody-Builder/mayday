import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Questionnaire } from '../../entities/Questionnaire';

export default class QuestionnaireController extends Controller {

    questionnaireRepository: Repository<Questionnaire>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.questionnaireRepository = connection.getRepository(Questionnaire)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postQuestionnaire(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllQuestionnaire(router)
        await this.getSingleQuestionnaire(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editQuestionnaire(router);
    }

    private async getAllQuestionnaire(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var questionnaires: Questionnaire[] = await this.fetchQuestionnairesFromDatabase()
                await this.sendResponse(res, 200, { data: questionnaires })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchQuestionnairesFromDatabase(): Promise<Questionnaire[]> {
        return await this.questionnaireRepository.find()
    }

    private async getSingleQuestionnaire(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var questionnaire: Questionnaire = await this.fetchQuestionnaireFromDatabase(req.params.id)
                if (await this.isQuestionnaireExist(questionnaire)) {
                    await this.sendResponse(res, 200, { data: questionnaire })
                } else {
                    await this.sendResponse(res, 404, { message: "Questionnaire Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchQuestionnaireFromDatabase(id: string): Promise<Questionnaire> {
        return this.questionnaireRepository.findOne(id)
    }
    private async isQuestionnaireExist(questionnaire: Questionnaire): Promise<boolean> {
        return questionnaire !== undefined
    }

    async postQuestionnaire(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var questionnaireToSave: Questionnaire = await this.createQuestionnaireFromRequest(req)
                var questionnaireSaved: Questionnaire = await this.saveQuestionnaireToDatabase(questionnaireToSave)
                await this.sendResponse(res, 201, { message: "Questionnaire Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Questionnaire Not Added", error: error })
            }
            next()
        })
    }
    private async createQuestionnaireFromRequest(req: Request): Promise<Questionnaire> {
        return this.questionnaireRepository.create(req.body as Object)
    }
    private async saveQuestionnaireToDatabase(questionnaire: Questionnaire): Promise<Questionnaire> {
        return await this.questionnaireRepository.save(questionnaire);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idQuestionnaire", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var questionnaire: Questionnaire = await this.questionnaireRepository.findOne(req.params.idQuestionnaire)
                await this.questionnaireRepository.remove(questionnaire)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editQuestionnaire(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var questionnaireToModify: Questionnaire = await this.questionnaireRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Questionnaire Not Found" });
                    return
                }
                try {
                    var questionnaireModifiedReadyToSave: Questionnaire = await this.mergeQuestionnaireFromRequest(questionnaireToModify, req);
                    await this.updateQuestionnaireInDatabase(questionnaireModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Questionnaire Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Questionnaire Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeQuestionnaireFromRequest(questionnaireToModify: Questionnaire, req: Request): Promise<Questionnaire> {
        return this.questionnaireRepository.merge(questionnaireToModify, req.body)
    }
    private async updateQuestionnaireInDatabase(questionnaireToUpdate: Questionnaire): Promise<Questionnaire> {
        return await this.questionnaireRepository.save(questionnaireToUpdate)
    }

}