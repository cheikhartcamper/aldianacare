import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  onClose?: () => void;
}

const styles = {
  success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: CheckCircle },
  warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
  danger: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: AlertCircle },
  info: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: Info },
};

export function Alert({ children, variant = 'info', title, onClose }: AlertProps) {
  const { bg, text, icon: Icon } = styles[variant];
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${text}`} />
        <div className="flex-1">
          {title && <h4 className={`text-sm font-semibold mb-1 ${text}`}>{title}</h4>}
          <p className={`text-sm ${text}`}>{children}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className={`flex-shrink-0 ${text} hover:opacity-70`}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
