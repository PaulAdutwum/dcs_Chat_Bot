// Email service using SendGrid
import sgMail from '@sendgrid/mail';
import { EmailData, EmailResult } from './types';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Sends an email using SendGrid
 * @param emailData The email data to send
 * @returns Promise resolving to success status and email data
 */
export async function sendGridEmail(emailData: EmailData): Promise<EmailResult> {
  try {
    // Ensure SendGrid is initialized
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }

    const msg = {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html || emailData.text,
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    return { success: false, error };
  }
}

/**
 * Creates an email with professor notification about student inquiry
 */
export function createProfessorSendGridEmail(studentEmail: string, chatSummary: string, professorName: string): { subject: string; html: string; text: string } {
  const text = `
Dear Professor ${professorName},

A student has expressed interest in learning more about the DCS major through our chatbot and would like to connect with you.

Student Contact Information:
- Email: ${studentEmail}

Chat Summary:
${chatSummary}

Please reach out to the student at your earliest convenience to provide more information about the DCS major or answer any specific questions they might have.

Thank you,
DCS Chatbot
  `;
  
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Student Inquiry About DCS Major</h2>
  <p>Dear Professor ${professorName},</p>
  <p>A student has expressed interest in learning more about the DCS major through our chatbot and would like to connect with you.</p>
  
  <h3>Student Contact Information:</h3>
  <ul>
    <li><strong>Email:</strong> ${studentEmail}</li>
  </ul>
  
  <h3>Chat Summary:</h3>
  <div style="background: #f7f7f7; padding: 15px; border-radius: 5px; margin: 15px 0;">
    <p style="white-space: pre-line;">${chatSummary}</p>
  </div>
  
  <p>Please reach out to the student at your earliest convenience to provide more information about the DCS major or answer any specific questions they might have.</p>
  
  <p>Thank you,<br>
  DCS Chatbot</p>
</div>
  `;
  
  return {
    subject: 'New Student Inquiry about DCS Major',
    text,
    html
  };
} 