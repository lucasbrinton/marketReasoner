/**
 * Financial Health Card
 */

import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketAnalysis } from '../../types';

interface FinancialHealthCardProps {
  data: MarketAnalysis['financial_health'];
}

export function FinancialHealthCard({ data }: FinancialHealthCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Financial Health</h3>
      </div>
      
      <p className="text-text-secondary mb-4">{data.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Strengths</span>
          </div>
          <ul className="space-y-2">
            {data.strengths.map((strength, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-success mt-0.5">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Weaknesses */}
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Weaknesses</span>
          </div>
          <ul className="space-y-2">
            {data.weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
