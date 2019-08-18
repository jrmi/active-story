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
import store from "@/store/store";

export default {
  name: "StoryManager",
  data() {
    return {
      allStories: store.state.allStories,
      currentStoryName: ""
    };
  },
  async created() {
    await store.actions.loadStories();
    console.log(store.state.allStories);
  },
  methods: {
    async addStory() {
      await store.actions.addStory(this.currentStoryName);
      this.currentStoryName = "";
    },
    async removeStory(uid) {
      await store.actions.removeStory(uid);
    }
  }
};
</script>
