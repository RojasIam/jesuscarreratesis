import type { EChartsOption } from '@/lib/echarts-setup';
import { echarts } from '@/lib/echarts-setup';
import { CHART_VIVID } from '@/lib/chart-colors';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

export function adjustColor(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const factor = amount / 100;
  if (factor >= 0) {
    return toHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
  }
  const f = 1 + factor;
  return toHex(r * f, g * f, b * f);
}

function vividBarGradient(horizontal = true) {
  return new echarts.graphic.LinearGradient(
    0,
    0,
    horizontal ? 1 : 0,
    horizontal ? 0 : 1,
    [
      { offset: 0, color: CHART_VIVID.indigo },
      { offset: 0.5, color: CHART_VIVID.blue },
      { offset: 1, color: CHART_VIVID.sky },
    ],
  );
}

function vividSegmentGradient(from: string, to: string, horizontal = true) {
  return new echarts.graphic.LinearGradient(
    0,
    0,
    horizontal ? 1 : 0,
    horizontal ? 0 : 1,
    [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  );
}

const baseTooltip = {
  backgroundColor: 'rgba(255,255,255,0.98)',
  borderColor: '#e0e7ff',
  borderWidth: 1,
  padding: [10, 14],
  textStyle: { color: '#1e293b', fontSize: 13 },
  extraCssText: 'box-shadow: 0 4px 16px rgba(79,70,229,0.1); border-radius: 12px;',
};

export function buildPieOption(
  data: { name: string; value: number; color: string }[],
  donut = true,
): EChartsOption {
  const mainData = data.map((item) => ({
    name: item.name,
    value: item.value,
    itemStyle: {
      color: vividSegmentGradient(item.color, adjustColor(item.color, 28), true),
      borderRadius: 8,
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  }));

  const radius = donut ? ['42%', '72%'] : ['0%', '68%'];

  return {
    animationDuration: 800,
    animationEasing: 'cubicOut',
    color: data.map((d) => d.color),
    tooltip: {
      ...baseTooltip,
      trigger: 'item',
      formatter: (p) => {
        const params = p as { name: string; value: number; percent?: number };
        return `<strong style="color:${CHART_VIVID.indigo}">${params.name}</strong><br/>${params.value} medición${params.value !== 1 ? 'es' : ''} (${params.percent ?? 0}%)`;
      },
    },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#475569', fontSize: 12, fontWeight: 500 },
    },
    series: [
      {
        type: 'pie',
        radius,
        center: ['50%', '50%'],
        padAngle: 3,
        emphasis: {
          scale: true,
          scaleSize: 8,
        },
        label: {
          color: '#1e293b',
          fontSize: 12,
          fontWeight: 600,
          formatter: '{b}\n{d}%',
        },
        data: mainData,
      },
    ],
  };
}

export function buildVerticalBarOption(
  labels: string[],
  values: number[],
): EChartsOption {
  return {
    animationDuration: 800,
    animationEasing: 'cubicOut',
    grid: { left: 8, right: 8, top: 20, bottom: 8, containLabel: true },
    tooltip: {
      ...baseTooltip,
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#c7d2fe', width: 1 } },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params];
        const main = items[0];
        if (!main) return '';
        return `<strong>Día ${main.name}</strong><br/>${main.value} medición${Number(main.value) !== 1 ? 'es' : ''}`;
      },
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11, interval: 'auto' },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#eef2ff', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Mediciones',
        type: 'bar',
        barWidth: '48%',
        itemStyle: {
          color: vividBarGradient(false),
          borderRadius: [10, 10, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          color: CHART_VIVID.blue,
          fontWeight: 700,
          fontSize: 11,
          formatter: (p) => (Number(p.value) > 0 ? String(p.value) : ''),
        },
        data: values,
      },
    ],
  };
}

export function buildHorizontalBarOption(
  labels: string[],
  values: number[],
  variant: 'indigo' | 'violet' = 'indigo',
): EChartsOption {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const gradient =
    variant === 'violet'
      ? vividSegmentGradient(CHART_VIVID.violet, CHART_VIVID.sky, true)
      : vividBarGradient(true);

  return {
    animationDuration: 800,
    animationEasing: 'cubicOut',
    grid: { left: 8, right: 28, top: 8, bottom: 8, containLabel: true },
    tooltip: {
      ...baseTooltip,
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#c7d2fe', width: 1 } },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params];
        const main = items[0];
        if (!main) return '';
        const pct = ((Number(main.value) / total) * 100).toFixed(1);
        return `<strong>${main.name}</strong><br/>${main.value} · ${pct}%`;
      },
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#eef2ff', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#334155', fontSize: 12, fontWeight: 500, width: 120, overflow: 'truncate' },
    },
    series: [
      {
        name: 'Mediciones',
        type: 'bar',
        barWidth: 18,
        itemStyle: {
          color: gradient,
          borderRadius: [0, 100, 100, 0],
        },
        label: {
          show: true,
          position: 'insideRight',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: 12,
          formatter: (p) => {
            const v = Number(p.value);
            if (v <= 0) return '';
            const pct = ((v / total) * 100).toFixed(1);
            return `${pct}%`;
          },
        },
        data: values,
      },
    ],
  };
}

/** @deprecated usar buildPieOption */
export const build3DPieOption = buildPieOption;
/** @deprecated usar buildVerticalBarOption */
export const build3DVerticalBarOption = buildVerticalBarOption;
/** @deprecated usar buildHorizontalBarOption */
export const build3DHorizontalBarOption = buildHorizontalBarOption;
