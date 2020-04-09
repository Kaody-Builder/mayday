import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../Controller";



export default class SymptomeController extends Controller {

    async createConnectionAndAssignRepository(): Promise<void> {
    }

    async addPost(router: Router): Promise<void> {
        await this.postSymptome(router)
    }

    async addDelete(router: Router): Promise<void> {
    }

    async addGet(router: Router): Promise<void> {
    }


    async addPut(router: Router): Promise<void> {
    }
    async postSymptome(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {

            await this.sendResponse(res, 201, { message: "Symptome Added Successfully" })
            next()
        })
    }
}