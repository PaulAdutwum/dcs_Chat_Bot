import { NextResponse } from 'next/server';
import { 
  faculty, 
  findCourseByCode,
  findProfessorByName,
  careerPaths, 
  dcsCoursesData
} from '@/lib/courseData';
import { extractInterestsFromMessage, recommendCourses, recommendCareerPaths, recommendDCSPath } from '@/lib/interests';
import { 
  generateMockResponse, 
  generateFallbackResponse,
  recommendCoursePath 
} from '@/lib/mockResponses';

export const runtime = 'edge';

// Set a shorter timeout for faster responses
const MAX_PROCESSING_TIME = 5000; // 5 seconds

// Track conversation state for guided exploration
interface ConversationState {
  explorationPhase: 'initial' | 'interests' | 'courses' | 'careers' | 'plan' | 'followup';
  identifiedInterests: Record<string, number>;
  mentionedCourses: string[];
  mentionedCareers: string[];
  suggestedPlan: boolean;
  lastInteractionTime: number;
  previousQuestions: string[];
  userType?: 'prospective' | 'current' | 'staff'; // Add user type
  coursesTaken?: string[]; // Add courses taken for current students
}

// Store conversation states by user ID
const conversationStates: Record<string, ConversationState> = {};

// Helper function to get or initialize conversation state
function getConversationState(userId: string): ConversationState {
  // Reset conversation if it's been over 30 minutes
  const thirtyMinutesInMs = 30 * 60 * 1000;
  const now = Date.now();
  
  if (
    conversationStates[userId] && 
    (now - conversationStates[userId].lastInteractionTime > thirtyMinutesInMs)
  ) {
    delete conversationStates[userId];
  }
  
  if (!conversationStates[userId]) {
    conversationStates[userId] = {
      explorationPhase: 'initial',
      identifiedInterests: {},
      mentionedCourses: [],
      mentionedCareers: [],
      suggestedPlan: false,
      lastInteractionTime: now,
      previousQuestions: []
    };
  } else {
    // Update the interaction time
    conversationStates[userId].lastInteractionTime = now;
  }
  
  return conversationStates[userId];
}

// Add new action types for prospective students
const PROSPECTIVE_STUDENT_ACTIONS = {
  EXPLORE_INTERESTS: 'explore_interests',
  PROGRAMMING_LANGUAGES: 'programming_languages',
  CAREER_PATHS: 'career_paths',
  RESEARCH_OPPS: 'research_opps',
  COURSE_PLANNING: 'course_planning'
};

// Add new function to handle prospective student flow
function handleProspectiveStudentFlow(action: string, message: string): string {
  const messageLower = message.toLowerCase();
  
  switch (action) {
    case PROSPECTIVE_STUDENT_ACTIONS.EXPLORE_INTERESTS:
      return `Great! Let's explore your interests in DCS. Here are some key areas you might be interested in:

• Programming and Software Development
• Data Science and Analysis
• Artificial Intelligence and Machine Learning
• Web and Mobile Development
• Digital Humanities
• Cybersecurity
• Game Development
• Human-Computer Interaction

Which of these areas interests you most? You can also tell me about other specific interests you have!`;

    case PROSPECTIVE_STUDENT_ACTIONS.PROGRAMMING_LANGUAGES:
      return `At Bates, you'll have the opportunity to learn several programming languages:

• Python: Used in DCS 109D for data analysis and computational thinking
• Java: Taught in DCS 211 for object-oriented programming
• JavaScript: Used in DCS 229 for web development
• R: Used in statistics and data science courses
• SQL: For database management
• HTML/CSS: For web development

Would you like to know more about any specific language or see how it's used in our courses?`;

    case PROSPECTIVE_STUDENT_ACTIONS.CAREER_PATHS:
      return `DCS graduates pursue diverse career paths:

• Software Engineering
• Data Science and Analytics
• Web Development
• UX/UI Design
• Cybersecurity
• Research and Academia
• Digital Humanities
• Tech Consulting
• Game Development
• AI/ML Engineering

Would you like to explore any of these career paths in more detail?`;

    case PROSPECTIVE_STUDENT_ACTIONS.RESEARCH_OPPS:
      return `Bates offers exciting research opportunities in DCS:

• Summer Research Fellowships
• Independent Study Projects
• Senior Thesis Research
• Faculty-Led Research Projects
• Interdisciplinary Research Collaborations
• External Research Internships

Current research areas include:
• Machine Learning and AI
• Data Visualization
• Digital Humanities
• Human-Computer Interaction
• Cybersecurity
• Computational Biology

Would you like to learn more about any specific research area or opportunity?`;

    case PROSPECTIVE_STUDENT_ACTIONS.COURSE_PLANNING:
      return `Let's plan your DCS journey! Here's a typical course sequence:

First Year:
• DCS 109D: Intro to Computational Problem Solving with Data
• DCS 150: Digital Storytelling and Culture

Second Year:
• DCS 211: Data Structures and Algorithms
• DCS 229: Web Development
• Methods courses in your area of interest

Third Year:
• Advanced courses in your chosen track
• Research opportunities
• Internships

Fourth Year:
• Senior Seminar
• Capstone Project
• Advanced electives

Would you like to explore any specific year or course in more detail?`;

    default:
      return `I'm here to help you explore the DCS program at Bates. What would you like to know more about?`;
  }
}

