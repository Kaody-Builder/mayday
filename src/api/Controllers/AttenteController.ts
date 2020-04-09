import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, SelectQueryBuilder, getConnection } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Attente } from '../../entities/Attente';
import md5 from "crypto-js/md5"
import fs from "fs"
import multer from 'multer'
import path from "path"
import { Central } from '../../entities/Central';
import { Signalement } from "../../entities/Signalement";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, md5(file.fieldname + '-' + Date.now()).toString() + "." + file.originalname.split(".").pop())
    }
})

var upload = multer({ storage: storage })

export default class AttenteController extends Controller {

    attenteRepository: Repository<Attente>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.attenteRepository = connection.getRepository(Attente)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
        await this.postAttente(router)
    }

    async addDelete(router: Router): Promise<void> {
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllAttente(router)
        await this.getSingleAttente(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editAttente(router);
    }

        private async isAttenteExist(attente: Attente): Promise<boolean> {
        return attente !== undefined
    }

    async postAttente(router: Router) {
        //TODO: SWITCH to another Controller
        router.post("/attente", upload.single('photo'), async (req: Request, res: Response, next: NextFunction) => {
            try {
                var attenteToSave: Attente = await this.createAttenteFromRequest(req)
                attenteToSave.codeAtt = Math.floor(Math.random() * (999999 - 100000) + 100000).toString()
                attenteToSave.photoAtt = "images/" + req.file.filename
                attenteToSave.idCent = await getConnection().getRepository(Central)
                    .createQueryBuilder("central")
                    .orderBy("ST_Distance(coord_cent, ST_GeomFromText(':data'))")
                    .setParameter("data", JSON.stringify(attenteToSave.coordAtt))
                    .getOne();
                var attenteSaved: Attente = await this.saveAttenteToDatabase(attenteToSave)
                await this.sendResponse(res, 201, { message: "Attente Added Successfully" })
            } catch (error) {

                await this.sendResponse(res, 403, { message: "Attente Not Added", error: error })
            }
            next()
        })

        router.post("/confirmer/:numtel",async (req: Request, res: Response, next: NextFunction) => {
            try {
                try {
                    var attenteToConfirm: Attente  = await this.attenteRepository.findOneOrFail({where: {
                        numTel : req.params.numtel,
                        codeAtt: req.body.codeAtt
                    }})

                    var sign: Signalement = new Signalement()
                    sign.coordSign = attenteToConfirm.coordAtt
                    sign.dateSign = new Date().toISOString()
                    sign.photoSign = attenteToConfirm.photoAtt
                    getConnection().getRepository(Signalement).save(sign)
                    await this.sendResponse(res, 200, { message: "Code confirmed Successfully", data: sign })

                    

                } catch (error) {
                    this.sendResponse(res, 404, {message: "Code confirmation error"})
                }

            } catch (error) {
                await this.sendResponse(res, 403, { message: "Error", error: error })
            }
            next()
        })
    }
    private async createAttenteFromRequest(req: Request): Promise<Attente> {
        return this.attenteRepository.create(req.body as Object)
    }
    private async saveAttenteToDatabase(attente: Attente): Promise<Attente> {
        return await this.attenteRepository.save(attente);
    }
    private async editAttente(router: Router) {
        router.put("/:idCent/attente/:numTel", async (req, res, next) => {
            try {
                try {
                    var attenteToModify: Attente = await this.attenteRepository.findOneOrFail(req.params.id)
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Attente Not Found" });
                    return
                }
                try {
                    var attenteModifiedReadyToSave: Attente = await this.mergeAttenteFromRequest(attenteToModify, req);
                    await this.updateAttenteInDatabase(attenteModifiedReadyToSave);
                    await this.sendResponse(res, 200, { message: "Attente Modified Successfully" });
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Attente Not Modified", error: error });
                }
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeAttenteFromRequest(attenteToModify: Attente, req: Request): Promise<Attente> {
        return this.attenteRepository.merge(attenteToModify, req.body)
    }
    private async updateAttenteInDatabase(attenteToUpdate: Attente): Promise<Attente> {
        return await this.attenteRepository.save(attenteToUpdate)
    }

}