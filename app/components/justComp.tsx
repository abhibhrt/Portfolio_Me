import React from 'react';

const LoadingAnimation = () => {
  const letters = ['|', '|','|', '|','|', '|','|', '|','|', '|','|', '|'];

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[300px] sm:w-[600px] h-[36px] overflow-visible select-none">
        {letters.map((letter, index) => (
          <div
            key={index}
            className="absolute w-[20px] h-[36px] opacity-0 text-[#35C4F0] font-sans font-bold text-3xl animate-letter-move"
            style={{
              animationDelay: `${index * 0.2}s`,
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;