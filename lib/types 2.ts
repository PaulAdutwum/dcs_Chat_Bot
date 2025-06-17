/**
 * Shared types for the email service
 */

// Define a type for the email result with additional fields
export interface EmailResult {
  success: boolean;
  data?: any;
  error?: any;
  provider?: string;
  fallback?: boolean;
  primaryError?: any;
}

// Basic email data structure
export interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
} 