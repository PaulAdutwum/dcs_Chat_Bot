// Interest tracking module for DCS chatbot
// This implementation uses local storage or server-side storage depending on environment
import { dcsCoursesData, getCoursesByCategory, Course, careerPaths } from './courseData';
import type { Interest } from './store';

// Local interface that matches our implementation needs
interface AppInterest {
  name: string;
  category: string;
  count: number;
}

// Track user's profile with interests
interface UserProfile {
  interests: AppInterest[];
}

// In-memory store for development
const interestStore: Record<string, UserProfile> = {};

/**
 * Record a user's interest
 */
export const recordInterest = async (userId: string, interest: AppInterest): Promise<void> => {
  try {
    // Initialize user profile if it doesn't exist
    if (!interestStore[userId]) {
      interestStore[userId] = { interests: [] };
    }
    
    // Check if interest already exists
    const existingInterest = interestStore[userId].interests.find(
      i => i.name === interest.name && i.category === interest.category
    );
    
    if (existingInterest) {
      // Increment count if interest already exists
      existingInterest.count += interest.count;
    } else {
      // Add new interest
      interestStore[userId].interests.push(interest);
    }
    
    console.log(`Recorded interest: ${interest.name} for user: ${userId}`);
  } catch (error) {
    console.error('Error recording interest:', error);
  }
};

/**
 * Get all interests for a user
 */
export const getUserInterests = async (userId: string): Promise<AppInterest[]> => {
  try {
    const profile = interestStore[userId];
    if (!profile) {
      return [];
    }
    return profile.interests;
  } catch (error) {
    console.error('Error getting user interests:', error);
    return [];
  }
};

/**
 * Extract interests from a user message
 */
export const extractInterestsFromMessage = (message: string): Record<string, number> => {
  const interests: Record<string, number> = {};
  const lowerMessage = message.toLowerCase();
  
  // Extract course interests
  Object.values(dcsCoursesData).forEach(course => {
    // Check for course code (e.g., "DCS 109") or course title
    if (
      lowerMessage.includes(course.code.toLowerCase()) ||
      lowerMessage.includes(course.title.toLowerCase())
    ) {
      const category = course.methodCategories[0]?.toLowerCase() || 'computer science';
      interests[category] = (interests[category] || 0) + 1;
    }
  });
  
  // Extract career path interests
  Object.values(careerPaths).forEach((path) => {
    if (lowerMessage.includes(path.name.toLowerCase())) {
      const careerCategory = path.name.toLowerCase().replace(/\s+/g, '_');
      interests[careerCategory] = (interests[careerCategory] || 0) + 1;
    }
  });
  
  // Extract general subject interests
  const subjectMappings = {
    'programming': ['programming', 'coding', 'software', 'developer'],
    'data_science': ['data', 'analytics', 'statistics', 'visualization'],
    'algorithms': ['algorithm', 'data structures', 'efficient', 'computational'],
    'artificial_intelligence': ['ai', 'machine learning', 'artificial intelligence', 'neural'],
    'web_development': ['web', 'frontend', 'backend', 'fullstack', 'website'],
    'design': ['design', 'user experience', 'ux', 'ui', 'interface'],
    'graphics': ['graphics', 'game', 'animation', 'visual', '3d'],
    'security': ['security', 'privacy', 'cryptography', 'cybersecurity'],
    'theory': ['theory', 'formal', 'mathematical', 'proof']
  };
  
  Object.entries(subjectMappings).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        interests[category] = (interests[category] || 0) + 1;
      }
    });
  });
  
  return interests;
};

/**
 * Get recommended DCS paths based on user interests
 */
export const getRecommendedDCSPaths = async (userId: string): Promise<string[]> => {
  try {
    const interests = await getUserInterests(userId);
    
    // Count interests by category
    const categoryCounts: Record<string, number> = {};
    interests.forEach(interest => {
      if (!categoryCounts[interest.category]) {
        categoryCounts[interest.category] = 0;
      }
      categoryCounts[interest.category] += interest.count;
    });
    
    // Generate recommendations based on top interests
    const recommendations: string[] = [];
    
    // Example implementation - expand based on your requirements
    if (categoryCounts['career'] > categoryCounts['subject']) {
      recommendations.push('Consider focusing on career-oriented courses');
    } else {
      recommendations.push('Consider exploring diverse subject areas');
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error getting DCS path recommendations:', error);
    return [];
  }
};

/**
 * Helper function to convert Record<string, number> interests to AppInterest array
 */
const convertInterestsFormat = (interestsRecord: Record<string, number>): AppInterest[] => {
  return Object.entries(interestsRecord).map(([name, count]) => ({
    name,
    category: 'subject', // Default category
    count
  }));
};

/**
 * Recommend DCS path based on identified interests
 */
export const recommendDCSPath = (interests: Record<string, number>): string[] => {
  // Simple mapping of interest categories to DCS paths
  const pathMappings: Record<string, string[]> = {
    programming: ['Software Development', 'Computer Science'],
    data_science: ['Data Science', 'Analytics'],
    design: ['Digital Media', 'Human-Computer Interaction'],
    theory: ['Computer Science', 'Research'],
    graphics: ['Digital Media', 'Creative Computing'],
    security: ['Cybersecurity', 'Information Systems'],
    web_development: ['Software Development', 'Web Technologies'],
    artificial_intelligence: ['AI/ML', 'Data Science']
  };
  
  // Count path recommendations
  const pathCounts: Record<string, number> = {};
  Object.entries(interests).forEach(([interest, strength]) => {
    const paths = pathMappings[interest] || [];
    paths.forEach(path => {
      pathCounts[path] = (pathCounts[path] || 0) + strength;
    });
  });
  
  // Sort paths by count and return top 3
  return Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([path]) => path);
};

