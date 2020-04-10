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
            html: `    
        <div style="display: flex; align-items: center; justify-content: center; text-align: center;">

        <div style="box-shadow: #f0f0f0 4px 2px 2px 1px; border: #f0f0f0 1px solid; height: 400px; width: 400px;">


                <h1 style="font-size: xx-large;margin-top: 70px;">May<span style="color: #0AB099;">day</span></h1>
                <p style="font-size: medium;margin-top: 55px;">Would you like to send an <b>emergency signal</b> ?  </p>
                <a style="text-decoration: none !important;" href="http://mayday-kaody.herokuapp.com/api/confirmations/${email}/${code}">
                    <button
                    style="background-color: #0AB099;font-size: 15px;border: none;border-radius: 0%; color: white; font-weight: 700; padding: 7px; display: inline-block; margin-top: 10px; border-radius: 1px;margin-top: px;">
                    Confirm emergency
                </button>
            </a>
            <p style="font-size: small; margin-top: 35px;">If the button don't work enter this code : <b
                style="font-size: medium;">123456</b></p>
        </div>
    </div>
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

}