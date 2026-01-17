/**
 * Risk Loading State
 * 
 * Animated loading display while analyzing risk profile
 */

import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertTriangle, Scale, Clock } from 'lucide-react';

const steps = [
  { icon: Shield, label: 'Analyzing risk tolerance...' },
  { icon: TrendingUp, label: 'Calculating exposure bands...' },
  { icon: AlertTriangle, label: 'Setting risk limits...' },
  { icon: Scale, label: 'Building rebalancing logic...' },
  { icon: Clock, label: 'Defining time horizons...' }
];

export function RiskLoadingState() {
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
          <Shield className="w-8 h-8 text-accent" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Building Your Risk Framework
        </h3>
        <p className="text-sm text-text-muted mb-8">
          Creating a personalized risk management plan...
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
