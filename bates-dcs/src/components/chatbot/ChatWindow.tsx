import React from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp?: number;
}

interface ChatWindowProps {
  messages: Message[];
  isMinimized: boolean;
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isMinimized,
  isLoading = false,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message: Message, index: number) => {
            // Generate a unique key using message ID, timestamp, and index
            const uniqueKey = `${message.id}-${message.timestamp || Date.now()}-${index}`;

            return (
              <div
                key={uniqueKey}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}

          {/* Loading Progress Bar */}
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-500 animate-pulse"></div>
                </div>
                <p className="text-center text-gray-500 mt-2">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
