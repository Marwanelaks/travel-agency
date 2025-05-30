import React from 'react';
import { Card as TremorCard, Text, Metric, Flex, ProgressBar, BadgeDelta, Badge } from '@tremor/react';
import { LineChart as TremorLineChart } from '@tremor/react';
import { BarChart as TremorBarChart } from '@tremor/react';
import { AreaChart as TremorAreaChart } from '@tremor/react';
import { DonutChart as TremorDonutChart } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Simple versions of the chart components that should work with any Tremor version
export function LineChart({
  data,
  index,
  categories,
  title,
}: {
  data: any[];
  index: string;
  categories: string[];
  title?: string;
}) {
  return (
    <Card>
      {title && <Text>{title}</Text>}
      <TremorLineChart
        className="mt-6 h-72"
        data={data}
        index={index}
        categories={categories}
        colors={["blue", "teal", "amber", "rose", "indigo", "green"]}
        yAxisWidth={40}
      />
    </Card>
  );
}

export function BarChart({
  data,
  index,
  categories,
  title,
}: {
  data: any[];
  index: string;
  categories: string[];
  title?: string;
}) {
  return (
    <Card>
      {title && <Text>{title}</Text>}
      <TremorBarChart
        className="mt-6 h-72"
        data={data}
        index={index}
        categories={categories}
        colors={["blue"]}
        yAxisWidth={40}
      />
    </Card>
  );
}

export function AreaChart({
  data,
  index,
  categories,
  title,
}: {
  data: any[];
  index: string;
  categories: string[];
  title?: string;
}) {
  return (
    <Card>
      {title && <Text>{title}</Text>}
      <TremorAreaChart
        className="mt-6 h-72"
        data={data}
        index={index}
        categories={categories}
        colors={["blue"]}
        yAxisWidth={40}
      />
    </Card>
  );
}

export function DonutChart({
  data,
  index,
  category,
  title,
}: {
  data: any[];
  index: string;
  category: string;
  title?: string;
}) {
  return (
    <Card>
      {title && <Text>{title}</Text>}
      <TremorDonutChart
        className="mt-6 h-60"
        data={data}
        index={index}
        category={category}
        colors={["blue", "teal", "amber", "rose", "indigo", "green"]}
      />
    </Card>
  );
}

// Add a simple metric card component as well
export function MetricCard({
  title,
  metric,
  subtext,
  progress,
}: {
  title: string;
  metric: string;
  subtext?: string;
  progress?: number;
}) {
  return (
    <Card>
      <Text>{title}</Text>
      <Metric>{metric}</Metric>
      {subtext && <Text className="mt-2">{subtext}</Text>}
      {progress !== undefined && (
        <ProgressBar value={progress} className="mt-3" />
      )}
    </Card>
  );
}
