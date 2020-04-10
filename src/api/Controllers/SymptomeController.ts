import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../Controller";
import * as tf from '@tensorflow/tfjs';


export default class SymptomeController extends Controller {
    model: tf.LayersModel
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        await this.addAllRoutes(this.mainRouter);
        const tfn = require("@tensorflow/tfjs-node");
        const handler = tfn.io.fileSystem("./model.json");
        this.model = await tf.loadLayersModel(handler);
        // this.model = await tf.loadLayersModel('http://localhost:9000/model.json');
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
            var data = [110.0552204,0,28,1,1]
            var t = tf.tensor(data).reshape([1,5])
            await this.sendResponse(res, 200, { data: this.model.predict(t).argMax().dataSync()[0]})
            next()
        })
    }
}