<template>
  <div class="home">
    <button @click="resetContext">Restart</button>
    <Story
      :content="state.currentStoryContent"
      :story="state.currentStory"
      :scene="currentScene"
      @updateStory="handleUpdateStory"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Story from "@/components/Story.vue";
import defaultStory from "@/assets/test.json";
import store from "@/store/store";

export default {
  name: "StoryView",
  data() {
    return {
      state: store.state,
      currentScene: ""
    };
  },
  async created() {
    // load the scene by name from localStorage
    await store.actions.loadStory(this.$route.params.story);

    this.currentScene =
      this.$route.params.scene || store.state.currentScene || "start";

    await this.addVisitToContext(this.currentScene);
  },
  watch: {
    async $route(to, from) {
      // React on route change

      this.currentScene =
        to.params.scene || store.state.currentScene || "start";

      await this.addVisitToContext(this.currentScene);

      //store.actions.addVisit()
    }
  },
  methods: {
    async handleUpdateStory(newStoryContent) {
      console.log("updateStory");
      await store.actions.updateStory(this.state.currentStory, newStoryContent);
    },
    async addVisitToContext(newScene) {
      // Add a visited__<scene> tag to context with number of visit for this scene
      if (newScene != store.state.currentScene) {
        await store.actions.setCurrentScene(newScene);
        const name = `visited__${newScene}`;
        const currentVisitedCount = store.state.context[name];
        if (currentVisitedCount === undefined) {
          await store.actions.setContext(name, 1);
        } else {
          await store.actions.setContext(name, currentVisitedCount + 1);
        }
      } else {
        console.log("Same scene");
      }
    },
    async resetContext() {
      await store.actions.resetContext();
      this.$router.push({
        name: "homeStory",
        params: { story: store.state.currentStory.uid }
      });
    }
  },
  components: {
    Story
  }
};
</script>
