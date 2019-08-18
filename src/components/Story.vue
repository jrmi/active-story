<template>
  <div class="story">
    <Scene
      :content="currentContent[currentScene]"
      :currentStory="currentStory"
      :currentScene="currentScene"
      @updateScene="handleUpdateScene"
    />
  </div>
</template>

<script>
import Scene from "@/components/Scene.vue";

export default {
  name: "Story",
  props: {
    content: Object,
    currentScene: String,
    currentStory: String
  },
  data() {
    return {
      currentContent: {}
    };
  },
  components: {
    Scene
  },
  created() {
    this.currentContent = this.content;
  },
  methods: {
    handleUpdateScene(text) {
      const newContent = { ...this.currentContent };
      newContent[this.currentScene] = text;
      this.currentContent = newContent;
      this.$emit("updateStory", newContent);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
