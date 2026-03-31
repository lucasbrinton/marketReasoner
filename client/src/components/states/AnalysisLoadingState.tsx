import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AnalysisLoadingStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  steps?: { icon: LucideIcon; label: string }[];
}

export function AnalysisLoadingState({ icon: Icon, title, subtitle, steps }: AnalysisLoadingStateProps) {
  // Steps variant: rotating icon + sequential animated steps
  if (steps) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        role="status"
        aria-live="polite"
      >
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6"
          >
            <Icon className="w-8 h-8 text-accent" />
          </motion.div>

          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-text-muted mb-8">
            {subtitle}
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.4 }}
                className="flex items-center gap-3 text-left"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ delay: idx * 0.4, duration: 0.5 }}
                >
                  <step.icon className="w-5 h-5 text-accent" />
                </motion.div>
                <span className="text-sm text-text-secondary">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Simple variant: spinner with icon + text + pulsing dots
  return (
    <div className="card" role="status" aria-live="polite">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <Icon className="w-16 h-16 text-accent opacity-20" />
          <Loader2 className="w-8 h-8 text-accent spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mt-6">
          {title}
        </h3>
        <p className="text-sm text-text-secondary mt-2 text-center max-w-md">
          {subtitle}
        </p>

        {/* Progress indicators */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