// Modify the generateGuidingQuestion function to include new prospective student options
function generateGuidingQuestion(state: ConversationState, message: string): string | null {
  const messageLower = message.toLowerCase();
  
  // Record this question to avoid repetition
  state.previousQuestions.push(message);
  
  // Check for user type indicators in the message
  if (messageLower.includes("prospective") || messageLower.includes("thinking about applying") || messageLower.includes("interested in applying")) {
    state.userType = 'prospective';
  } else if (messageLower.includes("current student") || messageLower.includes("already taking") || messageLower.includes("enrolled")) {
    state.userType = 'current';
  } else if (messageLower.includes("faculty") || messageLower.includes("staff") || messageLower.includes("teach")) {
    state.userType = 'staff';
  }
  
  // Check for courses taken in the message for current students
  if (state.userType === 'current') {
    const courseRegex = /dcs\s*\d{3}/gi;
    const courseMatches = messageLower.match(courseRegex);
    if (courseMatches && courseMatches.length > 0) {
      // Create the array if it doesn't exist yet
      state.coursesTaken = state.coursesTaken ?? [];
      
      const coursesTaken = state.coursesTaken; // Create a reference that TypeScript can track
      
      courseMatches.forEach(course => {
        const formattedCourse = course.toUpperCase().replace(/\s+/g, "");
        if (!coursesTaken.includes(formattedCourse)) {
          coursesTaken.push(formattedCourse);
        }
      });
    }
  }
  
  // Check for special commands that could reset the conversation
  if (messageLower.includes('start over') || messageLower.includes('reset')) {
    state.explorationPhase = 'initial';
    state.identifiedInterests = {};
    state.mentionedCourses = [];
    state.mentionedCareers = [];
    state.suggestedPlan = false;
    state.previousQuestions = [];
    state.userType = undefined;
    state.coursesTaken = undefined;
    return "Let's start fresh! I'm your Bates DCS guide, providing information based on the official Bates College Digital and Computational Studies website. To help me provide the most relevant information, could you tell me if you're a prospective student, current student, or faculty/staff member?";
  }
  
  // First question - always ask about user type if not set
  if (!state.userType && state.previousQuestions.length <= 2) {
    return "To help me provide more relevant information, could you tell me if you're a prospective student, current student, or faculty/staff member?";
  }
  
  // For prospective students, add more comprehensive options
  if (state.userType === 'prospective') {
    if (messageLower.includes("programming") || messageLower.includes("coding") || messageLower.includes("code")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.PROGRAMMING_LANGUAGES, message);
    }
    
    if (messageLower.includes("career") || messageLower.includes("job") || messageLower.includes("work")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.CAREER_PATHS, message);
    }
    
    if (messageLower.includes("research") || messageLower.includes("study") || messageLower.includes("project")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.RESEARCH_OPPS, message);
    }
    
    if (messageLower.includes("course") || messageLower.includes("plan") || messageLower.includes("schedule")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.COURSE_PLANNING, message);
    }
    
    if (messageLower.includes("interest") || messageLower.includes("explore") || messageLower.includes("learn")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.EXPLORE_INTERESTS, message);
    }
  }
  
  // For current students, focus on course planning based on what they've taken
  if (state.userType === 'current') {
    if (state.coursesTaken && state.coursesTaken.length > 0) {
      // Generate course recommendations based on what they've taken
      let recommendations = "Based on the courses you've taken (";
      recommendations += state.coursesTaken.join(", ");
      recommendations += "), here are some courses you might consider next:\n\n";
      
      if (state.coursesTaken.some(c => c.includes("109"))) {
        recommendations += "• DCS 211: Data Structures and Algorithms\n";
        recommendations += "• DCS 229: Web Application Development\n\n";
      }
      
      if (state.coursesTaken.some(c => c.includes("211"))) {
        recommendations += "• DCS 305: Human-Computer Interaction\n";
        recommendations += "• DCS 325: Machine Learning\n\n";
      }
      
      recommendations += "Would you like to discuss your course plan with Professor Barry Lawson? He can provide personalized advising.";
      
      return recommendations;
    } else if (state.previousQuestions.length === 2) {
      return "As a current student, it would help if you could tell me which DCS courses you've already taken. This will help me recommend appropriate next courses for you.";
    }
  }
  
  // For faculty/staff, focus on program information
  if (state.userType === 'staff' && state.previousQuestions.length === 2) {
    return `Thank you for identifying as faculty/staff. I can provide information about:

• Current DCS curriculum and requirements
• Course offerings and schedules
• Student resources and advising
• Research opportunities

What specific information about the DCS program would be most helpful to you?`;
  }
  
  // Continue with the rest of the existing logic, but with adaptations based on user type
  if ((state.explorationPhase === 'interests' && Object.keys(state.identifiedInterests).length > 0) || 
      messageLower.includes('courses i like') || messageLower.includes('taken courses')) {
    state.explorationPhase = 'courses';
    
    if (state.userType === 'prospective') {
      return `Based on your interests, these introductory courses would be excellent starting points:

• DCS 109D: Intro to Computational Problem Solving with Data
• DCS 109: Intro to Computer Science and Software Engineering

No prior experience is needed for these courses. Which aspects of these courses sound most interesting to you?`;
    } else if (state.userType === 'current') {
      return `Based on your interests and courses you've taken, these next courses might align well with your goals:

• DCS 211: Data Structures and Algorithms
• DCS 229: Web Development
• DCS 250: Data Analysis and Visualization

Would you like more details about any of these courses? Or would you prefer to speak with Professor Barry Lawson about course planning?`;
    } else {
      // Use the original response for faculty/staff or unknown user types
      return `Thank you for sharing your interests! Let's connect them to academic experiences.

Reflecting on courses you've taken or topics you've explored:

• What learning experiences have you found most engaging?
• Which class activities or projects have you enjoyed most?
• When learning something new, what formats help you thrive?
• Have any particular topics or challenges energized you?

Your reflections will help us find DCS courses that match your learning style and interests.`;
    }
  }
  
  // Check for keywords indicating interest in exploration
  const explorationKeywords = ['explore', 'interest', 'not sure', 'help me', 'guidance', 'advise', 'plan', 'career', 'major', 'courses', 'learn'];
  const isExplorationRequest = explorationKeywords.some(keyword => messageLower.includes(keyword));
  
  // Move through exploration phases when appropriate
  if ((isExplorationRequest && state.explorationPhase === 'initial') || messageLower.includes('my interests')) {
    state.explorationPhase = 'interests';
    return `Let's reflect on what aspects of computing resonate with you! 

According to the Bates DCS program, students connect with different elements of computing:

• Are you drawn to creative problem-solving?
• Do you enjoy working with data and discovering patterns?
• Are you interested in designing how people interact with technology?
• Do you want to use technology to address social challenges?
• Are you fascinated by how software is built?
• Does artificial intelligence or machine learning intrigue you?

Which of these resonates most with you, or is there something else that sparks your interest?`;
  }
  
  if ((state.explorationPhase === 'interests' && messageLower.includes('course')) || 
      messageLower.includes('career') || messageLower.includes('job') || messageLower.includes('work')) {
    state.explorationPhase = 'careers';
    return `Your course reflections provide valuable insights! Now let's consider how these might connect to future paths.

When you imagine using your technical knowledge after Bates, which of these resonates with you:

• Creating software solutions to real-world problems
• Finding meaningful patterns in complex data
• Designing digital experiences that help people
• Advising organizations on effective technology use
• Building interactive digital media or games
• Protecting systems from cyber threats
• Advancing the frontiers of artificial intelligence

Which of these paths speaks to you, or do you envision something different?`;
  }
  
  if (state.explorationPhase === 'careers' && !state.suggestedPlan) {
    state.explorationPhase = 'plan';
    return null; // Will generate a personalized plan in the main function
  }
  
  if (state.explorationPhase === 'plan' && !messageLower.includes('email') && !messageLower.includes('professor')) {
    state.explorationPhase = 'followup';
    return `Based on our conversation about your interests and goals, I've created this educational plan for you.

Take a moment to reflect on this suggested path:

• Does it align with what excites you about computing?
• Are there areas you'd like to explore further?
• Do you see connections to your other academic interests?
• What questions do you have about implementing this plan?

I'm here to help refine this plan or explore any aspect in more detail.`;
  }
  
  // Add a new phase for specific course exploration if the user mentions a course
  const courseCodeRegex = /dcs\s*(\d{3}[a-z]?)/gi;
  const courseCodes = messageLower.match(courseCodeRegex);
  
  if (courseCodes && courseCodes.length > 0) {
    const courseCode = courseCodes[0].replace(/\s+/g, "").toUpperCase();
    const course = dcsCoursesData.find(c => c.code.replace(/\s+/g, "") === courseCode);
    
    if (course) {
      // Add follow-up questions about the course
      return `${course.code} sounds interesting! As you consider this course:

• What specific skills or knowledge from this course seem most valuable to you?
• How do you see this course connecting to your broader educational goals?
• What aspects of the course content most align with your interests?
• What kind of projects would you hope to work on in this course?

I can provide more details on any of these aspects of ${course.code}.`;
    }
  }
  
  // If we've identified their interests but they're asking generic questions, guide them
  if (Object.keys(state.identifiedInterests).length > 0 && 
      (messageLower.includes("what") || messageLower.includes("tell me") || messageLower.includes("how"))) {
    const topInterests = Object.entries(state.identifiedInterests)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([interest]) => interest);
    
    if (topInterests.length > 0) {
      return `Based on your interest in ${topInterests.join(" and ")}, let's explore how these connect to your DCS journey:

• What specific courses might deepen these interests?
• How might these interests translate to career opportunities?
• Which faculty members share your passion in these areas?
• What student projects have explored similar interests?
• How might these interests combine with other fields you enjoy?

Which of these directions would you like to explore further?`;
    }
  }
  
  return null;
}

