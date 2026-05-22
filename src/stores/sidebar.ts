import { defineStore } from 'pinia';
interface SidebarState {
  selected: string;
  isSidebarOpen: boolean;
  page: string;
}
export const useSidebarStore = defineStore('sidebar', {
  state: (): SidebarState => ({
    selected: '',
    isSidebarOpen: false,
    page: ''
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    setSelected(selected: string) {
      this.selected = selected;
    },
    setPage(page: string) {
      this.page = page;
    },
    reset() {
      this.selected = '';
      this.isSidebarOpen = false;
      this.page = '';
    }
  }
});
