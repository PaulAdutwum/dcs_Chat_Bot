export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  prerequisites: string[];
  methodCategories: string[];
  typicalOffering: string;
  faculty: string[];
}

export const dcsCoursesData: Course[] = [
  {
    id: "dcs109d",
    code: "DCS 109D",
    title: "Introduction to Computational Problem Solving with Data",
    description: "This course introduces computational thinking and problem solving through the lens of data manipulation and analysis. Students learn fundamental programming concepts using Python, including variables, data types, control structures, functions, and basic data visualization techniques. The course emphasizes practical applications for processing and analyzing datasets.",
    credits: 1,
    prerequisites: [],
    methodCategories: ["methods of computer science", "methods of data science"],
    typicalOffering: "Fall and Winter semesters",
    faculty: ["Prof. Johnson", "Prof. Martinez"]
  },
  {
    id: "dcs109r",
    code: "DCS 109R",
    title: "Introduction to Computational Thinking with Robots",
    description: "This course introduces computational thinking using robotic systems as the primary learning tool. Students explore fundamental programming concepts while controlling robots to solve problems. Topics include basic algorithm design, control flow, event-based programming, and simple sensor integration.",
    credits: 1,
    prerequisites: [],
    methodCategories: ["methods of computer science"],
    typicalOffering: "Winter semester",
    faculty: ["Prof. Williams", "Prof. Chen"]
  },
  {
    id: "dcs109s",
    code: "DCS 109S",
    title: "Introduction to Computing for Problem Solving",
    description: "This course introduces computational problem solving with a focus on algorithm development and implementation. Students learn to solve problems using fundamental programming concepts, basic data structures, and systematic development approaches. The course emphasizes practices for writing clear, efficient, and maintainable code.",
    credits: 1,
    prerequisites: [],
    methodCategories: ["methods of computer science"],
    typicalOffering: "Fall and Winter semesters",
    faculty: ["Prof. Davis", "Prof. Thompson"]
  },
  {
    id: "dcs109t",
    code: "DCS 109T",
    title: "Computing Across the Liberal Arts",
    description: "This interdisciplinary course introduces computational methods in the context of different liberal arts disciplines. Students explore how computation can enhance understanding and research in fields such as humanities, social sciences, and arts. The course covers basic programming skills and computational thinking applied to interdisciplinary problems.",
    credits: 1,
    prerequisites: [],
    methodCategories: ["methods of computer science", "methods of critical digital studies"],
    typicalOffering: "Fall semester",
    faculty: ["Prof. Garcia", "Prof. Robinson"]
  },
  {
    id: "dcs211",
    code: "DCS 211",
    title: "Data Structures and Algorithms",
    description: "This course explores fundamental data structures and algorithms used in computer science. Topics include linked lists, stacks, queues, trees, graphs, sorting and searching algorithms, and analysis of algorithm efficiency. Students implement and analyze various data structures and algorithms to solve computational problems.",
    credits: 1,
    prerequisites: ["DCS 109D", "DCS 109R", "DCS 109S", "DCS 109T"],
    methodCategories: ["methods of computer science", "methods of software development"],
    typicalOffering: "Fall semester",
    faculty: ["Prof. Anderson", "Prof. Wilson"]
  },
  {
    id: "dcs229",
    code: "DCS 229",
    title: "Web Application Development",
    description: "This course covers the design and implementation of web applications. Students learn about client-server architecture, front-end design principles, database integration, and web application security. The course includes hands-on development of web applications using modern frameworks and technologies.",
    credits: 1,
    prerequisites: ["DCS 109D", "DCS 109S"],
    methodCategories: ["methods of software development", "methods of human-centered design"],
    typicalOffering: "Winter semester",
    faculty: ["Prof. Patel", "Prof. Smith"]
  },
  {
    id: "dcs250",
    code: "DCS 250",
    title: "Data Analysis and Visualization",
    description: "This course focuses on techniques for analyzing and visualizing data to extract meaningful insights. Students learn statistical methods, data preprocessing techniques, and visualization principles using modern tools and programming libraries. The course emphasizes effective communication of data-driven findings.",
    credits: 1,
    prerequisites: ["DCS 109D"],
    methodCategories: ["methods of data science, analysis, & visualization"],
    typicalOffering: "Winter semester",
    faculty: ["Prof. Lee", "Prof. Brown"]
  },
  {
    id: "dcs305",
    code: "DCS 305",
    title: "Human-Computer Interaction",
    description: "This course examines the design and evaluation of interactive computing systems from a human-centered perspective. Topics include user research methods, prototyping techniques, usability evaluation, and accessibility considerations. Students apply design thinking principles to create user-friendly interactive systems.",
    credits: 1,
    prerequisites: ["DCS 211", "DCS 229"],
    methodCategories: ["methods of human-centered design", "methods of critical digital studies"],
    typicalOffering: "Fall semester",
    faculty: ["Prof. Kim", "Prof. Taylor"]
  },
  {
    id: "dcs325",
    code: "DCS 325",
    title: "Machine Learning",
    description: "This course introduces the principles and techniques of machine learning. Topics include supervised and unsupervised learning, neural networks, decision trees, and model evaluation. Students implement various machine learning algorithms and apply them to real-world problems.",
    credits: 1,
    prerequisites: ["DCS 211", "DCS 250"],
    methodCategories: ["methods of data science, analysis, & visualization", "methods of computer science"],
    typicalOffering: "Winter semester",
    faculty: ["Prof. Zhang", "Prof. Miller"]
  },
  {
    id: "dcs342",
    code: "DCS 342",
    title: "Community-Engaged Digital Projects",
    description: "This project-based course partners students with local community organizations to develop digital solutions addressing real-world needs. Students apply technical skills while engaging with community stakeholders through participatory design processes, reflecting on the social impact of technology.",
    credits: 1,
    prerequisites: ["DCS 229", "DCS 305"],
    methodCategories: ["methods of community-engaged learning", "methods of human-centered design"],
    typicalOffering: "Fall and Winter semesters",
    faculty: ["Prof. Rodriguez", "Prof. Mitchell"]
  },
  {
    id: "dcs457",
    code: "DCS 457",
    title: "Senior Seminar: Critical Digital Studies",
    description: "This capstone seminar explores critical perspectives on digital technologies and their social, cultural, and ethical implications. Students engage with theoretical frameworks for analyzing digital systems and develop research projects examining the relationship between technology and society. The course fulfills the W3 writing requirement.",
    credits: 1,
    prerequisites: ["Senior standing"],
    methodCategories: ["methods of critical digital studies", "capstone"],
    typicalOffering: "Winter semester",
    faculty: ["Prof. Baker", "Prof. Nelson"]
  }
];

