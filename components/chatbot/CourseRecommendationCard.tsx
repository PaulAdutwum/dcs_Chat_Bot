import { useState } from "react";
import { Course } from "@/lib/courseData";
import { FaGraduationCap, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CourseRecommendationCardProps {
  courses: Course[];
  title?: string;
  onCourseSelect?: (course: Course) => void;
}

const CourseRecommendationCard: React.FC<CourseRecommendationCardProps> = ({
  courses,
  title = "Recommended Courses",
  onCourseSelect,
}) => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const toggleCourse = (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 shadow-md overflow-hidden mb-4">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaGraduationCap className="text-blue-200" />
          {title}
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <div
              className="p-3 flex justify-between items-start cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => toggleCourse(course.id)}
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {course.code}: {course.title}
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {expandedCourse !== course.id && (
                    <p className="line-clamp-2">{course.description}</p>
                  )}
                </div>
              </div>
              <div className="text-blue-500 dark:text-blue-400 ml-2 mt-1">
                {expandedCourse === course.id ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
            </div>

            {expandedCourse === course.id && (
              <div className="px-3 pb-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-xs">
                      Credits
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {course.credits}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-xs">
                      Typical Offering
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {course.typicalOffering}
                    </span>
                  </div>

                  {course.prerequisites.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">
                        Prerequisites
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {course.prerequisites.join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 block text-xs">
                      Categories
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.methodCategories.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {onCourseSelect && (
                  <button
                    onClick={() => onCourseSelect(course)}
                    className="mt-3 w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Learn More
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendationCard;
