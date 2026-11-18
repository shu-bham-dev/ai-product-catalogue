import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rate: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rate,
  count,
  size = 'md',
  showCount = true,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const clampedRate = Math.max(0, Math.min(5, rate));

  return (
    <div className="flex items-center gap-1.5" title={`${rate.toFixed(1)} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(
            0,
            Math.min(100, (clampedRate - (starIndex - 1)) * 100)
          );

          return (
            <div key={starIndex} className="relative">
              {/* Background gray star */}
              <Star className={`${iconSizes[size]} text-slate-200 fill-slate-200`} />
              {/* Filled star with clip */}
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden text-amber-400"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={`${iconSizes[size]} fill-current text-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-xs font-bold text-slate-700 ml-0.5">
        {rate.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-400 font-normal">
          ({count})
        </span>
      )}
    </div>
  );
};