// Career paths associated with DCS major
export const careerPaths = {
  dataScienceAnalytics: {
    name: "Data Science & Analytics",
    description: "Apply statistical analysis, machine learning, and data visualization to extract insights from large datasets.",
    relatedCourses: ["DCS211", "DCS309", "DCS310", "DCS311", "MATH205", "MATH365"],
    skills: ["Python", "R", "SQL", "machine learning", "statistical analysis", "data visualization"],
    potentialJobs: ["Data Scientist", "Data Analyst", "Business Intelligence Analyst", "Machine Learning Engineer", "Quantitative Analyst"]
  },
  softwareEngineering: {
    name: "Software Engineering",
    description: "Design, develop, and maintain software systems and applications.",
    relatedCourses: ["DCS109", "DCS209", "DCS235", "DCS215", "DCS325", "MATH315"],
    skills: ["Java", "Python", "JavaScript", "databases", "algorithms", "software development methodologies"],
    potentialJobs: ["Software Engineer", "Full-Stack Developer", "Mobile App Developer", "DevOps Engineer", "Quality Assurance Engineer"]
  },
  digitalMedia: {
    name: "Digital Media & Design",
    description: "Create digital content and interactive experiences through design principles and digital tools.",
    relatedCourses: ["DCS105", "DCS107", "DCS227", "DCS304", "AV219", "AV281"],
    skills: ["UI/UX design", "digital storytelling", "multimedia production", "web design", "visual communication"],
    potentialJobs: ["UX/UI Designer", "Digital Media Specialist", "Web Designer", "Interactive Media Designer", "Content Creator"]
  },
  computerScienceResearch: {
    name: "Computer Science Research",
    description: "Advance the theoretical foundations of computing and develop new technologies.",
    relatedCourses: ["DCS209", "DCS215", "DCS235", "DCS333", "MATH221", "MATH315"],
    skills: ["algorithms", "theoretical CS", "research methods", "mathematical reasoning", "technical writing"],
    potentialJobs: ["Research Scientist", "Professor", "Algorithm Designer", "Computational Biologist", "PhD Student"]
  },
  cyberSecurity: {
    name: "Cybersecurity",
    description: "Protect digital systems, networks, and data from unauthorized access and cyber threats.",
    relatedCourses: ["DCS209", "DCS235", "DCS325", "PHIL241"],
    skills: ["network security", "cryptography", "ethical hacking", "risk assessment", "security protocols"],
    potentialJobs: ["Security Analyst", "Ethical Hacker", "Security Engineer", "Cryptographer", "Security Consultant"]
  },
  humanComputerInteraction: {
    name: "Human-Computer Interaction",
    description: "Design and evaluate interactive computing systems centered on human needs and experiences.",
    relatedCourses: ["DCS105", "DCS107", "DCS214", "DCS304", "PSYC218"],
    skills: ["user research", "interaction design", "usability testing", "prototyping", "user psychology"],
    potentialJobs: ["UX Researcher", "Interaction Designer", "Usability Specialist", "Product Designer", "Accessibility Specialist"]
  }
};

