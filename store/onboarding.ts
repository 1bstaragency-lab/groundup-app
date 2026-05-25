import { create } from 'zustand';

interface OnboardingState {
  blocks: string[];
  frustrations: string[];
  wishes: string[];
  artistName: string;
  genre: string;
  careerStage: string;
  goals: string[];
  platforms: string[];
  contentComfort: string;
  releaseTimeline: string;
  selectedTier: string;
  setBlocks: (blocks: string[]) => void;
  setFrustrations: (frustrations: string[]) => void;
  setWishes: (wishes: string[]) => void;
  setArtistName: (name: string) => void;
  setGenre: (genre: string) => void;
  setCareerStage: (stage: string) => void;
  setGoals: (goals: string[]) => void;
  setPlatforms: (platforms: string[]) => void;
  setContentComfort: (comfort: string) => void;
  setReleaseTimeline: (timeline: string) => void;
  setSelectedTier: (tier: string) => void;
  getRecommendedTier: () => string;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  blocks: [],
  frustrations: [],
  wishes: [],
  artistName: '',
  genre: '',
  careerStage: '',
  goals: [],
  platforms: [],
  contentComfort: '',
  releaseTimeline: '',
  selectedTier: '',
  setBlocks: (blocks) => set({ blocks }),
  setFrustrations: (frustrations) => set({ frustrations }),
  setWishes: (wishes) => set({ wishes }),
  setArtistName: (artistName) => set({ artistName }),
  setGenre: (genre) => set({ genre }),
  setCareerStage: (careerStage) => set({ careerStage }),
  setGoals: (goals) => set({ goals }),
  setPlatforms: (platforms) => set({ platforms }),
  setContentComfort: (contentComfort) => set({ contentComfort }),
  setReleaseTimeline: (releaseTimeline) => set({ releaseTimeline }),
  setSelectedTier: (selectedTier) => set({ selectedTier }),
  getRecommendedTier: () => {
    const state = get();
    if (state.wishes.includes('Release manager') || state.wishes.includes('Content team')) {
      return 'Plant';
    }
    if (state.careerStage === 'Breaking Out') {
      return 'Breakout';
    }
    if (state.careerStage === 'Growing') {
      return 'Growth';
    }
    return 'Foundation';
  },
}));
