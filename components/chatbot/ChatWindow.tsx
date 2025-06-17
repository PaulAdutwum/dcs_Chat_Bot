"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import {
  Send,
  X,
  Moon,
  Sun,
  Loader2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useChatStore, Interest } from "@/lib/store";
import {
  dcsCoursesData,
  getCoursesByCategory,
  careerPaths,
  faculty,
  getCareerPathByTitle,
} from "@/lib/courseData";
import {
  generateMockResponse,
  generateFallbackResponse,
  generateProgrammingLanguageResponse,
  generateCareerFieldResponse,
  recommendCoursePath,
} from "@/lib/mockResponses";
import { formatChatSummary } from "@/lib/emailService";
import CourseRecommendationDisplay from "./CourseRecommendationDisplay";
import { extractInterestsFromMessage } from "@/lib/interests";
import { supabase, getUserId } from "@/lib/supabase-client";

// Helper function to combine mocked responses with API responses
const getHybridResponse = async (
  userInput: string,
  userType: "prospective" | "current" | "staff" | null,
  coursesTaken: string[]
) => {
  try {
    // Try to get immediate response from mock system
    const mockResponse = generateMockResponse(userInput);

    // If mock response is good, return it immediately
    if (
      mockResponse &&
      !mockResponse.includes("I apologize for the difficulty")
    ) {
      return {
        text: mockResponse,
        fromMock: true,
      };
    }

    // If no good mock response, try API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: userInput }],
        userId: useChatStore.getState().userId,
        userType: userType,
        coursesTaken: coursesTaken,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("API response was not ok");
    }

    const data = await response.json();

    return {
      text:
        data.response ||
        "I'm sorry, I couldn't understand that. Could you rephrase?",
      conversationPhase: data.conversationPhase,
      fromMock: false,
    };
  } catch (error) {
    console.error("Error in hybrid response:", error);

    // Fall back to mock response or fallback
    const fallbackResponse = generateFallbackResponse(userInput);

    return {
      text:
        fallbackResponse ||
        "I'm having trouble connecting right now. Please try again.",
      fromMock: true,
    };
  }
};

// Add Markdown formatting function to convert markdown to properly styled text
const formatResponseText = (text: string) => {
  // Handle bold text (convert **text** to proper bold styling)
  const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Handle bullet points
  const bulletFormatted = boldFormatted.replace(/^•\s+(.+)$/gm, "<li>$1</li>");

  // Wrap bullet points in <ul> tags if present
  let finalFormatted = bulletFormatted;
  if (bulletFormatted.includes("<li>")) {
    // Use a different approach without the 's' flag for compatibility
    const parts = bulletFormatted.split(/(<li>.*?<\/li>)/g);
    let inList = false;
    let processedText = "";

    for (const part of parts) {
      if (part.startsWith("<li>")) {
        if (!inList) {
          // Start a new list
          processedText += '<ul class="pl-5 list-disc space-y-1 text-sm">';
          inList = true;
        }
        processedText += part;
      } else if (part.trim() && inList) {
        // End the list if we have non-empty content outside of <li>
        processedText += "</ul>" + part;
        inList = false;
      } else {
        processedText += part;
      }
    }

    // Close any open list
    if (inList) {
      processedText += "</ul>";
    }

    finalFormatted = processedText;
  }

  // Convert line breaks to <br> tags
  finalFormatted = finalFormatted.replace(/\n/g, "<br />");

  return finalFormatted;
};

