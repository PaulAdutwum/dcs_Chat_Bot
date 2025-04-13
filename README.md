# Bates DCS Chatbot

A modern, interactive chatbot for the Bates Digital & Computational Studies program. Helps students, prospective students, and faculty access information about courses, faculty, and program requirements.

![Bates DCS Chatbot](https://example.com/screenshot.png)

## Features

- 💬 **Interactive Chat Interface** - Engage in natural conversation with the DCS assistant
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎓 **Program Information** - Access details about the DCS major, courses, and career paths
- 👨‍🏫 **Faculty Contact** - Connect with professors directly through the chatbot
- 📊 **Interest Tracking** - Personalizes responses based on user interests
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- 📈 **Analytics Integration** - Logs user interactions to Supabase for insights

## Tech Stack

- **Frontend:**

  - [Next.js](https://nextjs.org/) - React framework
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe code
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
  - [Shadcn UI](https://ui.shadcn.com/) - Component library

- **Backend:**

  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless API endpoints
  - [Supabase](https://supabase.com/) - Database and user authentication

- **Email Services:**
  - [SendGrid](https://sendgrid.com/) - Primary email provider
  - [Resend](https://resend.io/) - Backup email provider

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dcsbot.git
   cd dcsbot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   EMAIL_SERVICE=resend
   EMAIL_FROM_DOMAIN=dcs.bates.edu
   ```

4. Set up the Supabase database:

   - Navigate to your Supabase project SQL Editor
   - Run the migration from `/supabase/migrations/20231108000000_create_user_interactions.sql`
   - Run the helper functions from `/supabase/migrations/20231108000001_create_helper_functions.sql`

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Testing

Run the Supabase connection test to verify your setup:

```bash
npm run test:supabase
```

## Project Structure

```
dcsbot/
├── app/                   # Next.js app router
│   ├── api/               # API routes for chat and email
│   └── page.tsx           # Main application page
├── components/            # React components
│   └── chatbot/           # Chatbot-specific components
├── lib/                   # Utility functions
│   ├── courseData.ts      # Course information
│   ├── emailProvider.ts   # Email service integration
│   ├── interests.ts       # User interest tracking
│   ├── supabase-client.ts # Supabase client
│   └── store.ts           # State management with Zustand
├── public/                # Static assets
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
└── scripts/               # Utility scripts
    └── test-supabase.js   # Test Supabase connection
```

## Analytics and Data

User interactions are stored in Supabase in the `user_interactions` table with the following structure:

- `user_id`: Anonymous identifier for the user
- `interaction_type`: Type of interaction (user_message, suggestion_click, professor_contact)
- `content`: JSON with details about the interaction
- `created_at`: Timestamp

Access analytics using the PostgreSQL functions in `/supabase/migrations/20231108000001_create_helper_functions.sql`.

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import your project to Vercel
3. Add your environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Bates College Digital & Computational Studies Department
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
