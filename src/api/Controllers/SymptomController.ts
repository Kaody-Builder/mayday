import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { Controller } from "../Controller";
import * as tf from '@tensorflow/tfjs';
import natural from "natural"

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
            var text = req.body.text.toLowerCase()

            var tokenizer = new natural.WordTokenizer();
            var token = tokenizer.tokenize(text)
            var key = ["fever", "cough", "breath", "pain", "chills", "sweating", "malaise", "cold", "pneumonia", "sore", "throat"]
            var pt = 0
            var q = 0
            console.log(token)
            for (let t of token) {
                if(t.length > 4){
                    q++ 
                }
                for (let element of key) {
                    if (t.includes(element)) {
                        pt++
                    }
                    
                    if (t == "t" || t == "not"){
                        pt--
                        break
                    }
                }
            }
            var r = 0
            if (token.length != 0)
                r = (pt / q)
            if (r > 1)
                r = Math.random() * (0.95 - 0.85) + 0.85
            if (r <= 0)
                r = Math.random() * (0.4 - 0.05) + 0.05
            await this.sendResponse(res, 201, { data: r })
            next()
        })
    }
}