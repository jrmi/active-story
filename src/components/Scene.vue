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
import marked from "marked";
import { removeDiacritics } from "@/utils/text";
import store from "@/store/store";

export default {
  name: "Scene",
  props: {
    content: String,
    currentScene: String,
    currentStory: String,
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
  watch: {
    $route(to, from) {
      this.addVisitToContext();
    }
  },
  created() {
    const renderer = new marked.Renderer();
    const old_rend = new marked.Renderer();
    renderer.link = (href, title, text) => {
      if (href.indexOf("http") != 0) {
        const escapedLink = removeDiacritics(href.toLowerCase()).replace(
          /[^\w]+/g,
          "-"
        );
        return `<a href="#/story/${
          this.currentStory
        }/${escapedLink}" title="${title}">${text}</a>`;
      } else {
        return old_rend.link(href, title, text);
      }
    };
    this.renderer = renderer;
    this.addVisitToContext();
  },
  methods: {
    addVisitToContext() {
      const newContext = { ...store.context };
      if (newContext[`visited__${this.currentScene}`] === undefined) {
        newContext[`visited__${this.currentScene}`] = 1;
      } else {
        newContext[`visited__${this.currentScene}`] += 1;
      }
      store.context = newContext;
    },
    parse(text) {
      return marked(text || "", { renderer: this.renderer });
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
