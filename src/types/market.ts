export type MarketCategory = 'Overview' | 'Indices' | 'Stocks' | 'Crypto' | 'Forex' | 'Futures' | 'Bonds';

export type MoversFilter = 'active' | 'gainers' | 'losers';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  rawVolume: number;
  marketCap?: string;
  technicalRating: TechnicalRating;
  sparkline: number[];
  color: string;
  avatarText?: string;
  exchange?: string;
  country?: string;
  currency?: string;
  high52w?: number;
  low52w?: number;
  peRatio?: number;
  dividendYield?: string;
  sector?: string;
  description?: string;
  lastUpdated?: string;
}

export interface IndexCardData {
  id: string;
  symbol: string;
  name: string;
  badgeNumber: string;
  badgeColor: string;
  exchangeCode: string;
  country: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  isPositive: boolean;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}
