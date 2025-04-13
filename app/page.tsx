import { Chatbot } from "@/components/chatbot/Chatbot";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-[#800000] text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="font-bold text-xl">Bates College</div>
            <div className="ml-2 text-sm">Department of Computer Science</div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Curriculum
            </Link>
            <Link href="#" className="hover:underline">
              Faculty
            </Link>
            <Link href="#" className="hover:underline">
              Research
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" className="text-white">
              Menu
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-[#800000] mb-4">
                Department of Computer Science
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Explore the exciting world of computer science at Bates College.
                Our program emphasizes both theoretical foundations and
                practical applications, preparing students for success in a
                rapidly evolving field.
              </p>
              <div className="flex space-x-4">
                <Button variant="bates" size="lg">
                  Apply Now
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="aspect-video relative bg-gray-300 rounded">
                  {/* Replace with actual image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Campus Image Placeholder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Program Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#800000] mb-3">
                Innovative Curriculum
              </h3>
              <p className="text-gray-700">
                Our curriculum balances theoretical foundations with practical
                skills, preparing students for diverse career paths and graduate
                study.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#800000] mb-3">
                Faculty Mentorship
              </h3>
              <p className="text-gray-700">
                Work closely with faculty who are active researchers and
                dedicated educators, providing personalized guidance throughout
                your academic journey.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#800000] mb-3">
                Research Opportunities
              </h3>
              <p className="text-gray-700">
                Engage in cutting-edge research with faculty mentors, and
                present your work at conferences and undergraduate research
                symposia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Highlights */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Faculty
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-[#800000]">
                Dr. Jane Smith
              </h3>
              <p className="text-gray-600 mb-3">Department Chair</p>
              <p className="text-gray-700 text-center">
                Specializing in artificial intelligence and machine learning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-[#800000]">Dr. John Doe</h3>
              <p className="text-gray-600 mb-3">Associate Professor</p>
              <p className="text-gray-700 text-center">
                Research focus on algorithms and computational complexity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-[#800000]">
                Dr. Emily Brown
              </h3>
              <p className="text-gray-600 mb-3">Assistant Professor</p>
              <p className="text-gray-700 text-center">
                Specializing in computer graphics and visualization.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline">View All Faculty</Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#800000] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our vibrant community of scholars and innovators. Apply to
            Bates College today and start your path toward a successful career
            in computer science.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#800000]"
            >
              Schedule a Visit
            </Button>
            <Button
              variant="default"
              className="bg-white text-[#800000] hover:bg-gray-100"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Bates College</h3>
              <p className="text-gray-300">Department of Computer Science</p>
              <p className="text-gray-300">2 Andrews Road</p>
              <p className="text-gray-300">Lewiston, ME 04240</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Faculty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Research
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Student Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Alumni Network
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Career Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Email
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Bates College. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