// Generate a personalized educational plan based on user type
function generatePersonalizedPlan(state: ConversationState): string {
  // Get top interests for course recommendations
  const topInterests = Object.entries(state.identifiedInterests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([interest]) => interest)
    .join(" ");
  
  // Start with a different heading based on user type
  let plan = "";
  
  if (state.userType === 'prospective') {
    plan = "## Your Prospective DCS Path at Bates\n\n";
  } else if (state.userType === 'current') {
    plan = "## Your Personalized Course Plan\n\n";
  } else {
    plan = "## DCS Program Information\n\n";
  }
  
  // Add introduction based on interests
  plan += "Based on our conversation about your interest in ";
  const interestAreas = Object.keys(state.identifiedInterests).map(interest => 
    interest === 'ai' ? 'artificial intelligence' : interest.replace('_', ' ')
  );
  
  if (interestAreas.length === 1) {
    plan += `${interestAreas[0]}`;
  } else if (interestAreas.length === 2) {
    plan += `${interestAreas[0]} and ${interestAreas[1]}`;
  } else {
    const lastInterest = interestAreas.pop();
    plan += `${interestAreas.join(', ')}, and ${lastInterest}`;
  }
  
  // Different content based on user type
  if (state.userType === 'prospective') {
    plan += ", here's a suggested starting path for your DCS journey at Bates:\n\n";
    plan += "**First Year Courses:**\n";
    plan += "• DCS 109 or DCS 109S: Introduction to Computer Science and Software Engineering\n";
    plan += "• DCS 150: Digital Storytelling and Culture\n\n";
    
    plan += "**Second Year:**\n";
    plan += "• DCS 211: Data Structures and Algorithms\n";
    plan += "• DCS 229: Web Development\n\n";
    
    plan += "These introductory courses require no prior programming experience and will build a solid foundation for your DCS education.\n\n";
  } else if (state.userType === 'current') {
    plan += ", here's a recommended next steps in your DCS education:\n\n";
    
    // If they've taken courses, acknowledge them
    if (state.coursesTaken && state.coursesTaken.length > 0) {
      plan += `**Building on your current courses (${state.coursesTaken.join(", ")}):**\n`;
      
      if (state.coursesTaken.some(c => c.includes("109"))) {
        plan += "• DCS 211: Data Structures and Algorithms\n";
        plan += "• DCS 229: Web Development\n\n";
      }
      
      if (state.coursesTaken.some(c => c.includes("211"))) {
        plan += "• DCS 305: Human-Computer Interaction\n";
        plan += "• DCS 325: Machine Learning\n\n";
      }
    } else {
      // Use the coursePathRecommendation from mockResponses
      plan += recommendCoursePath(topInterests);
    }
  } else {
    // For faculty/staff or unknown user type
    plan += ", here are the key components of the DCS program:\n\n";
    plan += "**Foundation Courses (2):**\n";
    plan += "• DCS 109 \n";
    plan += "• Software development course (DCS 211 or DCS 229)\n\n";
    
    plan += "**Methods Requirements (4):**\n";
    plan += "• Methods spanning data science, critical digital studies, human-centered design, and community engagement\n\n";
    
    plan += "**Capstone (1):**\n";
    plan += "• DCS 457: Senior seminar project course\n\n";
    
    plan += "**Electives (3):**\n";
    plan += "• Courses to reach a total of 10, with at least 2 at 300-level or above\n\n";
  }
  
  // Add a tailored conclusion based on user type
  if (state.userType === 'prospective') {
    plan += "Would you like to speak with Professor Barry Lawson to discuss the DCS program and your interests further?";
  } else if (state.userType === 'current') {
    plan += "Would you like to schedule an advising session with Professor Barry Lawson to discuss your course plan in more detail?";
  } else {
    plan += "Please let me know if you'd like more specific information about any aspect of the DCS program.";
  }
  
  return plan;
}

