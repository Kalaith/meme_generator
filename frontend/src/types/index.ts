// TypeScript type definitions for the meme generator

export interface TextOverlay {
  id: number;
  text: string;
  font: string;
  fontSize: number;
  color: string;
  position: {
    top: number;
    left: number;
  };
}

export interface ImageUploadProps {
  image: string | null;
  onImageUpload: (file: File) => void;
}

export interface TextOverlayControlsProps {
  onAddText: (overlay: Omit<TextOverlay, 'id' | 'position'>) => void;
  onDeleteText: () => void;
  selectedOverlay: TextOverlay | undefined;
  onUpdateSelectedText: (updates: Partial<TextOverlay>) => void;
}

export interface TextOverlaysProps {
  overlays: TextOverlay[];
  onSelectOverlay: (id: number) => void;
  onUpdateOverlay: (id: number, updates: Partial<TextOverlay>) => void;
  selectedOverlayId: number | null;
}

export interface QuickActionsProps {
  onClearAll: () => void;
  onReset: () => void;
}

export interface ExportProps {
  onExport: (format: string) => void;
}

export interface ImageFile {
  src: string;
  name: string;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
