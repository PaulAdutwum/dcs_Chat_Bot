import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random ID string
 * @returns A random string that can be used as an ID
 */
export function generateId(): string {
  return 'id-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generate a user ID 
 * @returns A user ID string
 */
export function generateUserId(): string {
  return 'user-' + Math.random().toString(36).substring(2, 15);
}

/**
 * Format a date for display
 * @param date The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleString();
}

/**
 * Safely store a value in localStorage with error handling
 * @param key The localStorage key
 * @param value The value to store
 */
export function safelyStoreItem(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
  }
}

/**
 * Safely retrieve a value from localStorage with error handling
 * @param key The localStorage key
 * @param defaultValue A default value to return if retrieval fails
 * @returns The retrieved value or the default value
 */
export function safelyGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return defaultValue;
  }
}