/**
 * Get recommended career paths based on user interests
 */
export const recommendCareerPaths = (interestsRecord: Record<string, number>): string[] => {
  // Convert to array format for processing if using directly with interestsRecord
  const interests = convertInterestsFormat(interestsRecord);
  
  // Map interest categories to career paths
  const careerMappings: Record<string, string[]> = {
    programming: ['Software Engineering', 'Web Development'],
    data_science: ['Data Science & Analytics', 'Research Scientist'],
    design: ['Digital Media & Design', 'UX/UI Designer'],
    theory: ['Computer Science Research', 'Algorithm Designer'],
    graphics: ['Game Development', 'Digital Media & Design'],
    security: ['Cybersecurity', 'Security Analyst'],
    web_development: ['Web Developer', 'Software Engineering'],
    artificial_intelligence: ['Machine Learning Engineer', 'AI Researcher']
  };
  
  // Count career recommendations
  const careerCounts: Record<string, number> = {};
  interests.forEach(interest => {
    const careers = careerMappings[interest.name] || [];
    careers.forEach(career => {
      careerCounts[career] = (careerCounts[career] || 0) + interest.count;
    });
  });
  
  // Sort careers by count and return top 3
  return Object.entries(careerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([career]) => career);
};

/**
 * Get recommended courses based on user interests
 */
export const recommendCourses = (interestsRecord: Record<string, number>, takenCourses: string[] = []): Course[] => {
  // Convert to array format for processing if using directly with interestsRecord
  const interests = convertInterestsFormat(interestsRecord);
  
  // Map interest categories to related course codes
  const courseMappings: Record<string, string[]> = {
    programming: ['DCS109S', 'DCS211', 'DCS235'],
    data_science: ['DCS109D', 'DCS250', 'DCS325'],
    design: ['DCS109T', 'DCS229', 'DCS305'],
    theory: ['DCS211', 'DCS311', 'DCS333'],
    graphics: ['DCS109R', 'DCS229', 'DCS325'],
    security: ['DCS211', 'DCS235', 'DCS311'],
    web_development: ['DCS109D', 'DCS229', 'DCS325'],
    artificial_intelligence: ['DCS211', 'DCS250', 'DCS325']
  };
  
  // Get courses based on interests
  const courseScores: Record<string, number> = {};
  interests.forEach(interest => {
    const courseCodes = courseMappings[interest.name] || [];
    courseCodes.forEach(code => {
      courseScores[code] = (courseScores[code] || 0) + interest.count;
    });
  });
  
  // Sort course codes by score
  const sortedCourseCodes = Object.entries(courseScores)
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => code)
    .filter(code => !takenCourses.includes(code)); // Exclude already taken courses
  
  // Map codes to actual course objects and return the top 5
  const recommendedCourses: Course[] = [];
  sortedCourseCodes.forEach(code => {
    const course = dcsCoursesData.find(c => c.code === code);
    if (course && recommendedCourses.length < 5) {
      recommendedCourses.push(course);
    }
  });
  
  return recommendedCourses;
};

/**
 * Create a comprehensive recommendation based on user interests
 */
export function createPersonalizedRecommendation(interests: Record<string, number>, takenCourses: string[] = []): string {
  // Get path recommendations
  const dcsPathRecommendations = recommendDCSPath(interests);
  
  // Get career recommendations
  const careerPathRecommendations = recommendCareerPaths(interests);
  
  // Get course recommendations
  const courseRecommendations = recommendCourses(interests, takenCourses);
  
  // Create recommendation text
  let recommendation = "## Personalized DCS Recommendations\n\n";
  
  // Add DCS path recommendations
  if (dcsPathRecommendations.length > 0) {
    recommendation += "### Recommended DCS Focus Areas\n";
    dcsPathRecommendations.forEach(path => {
      recommendation += `- ${path}\n`;
    });
    recommendation += "\n";
  }
  
  // Add career path recommendations
  if (careerPathRecommendations.length > 0) {
    recommendation += "### Potential Career Paths\n";
    careerPathRecommendations.forEach(path => {
      // Get detailed career info
      const careerInfo = Object.values(careerPaths).find((career: any) => career.name === path);
      if (careerInfo) {
        recommendation += `- **${path}**: ${careerInfo.description.substring(0, 120)}...\n`;
      } else {
        recommendation += `- ${path}\n`;
      }
    });
    recommendation += "\n";
  }
  
  // Add course recommendations
  if (courseRecommendations.length > 0) {
    recommendation += "### Recommended Courses\n";
    courseRecommendations.forEach(course => {
      recommendation += `- **${course.code} (${course.title})**: ${course.description.substring(0, 120)}...\n`;
    });
    recommendation += "\n";
  }
  
  return recommendation;
} 