// Major requirements
export const majorRequirements = {
  totalCourses: 11,
  coreCourses: [
    { code: "DCS109", name: "Introduction to Computing" },
    { code: "DCS227", name: "Computational Problem Solving" },
    { code: "DCS200", name: "Critical Digital Studies" }
  ],
  methodsRequirements: {
    computational: {
      description: "Computational methods courses focus on computer programming and algorithmic thinking.",
      courses: ["DCS109", "DCS209", "DCS211", "DCS227", "DCS325", "DCS235"]
    },
    critical: {
      description: "Critical methods courses examine the social, cultural, and ethical implications of digital technologies.",
      courses: ["DCS200", "DCS204", "DCS214", "DCS241", "DCS273", "DCS304"]
    },
    quantitative: {
      description: "Quantitative methods courses develop mathematical and statistical skills for data analysis.",
      courses: ["MATH205", "MATH206", "MATH214", "ECON250", "STAT216", "PHYS301"]
    },
    creative: {
      description: "Creative methods courses explore digital design, storytelling, and artistic expression.",
      courses: ["DCS105", "DCS107", "AV219", "AV281", "MUS237", "THEA232"]
    }
  },
  electiveRequirements: "In addition to the core courses, students must complete at least one course from each of the four methods categories, plus two additional electives from any method.",
  capstone: "DCS457 - Senior Thesis or DCS458 - Community-Engaged Project"
};

