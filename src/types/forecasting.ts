export type ForecastHorizon = "quarterly" | "annual" | "three_year" | "five_year";

export type ForecastModelType =
  | "linear_trend"
  | "holt_exponential_smoothing"
  | "autoregressive_ar1"
  | "ensemble_weighted";

export interface ForecastPoint {
  period: string; // e.g. "2026", "2027", or "Q1 2026"
  year: number;
  actual?: number;
  predicted: number;
  lowerBound80: number;
  upperBound80: number;
  lowerBound95: number;
  upperBound95: number;
}

export interface ModelEvaluation {
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Squared Error
  mape: number; // Mean Absolute Percentage Error (in %)
  rSquared?: number;
  sampleSize: number;
  validationMethod: "walk_forward_chronological";
  trainPeriods: string;
  testPeriods: string;
}

export interface ForecastResult {
  metric: string;
  metricLabel: string;
  companyTicker: string;
  modelType: ForecastModelType;
  modelName: string;
  horizon: ForecastHorizon;
  historicalData: { period: string; value: number }[];
  forecastPoints: ForecastPoint[];
  evaluation: ModelEvaluation;
  alternativeModelEvaluation?: {
    modelType: ForecastModelType;
    modelName: string;
    evaluation: ModelEvaluation;
  };
  assumptions: string[];
  limitations: string[];
  warningMessage?: string;
  generatedAt: string;
}
