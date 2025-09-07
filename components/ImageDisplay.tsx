import React, { useContext } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import Loader from './Loader';
import { LocalizationContext } from '../context/LocalizationContext';

interface ImageDisplayProps {
  originalImage: string | null;
  transformedImage: string | null;
  isLoading: boolean;
  error: string | null;
  prompt: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalImage,
  transformedImage,
  isLoading,
  error,
  prompt
}) => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error("ImageDisplay must be used within a LocalizationProvider");
  const { t } = context;

  const handleDownload = () => {
    if (transformedImage) {
      const link = document.createElement('a');
      link.href = transformedImage;
      link.download = 'transformed-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCardContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Loader />
          <p className="mt-4 text-lg font-semibold animate-pulse">{t('transforming')}</p>
          <p className="mt-2 text-sm text-gray-400">{t('transformingMessage')}</p>
          {prompt && (
            <div className="mt-4 text-xs text-gray-500 bg-gray-800/50 p-2 rounded-md max-w-sm">
                <p className="break-words"><strong>{t('prompt')}:</strong> {prompt.length > 100 ? `${prompt.substring(0, 100)}...` : prompt}</p>
            </div>
          )}
        </div>
      );
    }

    if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
            <p className="font-bold">{t('errorOccurred')}</p>
            <p className="mt-2 text-sm break-words">{error}</p>
          </div>
        );
    }

    if (transformedImage) {
      return (
        <>
          <img src={transformedImage} alt="Transformed" className="object-contain w-full h-full rounded-lg" />
          <div className="absolute top-2 right-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
              title="Download Image"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
          </div>
        </>
      );
    }
    
    if (originalImage) {
        return <img src={originalImage} alt="Original" className="object-contain w-full h-full rounded-lg" />;
    }

    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500">
        <p>{t('imageWillBeDisplayed')}</p>
      </div>
    );
  };

  return (
    <div className="relative aspect-square w-full bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
      {getCardContent()}
    </div>
  );
};

export default ImageDisplay;