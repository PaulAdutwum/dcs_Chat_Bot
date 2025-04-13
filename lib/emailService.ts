// Email service with mock implementation
import { EmailData, EmailResult } from './types';

// No need for actual Resend API key with mock implementation
const MOCK_DELAY = 1000; // Simulate network delay

/**
 * Sends an email using mock implementation
 * @param emailData The email data to send
 * @returns Promise resolving to success status and email data
 */
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  try {
    // Log the email data that would be sent
    console.log('Mock email would be sent:', {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      textLength: emailData.text?.length || 0,
      htmlLength: emailData.html?.length || 0,
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    // Return mock success response
    return { 
      success: true, 
      data: { 
        id: `mock-email-${Date.now()}`, 
        from: emailData.from,
        to: [emailData.to]
      } 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Formats a chat summary into a readable format
 * @param chatMessages Array of chat messages
 * @returns Formatted summary
 */
export function formatChatSummary(chatMessages: any[]): string {
  if (!chatMessages || chatMessages.length === 0) {
    return 'No chat history available.';
  }

  // Get the last 10 messages or fewer
  const recentMessages = chatMessages.slice(-Math.min(10, chatMessages.length));
  
  // Format each message
  return recentMessages.map(msg => {
    const role = msg.sender === 'user' ? 'Student' : 'Bot';
    // Truncate long messages
    const text = msg.text?.length > 300 
      ? msg.text.substring(0, 300) + '...' 
      : msg.text || '';
    
    return `${role}: ${text}`;
  }).join('\n\n');
}

/**
 * Creates an email with professor notification about student inquiry
 */
export function createProfessorNotificationEmail(studentEmail: string, chatSummary: string, professorName: string): { subject: string; html: string; text: string } {
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