// Add a function to process user type information
function extractUserTypeInfo(message: string, state: ConversationState): void {
  const messageLower = message.toLowerCase();
  
  // Check for user type indicators
  if (messageLower.includes("prospective") || messageLower.includes("applying") || messageLower.includes("high school") || messageLower.includes("future student")) {
    state.userType = 'prospective';
  } else if (messageLower.includes("current") || messageLower.includes("enrolled") || messageLower.includes("taking classes") || messageLower.includes("student at bates")) {
    state.userType = 'current';
  } else if (messageLower.includes("faculty") || messageLower.includes("staff") || messageLower.includes("professor") || messageLower.includes("teach")) {
    state.userType = 'staff';
  }
  
  // Extract courses taken by current students
  if (state.userType === 'current') {
    const courseRegex = /dcs\s*\d{3}/gi;
    const courseMatches = messageLower.match(courseRegex);
    if (courseMatches && courseMatches.length > 0) {
      // Create the array if it doesn't exist yet
      state.coursesTaken = state.coursesTaken ?? [];
      
      const coursesTaken = state.coursesTaken; // Create a reference that TypeScript can track
      
      courseMatches.forEach(course => {
        const formattedCourse = course.toUpperCase().replace(/\s+/g, "");
        if (!coursesTaken.includes(formattedCourse)) {
          coursesTaken.push(formattedCourse);
        }
      });
    }
  }
}

