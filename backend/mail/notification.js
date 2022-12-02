const mailClient = require('./client')
const i18n = require('../i18n')
const ejs = require('ejs')
const fs = require('fs')

function sendNotificationMail(notifications, recipientName, recipientMail) {
    if (mailClient == undefined) {
        return false
    }
    
    const template = fs.readFileSync('./mail/notification_template.ejs', { encoding: 'utf-8' })
    const renderedHTML = ejs.render(template, {
        i18n: i18n,
        recipientName: recipientName,
        notifications: notifications,
        url: process.env.VUE_APP_FRONTEND_URL
    })
    const plainText = i18n.t("mail.notification.heading") + '\n\n' +
        i18n.t("mail.salutation", { recipient: recipientName }) + '\n' +
        i18n.t("mail.notification.content") + '\n\n'
    
    for(const notification of notifications){
        plainText += notification.name + ': ' + notification.person + '\n'
    }
    mailClient.sendMail({
        from: '"' + i18n.t("headlines.churchtoolsNotifications") + ' ' + i18n.t("resource.emoji") + '" <' + process.env.MAIL_SENDER_ADDRESS + '>', // sender address
        to: recipientMail, // list of receivers
        subject: i18n.t("mail.notification.heading") + ": " + booking.summary, // Subject line
        text: plainText, // plain text body
        html: renderedHTML, // html body
    })
}

module.exports = sendNotificationMail