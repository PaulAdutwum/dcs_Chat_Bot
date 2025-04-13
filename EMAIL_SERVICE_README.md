# Dual Email Service Implementation

This document describes the implementation of a flexible email service for the DCS Chatbot that supports both Resend and SendGrid as email providers.

## Overview

The email service is designed to allow easy switching between two popular email providers:

1. **Resend** - The default email provider
2. **SendGrid** - An alternative provider for redundancy

## Files and Structure

The implementation consists of the following files:

- `lib/emailService.ts` - The original Resend email service
- `lib/sendgridService.ts` - The new SendGrid email service
- `lib/emailProvider.ts` - A unified provider that selects between Resend and SendGrid
- `app/api/notify-professor/route.ts` - The API route that uses the email provider
- `app/email-service-demo/page.tsx` - A demo page to test both email services

## Configuration

Set up your email services by configuring the following environment variables in `.env.local`:

```
# API Keys
RESEND_API_KEY=your_resend_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# The domain to use for sending emails
EMAIL_FROM_DOMAIN=dcs.bates.edu

# Email service to use (resend or sendgrid)
EMAIL_SERVICE=resend
```

## Usage

### In Code

To send an email using the configured provider:

```typescript
import { sendEmailWithProvider } from "@/lib/emailProvider";

const result = await sendEmailWithProvider({
  from: `DCS Bot <noreply@${process.env.EMAIL_FROM_DOMAIN}>`,
  to: "recipient@example.com",
  subject: "Subject Line",
  text: "Plain text version",
  html: "<p>HTML version</p>",
});

if (result.success) {
  console.log("Email sent successfully!");
} else {
  console.error("Failed to send email:", result.error);
}
```

### Creating Professor Notification Emails

```typescript
import { createProfessorEmail } from "@/lib/emailProvider";

const emailContent = createProfessorEmail(
  "student@example.com", // Student email
  "Chat summary text...", // Chat summary
  "Prof. Smith" // Professor name
);

// emailContent contains { subject, text, html }
```

## Switching Between Providers

You can switch between email providers in three ways:

1. **Environment Variable** - Set `EMAIL_SERVICE=resend` or `EMAIL_SERVICE=sendgrid` in `.env.local`
2. **API Parameter** - Pass `emailService: 'resend'` or `emailService: 'sendgrid'` in the API request body
3. **Demo Page** - Use the radio buttons on the demo page at `/email-service-demo`

## Testing

You can test both email providers using the demo page at `/email-service-demo`. This page provides a form to:

- Select between Resend and SendGrid
- Enter your email address
- Choose a professor or let the system select based on your message
- Write a test message
- Send the email

## Fallback Mechanism

Future improvement: Implement a fallback mechanism that tries the secondary provider if the primary one fails.

```typescript
// Example implementation (not yet implemented)
async function sendEmailWithFallback(emailData) {
  try {
    // Try primary provider first
    const result = await sendEmailWithProvider(emailData);
    if (result.success) return result;

    // If primary fails, switch to the other provider
    const alternativeService =
      process.env.EMAIL_SERVICE === "resend" ? "sendgrid" : "resend";
    process.env.EMAIL_SERVICE = alternativeService;

    // Try with alternative provider
    return await sendEmailWithProvider(emailData);
  } catch (error) {
    return { success: false, error };
  }
}
```
