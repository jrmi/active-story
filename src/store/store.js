import VueReactiveStore from 'vue-reactive-store';
import { guid } from '@/utils/text';
import Vue from 'vue';

const store = {
  name: 'globalStore',
  state: {
    context: {},
    allStories: [],
    history: [],
    currentScene: '',
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
      await store.actions.loadStories();
    },

    async loadStory(uid) {
      store.state.currentStory = JSON.parse(
        localStorage.getItem(`story__${uid}`)
      );
      store.state.currentStoryContent = JSON.parse(
        localStorage.getItem(`storyContent__${uid}`)
      );
      const { context = {}, scene = 'start' } = JSON.parse(
        localStorage.getItem(`storyContext__${uid}`)
      );

      store.state.context = context;
      store.state.currentScene = scene;
    },

    async updateStory(story, content) {
      localStorage.setItem(`story__${story.uid}`, JSON.stringify(story));
      localStorage.setItem(
        `storyContent__${story.uid}`,
        JSON.stringify(content)
      );
      store.state.currentStory = story;
      store.state.currentStoryContent = content;
    },

    async removeStory(uid) {
      localStorage.removeItem(`story__${uid}`);
      localStorage.removeItem(`storyContent__${uid}`);
      await store.actions.loadStories();
    },

    async setContext(key, value) {
      const { context, currentScene, currentStory } = store.state;

      localStorage.setItem(
        `storyContext__${currentStory.uid}`,
        JSON.stringify({ context, scene: currentScene })
      );

      const newContext = { ...store.state.context };
      newContext[key] = value;

      store.state.context = newContext;
    },

    async resetContext() {
      store.state.context = {};
      store.state.currentScene = 'start';
      localStorage.setItem(
        `storyContext__${store.state.currentStory.uid}`,
        JSON.stringify({
          context: store.state.context,
          scene: store.state.currentScene
        })
      );
    },

    async setCurrentScene(scene) {
      const { context, currentStory } = store.state;
      store.state.currentScene = scene;
      localStorage.setItem(
        `storyContext__${currentStory.uid}`,
        JSON.stringify({ context, scene })
      );
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
          console.log(`action ${actionName} is finished`);
        }
      }
    }
  ]
};

const reactiveStore = new VueReactiveStore(store);

export default reactiveStore;
