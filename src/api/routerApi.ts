import express from "express"
import CentralController from './Controllers/CentralController';
var router = express.Router()
router.use("/centrals",new CentralController().mainRouter)
export default router;