// Add function to handle unexpected programming questions
function processProgrammingQuestion(message: string): string | null {
  const programmingRegex = /programming|language|python|javascript|java|r|code|coding/i;
  if (programmingRegex.test(message)) {
    if (message.toLowerCase().includes("python")) {
      return `**Python in the DCS Curriculum**

Python is used in several DCS courses:

• DCS 109D (Intro with Data) - First introduction to Python
• DCS 250 (Data Analysis) - Python for data processing
• DCS 325 (Machine Learning) - Advanced Python applications

No prior experience needed - we start from the basics. Would you like more information about these courses?`;
    } 
    
    if (message.toLowerCase().includes("javascript")) {
      return `**JavaScript in the DCS Curriculum**

JavaScript is primarily used in:

• DCS 229 (Web Development) - Building interactive web applications
• DCS 329 (Advanced Web) - Single-page applications and modern frameworks

Would you like to learn more about web development courses?`;
    }
    
    if (message.toLowerCase().includes("java")) {
      return `**Java in the DCS Curriculum**

Java concepts are covered in:

• DCS 211 (Data Structures) - Object-oriented programming principles
• DCS 310 (Software Engineering) - Application development

Would you like more information about these programming courses?`;
    }
    
    return `**Programming Languages at Bates DCS**

Our curriculum teaches several languages:

• Python (data science, intro courses)
• JavaScript (web development)
• Java (data structures, software design)
• SQL (databases)

No prior experience needed - we start from the basics in DCS 109 courses.

Which language interests you most?`;
  }
  
  return null;
}

