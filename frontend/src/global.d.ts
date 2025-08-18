// Global type declarations for the meme generator

import { NotificationType } from './types';

declare global {
  interface Window {
    showNotification?: (message: string, type: NotificationType, duration?: number) => void;
  }
}
