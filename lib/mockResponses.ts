import { dcsCoursesData, careerPaths, faculty } from "./courseData";

// Helper function to find relevant responses based on keywords
export function generateMockResponse(userInput: string = ""): string {
  try {
    const input = userInput.toLowerCase();
    
    // Check for programming language questions
    if (input.includes("programming language") || input.includes("coding") || input.includes("python") || 
        input.includes("javascript") || input.includes("java")) {
      return generateProgrammingLanguageResponse(userInput);
    }
    
    // Check for API key related inquiries
    if (input.includes("api key") || input.includes("openai") || input.includes("key not working")) {
      return `**API Configuration Information**

I'm a chatbot designed to help with Bates College's DCS program information. For API key related questions:

• The application needs a valid OpenAI API key to function with external AI services
• API keys should be configured in your environment variables
• Check the .env.local file to ensure the key is properly set

Would you like me to help you with information about the DCS program instead?`;
    }
    
    // Check if user wants to visit the Bates website
    if (input.includes("website") || input.includes("official site") || input.includes("college site")) {
      return `**Official Bates DCS Website**

You can find the official Bates College Digital and Computational Studies website at:
https://www.bates.edu/digital-computational-studies/

The website contains the most up-to-date information about:
• Course offerings and schedules
• Faculty profiles and contact information
• Major requirements and program details
• Student opportunities and resources
• News and events

Would you like me to help you find specific information from the DCS program instead?`;
    }
    
    // Check for course-specific inquiries
    const courseCodeRegex = /dcs\s*(\d{3}[a-z]?)/gi;
    const courseCodes = input.match(courseCodeRegex);
    
    if (courseCodes && courseCodes.length > 0) {
      const courseCode = courseCodes[0].replace(/\s+/g, "").toUpperCase();
      const course = dcsCoursesData.find(c => c.code.replace(/\s+/g, "") === courseCode);
      
      if (course) {
        let response = `**${course.code}: ${course.title}**

${course.description.substring(0, 150)}...

• Prerequisites: ${course.prerequisites.length > 0 ? course.prerequisites.join(", ") : "None"}
• Faculty: ${course.faculty.join(", ")}

Would you like to see related courses or speak with the professor?`;
        return addBatesReference(response);
      }
    }
    
    // Check for major requirements with shortened response
    if (input.includes("requirements") || input.includes("major") || input.includes("degree")) {
      return `**DCS Major Requirements**

The DCS major consists of 10 courses:

• 2 Foundation courses (DCS 109 series and a development course)
• 4 Methods requirements across different categories
• 1 Capstone project course
• 3 Electives (2 must be 300-level or above)

Would you like details on specific requirements or course recommendations?`;
    }
    
    // Check for career paths
    if (input.includes("career") || input.includes("job") || input.includes("work")) {
      try {
        // Handle careerPaths being an object instead of an array
        const careers = Object.values(careerPaths);
        let careerList = "";
        
        for (let i = 0; i < careers.length; i++) {
          const path = careers[i];
          careerList += `**${i+1}. ${path.name}**\n   ${path.description}\n   _Key skills: ${path.skills.slice(0, 3).join(', ')}_\n\n`;
        }
        
        return `**Career Paths with a DCS Major**

A DCS major prepares you for various exciting career paths:

${careerList}
Each path requires specific skills that you can develop through targeted coursework. 

Would you like to explore any of these career paths in more detail?`;
      } catch (error) {
        console.error("Error processing career paths:", error);
        return `**Career Paths with a DCS Major**

A DCS major prepares you for various exciting career paths including:

1. **Software Development**
   • Building applications and systems across platforms
   • Skills: programming languages, software design, problem-solving

2. **Data Science**
   • Analyzing data to extract meaningful insights
   • Skills: statistics, machine learning, data visualization

3. **UX/UI Design**
   • Creating intuitive and engaging user experiences
   • Skills: design thinking, prototyping, user research

4. **Technology Consulting**
   • Helping organizations leverage technology effectively
   • Skills: communication, problem-solving, technical expertise

5. **Project Management**
   • Leading technical projects from conception to delivery
   • Skills: organization, communication, leadership

Which of these career paths interests you most? I can provide more specific information about education requirements and job prospects.`;
      }
    }
    
    // Check for faculty inquiries
    if (input.includes("faculty") || input.includes("professor") || input.includes("teacher")) {
      try {
        let facultyList = "";
        
        for (let i = 0; i < faculty.length; i++) {
          const prof = faculty[i];
          facultyList += `**${i+1}. ${prof.name}**\n   Specialties: ${prof.specialties.join(", ")}\n   Office: ${prof.office}\n\n`;
        }
        
        return `👨‍🏫 **DCS Faculty Members**

The DCS department has several faculty members with diverse expertise:

${facultyList}
Would you like to learn more about a specific professor or schedule a meeting with one of them?`;
      } catch (error) {
        console.error("Error processing faculty list:", error);
        return `👨‍🏫 **DCS Faculty Members**

The DCS department has several faculty members with diverse expertise:

1. **Dr. Brown**
   • Specialties: Computer Architecture, Web Development, Programming Languages
   • Office: Pettengill Hall 365

2. **Dr. Davis**
   • Specialties: Critical Digital Studies, Digital Humanities, Technology Ethics
   • Office: Pettengill Hall 367

3. **Dr. Garcia**
   • Specialties: Algorithms, Artificial Intelligence, Software Design
   • Office: Pettengill Hall 369

4. **Dr. Thompson**
   • Specialties: Data Science, Machine Learning, Computational Problem Solving
   • Office: Pettengill Hall 375

Would you like to learn more about a specific professor or schedule a meeting with one of them?`;
      }
    }
    
    // Check for course listings
    if (input.includes("course") || input.includes("class") || input.includes("offerings")) {
      try {
        const introductory = dcsCoursesData.filter(c => c.code.includes("109")).map(c => `• ${c.code}: ${c.title}`).join("\n");
        const intermediate = dcsCoursesData.filter(c => {
          const num = parseInt(c.code.match(/\d+/)?.[0] || "0");
          return num > 109 && num < 300;
        }).map(c => `• ${c.code}: ${c.title}`).join("\n");
        const advanced = dcsCoursesData.filter(c => {
          const num = parseInt(c.code.match(/\d+/)?.[0] || "0");
          return num >= 300;
        }).map(c => `• ${c.code}: ${c.title}`).join("\n");
        
        return `📋 **DCS Course Offerings**

Here are the courses offered in the DCS department:

**Introductory Courses:**
${introductory}

**Intermediate Courses:**
${intermediate}

**Advanced Courses:**
${advanced}

Would you like more detailed information about any specific course?`;
      } catch (error) {
        console.error("Error processing course listings:", error);
        return `📋 **DCS Course Offerings**

DCS offers a variety of courses at different levels:

**Introductory Courses:**
• DCS 109D: Introduction to Computational Problem Solving with Data
• DCS 109S: Introduction to Computing for Problem Solving
• DCS 109R: Introduction to Computational Thinking with Robots
• DCS 109T: Computing Across the Liberal Arts

**Intermediate Courses:**
• DCS 211: Data Structures and Algorithms
• DCS 229: Web Application Development
• DCS 250: Data Analysis and Visualization

**Advanced Courses:**
• DCS 305: Human-Computer Interaction
• DCS 325: Machine Learning
• DCS 342: Community-Engaged Digital Projects
• DCS 457: Senior Seminar: Critical Digital Studies

Would you like more information about any specific course?`;
      }
    }
    
    // Check for four-year plan inquiries
    if (input.includes("four-year") || input.includes("4-year") || input.includes("4 year") || input.includes("plan")) {
      return `🗓️ **Sample Four-Year DCS Major Plan**

Here's a recommended sequence for completing the DCS major:

**FIRST YEAR:**
• Fall: DCS 109S (Intro to Computing for Problem Solving)
• Winter: DCS 109D (Intro to Computational Problem Solving with Data)

**SECOND YEAR:**
• Fall: DCS 211 (Data Structures and Algorithms)
• Winter: DCS 229 (Web Application Development)

**THIRD YEAR:**
• Fall: DCS 305 (Human-Computer Interaction)
• Winter: DCS 250 (Data Analysis and Visualization)

**FOURTH YEAR:**
• Fall: DCS 342 (Community-Engaged Digital Projects)
• Winter: DCS 457 (Senior Seminar: Critical Digital Studies) - Capstone

**Methods Categories Covered:**
• Computer science: DCS 109S, DCS 109D, DCS 211
• Software development: DCS 211, DCS 229
• Data science: DCS 109D, DCS 250
• Human-centered design: DCS 229, DCS 305, DCS 342
• Critical digital studies: DCS 305, DCS 457
• Community-engaged learning: DCS 342

This is one possible pathway. Would you like to discuss alternatives based on your specific interests?`;
    }
    
    // Default response - shorter and cleaner
    let response = `**Welcome to Bates DCS**

I can help with:

• Course recommendations based on your interests
• Major requirements and pathways
• Career possibilities with a DCS degree
• Connecting with faculty members

What would you like to explore first?`;

    return addBatesReference(response);
  } catch (error) {
    console.error("Error generating mock response:", error);
    return "I apologize for the difficulty. What would you like to know about Bates DCS? I can help with courses, requirements, careers, or faculty connections.";
  }
}

