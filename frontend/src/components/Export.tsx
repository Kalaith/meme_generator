import React, { useState } from 'react';
import { ExportProps, ExportFormat } from '../types';
import CustomDropdown from './CustomDropdown';

const Export: React.FC<ExportProps> = ({ onExport }) => {
  const [format, setFormat] = useState<ExportFormat>('png');

  const handleExport = (): void => {
    onExport(format);
  };

  return (
    <div className="tool-section">
      <h3 className="tool-title">💾 Export</h3>      <div className="form-group">
        <label className="form-label">Format</label>
        <CustomDropdown
          options={[
            { value: "png", label: "PNG" },
            { value: "jpeg", label: "JPG" },
            { value: "webp", label: "WebP" }
          ]}
          value={format}
          onChange={(value) => setFormat(value as ExportFormat)}
          placeholder="Select format"
          className="form-control"
        />
      </div>
      <button className="btn btn--primary btn--full-width" onClick={handleExport}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download Meme
      </button>
    </div>
  );
};

export default Export;
