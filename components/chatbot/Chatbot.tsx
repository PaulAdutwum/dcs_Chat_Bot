"use client";

import React from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import { useChatStore } from "@/lib/store";

export function Chatbot() {
  const { isOpen, setIsOpen } = useChatStore();

  return (
    <>
      <ChatButton />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