// Add new function to format OpenAI responses
function formatOpenAIResponse(response: string): string {
  // Add markdown formatting for better readability
  let formattedResponse = response;
    
  // Format headings
  formattedResponse = formattedResponse.replace(/^#\s+(.+)$/gm, '**$1**\n');
    
  // Format bullet points
  formattedResponse = formattedResponse.replace(/^•\s+(.+)$/gm, '• $1\n');
    
  // Format code blocks
  formattedResponse = formattedResponse.replace(/```([\s\S]*?)```/g, '`$1`');
    
  // Format links
  formattedResponse = formattedResponse.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  
  // Add spacing between sections
  formattedResponse = formattedResponse.replace(/\n\n/g, '\n\n');
  
  return formattedResponse;
}

// Add new function to get Bates DCS context
function getBatesDCSContext(): string {
  return `You are a helpful assistant for the Bates College Digital and Computational Studies (DCS) program. 
  Your responses should be informative, friendly, and focused on helping students explore the DCS major.
  
  Key information about Bates DCS:
  - The program combines computer science with liberal arts
  - Students can major or minor in DCS
  - The program offers courses in programming, data science, AI, web development, and more
  - Faculty include Professor Barry Lawson (Chair), Professor Matthew Jadud, and Professor Carrie Diaz Eaton
  - The program emphasizes hands-on learning and real-world applications
  
  When responding:
  - Use clear, concise language
  - Format responses with bullet points and headings for readability
  - Include specific course codes and names when relevant
  - Provide links to official Bates resources when available
  - Be encouraging and supportive of student interests
  - Always maintain a professional but friendly tone`;
}

function processUserMessage(message: string, state: ConversationState): string {
  const messageLower = message.toLowerCase();
    
  // Check for greetings and initial interactions
  if (messageLower.includes("hello") || messageLower.includes("hi") || messageLower.includes("hey")) {
    return "Hello! I'm your Bates DCS guide. How can I help you explore the Digital and Computational Studies program today?";
        }
  
  // Check for user type if not set
  if (!state.userType) {
    if (messageLower.includes("prospective") || messageLower.includes("applying") || messageLower.includes("interested in")) {
      state.userType = 'prospective';
      return "Great! As a prospective student, I can help you explore the DCS program. What would you like to know about? You can ask about courses, programming languages, career paths, or research opportunities.";
    } else if (messageLower.includes("current") || messageLower.includes("student") || messageLower.includes("taking")) {
      state.userType = 'current';
      return "Welcome back! As a current student, I can help you with course planning and program requirements. What courses are you currently taking or interested in?";
    } else if (messageLower.includes("faculty") || messageLower.includes("staff") || messageLower.includes("professor")) {
      state.userType = 'staff';
      return "Hello! As faculty/staff, I can provide information about the DCS program structure and resources. What would you like to know?";
    }
  }
  
  // Process based on user type
  if (state.userType === 'prospective') {
    if (messageLower.includes("programming") || messageLower.includes("coding") || messageLower.includes("code")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.PROGRAMMING_LANGUAGES, message);
    }
    
    if (messageLower.includes("career") || messageLower.includes("job") || messageLower.includes("work")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.CAREER_PATHS, message);
    }
    
    if (messageLower.includes("research") || messageLower.includes("study") || messageLower.includes("project")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.RESEARCH_OPPS, message);
        }
    
    if (messageLower.includes("course") || messageLower.includes("plan") || messageLower.includes("schedule")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.COURSE_PLANNING, message);
    }
    
    if (messageLower.includes("interest") || messageLower.includes("explore") || messageLower.includes("learn")) {
      return handleProspectiveStudentFlow(PROSPECTIVE_STUDENT_ACTIONS.EXPLORE_INTERESTS, message);
    }
  }
  
  // If no specific handler matches, generate a guiding question
  return generateGuidingQuestion(state, message) || 
    "I'm here to help you explore the DCS program. Could you tell me more about what interests you? You can ask about courses, programming languages, career paths, or research opportunities.";
          }

