/**
 * Strategy Loading State
 */

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertTriangle, Brain, HelpCircle } from 'lucide-react';

const steps = [
  { icon: Lightbulb, label: 'Analyzing strategy type...' },
  { icon: TrendingUp, label: 'Simulating market regimes...' },
  { icon: AlertTriangle, label: 'Identifying failure modes...' },
  { icon: Brain, label: 'Detecting emotional traps...' },
  { icon: HelpCircle, label: 'Cataloging unknowns...' }
];

export function StrategyLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6"
        >
          <Lightbulb className="w-8 h-8 text-accent" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Simulating Strategy with AI
        </h3>
        <p className="text-sm text-text-muted mb-8">
          Analyzing behavior, risks, and uncertainties... (8-15s)
        </p>

        <div className="space-y-3 max-w-xs mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.5 }}
              className="flex items-center gap-3 text-left"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: idx * 0.5, duration: 0.5 }}
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
