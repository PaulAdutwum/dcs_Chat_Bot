# Bates DCS Chatbot Documentation

## Overview

The Bates DCS Chatbot is an interactive chat interface designed to help students explore the Digital and Computational Studies (DCS) major at Bates College. The chatbot provides information about courses, major requirements, career paths, and faculty, while also helping students discover which areas of DCS best align with their interests and strengths.

## Key Features

### Interactive Chat Interface

- Real-time responses to student questions
- Suggestion buttons for guided exploration
- Dark/light mode toggle
- Resizable chat window
- Progress tracking throughout the conversation

### Information Access

- Detailed course information (prerequisites, scheduling, etc.)
- Major requirements and methods categories
- Faculty information and contact options
- Career paths and opportunities
- Sample four-year plans

### Interest-Based Recommendations

- Interest tracking that builds a profile of student preferences
- Personalized course and career path recommendations
- Interactive career exploration questionnaire
- Reflective questions to help students discover their interests
- Integration with faculty contact system

## Implementation Details

### Core Components

1. **ChatWindow.tsx**: Main component that renders the chat interface and handles user interactions
2. **store.ts**: State management using Zustand, tracking messages, user interests, and chat settings
3. **emailProvider.ts**: Handles professor notifications when students request to speak with faculty
4. **courseData.ts**: Contains structured information about DCS courses, career paths, and faculty
5. **api/chat/route.ts**: Backend API route that processes messages using OpenAI's API

### Interest Tracking System

The chatbot implements a sophisticated interest tracking system that:

1. Analyzes user messages for keywords related to DCS areas
2. Builds a weighted profile of interests over time
3. Uses this profile to personalize recommendations
4. Adjusts content based on detected strengths and preferences

This allows for increasingly personalized interactions the more a student uses the chatbot.

### Career Exploration Questionnaire

The career questionnaire helps students discover which areas of DCS align with their interests through:

1. A series of 5 carefully designed questions
2. Analysis of answers to identify primary and secondary career paths
3. Personalized course recommendations based on identified paths
4. Custom four-year plans tailored to student interests

### OpenAI Integration

The chatbot uses OpenAI's API for natural language understanding and generation:

1. Maintains conversation history for context
2. Incorporates detailed DCS program information in system prompts
3. Uses interest profiles to enhance API context
4. Falls back to mock responses during development or API outages

## Usage Examples

### Exploring Major Requirements

Students can ask questions like:

- "What are the requirements for the DCS major?"
- "What are the four methods requirements?"
- "How many courses do I need for the major?"

### Course Information

Students can inquire about specific courses:

- "Tell me about DCS 211"
- "What are the prerequisites for DCS 325?"
- "Which courses focus on data science?"

### Interest Exploration

Students can explore their interests with:

- "What would I enjoy in DCS?"
- "Help me find my path"
- "What career options match my interests?"

### Speaking with Faculty

Students can connect with professors:

- "I'd like to speak with a professor"
- "Can I talk to someone about the data science track?"
- "Who should I contact about UX/UI courses?"

## Configuration

### Environment Variables

The chatbot requires the following environment variables:

```
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Email Service Configuration (for faculty notifications)
EMAIL_SERVICE=resend or sendgrid
RESEND_API_KEY=your_resend_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM_DOMAIN=your_domain.edu
```

## Future Enhancements

Planned improvements include:

1. **Improved Interest Detection**: Enhanced NLP for better interest identification
2. **Course Planning Tool**: Interactive schedule builder based on interests
3. **Alumni Stories**: Integration of DCS alumni experiences and career paths
4. **Expanded Questionnaires**: Additional reflective tools for deeper exploration
5. **Multilingual Support**: Support for multiple languages to increase accessibility
