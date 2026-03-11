import { useState } from 'react';
import { ImageOff, ExternalLink } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUrl';

interface DocImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function DocImage({ src, alt, className = '' }: DocImageProps) {
  const [error, setError] = useState(false);
  const url = getImageUrl(src);

  if (!url) {
    return (
      <div className={`w-full h-36 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 bg-gray-50 ${className}`}>
        <ImageOff size={20} className="text-gray-300" />
        <p className="text-xs text-gray-400">Aucun document</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-36 rounded-xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-2 bg-orange-50/30 p-2 ${className}`}>
        <ImageOff size={18} className="text-orange-300" />
        <p className="text-xs text-orange-500 text-center font-medium">Fichier non accessible</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
        >
          <ExternalLink size={11} />
          Ouvrir le lien direct
        </a>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title="Ouvrir en plein écran">
      <img
        src={url}
        alt={alt}
        className={`w-full h-36 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity cursor-zoom-in ${className}`}
        onError={() => setError(true)}
      />
    </a>
  );
}
