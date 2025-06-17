import { sendEmail, createProfessorNotificationEmail, formatChatSummary } from './emailService';
import { sendGridEmail, createProfessorSendGridEmail } from './sendgridService';
import { EmailData, EmailResult } from './types';

/**
 * Send an email using the configured email service
 * @param emailData The email data to send
 * @returns Promise resolving to success status and email data
 */
export async function sendEmailWithProvider(emailData: EmailData): Promise<EmailResult> {
  // Determine which email service to use based on environment variable
  const emailService = process.env.EMAIL_SERVICE || 'resend';

  if (emailService.toLowerCase() === 'sendgrid') {
    // Use SendGrid
    return sendGridEmail(emailData);
  } else {
    // Default to Resend
    return sendEmail(emailData);
  }
}

/**
 * Send an email with fallback to the secondary provider if the primary one fails
 * @param emailData The email data to send
 * @returns Promise resolving to success status and email data with additional fields
 */
export async function sendEmailWithFallback(emailData: EmailData): Promise<EmailResult> {
  try {
    // Try primary provider first (based on configuration)
    const primaryResult = await sendEmailWithProvider(emailData);
    
    // If primary succeeds, return the result
    if (primaryResult.success) {
      return { ...primaryResult, provider: process.env.EMAIL_SERVICE || 'resend' };
    }
    
    console.log('Primary email provider failed, trying fallback provider...');
    
    // If primary fails, switch to the alternative provider
    const currentService = process.env.EMAIL_SERVICE || 'resend';
    const alternativeService = currentService.toLowerCase() === 'resend' ? 'sendgrid' : 'resend';
    
    // Temporarily set the alternative service
    const originalService = process.env.EMAIL_SERVICE;
    process.env.EMAIL_SERVICE = alternativeService;
    
    try {
      // Try with alternative provider
      const fallbackResult = await sendEmailWithProvider(emailData);
      
      // Restore original service setting
      process.env.EMAIL_SERVICE = originalService;
      
      return { 
        ...fallbackResult, 
        provider: alternativeService,
        fallback: true,
        primaryError: primaryResult.error
      };
    } catch (fallbackError) {
      // Restore original service setting
      process.env.EMAIL_SERVICE = originalService;
      
      return { 
        success: false, 
        error: `Both providers failed. Primary: ${primaryResult.error}, Fallback: ${fallbackError}` 
      };
    }
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Creates a professor notification email based on the configured email service
 */
export function createProfessorEmail(studentEmail: string, chatSummary: string, professorName: string): { subject: string; html: string; text: string } {
  // Determine which email service to use based on environment variable
  const emailService = process.env.EMAIL_SERVICE || 'resend';

  if (emailService.toLowerCase() === 'sendgrid') {
    // Use SendGrid email template
    return createProfessorSendGridEmail(studentEmail, chatSummary, professorName);
  } else {
    // Default to Resend email template
    return createProfessorNotificationEmail(studentEmail, chatSummary, professorName);
  }
}

// Re-export formatChatSummary from emailService
export { formatChatSummary }; 