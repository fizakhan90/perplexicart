// frontend/src/app/data.ts (or frontend/src/data.ts)

import { Star, Leaf, Heart, Shield } from 'lucide-react';
import { type AdviceResponse, type PriorityOption } from '../types'; // Adjust path if types is not in ../types

// Define PriorityOption if it's not already in your types/index.ts
// If it IS in types/index.ts, you don't need to redefine it here, just import it.
// For clarity, if it's not in types/index.ts, it could be:
// export interface PriorityOption {
//   value: string;
//   label: string;
//   icon: LucideIcon;
//   description: string;
// }

export const priorities: PriorityOption[] = [
  {
    value: "best_value",
    label: "Best Value",
    icon: Star,
    description: "Optimal price-to-performance ratio",
  },
  {
    value: "eco_friendly",
    label: "Eco-Friendly",
    icon: Leaf,
    description: "Sustainable and environmentally conscious",
  },
  {
    value: "ethical_brands",
    label: "Ethical Brands",
    icon: Heart,
    description: "Socially responsible companies",
  },
  {
    value: "long-term_durability",
    label: "Durability",
    icon: Shield,
    description: "Built to last with quality materials",
  },
];

export const mockResponse: AdviceResponse = {
  overall_search_summary:
    "This is MOCK DATA. Based on extensive research across multiple platforms, I've identified 3 excellent gaming laptops under $1000 that balance performance, value, and user satisfaction. The market shows strong competition in this segment with solid options from ASUS, Acer, and HP.",
  recommendations: [
    {
      product_name: "MOCK ASUS TUF Gaming F15",
      estimated_price_range: "$800 - $950",
      reasoning_summary:
        "Consistently rated as the best value gaming laptop in this price range with excellent build quality and thermal management.",
      value_alignment_details:
        "Offers exceptional price-to-performance ratio with solid components that won't need upgrading soon.",
      priority_match_analysis:
        "Perfect match for 'best value' priority - delivers premium gaming performance at a competitive price point.",
      pros: [
        "Excellent thermal cooling system (Mock)",
        "Solid build quality with military-grade durability (Mock)",
        "Good battery life for a gaming laptop (Mock)",
        "Upgradeable RAM and storage (Mock)",
      ],
      cons: [
        "Display color accuracy could be better (Mock)",
        "Slightly heavier than competitors (Mock)",
        "Pre-installed bloatware (Mock)",
      ],
      key_specifications: {
        Processor: "Intel Core i5-11400H (Mock)",
        Graphics: "NVIDIA GTX 1650 (Mock)",
        RAM: "8GB DDR4 (Mock)",
        Storage: "512GB SSD (Mock)",
        Display: '15.6" 144Hz IPS (Mock)',
      },
      user_sentiment_summary:
        "Users consistently praise its reliability and cooling performance, with 4.3/5 average rating across platforms. (Mock)",
      cited_sources: [
        {
          title: "MOCK: Best Budget Gaming Laptops 2024 - TechRadar",
          url: "https://techradar.com/best-budget-gaming-laptops",
          snippet: "The ASUS TUF Gaming F15 offers incredible value with its robust cooling system... (Mock)",
        },
        {
          title: "MOCK: Reddit r/GamingLaptops Community Review",
          url: "https://reddit.com/r/GamingLaptops/tuf-f15-review",
          snippet: "Been using this for 8 months, zero issues and handles all modern games... (Mock)",
        },
      ],
    },
    // You could add another mock recommendation if you want
  ],
  tradeoffs_explained:
    "MOCK DATA: While the ASUS TUF offers the best overall value, you'll sacrifice some display quality and portability. If color accuracy is crucial for content creation, consider spending slightly more for an upgraded display model.",
  general_tips: [
    "Always check for student discounts or seasonal sales (Mock)",
    "Consider extended warranty for gaming laptops due to higher component stress (Mock)",
    "Look for models with good upgrade paths for future-proofing (Mock)",
  ],
};