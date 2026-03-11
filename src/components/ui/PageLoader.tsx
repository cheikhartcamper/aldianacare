import { motion } from 'framer-motion';

interface PageLoaderProps {
  /** fullscreen: fixed overlay (default, for route/auth loading)
   *  inline: centered within its container (for in-page data loading) */
  variant?: 'fullscreen' | 'inline';
  /** Only used when variant='inline'. Controls the size of the spinner. */
  size?: 'sm' | 'md';
  /** Optional label shown below the spinner (inline only) */
  label?: string;
}

export function PageLoader({ variant = 'fullscreen', size = 'md', label }: PageLoaderProps) {
  if (variant === 'inline') {
    const ring = size === 'sm' ? 56 : 80;
    const inner = size === 'sm' ? 40 : 58;
    const bird = size === 'sm' ? 20 : 30;
    const circle = size === 'sm' ? 34 : 48;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-10"
      >
        <div className="relative flex items-center justify-center" style={{ width: ring, height: ring }}>
          {/* Outer gold arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute"
            style={{ width: ring, height: ring }}
          >
            <svg width={ring} height={ring} viewBox={`0 0 ${ring} ${ring}`} fill="none">
              <circle
                cx={ring / 2} cy={ring / 2} r={ring / 2 - 3}
                stroke="#F2C94C"
                strokeWidth={size === 'sm' ? 2 : 2.5}
                strokeLinecap="round"
                strokeDasharray={`${ring * 0.55} ${ring * 2}`}
                strokeOpacity="0.9"
              />
            </svg>
          </motion.div>
          {/* Inner green arc */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            className="absolute"
            style={{ width: inner, height: inner }}
          >
            <svg width={inner} height={inner} viewBox={`0 0 ${inner} ${inner}`} fill="none">
              <circle
                cx={inner / 2} cy={inner / 2} r={inner / 2 - 2.5}
                stroke="#0F5F43"
                strokeWidth={size === 'sm' ? 1.5 : 2}
                strokeLinecap="round"
                strokeDasharray={`${inner * 0.4} ${inner * 2}`}
                strokeOpacity="0.5"
              />
            </svg>
          </motion.div>
          {/* Green circle + bird */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 flex items-center justify-center"
            style={{
              width: circle, height: circle,
              borderRadius: '50%',
              background: '#0F5F43',
              boxShadow: '0 2px 12px rgba(15,95,67,0.3)',
            }}
          >
            <img src="/dove-white.svg" alt="" style={{ width: bird, height: bird }} />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {label && (
            <p className="text-sm text-gray-500 font-medium">{label}</p>
          )}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                style={{ width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6, borderRadius: '50%', backgroundColor: '#F2C94C' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f5faf7 55%, #eaf4ef 100%)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Spinner rings + logo */}
        <div className="relative flex items-center justify-center">

          {/* Outer rotating gold arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute"
            style={{ width: 124, height: 124 }}
          >
            <svg width="124" height="124" viewBox="0 0 124 124" fill="none">
              <circle
                cx="62" cy="62" r="58"
                stroke="#F2C94C"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100 265"
                strokeOpacity="0.9"
              />
            </svg>
          </motion.div>

          {/* Inner rotating green arc */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute"
            style={{ width: 96, height: 96 }}
          >
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              <circle
                cx="48" cy="48" r="44"
                stroke="#0F5F43"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="55 220"
                strokeOpacity="0.6"
              />
            </svg>
          </motion.div>

          {/* Static track ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 124, height: 124,
              border: '1.5px solid rgba(15,95,67,0.12)',
              borderRadius: '50%',
            }}
          />

          {/* Green circle with white bird */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 flex items-center justify-center"
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: '#0F5F43',
              boxShadow: '0 4px 24px rgba(15,95,67,0.35), 0 0 0 4px rgba(15,95,67,0.12)',
            }}
          >
            <img
              src="/dove-white.svg"
              alt="Aldiana Care"
              style={{ width: 42, height: 42 }}
            />
          </motion.div>
        </div>

        {/* Brand name + dots */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-gray-800 font-semibold tracking-tight text-lg">
            Aldiana <span style={{ color: '#0F5F43' }}>Care</span>
          </p>

          {/* Gold bouncing dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: 'easeInOut',
                }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#F2C94C',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
