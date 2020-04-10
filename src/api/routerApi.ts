import express, { Request, Response, NextFunction } from "express"
import CentralController from './Controllers/CentralController';
import TeamController from './Controllers/TeamController';
import InterventionController from './Controllers/InterventionController';
import DistressController from './Controllers/DistressController';
import ReplyController from './Controllers/ReplyController';
import ReportController from './Controllers/ReportController';
import QuestionController from './Controllers/QuestionController';
import OptionController from './Controllers/OptionController';
import SymptomeController from './Controllers/SymptomeController';
import ConfirmationController from './Controllers/ConfirmationController';
var router = express.Router()
router.use("*", convertLatLong())

router.use("/centrals", new CentralController().mainRouter)
router.use("/teams", new TeamController().mainRouter)
router.use("/interventions", new InterventionController().mainRouter)
router.use("/options", new OptionController().mainRouter)
router.use("/questionnaires", new QuestionController().mainRouter)
router.use("/reports", new ReportController().mainRouter)
router.use("/replys", new ReplyController().mainRouter)
router.use("/distresss", new DistressController().mainRouter)
router.use("/symptomes", new SymptomeController().mainRouter)
router.use("/confirmations", new ConfirmationController().mainRouter)

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