// Generate a fallback response for when the API call fails
export function generateFallbackResponse(userInput: string = ""): string {
  const input = userInput.toLowerCase();
  
  // Check for programming language mentions
  if (input.includes("programming") || input.includes("language") || input.includes("python") || 
      input.includes("java") || input.includes("code") || input.includes("coding")) {
    return generateProgrammingLanguageResponse(userInput);
  }
  
  // Check for career field mentions
  if (input.includes("field") || input.includes("industry") || input.includes("company") || 
      input.includes("job market") || input.includes("employment")) {
    return generateCareerFieldResponse(userInput);
  }
  
  // Check for major topics to provide the most relevant information
  if (input.includes("major") || input.includes("requirements") || input.includes("degree")) {
    return `**DCS Major Requirements**

The DCS major at Bates consists of 10 courses:

• 2 Foundation courses
• 4 Methods Requirements
• 1 Capstone
• 3 Electives

Which aspect interests you most? What other subjects are you studying?`;
  }
  
  if (input.includes("course") || input.includes("class")) {
    return `**DCS Course Offerings**

Courses are organized by level:

• 100-level: Introductory computing concepts
• 200-level: Core skills in development and analysis
• 300-level: Advanced specialized topics

What topics or skills would you like to learn?`;
  }
  
  if (input.includes("faculty") || input.includes("professor")) {
    return `**DCS Faculty**

Our faculty specialize in:

• Computer Science
• Data Science
• Digital Humanities
• Critical Digital Studies
• Human-Computer Interaction

Would you like to speak with a professor about your interests? I can help set that up.`;
  }
  
  if (input.includes("career") || input.includes("job")) {
    return generateCareerFieldResponse(userInput);
  }
  
  // Default response for truly unexpected questions
  return `**Exploring DCS at Bates**

I'm not sure I understood your question, but I'd like to help.

• What programming languages have you used before?
• What field of computing interests you most?
• Are you looking for courses, career advice, or faculty connections?

Let me know so I can guide you better.`;
}

