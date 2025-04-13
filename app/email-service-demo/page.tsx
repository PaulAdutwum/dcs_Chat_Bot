"use client";

import { useState, FormEvent } from "react";
import { faculty } from "@/lib/courseData";
import Link from "next/link";

export default function EmailServiceDemo() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "none";
    message: string;
  }>({ type: "none", message: "" });
  const [loading, setLoading] = useState(false);
  const [emailService, setEmailService] = useState("resend"); // default to resend

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "none", message: "" });

    try {
      const response = await fetch("/api/notify-professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          summary: message,
          selectedProfessor,
          emailService, // Pass the selected email service
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: `Email sent successfully to ${data.professorName} using ${emailService}!`,
        });
      } else {
        setStatus({
          type: "error",
          message: `Error: ${data.error || "Unknown error occurred"}`,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send email. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Service Demo</h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates the combined email service that can switch
          between Resend and SendGrid.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to home
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email Service
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emailService"
                  value="resend"
                  checked={emailService === "resend"}
                  onChange={() => setEmailService("resend")}
                  className="mr-2"
                />
                Resend
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emailService"
                  value="sendgrid"
                  checked={emailService === "sendgrid"}
                  onChange={() => setEmailService("sendgrid")}
                  className="mr-2"
                />
                SendGrid
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Professor
            </label>
            <select
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Auto-select based on message</option>
              {faculty.map((prof) => (
                <option key={prof.name} value={prof.name}>
                  {prof.name} ({prof.specialties.join(", ")})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-medium text-white 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>

        {status.type !== "none" && (
          <div
            className={`mt-4 p-3 rounded-md ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The email service provider can be configured in the environment
            variables using{" "}
            <code className="bg-gray-200 px-1 rounded">
              EMAIL_SERVICE=resend
            </code>{" "}
            or{" "}
            <code className="bg-gray-200 px-1 rounded">
              EMAIL_SERVICE=sendgrid
            </code>
          </li>
          <li>
            Make sure to set both{" "}
            <code className="bg-gray-200 px-1 rounded">RESEND_API_KEY</code> and{" "}
            <code className="bg-gray-200 px-1 rounded">SENDGRID_API_KEY</code>{" "}
            in your <code className="bg-gray-200 px-1 rounded">.env.local</code>{" "}
            file
          </li>
          <li>
            The email provider will automatically select the correct service
            based on the environment variable
          </li>
          <li>If no service is specified, it defaults to Resend</li>
        </ul>
      </div>
    </div>
  );
}
