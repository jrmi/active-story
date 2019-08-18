<template>
  <div class="story">
    <Scene
      v-if="content"
      :content="content[scene]"
      :story="story"
      :scene="scene"
      @updateScene="handleUpdateScene"
    />
  </div>
</template>

<script>
import Scene from "@/components/Scene.vue";
import store from "@/store/store";

export default {
  name: "Story",
  props: {
    content: Object,
    scene: String,
    story: Object
  },
  data() {
    return {};
  },
  components: {
    Scene
  },
  created() {},
  methods: {
    handleUpdateScene(text) {
      const newContent = { ...this.content };
      newContent[this.scene] = text;
      this.$emit("updateStory", newContent);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
