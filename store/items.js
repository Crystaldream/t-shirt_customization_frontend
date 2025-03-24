import { defineStore } from 'pinia';

export const useItemStore = defineStore('items', {
  state: () => ({
    items: [],
  }),
  actions: {
    async fetchItems() {
      const response = await fetch('http://localhost:5047/api/items');
      this.items = await response.json();
    },
  },
});