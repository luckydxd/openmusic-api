const nodemailer = require("nodemailer");
const config = require("./config");

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: "OpenMusic API <noreply@openmusic.com>",
      to: targetEmail,
      subject: "Ekspor Playlist OpenMusic",
      text: "Terlampir hasil ekspor playlist Anda.",
      attachments: [
        {
          filename: "playlist.json",
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