// Detailed course information
export const courses = [
  {
    code: "DCS105",
    name: "Introduction to Digital Storytelling",
    description: "An introductory course on creating compelling narratives using digital media tools.",
    method: "creative",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Fall", "Winter"],
    professors: ["Smith", "Johnson"]
  },
  {
    code: "DCS107",
    name: "Introduction to Digital Art",
    description: "Explores creating visual art using digital tools, focusing on principles of design and composition.",
    method: "creative",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Wilson"]
  },
  {
    code: "DCS109",
    name: "Introduction to Computing",
    description: "First course in computer science, covering fundamental programming concepts using Python.",
    method: "computational",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Fall", "Winter", "Short Term"],
    professors: ["Brown", "Garcia"]
  },
  {
    code: "DCS200",
    name: "Critical Digital Studies",
    description: "Examines social, ethical, and political implications of digital technologies in society.",
    method: "critical",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Davis"]
  },
  {
    code: "DCS204",
    name: "Technological Critiques",
    description: "Explores critical perspectives on technology's role in shaping society and culture.",
    method: "critical",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Miller"]
  },
  {
    code: "DCS209",
    name: "Data Structures and Algorithms",
    description: "Covers fundamental data structures and algorithms essential for efficient software development.",
    method: "computational",
    prerequisites: "DCS109",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Garcia"]
  },
  {
    code: "DCS211",
    name: "Introduction to Data Science",
    description: "Introduces statistical and computational methods for extracting insights from data.",
    method: "computational",
    prerequisites: "DCS109 or equivalent programming experience",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Thompson"]
  },
  {
    code: "DCS214",
    name: "Digital and Computational Studies Across the Disciplines",
    description: "Explores how digital tools and computational methods are transforming various academic disciplines.",
    method: "critical",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Martinez", "Davis"]
  },
  {
    code: "DCS215",
    name: "Computer Architecture",
    description: "Examines the structure and operation of modern computer systems from transistors to high-level programming.",
    method: "computational",
    prerequisites: "DCS109",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Brown"]
  },
  {
    code: "DCS227",
    name: "Computational Problem Solving",
    description: "Develops algorithmic thinking and computational approaches to solving complex problems.",
    method: "computational",
    prerequisites: "DCS109",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Thompson"]
  },
  {
    code: "DCS235",
    name: "Software Design",
    description: "Focuses on principles and practices of designing robust, maintainable software systems.",
    method: "computational",
    prerequisites: "DCS209",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Garcia"]
  },
  {
    code: "DCS241",
    name: "Digital Privacy",
    description: "Investigates privacy issues in the digital age, including surveillance, data collection, and regulation.",
    method: "critical",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Miller"]
  },
  {
    code: "DCS273",
    name: "Race and Digital Technology",
    description: "Explores how race and ethnicity intersect with digital technologies and online spaces.",
    method: "critical",
    prerequisites: "None",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Martinez"]
  },
  {
    code: "DCS304",
    name: "Digital Humanities",
    description: "Applies computational methods to humanities research questions and cultural analysis.",
    method: "critical",
    prerequisites: "One 200-level DCS course recommended",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Davis"]
  },
  {
    code: "DCS309",
    name: "Machine Learning",
    description: "Explores algorithms that allow computers to learn from and make predictions on data.",
    method: "computational",
    prerequisites: "DCS211 and MATH205",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Thompson"]
  },
  {
    code: "DCS310",
    name: "Data Visualization",
    description: "Covers principles and techniques for effectively communicating data through visual representations.",
    method: "computational",
    prerequisites: "DCS211",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Wilson"]
  },
  {
    code: "DCS311",
    name: "Advanced Data Science",
    description: "Explores advanced topics in data analysis, machine learning, and statistical inference.",
    method: "computational",
    prerequisites: "DCS211 and MATH205",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Thompson"]
  },
  {
    code: "DCS325",
    name: "Web Development",
    description: "Covers client-side and server-side web technologies, focusing on creating interactive web applications.",
    method: "computational",
    prerequisites: "DCS109",
    credits: 1,
    typically_offered: ["Fall"],
    professors: ["Brown"]
  },
  {
    code: "DCS333",
    name: "Artificial Intelligence",
    description: "Examines the theory and practice of building systems that exhibit intelligent behavior.",
    method: "computational",
    prerequisites: "DCS209",
    credits: 1,
    typically_offered: ["Winter"],
    professors: ["Garcia"]
  },
  {
    code: "DCS457",
    name: "Senior Thesis",
    description: "Independent research project culminating in a thesis on a DCS-related topic.",
    method: "capstone",
    prerequisites: "Senior standing and permission",
    credits: 1,
    typically_offered: ["Fall", "Winter"],
    professors: ["All Faculty"]
  },
  {
    code: "DCS458",
    name: "Community-Engaged Project",
    description: "Collaborative capstone project addressing a community need through digital and computational approaches.",
    method: "capstone",
    prerequisites: "Senior standing and permission",
    credits: 1,
    typically_offered: ["Fall", "Winter"],
    professors: ["All Faculty"]
  }
];

