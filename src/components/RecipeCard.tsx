import Image from 'next/image';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: {
    id?: number;
    title: string;
    image: string;
    sourceUrl?: string;
    readyInMinutes?: number;
    servings?: number;
    healthScore?: number;
    cheap?: boolean;
    dairyFree?: boolean;
    glutenFree?: boolean;
    ketogenic?: boolean;
    vegan?: boolean;
    vegetarian?: boolean;
    veryHealthy?: boolean;
    veryPopular?: boolean;
    whole30?: boolean;
  };
  onSave?: (recipe: RecipeCardProps['recipe']) => void;
  isSaved?: boolean;
}

export default function RecipeCard({ recipe, onSave, isSaved = false }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    title,
    image,
    sourceUrl,
    readyInMinutes,
    servings,
    healthScore,
    cheap,
    veryHealthy,
    vegan,
    vegetarian,
    glutenFree,
    dairyFree,
    veryPopular
  } = recipe;

  const getDifficultyLevel = () => {
    if (!readyInMinutes) return 'Unknown';
    if (readyInMinutes <= 15) return 'Easy';
    if (readyInMinutes <= 45) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = () => {
    const difficulty = getDifficultyLevel();
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-[#DB5461] bg-orange-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthScoreColor = () => {
    if (!healthScore) return 'text-gray-500';
    if (healthScore >= 80) return 'text-green-600';
    if (healthScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDietaryBadges = () => {
    const badges = [];
    if (vegan) badges.push({ label: 'Vegan', color: 'bg-green-100 text-green-800' });
    if (vegetarian) badges.push({ label: 'Vegetarian', color: 'bg-green-100 text-green-800' });
    if (glutenFree) badges.push({ label: 'Gluten-Free', color: 'bg-blue-100 text-blue-800' });
    if (dairyFree) badges.push({ label: 'Dairy-Free', color: 'bg-orange-100 text-orange-800' });
    return badges;
  };

  const dietaryBadges = getDietaryBadges();

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden card-hover relative group animate-scale-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Save button */}
      {onSave && (
        <button
          onClick={() => onSave(recipe)}
          className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all-smooth hover:scale-110 transform interactive"
          aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          <svg
            className={`w-4 h-4 transition-colors ${isSaved ? 'text-[#DB5461] fill-current' : 'text-gray-400 hover:text-[#DB5461]'}`}
              fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      )}

      {/* Popular badge */}
      {veryPopular && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#DB5461] to-[#C74552] text-white shadow-sm">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Popular
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageError ? '/api/placeholder/400/300' : image}
          alt={title}
          fill
          className={`object-cover transition-all-smooth ${isHovered ? 'scale-105' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
        
        {/* Health score overlay */}
        {healthScore && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
            <span className={`text-xs font-semibold ${getHealthScoreColor()}`}>
              Health: {healthScore}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-700 mb-2 line-clamp-2 group-hover:text-[#DB5461] transition-colors">
          {title}
        </h3>

        {/* Dietary badges */}
        {dietaryBadges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {dietaryBadges.slice(0, 3).map((badge, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
            {dietaryBadges.length > 3 && (
              <span className="text-xs text-gray-700">+{dietaryBadges.length - 3} more</span>
            )}
          </div>
        )}

        {/* Quick info */}
        <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
          <div className="flex items-center space-x-3">
            {readyInMinutes && (
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-1 text-[#DB5461]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readyInMinutes} min
              </div>
            )}

            {servings && (
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {servings} servings
              </div>
            )}
          </div>

          {/* Difficulty badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
            {getDifficultyLevel()}
          </span>
        </div>

        {/* Price indicator */}
        {cheap && (
          <div className="flex items-center text-sm text-green-700 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Budget-friendly
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center text-gray-700 hover:text-white font-medium text-sm bg-[#DB5461]/10 hover:bg-[#DB5461] py-2 px-3 rounded-lg transition-all-smooth"
            >
              View Recipe
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {veryHealthy && (
            <div className="flex items-center text-green-700 text-xs font-medium px-2 py-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Healthy
            </div>
          )}
        </div>
      </div>
    </div>
  );
}