// Enhanced error message component with retry functionality

import React from 'react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'modal' | 'toast';
  showRetry?: boolean;
  showDismiss?: boolean;
}

export function ErrorMessage({ 
  error, 
  onRetry, 
  onDismiss, 
  variant = 'inline',
  showRetry = true,
  showDismiss = true
}: ErrorMessageProps) {
  const getErrorIcon = () => {
    switch (variant) {
      case 'modal':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'toast':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default: // inline
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getErrorSuggestion = (errorMsg: string) => {
    if (errorMsg.includes('API quota exceeded')) {
      return "The recipe service is temporarily busy. Please try again in a few minutes.";
    }
    if (errorMsg.includes('authentication failed')) {
      return "There's a configuration issue. Please contact support if this persists.";
    }
    if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      return "Check your internet connection and try again.";
    }
    if (errorMsg.includes('Ingredients are required')) {
      return "Please enter at least one ingredient to search for recipes.";
    }
    return "Please check your input and try again.";
  };

  const suggestion = getErrorSuggestion(error);

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-[#686963]/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center animate-fade-in">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-scale-in border border-[#E3F2FD]/30">
          <div className="p-6">
            {getErrorIcon()}
            <h3 className="text-lg font-medium text-[#686963] text-center mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-sm text-[#8AA29E] text-center mb-4">
              {error}
            </p>
            <p className="text-sm text-[#8AA29E] text-center mb-6">
              {suggestion}
            </p>
            <div className="flex space-x-3">
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 btn-primary py-2 px-4 rounded-lg font-medium"
                >
                  Try Again
                </button>
              )}
              {showDismiss && onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-1 bg-[#E3F2FD] text-[#686963] py-2 px-4 rounded-lg hover:bg-[#DBE8FC] transition-all-smooth font-medium"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'toast') {
    return (
      <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-xl shadow-lg border border-[#DB5461]/30 p-4 z-50 animate-slide-in">
        <div className="flex items-start">
          {getErrorIcon()}
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-[#DB5461]">
              {error}
            </p>
            <p className="mt-1 text-sm text-[#8AA29E]">
              {suggestion}
            </p>
            {showRetry && onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-sm font-medium text-[#DB5461] hover:text-[#C74552] transition-all-smooth"
              >
                Try again →
              </button>
            )}
          </div>
          {showDismiss && onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-auto flex-shrink-0 flex p-1.5 rounded-md hover:bg-[#E3F2FD] transition-all-smooth"
            >
              <svg className="h-4 w-4 text-[#8AA29E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="rounded-xl bg-[#E3F2FD] border border-[#DB5461]/30 p-4 animate-fade-in">
      <div className="flex">
        {getErrorIcon()}
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-[#DB5461]">
            Error
          </h3>
          <div className="mt-2 text-sm text-[#686963]">
            <p>{error}</p>
            <p className="mt-1 text-[#8AA29E]">{suggestion}</p>
          </div>
          {showRetry && onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="bg-[#DB5461] text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-[#C74552] focus:outline-none focus:ring-2 focus:ring-[#DB5461] focus:ring-offset-2 transition-all-smooth"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
        {showDismiss && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className="inline-flex rounded-md p-1.5 text-[#8AA29E] hover:bg-[#E3F2FD] focus:outline-none focus:ring-2 focus:ring-[#DB5461] focus:ring-offset-2 transition-all-smooth"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for managing error state
export function useError() {
  const [error, setError] = React.useState<string | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const showError = (errorMessage: string) => {
    setError(errorMessage);
    setIsVisible(true);
  };

  const hideError = () => {
    setIsVisible(false);
    // Clear error after animation
    setTimeout(() => setError(null), 300);
  };

  const ErrorComponent = ({ onRetry, variant = 'inline' }: { onRetry?: () => void; variant?: 'inline' | 'modal' | 'toast' }) => {
    if (!error || !isVisible) return null;

    return (
      <ErrorMessage
        error={error}
        onRetry={onRetry}
        onDismiss={hideError}
        variant={variant}
      />
    );
  };

  return {
    showError,
    hideError,
    ErrorComponent,
    hasError: !!error && isVisible
  };
}