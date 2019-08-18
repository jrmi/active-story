<template>
  <div class="home">
    <Story
      :content="storyContent"
      :currentStory="$route.params.story"
      :currentScene="$route.params.scene"
      @updateStory="handleUpdateStory"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Story from "@/components/Story.vue";
import defaultStory from "@/assets/test.json";

export default {
  name: "StoryView",
  created() {
    // load the scene by name from localStorage or create one.
    let story = JSON.parse(
      localStorage.getItem(`storyContent__${this.$route.params.story}`)
    );

    if (!story) {
      story = defaultStory;
    }
    this.storyContent = story;
  },
  data() {
    return {
      storyContent: {}
    };
  },
  methods: {
    async handleUpdateStory(newStory) {
      console.log("updateStory");
      await store.actions(this.$route.params.story, newStory);
    }
  },
  components: {
    Story
  }
};
</script>
