import router from "./routerApi";
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import { createConnection } from 'typeorm';
import { ormconfig } from '../config';
import { Question } from '../entities/Question';
import { getConnection } from 'typeorm';
import cors from "cors"
import * as path from "path"

export default () => {

    (async () => {
        if ((await (await createConnection(ormconfig)).getRepository(Question).count()) <= 0) {
            var sql: string = `INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES(0, 'How old are you?', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('<15', 0); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Between 15 and 49', 0); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Between 50-69', 0); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('>70', 0); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (1, 'You are?', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('A woman', 1); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('A man', 1); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (2, 'Are you currently coughing ? An unusual or permanent cough.', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 2); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 2); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (3, 'Do you feel your cough has been getting worse the past 48 H ? ', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 3); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 3); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (4, 'Are you experiencing any breathing difficulties the past 24-48 H ?', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 4); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 4); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (5, 'Are you experiencing fever ?', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 5); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 5); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (6, 'If Yes, How many days have you experienced fever ?', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('1 day', 6); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('2 days', 6); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('3 days', 6); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('4 days', 6); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('5 days ', 6); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (7, 'If Yes, Are you experiencing any of these symptoms?', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Chills ', 7); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Feeling constantly hotChills ', 7); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (8, 'Take your temperature. What is your current tempareture ?', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('35° ', 8); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('37°', 8); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('+37°', 8); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (9, 'Do you feel tired with doing any physical effort?', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 9); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 9); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (10, 'Are you experiencing a sudden loss of sense of smell ( without having stuffy nose)?', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 10); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 10); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (11, 'Do you have a sore throat?', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 11); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 11); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (12, 'Are you having difficulties eating and swallowing for 24H or more? ', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 12); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 12); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (13, 'Are you having diarrhea ? more than 3 loose stools per 24h? ', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 13); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 13); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (14, 'Do you suffer from any other chronic diseases? ', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 14); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 14); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (15, 'If Yes, which one ? ', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Diabetis', 15); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Respiratory problems', 15); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Cancer', 15); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('HIV', 15); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (16, 'Did you travel the past 14 days ? ', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 16); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 16); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (17, 'If Yes : ', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('', 17); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('', 17); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (18, 'Did you go outside of your home during the past 24 hours ?', True); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 18); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('No', 18); INSERT INTO public."Question"( id_ques, text_ques, type_ques) VALUES (19, 'if Yes, where did you go? Mention your route', False); INSERT INTO public."Option"(valeur_opti, "questionIdQues") VALUES ('Yes', 19);`
            await getConnection().createEntityManager().query(sql)
        }
    })()
    var app = express();
    var server = require('http').Server(app);
    var io = require('socket.io').listen(server);
    server.listen(process.env.PORT || 3000)
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use("/api", compression())
    app.use("/api", router)
    app.use(express.static(__dirname.replace("/src/api", "") + '/dist/covida'))
    app.get("/*", async (req: Request, res: Response, next: NextFunction) => {
        res.sendFile(path.join(__dirname.replace("/src/api", "") +'/dist/covida/index.html'));
    })
    
    io.sockets.on('connection', function (socket) {
        socket.on('broadcast', function (message) {
            io.sockets.emit("broadcast", message )
        });
    });
    console.log("Mayday is ONLINE")
}

