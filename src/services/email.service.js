const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const mockMode = process.env.MOCK_EMAIL === 'true';
let transporter = null;
const templates = {};

const initializeTransporter = () => {
  if (mockMode) {
    console.log('[EMAIL SERVICE] Running in MOCK mode - emails will be logged instead of sent');
    return;
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.NODE_MAILER_PORT || 587,
    secure: false,
    auth: {
      user: process.env.NODE_MAILER_EMAIL || process.env.EMAIL_USER,
      pass: process.env.NODE_MAILER_EMAIL_PASSWORD || process.env.EMAIL_PASSWORD
    }
  });
};

const loadTemplates = () => {
  const templatesDir = path.join(__dirname, '../templates/emails');

  try {
    const billCreatedTemplate = fs.readFileSync(
      path.join(templatesDir, 'bill-created.hbs'),
      'utf8'
    );
    templates.billCreated = handlebars.compile(billCreatedTemplate);
    console.log('[EMAIL SERVICE] Email templates loaded successfully');
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to load email templates:', error.message);
  }
};

const sendBillCreatedNotification = async (bill, user) => {
  const templateData = {
    userName: user.name,
    billName: bill.name,
    billAmount: parseFloat(bill.amount).toFixed(2),
    billDueDate: new Date(bill.due_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    billCategory: bill.category,
    billStatus: bill.status,
    billStatusUpper: bill.status.toUpperCase(),
    currentYear: new Date().getFullYear()
  };

  const htmlContent = templates.billCreated(templateData);

  const textContent = `
New Bill Created

Hello ${user.name},

A new bill has been created in your OYF Billing account.

Bill Details:
- Name: ${bill.name}
- Amount: $${parseFloat(bill.amount).toFixed(2)}
- Due Date: ${templateData.billDueDate}
- Category: ${bill.category}
- Status: ${bill.status.toUpperCase()}

Please ensure you have sufficient funds available by the due date.

---
This is an automated message from OYF Billing System
© ${new Date().getFullYear()} OYF Billing. All rights reserved.
  `;

  const emailContent = {
    from: process.env.EMAIL_FROM || 'noreply@oyfbilling.com',
    to: user.email,
    subject: `New Bill Created: ${bill.name}`,
    html: htmlContent,
    text: textContent
  };

  if (mockMode) {
    console.log('\n========== MOCK EMAIL ==========');
    console.log('From:', emailContent.from);
    console.log('To:', emailContent.to);
    console.log('Subject:', emailContent.subject);
    console.log('------- TEXT CONTENT -------');
    console.log(emailContent.text);
    console.log('================================\n');
    return { success: true, mode: 'mock', message: 'Email logged to console' };
  }

  try {
    const info = await transporter.sendMail(emailContent);
    console.log(`[EMAIL SERVICE] Bill notification sent to ${user.email}. Message ID: ${info.messageId}`);
    return { success: true, mode: 'sent', messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send email:', error.message);
    throw new Error(`Failed to send email notification: ${error.message}`);
  }
};

const verifyConnection = async () => {
  if (mockMode) {
    return { success: true, mode: 'mock' };
  }

  try {
    await transporter.verify();
    console.log('[EMAIL SERVICE] Email service is ready to send messages');
    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error('[EMAIL SERVICE] Email service verification failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Initialize on load
initializeTransporter();
loadTemplates();

module.exports = {
  sendBillCreatedNotification,
  verifyConnection
};