// Faculty information
export const faculty = [
  {
    name: "Dr. Brown",
    specialties: ["Computer Architecture", "Web Development", "Programming Languages"],
    email: "brown@bates.edu",
    office: "Pettengill Hall 365",
    interests: ["software engineering", "web technologies"]
  },
  {
    name: "Dr. Davis",
    specialties: ["Critical Digital Studies", "Digital Humanities", "Technology Ethics"],
    email: "davis@bates.edu",
    office: "Pettengill Hall 367",
    interests: ["critical studies", "digital humanities", "ethics"]
  },
  {
    name: "Dr. Garcia",
    specialties: ["Algorithms", "Artificial Intelligence", "Software Design"],
    email: "garcia@bates.edu",
    office: "Pettengill Hall 369",
    interests: ["software engineering", "AI", "algorithms"]
  },
  {
    name: "Dr. Martinez",
    specialties: ["Technology and Society", "Race and Digital Media", "Interdisciplinary Computing"],
    email: "martinez@bates.edu",
    office: "Pettengill Hall 371",
    interests: ["critical studies", "social justice", "digital media"]
  },
  {
    name: "Dr. Miller",
    specialties: ["Privacy", "Technology Critiques", "Digital Ethics"],
    email: "miller@bates.edu",
    office: "Pettengill Hall 373",
    interests: ["critical studies", "ethics", "privacy"]
  },
  {
    name: "Dr. Thompson",
    specialties: ["Data Science", "Machine Learning", "Computational Problem Solving"],
    email: "thompson@bates.edu",
    office: "Pettengill Hall 375",
    interests: ["data science", "machine learning", "statistical analysis"]
  },
  {
    name: "Dr. Wilson",
    specialties: ["Digital Art", "Data Visualization", "Creative Computing"],
    email: "wilson@bates.edu",
    office: "Pettengill Hall 377",
    interests: ["creative computing", "digital design", "visualization"]
  }
];

