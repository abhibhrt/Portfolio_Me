'use client';

import { useEffect } from 'react';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

import { useAlert } from '../hooks/useAlert';
import type { AlertType } from '../hooks/useAlert';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface AlertConfig {
  icon: IconType;
  accent: string;
  text: string;
  label: string;
}

type AlertConfigMap = Record<AlertType, AlertConfig>;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const Alert: React.FC = () => {
  const { alert, show, hideAlert } = useAlert();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        hideAlert();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, hideAlert]);

  if (!alert) return null;

  const alertConfig: AlertConfigMap = {
    success: {
      icon: FiCheckCircle,
      accent: 'bg-emerald-500',
      text: 'text-emerald-400',
      label: 'System Confirmed',
    },
    error: {
      icon: FiAlertCircle,
      accent: 'bg-red-500',
      text: 'text-red-400',
      label: 'Clinical Exception',
    },
    warning: {
      icon: FiAlertTriangle,
      accent: 'bg-amber-500',
      text: 'text-amber-400',
      label: 'Attention Required',
    },
    info: {
      icon: FiInfo,
      accent: 'bg-blue-500',
      text: 'text-blue-400',
      label: 'System Update',
    },
  };

  const config = alertConfig[alert.type] ?? alertConfig.info;
  const IconComponent = config.icon;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${show ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}
        `}
      >
        <div className="bg-slate-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden">
          {/* Status Bar */}
          <div className={`h-1 w-full ${config.accent}`} />

          <div className="p-4 flex items-start space-x-4">
            <div className={`mt-0.5 ${config.text}`}>
              <IconComponent size={18} />
            </div>

            <div className="flex-1">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                {config.label}
              </div>
              <p className="text-xs font-medium text-slate-200 leading-relaxed">
                {alert.message}
              </p>
            </div>

            <button
              onClick={hideAlert}
              className="text-slate-500 hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label="Dismiss alert"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;