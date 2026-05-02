export type Lifestyle = 'beach' | 'mountain' | 'urban' | 'slow-life' | 'trekking';
export type WealthRange = 'budget' | 'comfortable' | 'luxury';

export interface UserProfile {
  name: string;
  interests: Lifestyle[];
  wealth: WealthRange;
  internetRequirement: 'minimum' | 'stable' | 'high-speed';
  visaStatus: string;
}

export interface BudgetTier {
  category: 'affordable' | 'luxury';
  estimatedMonthly: string;
  stays: string[];
  lifestyle: string;
}

export interface CountrySuggestion {
  country: string;
  city: string;
  reasoning: string;
  stats: {
    internetSpeed: string;
    costOfLiving: string;
    safetyScore: string;
    visaEase: string;
  };
  budgets: {
    affordable: BudgetTier;
    luxury: BudgetTier;
  };
  logistics: {
    visaProcess: string;
    healthInsurance: string;
    transportInfo: string;
    culture: string[];
    safety: {
      emergencyNumbers: {
        police: string;
        ambulance: string;
      };
      nomadTips: string[];
      precautions: string;
    };
    womenSpecific: {
      safetyTips: string[];
      dressCode: string;
      hygieneProductsAvailability: string;
      soloTravelAdvice: string;
      transportSafety: {
        publicTransport: string;
        rideSharing: string;
        scams: string[];
      };
    };
  };
  recommendations: {
    stays: string[]; // Keep for compatibility or legacy, though we have tiers now
    coworking: string[];
  };
  itinerary: {
    day: number;
    activity: string;
    description: string;
    coordinates?: { lat: number; lng: number };
  }[];
}

export interface NomadUser {
  uid: string;
  name: string;
  interests: Lifestyle[];
  wealth: WealthRange;
  currentCity?: string;
  updatedAt: number;
}

export interface NomadState {
  profile: UserProfile | null;
  suggestions: CountrySuggestion[];
  selectedCountry: CountrySuggestion | null;
  isLoading: boolean;
  networkUsers: NomadUser[];
}
