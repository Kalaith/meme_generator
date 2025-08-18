import React, { useRef, useState } from "react";

interface ImagePreviewProps {
  image: string | null;
  onImageUpload: (file: File) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      onImageUpload(files[0]);
    }
  };
  return (
    <div className="image-container">
      {!image ? (
        <div 
          className={`upload-area ${isDragOver ? 'dragover' : ''}`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <h3>Upload Your Image</h3>
            <p>Drag & drop or click to select</p>
            <p className="upload-hint">JPG, PNG, GIF, WebP</p>
          </div>
        </div>
      ) : (
        <img 
          id="imagePlayer" 
          src={image} 
          alt="Uploaded meme" 
          style={{ width: "100%", height: "100%", objectFit: "contain" }} 
        />
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImagePreview;
