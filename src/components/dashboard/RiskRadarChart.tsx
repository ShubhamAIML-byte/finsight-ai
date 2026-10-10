"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";

interface RiskRadarChartProps {
  companyTicker: string;
}

export function RiskRadarChart({ companyTicker }: RiskRadarChartProps) {
  const riskScores = [
    { subject: "Tariff Exposure", score: 68, fullMark: 100 },
    { subject: "FX Volatility", score: 54, fullMark: 100 },
    { subject: "Supply Chain", score: 72, fullMark: 100 },
    { subject: "Regulatory / BIS", score: 81, fullMark: 100 },
    { subject: "Cost Inflation", score: 45, fullMark: 100 },
    { subject: "Demand Elasticity", score: 38, fullMark: 100 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Risk Vulnerability Radar</CardTitle>
          <CardDescription>
            Multi-dimensional risk exposure across external geopolitical, operational, and macroeconomic vectors
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2 flex items-center justify-center">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={riskScores}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 9 }} />
              <Radar
                name={`${companyTicker} Exposure`}
                dataKey="score"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`${val}/100`, "Vulnerability Index"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
