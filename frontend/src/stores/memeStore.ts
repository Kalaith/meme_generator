import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TextOverlay, ExportFormat, Notification } from '../types';

export interface Meme {
  id: string;
  name: string;
  image: string | null;
  textOverlays: TextOverlay[];
  createdAt: Date;
  updatedAt: Date;
}

interface MemeState {
  currentMeme: Meme | null;
  savedMemes: Meme[];
  recentImages: string[];
  exportHistory: {
    memeId: string;
    format: ExportFormat;
    exportedAt: Date;
  }[];
  notifications: Notification[];
  selectedOverlayId: number | null;
}

interface MemeActions {
  // Meme management
  createNewMeme: () => void;
  saveMeme: (name: string) => void;
  loadMeme: (memeId: string) => void;
  deleteMeme: (memeId: string) => void;
  duplicateMeme: (memeId: string) => void;
  
  // Image handling
  setImage: (image: string) => void;
  addToRecentImages: (image: string) => void;
  
  // Text overlay management
  addTextOverlay: (overlay: Omit<TextOverlay, 'id' | 'position'>) => void;
  updateTextOverlay: (id: number, updates: Partial<TextOverlay>) => void;
  deleteTextOverlay: (id: number) => void;
  selectOverlay: (id: number | null) => void;
  clearAllOverlays: () => void;
  
  // Export
  recordExport: (format: ExportFormat) => void;
  
  // Notifications
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
  
  // Reset
  resetCurrentMeme: () => void;
  clearAll: () => void;
}

type MemeStore = MemeState & MemeActions;

const generateId = () => crypto.randomUUID();
const generateOverlayId = () => Date.now() + Math.random();

const createEmptyMeme = (): Meme => ({
  id: generateId(),
  name: '',
  image: null,
  textOverlays: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useMemeStore = create<MemeStore>()(
  persist(
    (set, get) => ({
      // State
      currentMeme: createEmptyMeme(),
      savedMemes: [],
      recentImages: [],
      exportHistory: [],
      notifications: [],
      selectedOverlayId: null,

      // Meme Management
      createNewMeme: () =>
        set({
          currentMeme: createEmptyMeme(),
          selectedOverlayId: null,
        }),

      saveMeme: (name) =>
        set((state) => {
          if (!state.currentMeme) return state;

          const memeToSave: Meme = {
            ...state.currentMeme,
            name,
            updatedAt: new Date(),
          };

          const existingIndex = state.savedMemes.findIndex(m => m.id === memeToSave.id);
          const updatedSavedMemes = existingIndex >= 0
            ? state.savedMemes.map((m, i) => i === existingIndex ? memeToSave : m)
            : [...state.savedMemes, memeToSave];

          return {
            savedMemes: updatedSavedMemes,
            currentMeme: memeToSave,
          };
        }),

      loadMeme: (memeId) =>
        set((state) => {
          const meme = state.savedMemes.find(m => m.id === memeId);
          return meme ? { currentMeme: meme, selectedOverlayId: null } : state;
        }),

      deleteMeme: (memeId) =>
        set((state) => ({
          savedMemes: state.savedMemes.filter(m => m.id !== memeId),
          currentMeme: state.currentMeme?.id === memeId ? createEmptyMeme() : state.currentMeme,
          exportHistory: state.exportHistory.filter(e => e.memeId !== memeId),
        })),

      duplicateMeme: (memeId) =>
        set((state) => {
          const originalMeme = state.savedMemes.find(m => m.id === memeId);
          if (!originalMeme) return state;

          const duplicatedMeme: Meme = {
            ...originalMeme,
            id: generateId(),
            name: `${originalMeme.name} (Copy)`,
            textOverlays: originalMeme.textOverlays.map(overlay => ({
              ...overlay,
              id: generateOverlayId(),
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            savedMemes: [...state.savedMemes, duplicatedMeme],
            currentMeme: duplicatedMeme,
            selectedOverlayId: null,
          };
        }),

      // Image Handling
      setImage: (image) =>
        set((state) => ({
          currentMeme: state.currentMeme
            ? { ...state.currentMeme, image, updatedAt: new Date() }
            : state.currentMeme,
        })),

      addToRecentImages: (image) =>
        set((state) => ({
          recentImages: [image, ...state.recentImages.filter(img => img !== image)].slice(0, 10),
        })),

      // Text Overlay Management
      addTextOverlay: (overlayData) =>
        set((state) => {
          if (!state.currentMeme) return state;

          const newOverlay: TextOverlay = {
            ...overlayData,
            id: generateOverlayId(),
            position: { top: 20, left: 20 },
          };

          return {
            currentMeme: {
              ...state.currentMeme,
              textOverlays: [...state.currentMeme.textOverlays, newOverlay],
              updatedAt: new Date(),
            },
            selectedOverlayId: newOverlay.id,
          };
        }),

      updateTextOverlay: (id, updates) =>
        set((state) => {
          if (!state.currentMeme) return state;

          return {
            currentMeme: {
              ...state.currentMeme,
              textOverlays: state.currentMeme.textOverlays.map(overlay =>
                overlay.id === id ? { ...overlay, ...updates } : overlay
              ),
              updatedAt: new Date(),
            },
          };
        }),

      deleteTextOverlay: (id) =>
        set((state) => {
          if (!state.currentMeme) return state;

          return {
            currentMeme: {
              ...state.currentMeme,
              textOverlays: state.currentMeme.textOverlays.filter(overlay => overlay.id !== id),
              updatedAt: new Date(),
            },
            selectedOverlayId: state.selectedOverlayId === id ? null : state.selectedOverlayId,
          };
        }),

      selectOverlay: (id) => set({ selectedOverlayId: id }),

      clearAllOverlays: () =>
        set((state) => ({
          currentMeme: state.currentMeme
            ? { ...state.currentMeme, textOverlays: [], updatedAt: new Date() }
            : state.currentMeme,
          selectedOverlayId: null,
        })),

      // Export
      recordExport: (format) =>
        set((state) => {
          if (!state.currentMeme) return state;

          const exportRecord = {
            memeId: state.currentMeme.id,
            format,
            exportedAt: new Date(),
          };

          return {
            exportHistory: [exportRecord, ...state.exportHistory].slice(0, 50), // Keep last 50 exports
          };
        }),

      // Notifications
      addNotification: (message, type) =>
        set((state) => {
          const notification: Notification = {
            id: Date.now(),
            message,
            type,
          };

          return {
            notifications: [...state.notifications, notification],
          };
        }),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Reset
      resetCurrentMeme: () =>
        set({
          currentMeme: createEmptyMeme(),
          selectedOverlayId: null,
        }),

      clearAll: () =>
        set({
          currentMeme: createEmptyMeme(),
          savedMemes: [],
          recentImages: [],
          exportHistory: [],
          notifications: [],
          selectedOverlayId: null,
        }),
    }),
    {
      name: 'meme-generator-storage',
      partialize: (state) => ({
        savedMemes: state.savedMemes,
        recentImages: state.recentImages,
        exportHistory: state.exportHistory,
      }),
    }
  )
);