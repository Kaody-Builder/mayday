import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../Controller";
import * as tf from '@tensorflow/tfjs';


export default class SymptomController extends Controller {
    // model: tf.LayersModel
    constructor() {
        super()
        this.createConnectionAndAssignRepository()
    }
    async createConnectionAndAssignRepository(): Promise<void> {
         await this.addAllRoutes(this.mainRouter);
        // const tfn = require("@tensorflow/tfjs-node");
        // const handler = tfn.io.fileSystem("./model.json");
        // this.model = await tf.loadLayersModel(handler);
        // this.model = await tf.loadLayersModel('http://localhost:9000/model.json');
    }

    async addPost(router: Router): Promise<void> {
        await this.postSymptom(router)
    }

    async addDelete(router: Router): Promise<void> {
    }

    async addGet(router: Router): Promise<void> {
    }


    async addPut(router: Router): Promise<void> {
    }
    async postSymptom(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            var text = req.body.text
            var natural = require('natural');
            var tokenizer = new natural.WordTokenizer();
            var token = tokenizer.tokenize(text)
            var key = [["fever"], ["cough"], ["breath"], ["pain"], [""]]

            await this.sendResponse(res, 200, { data: "this.model.predict(t).argMax().dataSync()[0]" })
            next()
        })
    }
}