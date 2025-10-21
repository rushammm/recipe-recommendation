interface AIRecommendationProps {
  suggestion: string;
}

export default function AIRecommendation({ suggestion }: AIRecommendationProps) {
  return (
    <section className="bg-gradient-to-r from-[#FE7F2D]/8 to-[#233d4d]/6 rounded-xl p-6 mb-8 border border-[#FE7F2D]/20 backdrop-blur-sm animate-scale-in interactive">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FE7F2D] to-[#E5671F] rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#686963] mb-3">
            AI Chef&apos;s Recommendation
          </h3>
          <p className="text-[#374151] leading-relaxed">
            {suggestion}
          </p>
        </div>
      </div>
    </section>
  );
}