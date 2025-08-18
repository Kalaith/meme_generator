import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ImagePreview from './ImagePreview';
import TextOverlayControls from './TextOverlayControls';
import TextOverlays from './TextOverlays';
import QuickActions from './QuickActions';
import Export from './Export';
import NotificationManager from './NotificationManager';
import { TextOverlay } from '../types';

const MemeEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [overlays, setOverlays] = useState<TextOverlay[]>([]);
  const [selectedOverlayId, setSelectedOverlayId] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (file: File): void => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        if (window.showNotification) {
          window.showNotification(`Image "${file.name}" uploaded successfully`, 'success');
        }
      }
    };
    reader.readAsDataURL(file);
  };  const handleAddText = (overlay: Omit<TextOverlay, 'id' | 'position'>): void => {
    // Position text in the center of the preview area
    // The CSS uses transform: translate(-50%, -50%) so these values represent the center point
    const centerPosition = {
      top: 50, // 50% from top (center vertically)
      left: 50, // 50% from left (center horizontally)
    };
    
    const newOverlay: TextOverlay = {
      ...overlay,
      id: Date.now(),
      position: centerPosition,
    };
    setOverlays([...overlays, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
    if (window.showNotification) {
      window.showNotification(`Text "${overlay.text}" added`, 'success');
    }
  };

  const handleSelectOverlay = (id: number): void => {
    setSelectedOverlayId(id);
  };

  const handleUpdateOverlay = (id: number, updates: Partial<TextOverlay>): void => {
    setOverlays((prev) =>
      prev.map((ov) => (ov.id === id ? { ...ov, ...updates } : ov))
    );
  };

  const handleUpdateSelectedText = (updates: Partial<TextOverlay>): void => {
    if (selectedOverlayId) {
      handleUpdateOverlay(selectedOverlayId, updates);
    }
  };

  const handleDeleteSelectedText = (): void => {
    if (selectedOverlayId) {
      const overlay = overlays.find(ov => ov.id === selectedOverlayId);
      setOverlays(overlays.filter((ov) => ov.id !== selectedOverlayId));
      setSelectedOverlayId(null);
      if (window.showNotification && overlay) {
        window.showNotification(`Text "${overlay.text}" deleted`, 'info');
      }
    }
  };

  const handleClearAll = (): void => {
    setOverlays([]);
    setSelectedOverlayId(null);
    if (window.showNotification) {
      window.showNotification('All text cleared', 'info');
    }
  };

  const handleReset = (): void => {
    setOverlays([]);
    setImage(null);
    setSelectedOverlayId(null);
    if (window.showNotification) {
      window.showNotification('Editor reset', 'info');
    }
  };

  const handleExport = (format: string): void => {
    setSelectedOverlayId(null);
    if (window.showNotification) {
      window.showNotification('Starting export...', 'info');
    }
    
    setTimeout(() => {
      if (previewRef.current) {
        html2canvas(previewRef.current, { 
          useCORS: true,
          allowTaint: true,
          backgroundColor: null
        }).then((canvas) => {
          const link = document.createElement('a');
          link.download = `meme.${format}`;
          link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
          link.click();
          if (window.showNotification) {
            window.showNotification(`Meme exported as ${format.toUpperCase()}`, 'success');
          }
        }).catch((error) => {
          console.error('Export failed:', error);
          if (window.showNotification) {
            window.showNotification('Export failed', 'error');
          }
        });
      }
    }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Delete' && selectedOverlayId) {
        handleDeleteSelectedText();
      }
      if (e.key === 'Escape') {
        setSelectedOverlayId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedOverlayId]);

  const selectedOverlay = overlays.find(ov => ov.id === selectedOverlayId);
  return (
    <div className="meme-editor" data-color-scheme="dark">
      <NotificationManager />
      
      <header className="editor-header">
        <h1 className="editor-title">Meme Generator</h1>
        <div className="header-actions">
          <button 
            className="btn btn--primary" 
            onClick={() => handleExport('png')}
          >
            Export Meme
          </button>
        </div>
      </header>

      <div className="editor-content">
        <div
          className="preview-panel"
          ref={previewRef}
          onClick={(e) => {
            if (e.target === previewRef.current || (e.target as Element).closest('.image-container')) {
              setSelectedOverlayId(null);
            }
          }}
        >
          <ImagePreview image={image} onImageUpload={handleImageUpload} />
          <TextOverlays
            overlays={overlays}
            onSelectOverlay={handleSelectOverlay}
            onUpdateOverlay={handleUpdateOverlay}
            selectedOverlayId={selectedOverlayId}
          />
        </div>

        <div className="tools-panel">
          <TextOverlayControls
            onAddText={handleAddText}
            onDeleteText={handleDeleteSelectedText}
            selectedOverlay={selectedOverlay}
            onUpdateSelectedText={handleUpdateSelectedText}
          />
          <QuickActions onClearAll={handleClearAll} onReset={handleReset} />
          <Export onExport={handleExport} />
        </div>
      </div>
    </div>
  );
};

export default MemeEditor;
