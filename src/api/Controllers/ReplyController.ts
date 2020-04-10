import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Reply } from '../../entities/Reply';

export default class ReplyController extends Controller {

    replyRepository: Repository<Reply>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.replyRepository = connection.getRepository(Reply)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postReply(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllReply(router)
        await this.getSingleReply(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editReply(router);
    }

    private async getAllReply(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var replys: Reply[] = await this.fetchReplysFromDatabase()
                await this.sendResponse(res, 200, { data: replys })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchReplysFromDatabase(): Promise<Reply[]> {
        return await this.replyRepository.find()
    }

    private async getSingleReply(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var reply: Reply = await this.fetchReplyFromDatabase(req.params.id)
                if (await this.isReplyExist(reply)) {
                    await this.sendResponse(res, 200, { data: reply })
                } else {
                    await this.sendResponse(res, 404, { message: "Reply Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchReplyFromDatabase(id: string): Promise<Reply> {
        return this.replyRepository.findOne(id)
    }
    private async isReplyExist(reply: Reply): Promise<boolean> {
        return reply !== undefined
    }

    async postReply(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var replyToSave: Reply = await this.createReplyFromRequest(req)
                var replySaved: Reply = await this.saveReplyToDatabase(replyToSave)
                await this.sendResponse(res, 201, { message: "Reply Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Reply Not Added", error: error })
            }
            next()
        })
    }
    private async createReplyFromRequest(req: Request): Promise<Reply> {
        return this.replyRepository.create(req.body as Object)
    }
    private async saveReplyToDatabase(reply: Reply): Promise<Reply> {
        return await this.replyRepository.save(reply);
    }

    private async deleteById(router: Router): Promise<void> {
        router.delete("/:idReply", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reply: Reply = await this.replyRepository.findOne(req.params.idReply)
                await this.replyRepository.remove(reply)
                res.status(202).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async editReply(router: Router) {
        router.put("/:id", async (req, res, next) => {
            try {
                try {
                    var replyToModify: Reply = await this.replyRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reply Not Found" });
                    return
                }
                try {
                    var replyModifiedReadyToSave: Reply = await this.mergeReplyFromRequest(replyToModify, req);
                    await this.updateReplyInDatabase(replyModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Reply Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Reply Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeReplyFromRequest(replyToModify: Reply, req: Request): Promise<Reply> {
        return this.replyRepository.merge(replyToModify, req.body)
    }
    private async updateReplyInDatabase(replyToUpdate: Reply): Promise<Reply> {
        return await this.replyRepository.save(replyToUpdate)
    }

}