import { PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RiskProfile } from '../../types';
import { AnalysisCard } from '../shared';

interface ExposureBandsCardProps {
  data: RiskProfile['exposure_bands'];
}

function parsePercentageRange(range: string): number {
  const match = range.match(/(\d+)(?:-(\d+))?%?/);
  if (match) {
    const low = parseInt(match[1], 10);
    const high = match[2] ? parseInt(match[2], 10) : low;
    return (low + high) / 2;
  }
  return 0;
}

const ASSET_COLORS: Record<string, string> = {
  Equities: '#2563EB',
  'Fixed Income': '#059669',
  Alternatives: '#D97706',
  Cash: '#6B7280',
};

export function ExposureBandsCard({ data }: ExposureBandsCardProps) {
  const chartData = [
    { name: 'Equities', value: parsePercentageRange(data.equities), range: data.equities },
    { name: 'Fixed Income', value: parsePercentageRange(data.fixed_income), range: data.fixed_income },
    { name: 'Alternatives', value: parsePercentageRange(data.alternatives), range: data.alternatives },
    { name: 'Cash', value: parsePercentageRange(data.cash), range: data.cash },
  ];

  return (
    <AnalysisCard icon={PieChart} title="Target Exposure Bands">
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip
              formatter={(_value, _name, props) => [(props.payload as { range: string }).range, 'Range']}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={ASSET_COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ASSET_COLORS[item.name] }}
            />
            <div className="text-sm">
              <span className="text-text-muted">{item.name}:</span>
              <span className="text-text-primary font-medium ml-1">{item.range}</span>
            </div>
          </div>
        ))}
      </div>
    </AnalysisCard>
  );
}