// Define suggestion button types
type SuggestionButton = {
  id: string;
  text: string;
  action: string;
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: SuggestionButton[];
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

// Styles for suggestion button click animation
const styles = {
  suggestionClicked: `
    transform: scale(0.95) !important;
    background-color: rgb(30, 64, 175) !important;
    color: white !important;
  `,
};

// Add a constant for auto-recovery
const AUTO_RECOVERY_INTERVAL = 30000; // 30 seconds - reduced from 60 seconds

// Define user type buttons at the beginning of the component function
const userTypeButtons: SuggestionButton[] = [
  {
    id: "prospective_student",
    text: "Prospective Student",
    action: "I'm a prospective student",
  },
  {
    id: "current_student",
    text: "Current Student",
    action: "I'm a current student",
  },
  {
    id: "staff",
    text: "Faculty/Staff",
    action: "I'm faculty or staff",
  },
];

// Define a simplified career questionnaire
const careerQuestionnaire = [
  {
    question: "What aspects of technology interest you the most?",
    options: [
      {
        id: "q1a",
        text: "Building software applications",
        value: "programming",
      },
      { id: "q1b", text: "Working with data and analytics", value: "data" },
      { id: "q1c", text: "Designing user experiences", value: "design" },
      {
        id: "q1d",
        text: "Solving complex problems",
        value: "problemsolving",
      },
    ],
  },
  {
    question: "Which of these activities would you enjoy most?",
    options: [
      {
        id: "q2a",
        text: "Creating algorithms to solve problems",
        value: "algorithms",
      },
      {
        id: "q2b",
        text: "Finding insights in large datasets",
        value: "dataanalysis",
      },
      {
        id: "q2c",
        text: "Making technology more accessible to users",
        value: "accessibility",
      },
      {
        id: "q2d",
        text: "Connecting technology to social issues",
        value: "social",
      },
    ],
  },
  {
    question: "In group projects, which role do you naturally take?",
    options: [
      { id: "q3a", text: "Technical implementer", value: "technical" },
      { id: "q3b", text: "Researcher and analyst", value: "researcher" },
      { id: "q3c", text: "Creative problem solver", value: "creative" },
      { id: "q3d", text: "Team coordinator or leader", value: "leadership" },
    ],
  },
];

// Define the student questions objects
const prospectiveStudentQuestions = [
  {
    id: "major_interests",
    text: "What majors are you considering?",
    suggestions: [
      {
        id: "major_dcs",
        text: "DCS Major",
        action: "I'm considering the DCS major",
      },
      {
        id: "major_double",
        text: "Double Major",
        action: "I'm considering a double major with DCS",
      },
      {
        id: "major_minor",
        text: "DCS Minor",
        action: "I'm considering a DCS minor",
      },
      {
        id: "major_unsure",
        text: "Not Sure Yet",
        action: "I'm not sure what I want to major in yet",
      },
    ],
  },
  {
    id: "interests",
    text: "What aspects of computing interest you most?",
    suggestions: [
      {
        id: "interest_coding",
        text: "Coding/Software",
        action: "I'm interested in coding and software development",
      },
      {
        id: "interest_data",
        text: "Data/AI",
        action: "I'm interested in data science and AI",
      },
      {
        id: "interest_design",
        text: "UI/UX Design",
        action: "I'm interested in user interface design",
      },
      {
        id: "interest_theory",
        text: "Theory/Algorithms",
        action: "I'm interested in computer science theory",
      },
    ],
  },
];

const currentStudentQuestions = [
  {
    id: "year",
    text: "What year are you at Bates?",
    suggestions: [
      {
        id: "year_1",
        text: "First Year",
        action: "I'm a first year student",
      },
      {
        id: "year_2",
        text: "Second Year",
        action: "I'm a second year student",
      },
      {
        id: "year_3",
        text: "Third Year",
        action: "I'm a third year student",
      },
      {
        id: "year_4",
        text: "Fourth Year",
        action: "I'm a fourth year student",
      },
    ],
  },
  {
    id: "courses_taken",
    text: "Which DCS courses have you taken?",
    suggestions: [
      {
        id: "taken_none",
        text: "None Yet",
        action: "I haven't taken any DCS courses yet",
      },
      {
        id: "taken_intro",
        text: "Intro Course(s)",
        action: "I've taken an intro DCS course",
      },
      {
        id: "taken_multiple",
        text: "Multiple Courses",
        action: "I've taken multiple DCS courses",
      },
      {
        id: "taken_other",
        text: "Other Courses",
        action: "I want to specify which courses I've taken",
      },
    ],
  },
];

const staffQuestions = [
  {
    id: "role",
    text: "What's your role at Bates?",
    suggestions: [
      {
        id: "role_faculty",
        text: "Faculty",
        action: "I'm faculty at Bates",
      },
      {
        id: "role_advisor",
        text: "Academic Advisor",
        action: "I'm an academic advisor",
      },
      {
        id: "role_staff",
        text: "Staff",
        action: "I'm staff at Bates",
      },
      {
        id: "role_admin",
        text: "Administrator",
        action: "I'm an administrator",
      },
    ],
  },
];

// Define initial suggestions
const initialSuggestions: SuggestionButton[] = [
  {
    id: "major_requirements",
    text: "Major Requirements",
    action: "What are the requirements for the DCS major at Bates?",
  },
  {
    id: "course_offerings",
    text: "Course Offerings",
    action: "What DCS courses are offered at Bates?",
  },
  {
    id: "faculty",
    text: "Meet the Faculty",
    action: "Tell me about the DCS faculty at Bates College",
  },
  {
    id: "website",
    text: "Official DCS Website",
    action: "Where can I find the official Bates DCS website?",
  },
];

// Add professor contact buttons
const professorContactButtons: SuggestionButton[] = [
  {
    id: "contact_lawson",
    text: "Contact Prof. Lawson",
    action: "I'd like to contact Professor Barry Lawson",
  },
  {
    id: "schedule_meeting",
    text: "Schedule Meeting",
    action: "I'd like to schedule a meeting with Professor Lawson",
  },
  {
    id: "back_to_topics",
    text: "Back to Topics",
    action: "I'd like to explore more DCS topics",
  },
];

// Add new prospective student suggestion buttons with professor contact option
const prospectiveStudentSuggestions: SuggestionButton[] = [
  {
    id: "explore_interests",
    text: "Explore DCS Interests",
    action: "I'd like to explore different areas of DCS",
  },
  {
    id: "programming_languages",
    text: "Programming Languages",
    action: "What programming languages are taught in DCS?",
  },
  {
    id: "career_paths",
    text: "Career Opportunities",
    action: "What career paths are available for DCS graduates?",
  },
  {
    id: "research_opportunities",
    text: "Research Opportunities",
    action: "Tell me about research opportunities in DCS",
  },
  {
    id: "course_planning",
    text: "Course Planning",
    action: "How should I plan my DCS courses?",
  },
  {
    id: "contact_professor",
    text: "Contact Professor",
    action: "I'd like to speak with a professor about the DCS program",
  },
];

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const {
    messages,
    addMessage,
    toggleChat,
    clearMessages,
    progressValue,
    incrementProgress,
    resetProgress: resetProgressStore,
    darkMode,
    toggleDarkMode,
    userInterests,
    addInterest,
    getTopInterests,
  } = useChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [chatSummary, setChatSummary] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [showCalendlyOption, setShowCalendlyOption] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 450, height: 600 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireStep, setQuestionnaireStep] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [showCourseRecommendations, setShowCourseRecommendations] =
    useState<boolean>(false);
  const [userCoursesHistory, setUserCoursesHistory] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [progress, setProgress] = useState(0);

  // Add new state to track user type
  const [userType, setUserType] = useState<
    "prospective" | "current" | "staff" | null
  >(null);
  const [userCoursesTaken, setUserCoursesTaken] = useState<string[]>([]);
  const [askedUserType, setAskedUserType] = useState(false);

  // Define the default professor for advising
  const DEFAULT_PROFESSOR = "Barry Lawson";

  // Initialize with user type question
  useEffect(() => {
    if (messages.length === 0) {
      // First message to start the conversation
      addMessage({
        text: "Welcome to the Bates DCS Chatbot! I'm here to help with questions about the Digital and Computational Studies program.",
        sender: "bot",
        suggestions: [],
      });

      // Ask for user type after a brief delay
      setTimeout(() => {
        addMessage({
          text: "To help me provide the most relevant information, could you tell me if you're a prospective student, current student, or faculty/staff member?",
          sender: "bot",
          suggestions: userTypeButtons,
        });
        setAskedUserType(true);
      }, 1000);
    }
  }, [messages, addMessage, userTypeButtons, setAskedUserType]);

  // Handle questionnaire answer
  const handleQuestionnaireAnswer = (value: string) => {
    if (!questionnaireAnswers || questionnaireStep === undefined) return;

    // Record the answer
    setQuestionnaireAnswers({
      ...questionnaireAnswers,
      [`question${questionnaireStep + 1}`]: value,
    });

    // Track the interest based on the answer
    if (typeof addInterest === "function") {
      addInterest(value, 2); // Higher weight for explicit questionnaire answers
    }

    // Move to next question or finish questionnaire
    if (
      careerQuestionnaire &&
      questionnaireStep < careerQuestionnaire.length - 1
    ) {
      setQuestionnaireStep(questionnaireStep + 1);
    } else {
      // Finish questionnaire and show results
      finishQuestionnaire();
    }
  };

  // Handle questionnaire results
  const finishQuestionnaire = () => {
    // Generate a career path recommendation based on answers
    const careerResults = analyzeQuestionnaireResults();

    // Add a bot message with the results
    if (typeof addMessage === "function") {
      addMessage({
        text:
          careerResults ||
          "Based on your answers, I can help you find the right path in DCS.",
        sender: "bot",
        suggestions: [
          {
            id: "explore_courses",
            text: "Explore recommended courses",
            action: "Tell me about the courses that align with my interests",
          },
          {
            id: "contact_prof",
            text: "Speak with a professor",
            action: "I'd like to speak with a professor about these paths",
          },
          {
            id: "sample_plan",
            text: "See sample 4-year plan",
            action: "Show me a 4-year plan that focuses on these interests",
          },
        ],
      });
    }

    // Hide questionnaire
    if (typeof setShowQuestionnaire === "function") {
      setShowQuestionnaire(false);
    }

    // Reset for future use
    if (typeof setQuestionnaireStep === "function") {
      setQuestionnaireStep(0);
    }

    // Increment progress
    if (typeof incrementProgress === "function") {
      incrementProgress(20);
    }
  };

  // Function to handle showing course recommendations
  const handleShowCourseRecommendations = () => {
    setShowCourseRecommendations(true);

    addMessage({
      text: "Here are some course recommendations based on your interests and previous messages. You can view more details about each course by clicking on it.",
      sender: "bot",
      suggestions: [
        {
          id: "hide_courses",
          text: "Hide recommendations",
          action: "/hidecourses",
        },
        {
          id: "take_questionnaire",
          text: "Take career questionnaire",
          action: "I'd like to take the career questionnaire",
        },
      ],
    });
  };

  const resetLocalProgress = () => {
    resetProgressStore();
    setQuestionnaireStep(0);
    setShowQuestionnaire(false);
    setQuestionnaireAnswers({});
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Analyze questionnaire results
  const analyzeQuestionnaireResults = () => {
    if (!questionnaireAnswers) return "";

    // Count occurrences of each career path
    const counts = {
      software: 0,
      data: 0,
      design: 0,
      project: 0,
      research: 0,
    };

    // Map answers to career paths
    Object.values(questionnaireAnswers).forEach((answer: string) => {
      // Technical/programming answers
      if (
        ["programming", "algorithms", "technical", "cs", "innovation"].includes(
          answer
        )
      ) {
        counts.software++;
      }

      // Data-related answers
      if (["data", "dataanalysis", "researcher", "insights"].includes(answer)) {
        counts.data++;
      }

      // Design-related answers
      if (
        ["design", "accessibility", "creative", "hci", "usability"].includes(
          answer
        )
      ) {
        counts.design++;
      }

      // Project management/social answers
      if (["social", "leadership", "community"].includes(answer)) {
        counts.project++;
      }
    });

    // Determine primary and secondary paths
    const sortedPaths = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, count]) => count > 0);

    // Default path if no clear pattern
    const primaryPath = sortedPaths[0]?.[0] || "software";

    return `Based on your answers, you seem most interested in ${primaryPath} aspects of digital and computational studies. 
    
I'd recommend exploring courses related to ${primaryPath} within the DCS program at Bates.`;
  };

  // Add faculty display and contact handling
  const handleFacultyContact = () => {
    // Create a message with faculty information and Professor Barry Lawson's details
    addMessage({
      text: `**Meet the DCS Faculty**

• **Professor Barry Lawson (Department Chair)**
  Areas: Computer Systems, Programming Languages, AI
  Office: Pettengill Hall 365
  Email: blawson@bates.edu

• **Professor Matthew Jadud**
  Areas: Computing Education, Digital Humanities
  Office: Pettengill Hall 366
  Email: mjadud@bates.edu

• **Professor Carrie Diaz Eaton**
  Areas: Computational Math, Data Science, Ecology
  Office: Pettengill Hall 367
  Email: ceatondi@bates.edu

Would you like to contact Professor Barry Lawson (Department Chair) for more information about the program?`,
      sender: "bot",
      suggestions: [
        {
          id: "contact_chair",
          text: "Contact Prof. Lawson",
          action: "I'd like to contact Professor Lawson",
        },
        {
          id: "more_info",
          text: "More about faculty",
          action: "Tell me more about the DCS faculty",
        },
        {
          id: "back",
          text: "Back",
          action: "Go back",
        },
      ],
    });
  };

  // Function to handle suggestion button clicks
  const handleSuggestionClick = (suggestion: SuggestionButton) => {
    // Log the suggestion click to Supabase
    logUserInteraction("suggestion_click", {
      button_id: suggestion.id,
      button_text: suggestion.text,
      action: suggestion.action,
      timestamp: new Date().toISOString(),
    });

    // If the action relates to user type, set user type
    if (suggestion.action.includes("I'm a prospective student")) {
      handleUserTypeSelection("prospective");
      return;
    } else if (suggestion.action.includes("I'm a current student")) {
      handleUserTypeSelection("current");
      return;
    } else if (
      suggestion.action.includes("I'm faculty") ||
      suggestion.action.includes("staff")
    ) {
      handleUserTypeSelection("staff");
      return;
    } else if (
      suggestion.action.includes("Meet the Faculty") ||
      suggestion.action.toLowerCase().includes("faculty")
    ) {
      handleFacultyContact();
      return;
    } else if (suggestion.action.includes("contact Professor Lawson")) {
      setSelectedProfessor("Barry Lawson");
      setShowEmailPrompt(true);
      return;
    }

    // Handle other suggestion clicks by using the action as user input
    setInput(suggestion.action);
    handleSendMessage();
  };

  // Add a function to handle user type selection
  const handleUserTypeSelection = (
    type: "prospective" | "current" | "staff"
  ) => {
    setUserType(type);

    // Ask first question based on user type
    let nextQuestion = "";
    let suggestions: SuggestionButton[] = [];

    if (type === "prospective") {
      nextQuestion = prospectiveStudentQuestions[0].text;
      suggestions = prospectiveStudentQuestions[0].suggestions;

      // Record interest in relevant areas
      addInterest("prospective_student", 3);
    } else if (type === "current") {
      nextQuestion = currentStudentQuestions[0].text;
      suggestions = currentStudentQuestions[0].suggestions;

      // Record interest in relevant areas
      addInterest("current_student", 3);
    } else if (type === "staff") {
      nextQuestion = staffQuestions[0].text;
      suggestions = staffQuestions[0].suggestions;
    }

    // Add bot message with the next question (with fallback text if missing)
    addMessage({
      text: nextQuestion || "What can I help you with today?",
      sender: "bot",
      suggestions: suggestions || [],
    });
  };

  // Add this new function for step-based progress simulation (inside the ChatWindow component)
  const advanceProgressInSteps = useCallback(
    (initialJump = 30, maxProgress = 95) => {
      // Reset progress first
      resetProgressStore();

      // Initial jump to show immediate feedback
      incrementProgress(initialJump);

      // Create a target to reach in each phase
      const targets = [
        { target: Math.min(60, maxProgress), interval: 300 }, // Phase 1: Quick progress
        { target: Math.min(85, maxProgress), interval: 500 }, // Phase 2: Slower progress
        { target: maxProgress, interval: 800 }, // Phase 3: Very slow progress
      ];

      let currentPhase = 0;
      let interval: NodeJS.Timeout | null = null;

      const advancePhase = () => {
        if (currentPhase >= targets.length || !isLoading) {
          if (interval) clearInterval(interval);
          return;
        }

        const { target, interval: delay } = targets[currentPhase];

        if (interval) clearInterval(interval);

        interval = setInterval(() => {
          incrementProgress(1);

          // If we reach the target for this phase, move to next phase
          if (progressValue >= target) {
            currentPhase++;
            advancePhase();
          }
        }, delay);
      };

      // Start the first phase
      advancePhase();

      // Cleanup function
      return () => {
        if (interval) clearInterval(interval);
      };
    },
    [incrementProgress, resetProgressStore, progressValue, isLoading]
  );

  // Handle message sending
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || isTyping) return;

    // If user type not determined and we haven't asked yet, ask first
    if (!userType && !askedUserType) {
      // Add the user's message to the chat
      addMessage({
        text: input,
        sender: "user",
      });

      // Log user message to Supabase
      logUserInteraction("user_message", {
        message: input,
        timestamp: new Date().toISOString(),
      });

      setInput("");

      // Ask for user type
      addMessage({
        text: "Before I answer, could you tell me if you're a prospective student, current student, or faculty/staff member? This will help me provide more relevant information.",
        sender: "bot",
        suggestions: userTypeButtons,
      });

      setAskedUserType(true);
      return;
    }

    // If user is a prospective student, show relevant suggestions
    if (userType === "prospective") {
      addMessage({
        text: input,
        sender: "user",
      });

      // Log user message
      logUserInteraction("user_message", {
        message: input,
        timestamp: new Date().toISOString(),
      });

      setInput("");
      setIsLoading(true);

      try {
        const response = await getHybridResponse(
          input,
          userType,
          userCoursesTaken
        );

        // Check if the message is about contacting a professor
        if (
          input.toLowerCase().includes("contact") ||
          input.toLowerCase().includes("professor") ||
          input.toLowerCase().includes("lawson")
        ) {
          // Show professor contact options
          addMessage({
            text: `I'd be happy to help you connect with Professor Barry Lawson, the DCS Department Chair. You can:

• Email him directly at blawson@bates.edu
• Schedule a meeting through the DCS department
• Learn more about his research and teaching

What would you like to do?`,
            sender: "bot",
            suggestions: professorContactButtons,
          });
        } else {
          // Add bot response with prospective student suggestions
          addMessage({
            text: response.text,
            sender: "bot",
            suggestions: prospectiveStudentSuggestions,
          });
        }

        setIsLoading(false);

        // Scroll to bottom
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
        addMessage({
          text: "I'm having trouble processing your request. Please try again.",
          sender: "bot",
          suggestions: prospectiveStudentSuggestions,
        });
      }
      return;
    }

    // Check for user type responses if we're waiting for them (not handling via buttons)
    if (!userType && askedUserType) {
      // Check for user type in text
      if (
        input.toLowerCase().includes("prospective") ||
        input.toLowerCase().includes("high school") ||
        input.toLowerCase().includes("applying")
      ) {
        addMessage({
          text: input,
          sender: "user",
        });

        // Log user message to Supabase
        logUserInteraction("user_message", {
          message: input,
          timestamp: new Date().toISOString(),
        });

        setInput("");
        handleUserTypeSelection("prospective");
        return;
      } else if (
        input.toLowerCase().includes("current") ||
        input.toLowerCase().includes("student") ||
        input.toLowerCase().includes("enrolled")
      ) {
        addMessage({
          text: input,
          sender: "user",
        });

        // Log user message to Supabase
        logUserInteraction("user_message", {
          message: input,
          timestamp: new Date().toISOString(),
        });

        setInput("");
        handleUserTypeSelection("current");
        return;
      } else if (
        input.toLowerCase().includes("faculty") ||
        input.toLowerCase().includes("staff") ||
        input.toLowerCase().includes("professor") ||
        input.toLowerCase().includes("work")
      ) {
        addMessage({
          text: input,
          sender: "user",
        });

        // Log user message to Supabase
        logUserInteraction("user_message", {
          message: input,
          timestamp: new Date().toISOString(),
        });

        setInput("");
        handleUserTypeSelection("staff");
        return;
      }
    }

    // Normal message handling for other cases
    const userMessage: Omit<Message, "id" | "timestamp"> = {
      text: input,
      sender: "user" as const,
    };

    addMessage(userMessage);

    // Log user message to Supabase
    logUserInteraction("user_message", {
      message: input,
      timestamp: new Date().toISOString(),
    });

    setInput("");
    setIsLoading(true);

    // Use the improved step-based progress function
    const cleanupProgress = advanceProgressInSteps();

    try {
      // Generate a mock response for immediate feedback
      const mockResponse = generateMockResponse(input);

      // Stop loading and clean up the intervals
      setIsLoading(false);
      cleanupProgress();
      resetProgressStore();

      // Add the response to the chat
      addMessage({
        text:
          mockResponse ||
          "I'm sorry, I don't have information on that topic yet. Is there something else I can help with?",
        sender: "bot",
        suggestions: initialSuggestions,
      });

      // Scroll to bottom
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      cleanupProgress();
      resetProgressStore();

      addMessage({
        text: "I'm having trouble processing your request. Please try again.",
        sender: "bot",
        suggestions: initialSuggestions,
      });
    }
  };

  // Function to log user interactions to Supabase
  const logUserInteraction = async (interactionType: string, content: any) => {
    try {
      const userId = await getUserId();

      const { data, error } = await supabase.from("user_interactions").insert({
        user_id: userId,
        interaction_type: interactionType,
        content,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error logging interaction to Supabase:", error);
      }
    } catch (err) {
      console.error("Failed to log user interaction:", err);
    }
  };

  // Add resize handling functions
  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && chatWindowRef.current) {
      const rect = chatWindowRef.current.getBoundingClientRect();
      setWindowSize({
        width: Math.max(300, e.clientX - rect.left),
        height: Math.max(400, e.clientY - rect.top),
      });
    }
  };

  // Add mouse event listeners for resizing
  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  // Add new function to handle professor contact email submission
  const handleProfessorEmailSubmit = async () => {
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      // Create a personalized message for Professor Lawson
      const messageContent = `Dear Professor Lawson,

I'm interested in learning more about the DCS program at Bates College. Based on our conversation, I'm particularly interested in:
${getTopInterests(3)
  .map((interest) => `• ${interest.topic}`)
  .join("\n")}

I would appreciate the opportunity to discuss the program further.

Best regards,
${email}`;

      // Log the email request to Supabase
      const { data, error } = await supabase.from("user_interactions").insert({
        user_id: await getUserId(),
        interaction_type: "professor_contact",
        content: {
          to: "blawson@bates.edu",
          from: email,
          subject: "DCS Program Inquiry from Chatbot",
          message: messageContent,
          userType,
          interests: getTopInterests(5).map((i) => i.topic),
        },
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error logging to Supabase:", error);
        throw error;
      }

      // Send the email through the API
      const response = await fetch("/api/notify-professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: messageContent,
          professor: "Barry Lawson",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // Add success message to chat
      addMessage({
        text: `Great! I've sent your message to Professor Barry Lawson. He'll contact you at ${email} soon to discuss your interest in the DCS program.`,
        sender: "bot",
        suggestions: [
          {
            id: "explore_more",
            text: "Explore More Topics",
            action: "I'd like to learn more about DCS",
          },
          {
            id: "schedule_meeting",
            text: "Schedule a Meeting",
            action: "How can I schedule a meeting with Professor Lawson?",
          },
        ],
      });

      // Reset email form
      setShowEmailPrompt(false);
      setEmail("");
    } catch (error) {
      console.error("Error sending email:", error);
      addMessage({
        text: "I'm having trouble sending your message right now. You can directly email Professor Barry Lawson at blawson@bates.edu, or try again later.",
        sender: "bot",
        suggestions: [
          {
            id: "try_again",
            text: "Try Again",
            action: "I'd like to try sending the email again",
          },
          {
            id: "back_to_topics",
            text: "Back to Topics",
            action: "I'd like to explore more DCS topics",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatWindowRef}
      className={`fixed bottom-4 right-4 flex flex-col rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out ${
        isMinimized
          ? "w-64 h-14"
          : `w-[${windowSize.width}px] h-[${windowSize.height}px]`
      } ${darkMode ? "bg-gray-900" : "bg-white border border-gray-200"}`}
      style={{
        width: isMinimized ? "16rem" : windowSize.width,
        height: isMinimized ? "3.5rem" : windowSize.height,
        maxWidth: "90vw",
        maxHeight: "90vh",
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-[#800000] to-[#b30000] text-white px-4 py-3 flex justify-between items-center shadow-md cursor-move"
        onMouseDown={(e) => {
          // Add dragging functionality here if needed
        }}
      >
        <h3 className="font-bold flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
          Bates DCS Assistant
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-white hover:bg-[#600000]/50 transition-colors rounded-full"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="text-white hover:bg-[#600000]/50 transition-colors rounded-full"
          >
            {isMinimized ? (
              <Maximize2 className="h-5 w-5" />
            ) : (
              <Minimize2 className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-[#600000]/50 transition-colors rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] transition-all duration-300 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : darkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {/* Use the formatting function to render message text */}
                {message.sender === "bot" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatResponseText(message.text),
                    }}
                  />
                ) : (
                  <div>{message.text}</div>
                )}
              </div>

              {/* Suggestion Buttons - only show for bot messages */}
              {message.sender === "bot" &&
                message.suggestions &&
                message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 justify-start">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        id={`suggestion-${suggestion.action.replace(/\s+/g, "-")}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 transition-all duration-200 hover:scale-105"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Progress bar */}
      {isLoading && !isMinimized && (
        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden rounded-sm">
          {/* Background pulse effect */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>

          {/* Main progress bar */}
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-r-sm transition-all duration-500 ease-out"
            style={{
              width: `${progressValue}%`,
              opacity: progressValue ? 1 : 0,
              boxShadow: "0 0 8px rgba(79, 70, 229, 0.5)",
            }}
          ></div>

          {/* Animated light effect */}
          <div
            className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
            style={{
              transform: `translateX(${progressValue * 2}%)`,
              transition: "transform 0.5s ease-out",
            }}
          ></div>

          {/* Loading percentage (optional) */}
          {progressValue > 10 && (
            <div
              className="absolute top-0 right-0 text-xs px-1 text-white font-medium transition-opacity duration-300"
              style={{ opacity: progressValue > 30 ? 0.8 : 0 }}
            >
              {Math.round(progressValue)}%
            </div>
          )}
        </div>
      )}

      {/* "Bot is typing" indicator */}
      {isTyping && !isMinimized && (
        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <div className="flex space-x-1 mr-2">
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
              style={{ animationDelay: "600ms" }}
            ></div>
          </div>
          Bot is thinking...
        </div>
      )}

      {/* Enhanced Email prompt modal */}
      {showEmailPrompt && !isMinimized && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h3 className="font-medium mb-2">Contact Professor Barry Lawson</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enter your email address below, and I'll send Professor Lawson a
            message about your interest in the DCS program.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@example.com"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setShowEmailPrompt(false);
                  setEmail("");
                  addMessage({
                    text: "No problem! What else would you like to know about the DCS program?",
                    sender: "bot",
                    suggestions: prospectiveStudentSuggestions,
                  });
                }}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleProfessorEmailSubmit}
                disabled={!email.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      {!isMinimized && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center bg-white dark:bg-gray-900">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || isTyping}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md disabled:opacity-50 transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Resize handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={startResizing}
        ></div>
      )}
    </div>
  );
}
