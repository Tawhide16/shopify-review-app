import React from 'react';

export default function StarRating({
  rating = 5,
  max = 5,
  size = 16,
  color = '#F59E0B',
  emptyColor = '#E5E7EB',
  interactive = false,
  onChange
}) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const activeRating = hoverRating || rating;

  return (
    <div 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '2px', 
        cursor: interactive ? 'pointer' : 'default' 
      }}
      onMouseLeave={() => interactive && setHoverRating(0)}
    >
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = activeRating >= starValue;

        return (
          <span
            key={i}
            onClick={() => interactive && onChange && onChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            style={{
              fontSize: `${size}px`,
              lineHeight: 1,
              color: isFilled ? color : emptyColor,
              transition: 'transform 0.1s ease, color 0.1s ease',
              transform: interactive && hoverRating >= starValue ? 'scale(1.15)' : 'none',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
