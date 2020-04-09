import { Request, Response, NextFunction } from "express";

post("signaler",(req:Request, res: Response, next:NextFunction) => {
    if(req.body.numTel != undefined && req.body.numTel != null){

    }
})

post("confirmer",(req:Request, res: Response, next:NextFunction) => {
    if(req.body.code != undefined && req.body.code != null){
        
    }
})