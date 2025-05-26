import {  LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface Source {
  title?: string | null;
  url: string;
  snippet?: string | null;
}

export interface ProductInsight {
  product_name: string;
  reasoning_summary: string;
  value_alignment_details: string;
  pros: string[];
  cons: string[];
  priority_match_analysis: string;
  key_specifications?: Record<string, string> | null; 
  estimated_price_range?: string | null;
  user_sentiment_summary?: string | null;
  cited_sources: Source[];
}

export interface AdviceResponse {
  recommendations: ProductInsight[];
  overall_search_summary: string;
  tradeoffs_explained?: string | null;
  general_tips?: string[] | null;
}

export interface QueryRequest {
  query: string;
  priority: string;
  user_context?: string | null;
}

export interface PriorityOption { 
  value: string;
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  description: string;
}