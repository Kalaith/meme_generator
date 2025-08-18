import React, { useState, useEffect } from 'react';
import { TextOverlayControlsProps, TextOverlay } from '../types';
import CustomDropdown from './CustomDropdown';

const TextOverlayControls: React.FC<TextOverlayControlsProps> = ({ 
  onAddText, 
  onDeleteText, 
  selectedOverlay, 
  onUpdateSelectedText 
}) => {
  const [text, setText] = useState<string>('');
  const [font, setFont] = useState<string>('Impact, Arial Black, sans-serif');
  const [fontSize, setFontSize] = useState<number>(32);
  const [color, setColor] = useState<string>('#ffffff');

  const handleAddText = (): void => {
    if (text.trim()) {
      onAddText({ text, font, fontSize, color });
      setText('');
    }
  };

  const handleTextChange = (newText: string): void => {
    setText(newText);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ text: newText });
    }
  };

  const handleFontChange = (newFont: string): void => {
    setFont(newFont);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ font: newFont });
    }
  };

  const handleFontSizeChange = (newSize: number): void => {
    setFontSize(newSize);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ fontSize: newSize });
    }
  };

  const handleColorChange = (newColor: string): void => {
    setColor(newColor);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ color: newColor });
    }
  };

  useEffect(() => {
    if (selectedOverlay) {
      setText(selectedOverlay.text || '');
      setFont(selectedOverlay.font || 'Impact, Arial Black, sans-serif');
      setFontSize(selectedOverlay.fontSize || 32);
      setColor(selectedOverlay.color || '#ffffff');
    }
  }, [selectedOverlay]);

  return (
    <div className="tool-section">
      <h3 className="tool-title">✨ Text Overlay</h3>
      <button className="btn btn--primary btn--full-width" onClick={handleAddText}>
        Add Text
      </button>
      <div className="text-controls">
        <div className="form-group">
          <label className="form-label">Text Content</label>
          <input
            type="text"
            className="form-control"
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            placeholder="Enter your meme text..."
          />
        </div>        <div className="form-group">
          <label className="form-label">Font Style</label>
          <CustomDropdown
            options={[
              { value: "Impact, Arial Black, sans-serif", label: "Impact (Classic)" },
              { value: "Arial, sans-serif", label: "Arial" },
              { value: "Comic Sans MS, cursive", label: "Comic Sans" },
              { value: "Montserrat, sans-serif", label: "Montserrat" }
            ]}
            value={font}
            onChange={handleFontChange}
            placeholder="Select font style"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Font Size: <span>{fontSize}px</span>
          </label>
          <input
            type="range"
            className="form-control"
            min="16"
            max="72"
            value={fontSize}
            onChange={e => handleFontSizeChange(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Text Color</label>
          <input
            type="color"
            className="form-control"
            value={color}
            onChange={e => handleColorChange(e.target.value)}
          />
        </div>
        {selectedOverlay && (
          <div className="form-group">
            <button className="btn btn--secondary btn--full-width" onClick={onDeleteText}>
              Delete Selected Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextOverlayControls;
