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

// Modify the generateGuidingQuestion function to handle different user types
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
  
  // For prospective students, focus on intro courses and major requirements
  if (state.userType === 'prospective') {
    if (state.previousQuestions.length === 2) {
      return `Thanks for letting me know you're a prospective student! I'll focus on information that will be most helpful to you.

The DCS program at Bates offers several introductory courses that are perfect entry points:

• DCS 109D: Intro to Computational Problem Solving with Data
• DCS 109S: Intro to Computing for Problem Solving
• DCS 109R: Intro to Computational Thinking with Robots
• DCS 109T: Computing Across the Liberal Arts

What specific aspects of computer science or digital studies interest you most?`;
    }
    
    // If they mention programming or coding
    if (messageLower.includes("programming") || messageLower.includes("coding") || messageLower.includes("code")) {
      return `For prospective students interested in programming, I recommend starting with:

• DCS 109D if you're interested in working with data
• DCS 109S if you want a strong general programming foundation

No prior experience is needed for these courses! They're designed as entry points.

Would you like to know more about what languages you'll learn or what projects you might work on?`;
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
• DCS 109S: Intro to Computing for Problem Solving

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
    plan += "• DCS 109D or DCS 109S: Introduction to computational thinking and programming\n";
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
    plan += "• DCS 109 series (D, R, S, or T)\n";
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

export async function POST(req: Request) {
  // Track start time for processing
  const startTime = Date.now();
  
  try {
    // Parse the request
    const data = await req.json();
    const { messages, systemPrompt, context, userId } = data;
    
    // Extract the user's message
    const userMessage = messages[messages.length - 1].content;
    
    // Get or initialize the conversation state
    const conversationState = getConversationState(userId || 'anonymous');
    
    // Extract user type information from the message
    extractUserTypeInfo(userMessage, conversationState);
    
    // Check for timeout frequently during processing
    const checkTimeout = () => {
      if (Date.now() - startTime > MAX_PROCESSING_TIME) {
        throw new Error("Processing timeout");
      }
    };
    
    // Check for interests in the user's message
    const newInterests = extractInterestsFromMessage(userMessage);
    checkTimeout();
    
    // Update identified interests
    Object.entries(newInterests).forEach(([category, strength]) => {
      conversationState.identifiedInterests[category] = Math.max(
        strength,
        conversationState.identifiedInterests[category] || 0
      );
    });
    
    // Process content to enrich with specific DCS information
    let enhancedContent = userMessage;
    checkTimeout();
    
    // Check if this is a course inquiry
    const courseCodeMatch = userMessage.match(/\b(DCS|MATH|STAT|ECON|PSYC|AV|MUS|THEA|PHYS)[0-9]{3}\b/i);
    if (courseCodeMatch) {
      const courseCode = courseCodeMatch[0].toUpperCase();
      const course = findCourseByCode(courseCode);
      if (course) {
        enhancedContent = `[COURSE INFO REQUESTED: ${courseCode}] ${userMessage}`;
        if (!conversationState.mentionedCourses.includes(courseCode)) {
          conversationState.mentionedCourses.push(courseCode);
        }
      }
    }
    
    checkTimeout();
    
    // Check if this is a professor inquiry
    const facultyNames = faculty.map((prof: any) => prof.name?.split(' ')[1]).filter(Boolean); // Get last names
    const professorMatch = facultyNames.find((name: string) => 
      userMessage.toLowerCase().includes(name.toLowerCase())
    );
    if (professorMatch) {
      const professor = findProfessorByName(professorMatch);
      if (professor) {
        enhancedContent = `[PROFESSOR INFO REQUESTED: ${professor.name}] ${userMessage}`;
      }
    }
    
    checkTimeout();
    
    // Check for career path mentions
    Object.values(careerPaths).forEach((career: any) => {
      if (userMessage.toLowerCase().includes(career.name.toLowerCase())) {
        if (!conversationState.mentionedCareers.includes(career.name)) {
          conversationState.mentionedCareers.push(career.name);
        }
      }
    });
    
    checkTimeout();
    
    // Check for special commands to jump to specific phases
    if (userMessage.toLowerCase().includes('/plan')) {
      conversationState.explorationPhase = 'plan';
    } else if (userMessage.toLowerCase().includes('/recommend')) {
      conversationState.explorationPhase = 'plan';
    } else if (userMessage.toLowerCase().includes('/courses')) {
      conversationState.explorationPhase = 'courses';
    } else if (userMessage.toLowerCase().includes('/careers')) {
      conversationState.explorationPhase = 'careers';
    } else if (userMessage.toLowerCase().includes('/interests')) {
      conversationState.explorationPhase = 'interests';
    } else if (userMessage.toLowerCase().includes('/reset')) {
      conversationState.explorationPhase = 'initial';
      conversationState.identifiedInterests = {};
      conversationState.mentionedCourses = [];
      conversationState.mentionedCareers = [];
      conversationState.suggestedPlan = false;
    }
    
    checkTimeout();
    
    // Check for programming questions first
    const programmingResponse = processProgrammingQuestion(userMessage);
    if (programmingResponse) {
      return NextResponse.json({ 
        response: programmingResponse,
        success: true,
        conversationPhase: conversationState.explorationPhase
      });
    }
    
    // Check if we should generate a guiding question
    let response = generateGuidingQuestion(conversationState, userMessage);
    
    // If we've reached the plan phase, generate a personalized plan
    if (conversationState.explorationPhase === 'plan' && !conversationState.suggestedPlan) {
      response = generatePersonalizedPlan(conversationState);
      conversationState.suggestedPlan = true;
    }
    
    checkTimeout();
    
    // If no guiding question is needed, use the mock response
    if (!response) {
      // Provide different responses based on user type
      if (conversationState.userType === 'prospective') {
        if (userMessage.toLowerCase().includes("course") || userMessage.toLowerCase().includes("class")) {
          response = `For prospective students, I recommend these introductory courses:

• DCS 109D: Introduces computational thinking using data and Python
• DCS 109S: Focuses on problem-solving and programming fundamentals
• DCS 109R: Explores robotics and tangible computing
• DCS 109T: Examines computing across the liberal arts

These courses require no prior experience and provide an excellent foundation for the DCS major.

Would you like more information about any specific course?`;
        }
      } else if (conversationState.userType === 'current') {
        if (userMessage.toLowerCase().includes("course") || userMessage.toLowerCase().includes("class")) {
          if (conversationState.coursesTaken && conversationState.coursesTaken.length > 0) {
            response = `Based on your courses (${conversationState.coursesTaken.join(", ")}), here are recommended next steps:

${getNextCourseRecommendations(conversationState.coursesTaken)}

Would you like to speak with Professor Barry Lawson for personalized advising?`;
          } else {
            response = "As a current student, it would help if you could tell me which DCS courses you've already taken so I can provide appropriate recommendations.";
          }
        }
      }
      
      // If we still don't have a specific response, use the general mock response
      if (!response) {
        response = generateMockResponse(userMessage);
      }
    }

    // Check if the response is about courses and should include pathways
    if ((!response || response.includes("course")) && 
        (userMessage.includes("recommend") || userMessage.includes("pathway") || 
         userMessage.includes("sequence") || userMessage.includes("path"))) {
      
      // Get the top interests
      const topInterests = Object.entries(conversationState.identifiedInterests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([interest]) => interest)
        .join(" ");
      
      response = recommendCoursePath(topInterests);
    }

    // Return successful response
    return NextResponse.json({ 
      response,
      success: true,
      conversationPhase: conversationState.explorationPhase
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Provide a fallback response even on error
    let fallbackResponse;
    try {
      // Try to extract the user message from the request
      const requestData = await req.json();
      const userMessage = requestData.messages[requestData.messages.length - 1].content;
      fallbackResponse = generateFallbackResponse(userMessage);
    } catch (fallbackError) {
      // If we can't even extract the message, provide a generic response
      fallbackResponse = "I'm here to help you explore the Bates College Digital and Computational Studies program. What would you like to know about the major, courses, faculty, or career opportunities?";
    }
    
    return NextResponse.json(
      { 
        error: 'There was an error processing your request',
        response: fallbackResponse,
        conversationPhase: 'initial'
      },
      { status: 200 } // Return 200 OK even on error to avoid client-side failures
    );
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