// Sample four-year plans
export const fourYearPlans = {
  dataScienceFocus: {
    name: "Data Science Focus",
    description: "This plan emphasizes courses in data analysis, statistics, and machine learning.",
    firstYear: [
      "DCS109: Introduction to Computing (Fall)",
      "MATH205: Calculus I (Fall)",
      "DCS211: Introduction to Data Science (Winter)",
      "MATH206: Calculus II (Winter)"
    ],
    secondYear: [
      "DCS227: Computational Problem Solving (Fall)",
      "DCS200: Critical Digital Studies (Fall)",
      "DCS209: Data Structures and Algorithms (Winter)",
      "STAT216: Probability and Statistics (Winter)"
    ],
    thirdYear: [
      "DCS310: Data Visualization (Fall)",
      "DCS214: DCS Across the Disciplines (Fall)",
      "DCS309: Machine Learning (Winter)",
      "DCS105: Introduction to Digital Storytelling (Winter)"
    ],
    fourthYear: [
      "DCS311: Advanced Data Science (Fall)",
      "Elective: DCS241: Digital Privacy (Fall)",
      "DCS457/458: Capstone (Winter)"
    ]
  },
  softwareEngineeringFocus: {
    name: "Software Engineering Focus",
    description: "This plan emphasizes software development, algorithms, and system design.",
    firstYear: [
      "DCS109: Introduction to Computing (Fall)",
      "MATH205: Calculus I (Fall)",
      "DCS107: Introduction to Digital Art (Winter)",
      "MATH206: Calculus II (Winter)"
    ],
    secondYear: [
      "DCS227: Computational Problem Solving (Fall)",
      "DCS200: Critical Digital Studies (Fall)",
      "DCS209: Data Structures and Algorithms (Winter)",
      "DCS215: Computer Architecture (Winter)"
    ],
    thirdYear: [
      "DCS325: Web Development (Fall)",
      "DCS241: Digital Privacy (Fall)",
      "DCS235: Software Design (Winter)",
      "MATH315: Algorithms (Winter)"
    ],
    fourthYear: [
      "DCS333: Artificial Intelligence (Fall)",
      "Elective: DCS309: Machine Learning (Fall)",
      "DCS457/458: Capstone (Winter)"
    ]
  },
  digitalMediaFocus: {
    name: "Digital Media Focus",
    description: "This plan emphasizes digital design, storytelling, and creative applications of technology.",
    firstYear: [
      "DCS109: Introduction to Computing (Fall)",
      "DCS105: Introduction to Digital Storytelling (Fall)",
      "DCS107: Introduction to Digital Art (Winter)",
      "AV219: Visual Meaning (Winter)"
    ],
    secondYear: [
      "DCS227: Computational Problem Solving (Fall)",
      "DCS200: Critical Digital Studies (Fall)",
      "DCS214: DCS Across the Disciplines (Winter)",
      "AV281: Multimedia Storytelling (Winter)"
    ],
    thirdYear: [
      "DCS325: Web Development (Fall)",
      "DCS273: Race and Digital Technology (Fall)",
      "DCS304: Digital Humanities (Winter)",
      "MUS237: Electronic Music (Winter)"
    ],
    fourthYear: [
      "DCS310: Data Visualization (Fall)",
      "Elective: DCS241: Digital Privacy (Fall)",
      "DCS457/458: Capstone (Winter)"
    ]
  },
  interdisciplinaryFocus: {
    name: "Interdisciplinary Focus",
    description: "This plan balances computational skills with critical perspectives and applications across disciplines.",
    firstYear: [
      "DCS109: Introduction to Computing (Fall)",
      "DCS105: Introduction to Digital Storytelling (Fall)",
      "DCS200: Critical Digital Studies (Winter)",
      "STAT216: Probability and Statistics (Winter)"
    ],
    secondYear: [
      "DCS227: Computational Problem Solving (Fall)",
      "DCS214: DCS Across the Disciplines (Fall)",
      "DCS211: Introduction to Data Science (Winter)",
      "DCS241: Digital Privacy (Winter)"
    ],
    thirdYear: [
      "DCS310: Data Visualization (Fall)",
      "DCS273: Race and Digital Technology (Fall)",
      "DCS304: Digital Humanities (Winter)",
      "DCS235: Software Design (Winter)"
    ],
    fourthYear: [
      "Elective: DCS325: Web Development (Fall)",
      "Elective: DCS333: Artificial Intelligence (Fall)",
      "DCS457/458: Capstone (Winter)"
    ]
  }
};

// Add type definition for interestAreas
type InterestArea = {
  description: string;
  relatedPaths: string[];
  suggestedCourses: string[];
};

type InterestAreas = {
  [key: string]: InterestArea;
};

// Interest areas mapping to suggest relevant paths and courses
export const interestAreas = {
  programming: {
    description: "Designing and writing computer programs and software",
    relatedPaths: ["softwareEngineering", "dataScienceAnalytics", "computerScienceResearch"],
    suggestedCourses: ["DCS109", "DCS209", "DCS227", "DCS235"]
  },
  dataAnalysis: {
    description: "Extracting insights and patterns from data",
    relatedPaths: ["dataScienceAnalytics", "computerScienceResearch"],
    suggestedCourses: ["DCS211", "DCS309", "DCS310", "DCS311"]
  },
  design: {
    description: "Creating visual and interactive experiences",
    relatedPaths: ["digitalMedia", "humanComputerInteraction"],
    suggestedCourses: ["DCS105", "DCS107", "DCS304", "DCS310"]
  },
  criticalThinking: {
    description: "Analyzing social and ethical implications of technology",
    relatedPaths: ["computerScienceResearch", "humanComputerInteraction"],
    suggestedCourses: ["DCS200", "DCS204", "DCS214", "DCS241", "DCS273"]
  },
  problemSolving: {
    description: "Developing strategies to solve complex challenges",
    relatedPaths: ["softwareEngineering", "computerScienceResearch", "dataScienceAnalytics"],
    suggestedCourses: ["DCS227", "DCS209", "DCS235", "DCS333"]
  },
  visualization: {
    description: "Creating visual representations of data and concepts",
    relatedPaths: ["dataScienceAnalytics", "digitalMedia"],
    suggestedCourses: ["DCS310", "DCS107", "AV219", "AV281"]
  },
  security: {
    description: "Protecting digital systems and information",
    relatedPaths: ["cyberSecurity", "softwareEngineering"],
    suggestedCourses: ["DCS209", "DCS215", "DCS235", "DCS241"]
  },
  userExperience: {
    description: "Designing intuitive and engaging user interfaces",
    relatedPaths: ["humanComputerInteraction", "digitalMedia"],
    suggestedCourses: ["DCS105", "DCS107", "DCS214", "DCS304"]
  },
  artificialIntelligence: {
    description: "Creating systems that can learn and reason",
    relatedPaths: ["computerScienceResearch", "dataScienceAnalytics"],
    suggestedCourses: ["DCS211", "DCS309", "DCS333", "MATH315"]
  },
  creativity: {
    description: "Expressing ideas through digital media and storytelling",
    relatedPaths: ["digitalMedia", "humanComputerInteraction"],
    suggestedCourses: ["DCS105", "DCS107", "AV219", "MUS237"]
  }
};

