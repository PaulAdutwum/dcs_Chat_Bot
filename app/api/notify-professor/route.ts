import { NextResponse } from 'next/server';
import { faculty as courseFaculty } from '@/lib/courseData';
import { sendEmailWithFallback, createProfessorEmail, formatChatSummary } from '@/lib/emailProvider';

// Define an interface for the faculty member that matches actual data
interface FacultyMember {
  name: string;
  specialties?: string[];
  email: string;
  office?: string;
  interests: string[];
  id?: string; // Optional ID field
  isDepartmentChair: boolean;
  isDefaultAdvisor: boolean;
}

// Define an interface for the match result
interface ProfessorMatch {
  professor: FacultyMember;
  score: number;
}

// Create our extended faculty list with Barry as default advisor
export const faculty: FacultyMember[] = [
  {
    name: "Barry Lawson",
    email: "padutwum@bates.edu",
    interests: ["algorithms", "programming", "robotics", "parallel computing", "cs education"],
    isDepartmentChair: true,
    isDefaultAdvisor: true
  }
  // We'll rely on course faculty for others
];

function findRelevantProfessors(content: string, count = 1): FacultyMember[] {
  try {
    // Simple keyword matching for now
    const matches: ProfessorMatch[] = faculty.map((prof) => {
      let score = 0;
      
      // Check for professor's specialty keywords in the content
      if (prof.specialties) {
        for (const keyword of prof.specialties) {
          if (content.toLowerCase().includes(keyword.toLowerCase())) {
            score += 2;
          }
        }
      }
      
      // Also check for professor's interests
      if (prof.interests) {
        for (const interest of prof.interests) {
          if (content.toLowerCase().includes(interest.toLowerCase())) {
            score += 2;
          }
        }
      }
      
      // Also check for professor's name in the content (lower priority)
      if (prof.name && content.toLowerCase().includes(prof.name.toLowerCase())) {
        score += 1;
      }
      
      return { professor: prof, score };
    });
    
    // Sort by score and return the top professors
    return matches
      .filter((match: ProfessorMatch) => match.score > 0)
      .sort((a: ProfessorMatch, b: ProfessorMatch) => b.score - a.score)
      .slice(0, count)
      .map((match: ProfessorMatch) => match.professor);
  } catch (error) {
    console.error('Error finding relevant professors:', error);
    // Get Barry Lawson as fallback
    const defaultAdvisor = faculty.find(f => f.isDefaultAdvisor) || faculty[0];
    return defaultAdvisor ? [defaultAdvisor] : [];
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, summary, selectedProfessor } = data;

    if (!email) {
      return NextResponse.json(
        { error: "Email field is required" },
        { status: 400 }
      );
    }

    if (!summary) {
      return NextResponse.json(
        { error: "Summary field is required" },
        { status: 400 }
      );
    }

    // Get Barry Lawson as the default professor
    const defaultProfessor = faculty.find(f => f.isDefaultAdvisor) || faculty[0];
    
    // Either use selected professor or default to Barry Lawson
    let professorToEmail = selectedProfessor 
      ? faculty.find(prof => prof.name === selectedProfessor) 
      : defaultProfessor;
    
    // Ensure we have a professor, using default as fallback
    if (!professorToEmail) {
      professorToEmail = defaultProfessor;
    }

    // Ensure the professor has a valid email
    const professorEmail = professorToEmail?.email || 'dcs-department@bates.edu';
    const professorName = professorToEmail?.name || 'DCS Department';
    
    const emailContent = createProfessorEmail(email, summary, professorName);
    
    // Use the email service with fallback
    const result = await sendEmailWithFallback({
      from: `DCS Bot <noreply@${process.env.EMAIL_FROM_DOMAIN || 'dcs.bates.edu'}>`,
      to: professorEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    });
    
    if (result.success) {
      return NextResponse.json({ 
        message: `Email sent to Professor ${professorName}`,
        professorName: professorName,
        service: result.provider || process.env.EMAIL_SERVICE || 'mock',
        usedFallback: result.fallback || false
      });
    } else {
      console.error('Failed to send email:', result.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in notify-professor route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 