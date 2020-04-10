import nodeMailer from 'nodemailer';

export default class Utils {


    static sendEmail(email: string, code: string) {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_KAODY,
                pass: process.env.PASS_KAODY
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailOptions = {
            to: email,
            subject: 'Code confirmation',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Product+Sans&display=swap" rel="stylesheet">
                <style>

                </style>
            </head>
            <body>
                <div class="container">
                    <div class="row align-justify">
                        <div class="col-md-12 col-lg-12 boxPanel">
                            <div class="shadow  mb-3 bg-white rounded">
                                <div class="card-body covpanel">
                                    <div>
                                    *{font-family: 'Open Sans', sans-serif;}h3{font-family: 'Product Sans', sans-serif;}.btn-info {background-color: #0AB099;font-size: 15px;border: none;border-radius: 0%;}.confirmation {width: 20%;height: 30%;}.comment {color: gray;font-size: 12px;}.covpanel {width: 70%;}.boxPanel {}
                                        <img src="${process.env.BASE_URL}/assets/logo1.png" alt="logo" width="12%">
                                    </div><br>
                                    <div>
                                        <strong>
                                            <h3>May<span style="color: #0AB099;">Day</span></h3>
                                        </strong>
                                        <p class="comment">Please confirm that your email address to confirm the distress.
                                        </p><br>
                                        <div class=" col-md-5 col-lg-6">
                                        <a href="http://mayday-kaody.herokuapp.com/api/confirmations/${email}/${code}">
                                                <div class="btn btn-info">Confirm Distress</div>
                                            </a>
                                        </div>
                                    </div><br>
                                    <div>
                                        <p class="comment">You may also enter this confirmation code to continue: <span style="color: grey; font-size: 15px;"> ${code} </span> </p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </body>
            
            </html>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

}