// src/components/store/useStore.ts
import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface AppState {
  availableStates: string[];
  selectedState: string;
  setSelectedState: (state: string) => void;
  fetchAvailableStates: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  availableStates: ['Madhya Pradesh'],
  selectedState: 'Madhya Pradesh',
  setSelectedState: (state) => set({ selectedState: state }),
  fetchAvailableStates: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/states`);
      const states = response.data.states;
      const currentState = get().selectedState;
      set({
        availableStates: states,
        selectedState: states.includes(currentState) ? currentState : states[0] || '',
      });
    } catch (error) {
      console.error("Could not fetch list of available states", error);
    }
  },
}));