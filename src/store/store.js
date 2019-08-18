import VueReactiveStore from 'vue-reactive-store';
import { guid } from '@/utils/text';
import Vue from 'vue';

const store = {
  name: 'globalStore',
  state: {
    context: {},
    allStories: [],
    history: [],
    currentStory: {},
    currentStoryContent: {}
  },
  actions: {
    async initContext() {
      store.context = {};
    },

    async loadStories() {
      store.state.allStories.splice(0);
      for (var key in localStorage) {
        if (key.startsWith('story__')) {
          store.state.allStories.push(JSON.parse(localStorage[key]));
        }
      }
    },

    async addStory(storyName) {
      const uid = guid();
      const story = { name: storyName, uid };
      const defaultStory = { start: 'Start here !!!' };
      localStorage.setItem(`story__${uid}`, JSON.stringify(story));
      localStorage.setItem(
        `storyContent__${uid}`,
        JSON.stringify(defaultStory)
      );
      this.loadStories();
    },

    async loadStory(uid) {
      store.state.currentStory = JSON.parse(
        localStorage.getItem(`story__${uid}`)
      );
      store.state.currentStoryContent = JSON.parse(
        localStorage.getItem(`storyContent__${uid}`)
      );
      console.log('story loaded', store.state.currentStory);
      console.log('story loaded bis', store.state.currentStoryContent);
    },

    async updateStory(story, content) {
      localStorage.setItem(`story__${story.uid}`, JSON.stringify(story));
      localStorage.setItem(
        `storyContent__${story.uid}`,
        JSON.stringify(content)
      );
      await store.actions.loadStory();
      //store.state.currentStory = story;
      //store.state.currentStoryContent = content;
    },

    async removeStory(uid) {
      localStorage.removeItem(`story__${uid}`);
      localStorage.removeItem(`storyContent__${uid}`);
      this.loadStories();
    },

    async setContext(key, value) {
      store.state.context[key] = value;
    },

    async addVisit(scene) {
      store.state.history.push(scene);
    },
    async popVisit() {
      return store.state.history.pop();
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
