/**
 * @typedef {import("../../../types/models").EmailTask} Task
 */

import {
    FAILED,
    PASSED,
    ACTIVATION_EMAIL,
    PASSWORD_RESET_EMAIL
} from "../../constants/Service"
import {
    Job
} from "bull"
import nodemailer from "nodemailer"
import Mailgen from "mailgen"
import { ServiceConfig, AppConfig} from "../../config"

/**
 * 
 */
async function sendDebug(from, to, subject, html, text) {
    let transporter = nodemailer.createTransport({
        jsonTransport: true
    });
    const response = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text
    });
    console.log(response)
    return response
}

/**
 * 
 * @param {*} from 
 * @param {*} to 
 * @param {*} subject 
 * @param {*} html 
 * @param {*} text 
 */
async function send(from, to, subject, html, text) {
    if (AppConfig.debug) return sendDebug(from, to, subject, html, text)
    const transporter = nodemailer.createTransport(ServiceConfig.email);
    const response = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text
    });
    return response;
}

/**
 * 
 * @param {*} invitation 
 * @returns 
 */
async function sendInvitationEmail(invitation) {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mage Solutions',
            link: 'http://magesolutions.co.uk'
            // Optional logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });

    const email = {
        body: {
            name: invitation.name,
            intro: 'Welcome to Mage Solutions! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mage Solutions, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Activate your account',
                    link: `${appConfig.clientURL}/register?token=${invitation.token}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    const emailBody = mailGenerator.generate(email);
    const emailText = mailGenerator.generatePlaintext(email);

    try {
        await send(
            'magesolutions@magesolutions.xyz',
            invitation.email,
            "Invitation",
            emailBody,
            emailText
        )
        return PASSED
    } catch (error) {
        console.log(error)
        return FAILED
    }
}

/**
 * 
 * @param {*} details 
 * @returns 
 */
async function sendPasswordResetEmail(details) {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mage Solution',
            link: 'http://magesolutions.xyz'
            // Optional logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });

    const email = {
        body: {
            name: details.name,
            intro: 'You have received this email because a password reset request for your account was received.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#DC4D2F',
                    text: 'Reset your password',
                    link: `${appConfig.clientURL}/password-reset?token=${details.token}`
                }
            },
            outro: 'If you did not request a password reset, no further action is required on your part.'
        }
    };

    const emailBody = mailGenerator.generate(email);
    const emailText = mailGenerator.generatePlaintext(email);

    try {
        await send(
            'magesolutions@magesolutions.co.uk',
            details.email,
            "Password Reset",
            emailBody,
            emailText
        )
        return PASSED
    } catch (error) {
        console.log(error)
        return FAILED
    }

}

/**
 * 
 * @param {Job<Task>} job 
 */
export async function sendEmail(job) {
    const {
        type,
        payload
    } = job.data
    let response = PASSED
    if (type === ACTIVATION_EMAIL) response = await sendInvitationEmail(payload)
    if (type === PASSWORD_RESET_EMAIL) response = await sendPasswordResetEmail(payload)

    return response
}