import express, { Request, Response, NextFunction } from "express"
import CentralController from './Controllers/CentralController';
import EquipeController from './Controllers/EquipeController';
import InterventionController from './Controllers/InterventionController';
import SignalementController from './Controllers/SignalementController';
import ReponseController from './Controllers/ReponseController';
import RapportController from './Controllers/RapportController';
import QuestionnaireController from './Controllers/QuestionnaireController';
import PaysController from './Controllers/PaysController';
import OptionController from './Controllers/OptionController';
import AttenteController from './Controllers/AttenteController';
var router = express.Router()
router.use("*", convertLatLong())

router.use("/centrals", new CentralController().mainRouter)
router.use("/attentes", new AttenteController().mainRouter)
router.use("/equipes", new EquipeController().mainRouter)
router.use("/interventions", new InterventionController().mainRouter)
router.use("/options", new OptionController().mainRouter)
router.use("/pays", new PaysController().mainRouter)
router.use("/questionnaires", new QuestionnaireController().mainRouter)
router.use("/rapports", new RapportController().mainRouter)
router.use("/reponses", new ReponseController().mainRouter)
router.use("/signalements", new SignalementController().mainRouter)

export default router;

function convertLatLong() {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method != "POST" && req.method != "PUT") {
            next();
            return;
        }
        var long = Object.keys(req.body as Object).filter((val: string) => /long[A-Z]/.test(val));
        var lat = Object.keys(req.body as Object).filter((val: string) => /lat[A-Z]/.test(val));
        for (const data of long) {
            let suffix = data.substring(4);
            let lo = req.body[data];
            let la = req.body[`lat${suffix}`];
            if (la == undefined || lo == undefined)
                continue;
            delete req.body[data];
            delete req.body[`lat${suffix}`];
            req.body[`coord${suffix}`] = JSON.parse(`{"type":"Point","coordinates":[${la},${lo}]}`);
        }
        next();
    };
}
