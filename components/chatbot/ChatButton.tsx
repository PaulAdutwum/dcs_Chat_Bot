"use client";

import React from "react";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { motion } from "framer-motion";

export function ChatButton() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="bates"
        size="lg"
        className={`fixed bottom-6 right-6 rounded-full shadow-lg z-40 p-4 flex items-center justify-center transition-all duration-300 chat-button ${
          isOpen
            ? "opacity-0 translate-y-10 pointer-events-none"
            : "opacity-100"
        }`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        {!isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="whitespace-nowrap overflow-hidden"
          >
            Explore your Bates DCS journey
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}
