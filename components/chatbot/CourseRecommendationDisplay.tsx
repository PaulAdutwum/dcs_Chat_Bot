import { useState, useEffect } from "react";
import CourseRecommendationCard from "./CourseRecommendationCard";
import { Course } from "@/lib/courseData";
import { recommendCourses, extractInterestsFromMessage } from "@/lib/interests";

interface CourseRecommendationDisplayProps {
  messages: { text: string; sender: string }[];
  takenCourses?: string[];
}

const CourseRecommendationDisplay: React.FC<
  CourseRecommendationDisplayProps
> = ({ messages, takenCourses = [] }) => {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Process messages to extract interests and recommend courses
  useEffect(() => {
    // Only process if we have messages
    if (messages.length === 0) return;

    // Combine all user messages
    const userMessages = messages
      .filter((msg) => msg.sender === "user")
      .map((msg) => msg.text)
      .join(" ");

    // Extract interests from the messages (now returns Record<string, number>)
    const interestsRecord = extractInterestsFromMessage(userMessages);

    // Get course recommendations based on extracted interests
    const courses = recommendCourses(interestsRecord, takenCourses);
    setRecommendedCourses(courses);
  }, [messages, takenCourses]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseDetails = () => {
    setSelectedCourse(null);
  };

  if (recommendedCourses.length === 0) {
    return null;
  }

  if (selectedCourse) {
    return (
      <div className="w-full rounded-lg bg-white dark:bg-slate-900 shadow-md overflow-hidden mb-4 animate-fadeIn">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            {selectedCourse.code}: {selectedCourse.title}
          </h3>
          <button
            onClick={handleCloseDetails}
            className="text-white hover:text-blue-200 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            {selectedCourse.description}
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Course Details
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Credits:
                  </span>
                  <span className="ml-2 text-gray-800 dark:text-gray-200">
                    {selectedCourse.credits}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Typical Offering:
                  </span>
                  <span className="ml-2 text-gray-800 dark:text-gray-200">
                    {selectedCourse.typicalOffering}
                  </span>
                </div>
                {selectedCourse.prerequisites.length > 0 && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Prerequisites:
                    </span>
                    <span className="ml-2 text-gray-800 dark:text-gray-200">
                      {selectedCourse.prerequisites.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-slate-800 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                Faculty
              </h4>
              <div className="space-y-1">
                {selectedCourse.faculty.map((professor, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-gray-800 dark:text-gray-200">
                      {professor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">
              Course Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCourse.methodCategories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <button
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => {
              // Sample action - could open registration portal, contact professor, etc.
              window.open(`https://example.com/courses/${selectedCourse.id}`);
            }}
          >
            Register Interest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <CourseRecommendationCard
        courses={recommendedCourses}
        title="Personalized Course Recommendations"
        onCourseSelect={handleCourseSelect}
      />
    </div>
  );
};

export default CourseRecommendationDisplay;
