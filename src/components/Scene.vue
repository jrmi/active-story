<template>
  <div class="scene">
    <div v-if="!editMode">
      <div v-if="content" v-html="parse(content)"></div>
      <p v-if="!content">Empty scene…</p>
      <button @click="edit()">Edit</button>
    </div>
    <div v-if="editMode">
      <textarea v-model="currentContent" />
      <div v-if="preview" v-html="parse(currentContent)"></div>
      <button @click="save()">Save</button>
      <button @click="preview = !preview">Preview</button>
      <button @click="editMode=false">Cancel</button>
    </div>
  </div>
</template>

<script>
import { removeDiacritics, parseScene } from "@/utils/text";
import store from "@/store/store";

export default {
  name: "Scene",
  props: {
    content: String,
    scene: String,
    story: Object,
    updateScene: Function
  },
  data() {
    return {
      editMode: false,
      preview: false,
      render: null,
      currentContent: ""
    };
  },
  async created() {},
  methods: {
    parse(text) {
      if (this.content) {
        return parseScene(
          text,
          this.story.uid,
          store.state.currentStoryContent,
          store.state.context
        );
      } else {
        return "";
      }
    },
    edit() {
      this.currentContent = this.content;
      this.editMode = true;
    },
    save() {
      this.editMode = false;
      this.$emit("updateScene", this.currentContent);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
