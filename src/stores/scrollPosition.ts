// src/stores/scrollPosition.ts
import { defineStore } from 'pinia';

interface ScrollPositionState {
  scrollPositions: Record<string, number>;
}

export const useScrollPositionStore = defineStore('scrollPosition', {
  state: (): ScrollPositionState => ({
    scrollPositions: {}
  }),
  actions: {
    addScrollPosition(path: string, scrollPosition: number) {
      this.scrollPositions[path] = scrollPosition;
    },
    getScrollPosition(path: string): number | undefined {
      return this.scrollPositions[path];
    },
    clearScrollPositions() {
      this.scrollPositions = {};
    }
  }
});
