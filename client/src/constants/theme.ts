import { TrendingUp, Newspaper, Shield, Lightbulb, Search, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ConfidenceLevel } from '../types';

export type { ConfidenceLevel };
export type ModuleType = 'stock' | 'news' | 'risk' | 'strategy' | 'screener' | 'daily';

export interface ModuleColorConfig {
  bg: string;
  text: string;
  border: string;
  solid: string;
}

export const MODULE_COLORS: Record<ModuleType, ModuleColorConfig> = {
  stock: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    solid: 'bg-blue-600',
  },
  news: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    solid: 'bg-purple-600',
  },
  risk: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    solid: 'bg-green-600',
  },
  strategy: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    solid: 'bg-amber-600',
  },
  screener: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800',
    solid: 'bg-cyan-600',
  },
  daily: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800',
    solid: 'bg-pink-600',
  },
};

export const MODULE_ICONS: Record<ModuleType, LucideIcon> = {
  stock: TrendingUp,
  news: Newspaper,
  risk: Shield,
  strategy: Lightbulb,
  screener: Search,
  daily: Brain,
};

export const MODULE_LABELS: Record<ModuleType, string> = {
  stock: 'Stock',
  news: 'News',
  risk: 'Risk',
  strategy: 'Strategy',
  screener: 'Screener',
  daily: 'Daily',
};

export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const PASS_FAIL_COLORS = {
  pass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  fail: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
} as const;

export interface ConfidenceConfig {
  title: string;
  descriptions: Record<ConfidenceLevel, string>;
}

export const CONFIDENCE_CONFIGS: Record<ModuleType, ConfidenceConfig> = {
  stock: {
    title: 'Analysis Confidence',
    descriptions: {
      high: 'Analysis based on comprehensive data',
      medium: 'Some data limitations noted',
      low: 'Significant data gaps present',
    },
  },
  news: {
    title: 'Analysis Confidence',
    descriptions: {
      high: 'Analysis based on clear, verifiable information',
      medium: 'Some ambiguity in the news source',
      low: 'Significant uncertainties present',
    },
  },
  risk: {
    title: 'Framework Confidence',
    descriptions: {
      high: 'Framework based on clear risk parameters',
      medium: 'Some profile factors require clarification',
      low: 'Consider providing more details',
    },
  },
  strategy: {
    title: 'Simulation Confidence',
    descriptions: {
      high: 'Well-understood strategy dynamics',
      medium: 'Some aspects require more analysis',
      low: 'Significant uncertainties present',
    },
  },
  screener: {
    title: 'Screening Confidence',
    descriptions: {
      high: 'Sufficient data for thorough analysis',
      medium: 'Some data limitations exist',
      low: 'Limited data available',
    },
  },
  daily: {
    title: 'Routine Overview',
    descriptions: {
      high: 'Well-tested routine structure',
      medium: 'Solid routine with some customization needed',
      low: 'Experimental routine - iterate as needed',
    },
  },
};
