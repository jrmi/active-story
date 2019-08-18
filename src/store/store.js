import VueReactiveStore from 'vue-reactive-store';
import { guid } from '@/utils/text';

const store = {
  name: 'globalStore',
  state: {
    context: {},
    allStories: []
  },
  actions: {
    async initContext() {
      store.context = {};
    },

    async loadStories() {
      const allStories = [];
      for (var key in localStorage) {
        if (key.startsWith('story__')) {
          allStories.push(JSON.parse(localStorage[key]));
        }
      }
      store.state.allStories = allStories;
      console.log(allStories);
    },

    async addStory(storyName) {
      const uid = guid();
      const storyDescriptor = { name: storyName, uid };
      const defaultStory = { start: 'Start here !!!' };
      localStorage.setItem(`story__${uid}`, JSON.stringify(storyDescriptor));
      localStorage.setItem(
        `storyContent__${uid}`,
        JSON.stringify(defaultStory)
      );
      this.loadStories();
    },

    async updateStory(uid, content) {
      localStorage.setItem(`storyContent__${uid}`, JSON.stringify(content));
    },

    async removeStory(uid) {
      localStorage.removeItem(`story__${uid}`);
      localStorage.removeItem(`storyContent__${uid}`);
      this.loadStories();
    }
  },
  plugins: [
    {
      actions: {
        after(storeName, actionName, storeState) {
          console.log(
            `action ${actionName} is finished, this is my store : `,
            storeState
          );
        }
      }
    }
  ]
};

const reactiveStore = new VueReactiveStore(store);

export default reactiveStore;