export async function POST(req: Request) {
  const startTime = Date.now();
  let userMessage = "";
  
  try {
    const requestData = await req.json();
    const { messages, userId } = requestData;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid message format");
    }
    
    // Get conversation state
    const conversationState = getConversationState(userId || 'anonymous');
    
    // Extract user's message
    userMessage = messages[messages.length - 1].content;
    
    // Process the message and get response
    const processedResponse = processUserMessage(userMessage, conversationState);
    
    // Update conversation state
    conversationState.lastInteractionTime = Date.now();
    
    // Return formatted response
    return NextResponse.json({ 
      response: processedResponse,
      success: true,
      conversationPhase: conversationState.explorationPhase
    });
    
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    
    // Provide a fallback response
    const fallbackResponse = generateFallbackResponse(userMessage);
    
    return NextResponse.json({
      error: "There was an error processing your request",
        response: fallbackResponse,
      conversationPhase: "initial"
    }, { status: 200 });
  }
}

// Helper function to get course recommendations
function getNextCourseRecommendations(coursesTaken: string[]): string {
  let recommendations = "";
  
  // Check if they've taken 109
  if (coursesTaken.some(course => course.includes("109"))) {
    recommendations += "**Next Level Courses:**\n";
    recommendations += "• DCS 211: Data Structures and Algorithms\n";
    recommendations += "• DCS 229: Web Development\n\n";
  } else {
    recommendations += "**Start with:**\n";
    recommendations += "• DCS 109D: Intro to Computational Problem Solving with Data\n";
    recommendations += "• DCS 109S: Intro to Computing for Problem Solving\n\n";
  }
  
  // Check if they've taken 211
  if (coursesTaken.some(course => course.includes("211"))) {
    recommendations += "**Advanced Courses:**\n";
    recommendations += "• DCS 305: Human-Computer Interaction\n";
    recommendations += "• DCS 325: Machine Learning\n";
  }
  
  return recommendations || "Consider starting with the DCS 109 series to build a strong foundation.";
} 