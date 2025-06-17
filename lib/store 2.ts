import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateUserId } from '@/lib/utils';

// Define types
export type SuggestionButton = {
  id: string;
  text: string;
  action: string;
};

export type Interest = {
  topic: string;
  weight: number;
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: SuggestionButton[];
}

// API Message type (different from UI Message)
export type APIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
};

interface ChatStore {
  messages: Message[];
  isOpen: boolean;
  progressValue: number;
  darkMode: boolean;
  userInterests: Interest[];
  userId: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  toggleChat: () => void;
  setIsOpen: (isOpen: boolean) => void;
  clearMessages: () => void;
  incrementProgress: (amount: number) => void;
  resetProgress: () => void;
  toggleDarkMode: () => void;
  addInterest: (topic: string, weight: number) => void;
  getTopInterests: (count?: number) => Interest[];
  setUserId: (id: string) => void;
}

// In-memory message storage for API messages
const messageStore: Record<string, APIMessage[]> = {};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: '1',
          text: 'Hello! I\'m your Bates DCS guide. How can I help you explore your computer science journey at Bates College?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      isOpen: false,
      progressValue: 0,
      darkMode: false,
      userInterests: [],
      userId: generateUserId(),
      addMessage: (message) =>
        set((state) => {
          const newMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date(),
          };
          
          return {
            messages: [...state.messages, newMessage],
          };
        }),
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsOpen: (isOpen) => set({ isOpen }),
      clearMessages: () =>
        set({
          messages: [
            {
              id: '1',
              text: 'Hello! I\'m your Bates DCS guide. How can I help you explore your computer science journey at Bates College?',
              sender: 'bot',
              timestamp: new Date(),
            },
          ],
          progressValue: 0,
        }),
      incrementProgress: (amount) =>
        set((state) => ({
          progressValue: Math.min(100, state.progressValue + amount),
        })),
      resetProgress: () => set({ progressValue: 0 }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      addInterest: (topic, weight) => 
        set((state) => {
          // Check if the topic already exists
          const existingIndex = state.userInterests.findIndex(
            interest => interest.topic.toLowerCase() === topic.toLowerCase()
          );
          
          let updatedInterests = [...state.userInterests];
          
          if (existingIndex >= 0) {
            // Update existing interest with new weight
            updatedInterests[existingIndex] = {
              ...updatedInterests[existingIndex],
              weight: updatedInterests[existingIndex].weight + weight
            };
          } else {
            // Add new interest
            updatedInterests = [...state.userInterests, { topic, weight }];
          }
                    
          return { userInterests: updatedInterests };
        }),
      getTopInterests: (count = 3) => {
        const { userInterests } = get();
        return [...userInterests]
          .sort((a, b) => b.weight - a.weight)
          .slice(0, count);
      },
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: 'bates-dcs-chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        userInterests: state.userInterests,
        userId: state.userId,
      }),
    }
  )
);

/**
 * Save a chat message to the in-memory storage
 */
export async function saveMessage(userId: string, message: APIMessage) {
  try {
    if (!messageStore[userId]) {
      messageStore[userId] = [];
    }
    
    messageStore[userId].push({
      ...message,
      timestamp: message.timestamp || new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
}

/**
 * Get all messages for a user from in-memory storage
 */
export async function getMessages(userId: string): Promise<APIMessage[]> {
  try {
    return messageStore[userId] || [];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

/**
 * Delete all messages for a user from in-memory storage
 */
export async function clearMessages(userId: string): Promise<boolean> {
  try {
    messageStore[userId] = [];
    return true;
  } catch (error) {
    console.error('Error clearing messages:', error);
    return false;
  }
} 