// Component to display and manage saved recipes

import { useState } from 'react';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import RecipeCard from './RecipeCard';
import { LoadingSpinner } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';

interface SavedRecipesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedRecipes({ isOpen, onClose }: SavedRecipesProps) {
  const { 
    savedRecipes, 
    isLoading, 
    removeRecipe, 
    clearAllSavedRecipes,
    exportSavedRecipes,
    importSavedRecipes,
    getSavedRecipeCount
  } = useSavedRecipes();
  
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const data = exportSavedRecipes();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'saved-recipes.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting recipes:', error);
    }
  };

  const handleImport = () => {
    try {
      const success = importSavedRecipes(importData);
      if (success) {
        setShowImportDialog(false);
        setImportData('');
        setImportError('');
      } else {
        setImportError('Invalid recipe data. Please check the format and try again.');
      }
    } catch (error) {
      setImportError('Error importing recipes. Please check the file format.');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#233d4d]/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 animate-fade-in">
      <div className="relative top-16 mx-auto p-4 border w-11/12 max-w-4xl shadow-2xl rounded-3xl bg-white animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#233d4d]">
            Saved Recipes ({getSavedRecipeCount()})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#FE7F2D] transition-all-smooth rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        {savedRecipes.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleExport}
              className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium interactive"
            >
              Export Recipes
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all-smooth text-sm font-medium hover:shadow-md interactive"
            >
              Import Recipes
            </button>
            <button
              onClick={clearAllSavedRecipes}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all-smooth text-sm font-medium hover:shadow-md interactive"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FE7F2D] to-[#E5671F] shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#233d4d] mb-2">
              No saved recipes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start saving your favorite recipes to see them here!
            </p>
            <button
              onClick={onClose}
              className="btn-primary px-6 py-2 rounded-lg font-medium"
            >
              Find Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto custom-scrollbar">
            {savedRecipes.map((recipe, index) => (
              <div key={index} className="relative">
                <RecipeCard
                  recipe={recipe}
                  onSave={() => removeRecipe(recipe.id || recipe.title, recipe.id ? 'id' : 'title')}
                  isSaved={true}
                />
              </div>
            ))}
          </div>
        )}

        {/* Import Dialog */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-[#233d4d]/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center animate-fade-in">
            <div className="relative mx-auto p-6 border w-11/12 max-w-md shadow-xl rounded-2xl bg-white animate-scale-in">
              <h3 className="text-xl font-bold text-[#233d4d] mb-4">
                Import Recipes
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#233d4d] mb-2">
                  Upload JSON file or paste data:
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus outline-none mb-2"
                />
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Or paste your JSON data here..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg input-focus outline-none h-32"
                />
              </div>

              {importError && (
                <ErrorMessage
                  error={importError}
                  variant="inline"
                  showDismiss={false}
                  showRetry={false}
                />
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportData('');
                    setImportError('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all-smooth font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="btn-primary px-4 py-2 rounded-lg font-medium"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}