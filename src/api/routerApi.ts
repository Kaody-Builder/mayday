import express from "express"
import CentralController from './Controllers/CentralController';
import EquipeController from './Controllers/EquipeController';
var router = express.Router()
router.use("/centrals",new CentralController().mainRouter)
router.use("/equipes",new EquipeController().mainRouter)
export default router;