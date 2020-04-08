import router from "./routerApi";
import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"

import * as fs from 'fs'
import * as path from 'path'



export default () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use("/api", compression())
    app.use(express.static(__dirname.replace("/src/api", "") + '/uploads'))
    app.use("/api", router)
    console.log("Server started")
    return app.listen(process.env.PORT || 3000)
}

