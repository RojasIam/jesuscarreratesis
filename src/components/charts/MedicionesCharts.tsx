'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import '@/lib/echarts-setup';
import {
  buildHorizontalBarOption,
  buildPieOption,
  buildVerticalBarOption,
} from '@/lib/chart-3d-options';

function ChartCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg bg-gradient-to-b from-gray-50 to-white text-sm text-gray-500 dark:from-white/[0.02] dark:to-transparent dark:text-gray-400">
      {message}
    </div>
  );
}

function ChartCanvas({
  option,
  height = 280,
}: {
  option: Record<string, unknown>;
  height?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ height }}>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}

export function EstadoPieChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const option = useMemo(() => buildPieOption(data, true), [data]);

  if (data.length === 0) {
    return <ChartEmpty message="Sin datos" />;
  }

  return <ChartCanvas option={option} />;
}

export function DiaBarChart({
  data,
}: {
  data: { day: string; count: number }[];
}) {
  const hasData = data.some((d) => d.count > 0);
  const option = useMemo(
    () => buildVerticalBarOption(
      data.map((d) => d.day),
      data.map((d) => d.count),
    ),
    [data],
  );

  if (!hasData) {
    return <ChartEmpty message="Sin datos" />;
  }

  return <ChartCanvas option={option} />;
}

export function RankingBarChart({
  data,
  variant = 'indigo',
  emptyMessage,
}: {
  data: { name: string; value: number }[];
  variant?: 'indigo' | 'violet';
  emptyMessage: string;
}) {
  const height = Math.max(240, data.length * 44 + 48);
  const option = useMemo(
    () => buildHorizontalBarOption(
      data.map((d) => d.name),
      data.map((d) => d.value),
      variant,
    ),
    [data, variant],
  );

  if (data.length === 0) {
    return <ChartEmpty message={emptyMessage} />;
  }

  return <ChartCanvas option={option} height={height} />;
}

export function BandaPieChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const option = useMemo(() => buildPieOption(data, false), [data]);

  if (data.length === 0) {
    return <ChartEmpty message="Sin datos" />;
  }

  return <ChartCanvas option={option} />;
}

export { ChartCard };
