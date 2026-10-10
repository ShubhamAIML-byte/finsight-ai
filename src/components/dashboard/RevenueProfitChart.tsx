"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { FinancialMetric } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";

interface RevenueProfitChartProps {
  history: FinancialMetric[];
  companyName: string;
}

export function RevenueProfitChart({ history, companyName }: RevenueProfitChartProps) {
  const chartData = history.map((m) => ({
    year: `FY${m.year}`,
    revenue: m.revenue,
    grossProfit: m.grossProfit,
    netIncome: m.netIncome,
    operatingMargin: m.operatingMargin,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Revenue & Profitability Trajectory</CardTitle>
          <CardDescription>
            Historical multi-year top-line performance vs net earnings and operating margins for {companyName}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `$${val}B`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => {
                  if (name === "Operating Margin") return [`${value}%`, name];
                  return [`$${value}B`, name];
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Revenue"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                yAxisId="left"
                dataKey="netIncome"
                name="Net Income"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="operatingMargin"
                name="Operating Margin"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#8B5CF6" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
