import React, { useState, useMemo, useContext } from 'react';
import type { Filter } from '../types';
import { FILTERS, CATEGORIES } from '../constants';
import { SearchIcon } from './icons/SearchIcon';
import { LocalizationContext } from '../context/LocalizationContext';

interface FilterSelectorProps {
  selectedFilter: Filter | null;
  onSelectFilter: (filter: Filter) => void;
  disabled: boolean;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ selectedFilter, onSelectFilter, disabled }) => {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES.CINEMATIC);
  const [searchTerm, setSearchTerm] = useState('');

  const context = useContext(LocalizationContext);
  if (!context) throw new Error("FilterSelector must be used within a LocalizationProvider");
  const { t } = context;

  const filteredFilters = useMemo(() => {
    return FILTERS.filter(filter => {
      const inCategory = filter.category === activeCategory;
      const matchesSearch = searchTerm === '' || filter.name.toLowerCase().includes(searchTerm.toLowerCase());
      return inCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className={`transition-opacity duration-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
      <p className="text-sm text-gray-400 mb-4">{t('selectStylePrompt')}</p>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.values(CATEGORIES).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              activeCategory === category
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {/* FIX: Removed 'as any' cast as it is no longer necessary with proper typing from constants.ts */}
            {t(`category_${category}`, category)}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Filters Grid */}
      <div className="max-h-64 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFilters.length > 0 ? (
          filteredFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onSelectFilter(filter)}
              disabled={disabled}
              className={`relative aspect-square rounded-lg overflow-hidden focus:outline-none transition-all duration-300 transform hover:scale-105 ${
                selectedFilter?.id === filter.id 
                ? 'ring-4 ring-cyan-500 shadow-lg' 
                : 'ring-2 ring-transparent hover:ring-cyan-600'
              }`}
            >
              <img src={filter.previewImageUrl} alt={filter.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center p-2">
                <span className="text-white text-xs text-center font-bold">{filter.name}</span>
              </div>
               {selectedFilter?.id === filter.id && (
                  <div className="absolute inset-0 bg-cyan-500 bg-opacity-30"></div>
              )}
            </button>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-4">{t('noResults')}</p>
        )}
      </div>
    </div>
  );
};

export default FilterSelector;