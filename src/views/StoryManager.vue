<template>
  <div class="home">
    <ul>
      <li v-for="story in allStories" :key="story.uid">
        <router-link :to="`/story/${story.uid}/start`">{{story.name}}</router-link>
        <button @click="removeStory(story.uid)">x</button>
      </li>
    </ul>
    <form>
      <label>Name</label>
      <input v-model="currentStoryName" />
      <button @click="addStory" :disabled="!currentStoryName">Add</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import Story from "@/components/Story.vue";
import initialStory from "@/assets/test.json";
import { guid } from "@/utils/text";

export default {
  name: "StoryManager",
  data() {
    return {
      allStories: [],
      currentStoryName: ""
    };
  },
  created() {
    this.loadStories();
  },
  methods: {
    loadStories() {
      this.allStories = [];
      for (var key in localStorage) {
        if (key.startsWith("story__")) {
          this.allStories.push(JSON.parse(localStorage[key]));
        }
      }
    },
    addStory() {
      const uid = guid();
      const storyDescriptor = { name: this.currentStoryName, uid };
      const defaultStory = { start: "Start here !!!" };
      localStorage.setItem(`story__${uid}`, JSON.stringify(storyDescriptor));
      localStorage.setItem(
        `storyContent__${uid}`,
        JSON.stringify(defaultStory)
      );
      this.currentStoryName = "";
      this.loadStories();
    },
    removeStory(uid) {
      localStorage.removeItem(`story__${uid}`);
      localStorage.removeItem(`storyContent__${uid}`);
      this.loadStories();
    }
  }
};
</script>
