"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { FinancialMetric } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";

interface CashFlowChartProps {
  history: FinancialMetric[];
}

export function CashFlowChart({ history }: CashFlowChartProps) {
  const chartData = history.map((m) => ({
    year: `FY${m.year}`,
    operatingCashFlow: m.operatingCashFlow,
    capitalExpenditures: -m.capitalExpenditures,
    freeCashFlow: m.freeCashFlow,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Cash Flow Generation & CapEx</CardTitle>
          <CardDescription>
            Operating Cash Flow conversion, Capital Expenditures, and Net Free Cash Flow ($B)
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `$${val}B`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(val: any, name: any) => [`$${Math.abs(val)}B`, name]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />
              <Bar
                dataKey="operatingCashFlow"
                name="Operating Cash Flow"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="capitalExpenditures"
                name="Capital Expenditures (CapEx)"
                fill="#EF4444"
                radius={[0, 0, 4, 4]}
                barSize={20}
              />
              <Bar
                dataKey="freeCashFlow"
                name="Free Cash Flow"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
