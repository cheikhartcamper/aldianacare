interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'color' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 34, text: 'text-[15px]', gap: 'gap-2' },
  md: { icon: 40, text: 'text-lg', gap: 'gap-2.5' },
  lg: { icon: 48, text: 'text-xl', gap: 'gap-3' },
  xl: { icon: 64, text: 'text-3xl', gap: 'gap-3.5' },
};

export function Logo({ size = 'md', variant = 'color', showText = true, className = '' }: LogoProps) {
  const { icon, text, gap } = sizes[size];

  const isWhite = variant === 'white';
  const textMain = isWhite ? 'text-white' : 'text-gray-900';
  const textAccent = isWhite ? 'text-gold' : 'text-primary';
  const imgSrc = isWhite ? '/dove-white.svg' : '/dove.svg';

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <img
        src={imgSrc}
        alt="Aldiana Care"
        className="flex-shrink-0 rounded-lg"
        style={{ width: icon, height: icon }}
      />
      {showText && (
        <span className={`font-semibold tracking-tight ${text} ${textMain}`}>
          Aldiana <span className={textAccent}>Care</span>
        </span>
      )}
    </div>
  );
}
