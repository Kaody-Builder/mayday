import express, { Request, Response, NextFunction } from "express"
import CentralController from './Controllers/CentralController';
import EquipeController from './Controllers/EquipeController';
var router = express.Router()
router.use("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.method != "POST" && req.method != "PUT") {
        next()
        return
    }
    var long = Object.keys(req.body as Object).filter((val: string) => /long[A-Z]/.test(val))
    var lat = Object.keys(req.body as Object).filter((val: string) => /lat[A-Z]/.test(val))
    for (const data of long) {
        let suffix = data.substring(4)
        let lo = req.body[data]
        let la = req.body[`lat${suffix}`]
        if (la == undefined || lo == undefined)
            continue
        delete req.body[data]
        delete req.body[`lat${suffix}`]
        req.body[`coord${suffix}`] = JSON.parse(`{"type":"Point","coordinates":[${la},${lo}]}`)
    }
    next()
})
router.use("/centrals", new CentralController().mainRouter)
router.use("/equipes", new EquipeController().mainRouter)
export default router;