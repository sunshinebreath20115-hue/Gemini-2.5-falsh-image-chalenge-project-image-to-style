import React, { useRef, useState, useCallback, useContext } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { LocalizationContext } from '../context/LocalizationContext';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const context = useContext(LocalizationContext);
  if (!context) throw new Error("ImageUploader must be used within a LocalizationProvider");
  const { t } = context;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-500 hover:bg-gray-700/30'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="flex flex-col items-center justify-center text-gray-400">
        <PhotoIcon className="w-12 h-12 mb-4" />
        <p className="font-semibold">{t('imageUploader')}</p>
        <p className="text-sm text-gray-500">{t('imageFormats')}</p>
      </div>
    </div>
  );
};

export default ImageUploader;