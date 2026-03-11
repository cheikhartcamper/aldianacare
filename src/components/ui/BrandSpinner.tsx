import { motion } from 'framer-motion';

interface BrandSpinnerProps {
  size?: number;
}

export function BrandSpinner({ size = 16 }: BrandSpinnerProps) {
  const r1 = size / 2 - 2;
  const r2 = size / 2 - size * 0.28;
  const dash1 = r1 * Math.PI * 0.55;
  const dash2 = r2 * Math.PI * 0.5;

  return (
    <span className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{ position: 'absolute' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={size / 2} cy={size / 2} r={r1}
          stroke="#F2C94C"
          strokeWidth={size <= 14 ? 1.8 : 2}
          strokeLinecap="round"
          strokeDasharray={`${dash1} ${r1 * Math.PI * 2}`}
        />
      </motion.svg>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{ position: 'absolute' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={size / 2} cy={size / 2} r={r2}
          stroke="#0F5F43"
          strokeWidth={size <= 14 ? 1.5 : 1.8}
          strokeLinecap="round"
          strokeDasharray={`${dash2} ${r2 * Math.PI * 2}`}
          strokeOpacity={0.7}
        />
      </motion.svg>
    </span>
  );
}