// Helper functions
export function findCourseByCode(code: string) {
  return courses.find(course => course.code.toLowerCase() === code.toLowerCase());
}

export function findCoursesByMethod(method: string) {
  return courses.filter(course => course.method.toLowerCase() === method.toLowerCase());
}

export function findProfessorByName(name: string) {
  return faculty.find(prof => 
    prof.name.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(prof.name.split(' ')[1].toLowerCase())
  );
}

export function findProfessorsByInterest(interest: string) {
  return faculty.filter(prof => 
    prof.interests.some(i => i.toLowerCase().includes(interest.toLowerCase()))
  );
}

export function getCareerPathByTitle(title: string) {
  return Object.values(careerPaths).find(path => 
    path.name.toLowerCase().includes(title.toLowerCase())
  );
}

export function suggestPathsForInterests(interests: string[]) {
  const pathScores: Record<string, number> = {};
  
  const matchedAreas = interests.filter(interest => 
    Object.keys(interestAreas).some(area => 
      interest.toLowerCase().includes(area.toLowerCase())
    )
  );
  
  matchedAreas.forEach(area => {
    Object.keys(interestAreas).forEach(knownArea => {
      if (area.toLowerCase().includes(knownArea.toLowerCase())) {
        const interestAreaTyped = interestAreas as InterestAreas;
        interestAreaTyped[knownArea].relatedPaths.forEach((path: string) => {
          pathScores[path] = (pathScores[path] || 0) + 1;
        });
      }
    });
  });
  
  // Sort paths by score
  return Object.entries(pathScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([path]) => path);
}

export function suggestCoursesForInterests(interests: string[]) {
  const courseScores: Record<string, number> = {};
  
  const matchedAreas = interests.filter(interest => 
    Object.keys(interestAreas).some(area => 
      interest.toLowerCase().includes(area.toLowerCase())
    )
  );
  
  matchedAreas.forEach(area => {
    Object.keys(interestAreas).forEach(knownArea => {
      if (area.toLowerCase().includes(knownArea.toLowerCase())) {
        const interestAreaTyped = interestAreas as InterestAreas;
        interestAreaTyped[knownArea].suggestedCourses.forEach((course: string) => {
          courseScores[course] = (courseScores[course] || 0) + 1;
        });
      }
    });
  });
  
  // Sort courses by score
  return Object.entries(courseScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([course]) => course);
}

// Add the missing helper functions that are imported in other files
export function getCoursesByCategory(category: string): Course[] {
  return dcsCoursesData.filter(course => 
    course.methodCategories.some(method => 
      method.toLowerCase().includes(category.toLowerCase())
    )
  );
}

export function getCourseById(id: string): Course | undefined {
  return dcsCoursesData.find(course => 
    course.id.toLowerCase() === id.toLowerCase() || 
    course.code.toLowerCase() === id.toLowerCase()
  );
}

export function getPrerequisiteCourses(courseId: string): Course[] {
  const course = getCourseById(courseId);
  if (!course) return [];
  
  return dcsCoursesData.filter(c => 
    course.prerequisites.includes(c.code)
  );
} 