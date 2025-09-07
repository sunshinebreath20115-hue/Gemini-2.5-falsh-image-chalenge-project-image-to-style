import React, { useState, useContext } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import FilterSelector from './components/FilterSelector';
import ImageDisplay from './components/ImageDisplay';
import { Filter } from './types';
import { generatePromptForStyle, applyImageEffect } from './services/geminiService';
import { PhotoIcon } from './components/icons/PhotoIcon';
import Loader from './components/Loader';
import { LocalizationContext } from './context/LocalizationContext';


const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const context = useContext(LocalizationContext);
  if (!context) throw new Error("useLocalization must be used within a LocalizationProvider");
  const { t } = context;

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setTransformedImageUrl(null);
    setError(null);
    setSelectedFilter(null);
  };
  
  const handleSelectFilter = (filter: Filter) => {
    setSelectedFilter(filter);
  };

  const handleApplyFilter = async () => {
    if (!originalImageFile || !selectedFilter) {
      setError("Please upload an image and select a filter first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransformedImageUrl(null);
    setGeneratedPrompt(null);

    try {
      // Step 1: Generate a detailed prompt from the filter's base query
      const detailedPrompt = await generatePromptForStyle(selectedFilter.baseQuery);
      setGeneratedPrompt(detailedPrompt);

      // Step 2: Apply the effect using the detailed prompt and the image
      const result = await applyImageEffect(originalImageFile, detailedPrompt);

      if (result.imageUrl) {
        setTransformedImageUrl(result.imageUrl);
      } else {
        // Handle cases where the image is not returned but text might be (e.g., safety blocks)
        setError(t(result.text || 'error_generationFailed'));
      }
      
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unknown error occurred during image transformation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setTransformedImageUrl(null);
    setSelectedFilter(null);
    setIsLoading(false);
    setError(null);
    setGeneratedPrompt(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 p-6 bg-gray-800/50 rounded-lg shadow-xl border border-gray-700">
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><span className="text-cyan-400 font-bold"></span> {t('step1')}</h2>
              {originalImageUrl ? (
                <div className="relative group">
                    <img src={originalImageUrl} alt="Uploaded preview" className="rounded-lg w-full object-cover max-h-60" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors">
                            {t('removeImage')}
                        </button>
                    </div>
                </div>
              ) : (
                <ImageUploader onImageUpload={handleImageUpload} />
              )}
            </div>
            
            <hr className="border-gray-700" />

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><span className="text-cyan-400 font-bold"></span> {t('step2')}</h2>
              <FilterSelector 
                selectedFilter={selectedFilter}
                onSelectFilter={handleSelectFilter}
                disabled={!originalImageFile || isLoading}
              />
            </div>
            
            <hr className="border-gray-700" />
            
            <div>
              <button
                onClick={handleApplyFilter}
                disabled={!originalImageFile || !selectedFilter || isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader /> <span>{t('transforming')}</span></> : <> <PhotoIcon className="w-5 h-5" /> <span>{t('applyEffect')}</span> </>}
              </button>
            </div>
          </div>

          {/* Right Column: Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-lg shadow-xl border border-gray-700">
             <h2 className="text-xl font-semibold mb-3 text-center w-full"><span className="text-cyan-400 font-bold"></span> {t('step3')}</h2>
            <ImageDisplay 
              originalImage={originalImageUrl}
              transformedImage={transformedImageUrl}
              isLoading={isLoading}
              error={error}
              prompt={generatedPrompt}
            />
          </div>

        </div>
        <footer className="text-center py-8 text-gray-500 text-sm">
            <p>{t('poweredBy')}</p>
        </footer>
      </main>
    </div>
  );
};

export default App;