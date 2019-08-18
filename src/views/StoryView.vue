<template>
  <div class="home">
    <Story
      :content="state.currentStoryContent"
      :story="state.currentStory"
      :scene="$route.params.scene"
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
      state: store.state
    };
  },
  async created() {
    // load the scene by name from localStorage
    await store.actions.loadStory(this.$route.params.story);
    console.log("pouet", store.state.currentStory);
  },
  methods: {
    async handleUpdateStory(newStoryContent) {
      console.log("updateStory");
      await store.actions.updateStory(this.state.currentStory, newStoryContent);
    }
  },
  components: {
    Story
  }
};
</script>