// Add a function to provide references to the Bates website
function addBatesReference(response: string): string {
  // Only add the reference if it's not already there
  if (!response.includes("Bates DCS website")) {
    return response + "\n\n*Information sourced from the official Bates College Digital and Computational Studies program.*";
  }
  return response;
}

// Add new responses for programming language questions
export function generateProgrammingLanguageResponse(userInput: string = ""): string {
  return `**Programming Languages in DCS**

Bates DCS courses use various programming languages:

• Python: Used in data science and intro courses
• JavaScript: Used in web development courses
• Java: Used in some data structures courses
• R: Used for statistical analysis

Which of these interests you most? Have you had experience with any programming languages?`;
}

// Add new response for specific career guidance
export function generateCareerFieldResponse(userInput: string = ""): string {
  return `**DCS Career Fields**

Your DCS skills could lead to careers in:

• Software Development
• Data Science
• UX/UI Design
• Tech Consulting
• Digital Media

Which field interests you most? I can suggest courses that align with that path.`;
}

// Add a function to recommend courses starting from 109 upwards
export function recommendCoursePath(interest: string): string {
  let response = `**Recommended Course Path**\n\n`;
  
  // Start with 100-level courses
  response += `**Start with:**\n`;
  
  // Recommend introductory course based on interest
  if (interest.includes("data") || interest.includes("analysis")) {
    response += `• DCS 109D: Intro to Computational Problem Solving with Data\n`;
  } else if (interest.includes("robot") || interest.includes("hardware")) {
    response += `• DCS 109R: Intro to Computational Thinking with Robots\n`;
  } else if (interest.includes("problem") || interest.includes("algorithm")) {
    response += `• DCS 109S: Intro to Computing for Problem Solving\n`;
  } else if (interest.includes("liberal") || interest.includes("interdisciplinary")) {
    response += `• DCS 109T: Computing Across the Liberal Arts\n`;
  } else {
    response += `• Any DCS 109 course based on your specific interests\n`;
  }
  
  // Continue with 200-level recommendations
  response += `\n**Then explore:**\n`;
  response += `• DCS 211: Data Structures and Algorithms\n`;
  response += `• DCS 229: Web Application Development\n`;
  
  // Add 300-level recommendations
  response += `\n**Advanced courses:**\n`;
  response += `• DCS 305: Human-Computer Interaction\n`;
  response += `• DCS 325: Machine Learning\n`;
  response += `• DCS 342: Community-Engaged Digital Projects\n`;
  
  // Add capstone information
  response += `\n**Capstone:**\n`;
  response += `• DCS 457: Senior Seminar in Digital & Computational Studies\n`;
  
  response += `\nWould you like to speak with a professor about this path? I can help set that up.`;
  
  return response;
} 