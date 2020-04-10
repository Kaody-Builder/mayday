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
            html: `<a href="http://mayday-kaody.herokuapp.com/api/confirmations/${email}/${code}"> Confirm Account </a>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

}