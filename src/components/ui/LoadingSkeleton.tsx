// Loading skeleton components for better UX during data fetching

export function RecipeCardSkeleton() {
  return (
    <div className="glass rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-200 card-hover">
      <div className="h-52 loading-shimmer"></div>
      <div className="p-6">
        <div className="h-7 loading-shimmer rounded-lg mb-3 w-full"></div>
        <div className="h-5 loading-shimmer rounded-lg mb-4 w-4/5"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 loading-shimmer rounded-lg w-20"></div>
          <div className="h-4 loading-shimmer rounded-lg w-24"></div>
        </div>
        <div className="h-10 loading-shimmer rounded-xl w-full"></div>
      </div>
    </div>
  );
}

export function AIRecommendationSkeleton() {
  return (
    <section className="glass rounded-2xl p-8 mb-12 border border-[#DB5461]/20 backdrop-blur-sm animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 loading-shimmer rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-7 loading-shimmer rounded-lg mb-3 w-64"></div>
          <div className="space-y-3">
            <div className="h-5 loading-shimmer rounded-lg w-full"></div>
            <div className="h-5 loading-shimmer rounded-lg w-11/12"></div>
            <div className="h-5 loading-shimmer rounded-lg w-10/12"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-[#DB5461] ${sizeClasses[size]} ${className}`}></div>
  );
}

interface FullPageLoadingProps {
  message?: string;
}

export function FullPageLoading({ message = 'Searching for perfect recipes...' }: FullPageLoadingProps) {
  return (
    <div className="glass rounded-2xl p-12 mb-8 border border-[#DB5461]/20 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <LoadingSpinner size="lg" className="mb-6" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#DB5461]/20 to-transparent scale-150 animate-pulse-slow"></div>
        </div>
        <p className="text-[#686963] text-xl font-semibold mb-8">{message}</p>
        <div className="w-full max-w-2xl space-y-4">
          <div className="glass rounded-xl p-4 flex items-center space-x-4 border border-[#E3F2FD]/50">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-[#686963] font-medium">Finding recipes that match your ingredients...</span>
          </div>
          <div className="glass rounded-xl p-4 flex items-center space-x-4 border border-[#E3F2FD]/50">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-[#686963] font-medium">Analyzing flavor combinations...</span>
          </div>
          <div className="glass rounded-xl p-4 flex items-center space-x-4 border border-[#E3F2FD]/50">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-[#686963] font-medium">Generating personalized recommendations...</span>
          </div>
        </div>
      </div>
    </div>
  );
}