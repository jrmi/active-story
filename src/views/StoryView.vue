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
    handleUpdateStory(newStory) {
      console.log("updateStory");
      this.storyContent = newStory;
      localStorage.setItem(
        `storyContent__${this.$route.params.story}`,
        JSON.stringify(newStory)
      );
    }
  },
  components: {
    Story
  }
};
</script>
