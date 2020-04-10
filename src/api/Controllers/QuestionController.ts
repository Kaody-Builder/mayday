import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import router from '../routerApi';
import { Question } from '../../entities/Question';

export default class QuestionController extends Controller {

    questionRepository: Repository<Question>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.questionRepository = connection.getRepository(Question)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postQuestion(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllQuestion(router)
        await this.getSingleQuestion(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editQuestion(router);
    }

    private async getAllQuestion(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var questions: Question[] = await this.fetchQuestionsFromDatabase()
                await this.sendResponse(res, 200, { data: questions })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchQuestionsFromDatabase(): Promise<Question[]> {
        return await this.questionRepository.find()
    }

    private async getSingleQuestion(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var question: Question = await this.fetchQuestionFromDatabase(req.params.id)
                if (await this.isQuestionExist(question)) {
                    await this.sendResponse(res, 200, { data: question })
                } else {
                    await this.sendResponse(res, 404, { message: "Question Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchQuestionFromDatabase(id: string): Promise<Question> {
        return this.questionRepository.findOne(id)
    }
    private async isQuestionExist(question: Question): Promise<boolean> {
        return question !== undefined
    }

    async postQuestion(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var questionToSave: Question = await this.createQuestionFromRequest(req)
                var questionSaved: Question = await this.saveQuestionToDatabase(questionToSave)
                await this.sendResponse(res, 201, { message: "Question Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Question Not Added", error: error })
            }
            next()
        })
    }
    private async createQuestionFromRequest(req: Request): Promise<Question> {
        return this.questionRepository.create(req.body as Object)
    }
    private async saveQuestionToDatabase(question: Question): Promise<Question> {
        return await this.questionRepository.save(question);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idQuestion", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var question: Question = await this.questionRepository.findOne(req.params.idQuestion)
                await this.questionRepository.remove(question)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editQuestion(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var questionToModify: Question = await this.questionRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Question Not Found" });
                    return
                }
                try {
                    var questionModifiedReadyToSave: Question = await this.mergeQuestionFromRequest(questionToModify, req);
                    await this.updateQuestionInDatabase(questionModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Question Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Question Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeQuestionFromRequest(questionToModify: Question, req: Request): Promise<Question> {
        return this.questionRepository.merge(questionToModify, req.body)
    }
    private async updateQuestionInDatabase(questionToUpdate: Question): Promise<Question> {
        return await this.questionRepository.save(questionToUpdate)
    }

}