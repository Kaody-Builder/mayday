import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import axios from "axios";
export default class DirectionController extends Controller {

    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }

    async addGet(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                if(req.query.dla == undefined || req.query.dlo == undefined || req.query.fla == undefined || req.query.flo == undefined ){
                    throw "Query";
                }
                var api_key = ["5b3ce3597851110001cf6248188d4f6749ab49f5ab5e57d6124a1c9a", "5b3ce3597851110001cf624860d17d68bc23438c8ae615c98333d1e5"]
                var data = (await axios(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${api_key[Math.floor(Math.random() *(0 - api_key.length) + api_key.length )]}&start=${req.query.dlo},${req.query.dla}&end=${req.query.flo},${req.query.fla}`)).data["features"][0]["geometry"]["coordinates"]
                
                await this.sendResponse(res, 200, { points: data })
            } catch (error) {
                await this.sendResponse(res, 403, { message: "Code error", error: error })
            }
            next()
        })
    }

    async addPut(router: Router): Promise<void> {
        
    }

}