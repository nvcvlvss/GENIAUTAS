import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  animating?: boolean;
};

// animations-disabled-fallback
// Fallback to static border transitions if animating is false or system prefers reduced motion.
const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'var(--color-primary)',
  speed = '6s',
  thickness = 1,
  animating = false, // non-animating by default as per interface-design skill
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style
      }}
    >
      <div
        className={`absolute w-[300%] h-[50%] opacity-50 bottom-[-11px] right-[-250%] rounded-full z-0 transition-all ${
          animating ? 'animate-star-movement-bottom' : ''
        }`}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className={`absolute w-[300%] h-[50%] opacity-50 top-[-10px] left-[-250%] rounded-full z-0 transition-all ${
          animating ? 'animate-star-movement-top' : ''
        }`}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="relative z-1 bg-[#1b2a44]/40 backdrop-blur-xl border border-white/10 text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px]">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
