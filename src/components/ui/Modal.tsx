import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
