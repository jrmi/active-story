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
  created() {
    this.addVisitToContext();
  },
  watch: {
    $route(to, from) {
      this.addVisitToContext();
      console.log(to, from);
      //store.actions.addVisit()
    }
  },
  methods: {
    async addVisitToContext() {
      const currentVisitedCount = store.state.context[`visited__${this.scene}`];
      if (currentVisitedCount === undefined) {
        await store.actions.setContext(`visited__${this.scene}`, 1);
      } else {
        await store.actions.setContext(
          `visited__${this.scene}`,
          currentVisitedCount + 1
        );
      }
    },
    parse(text) {
      console.log("parse called");
      if (this.story) {
        console.log("Real render");
        const renderer = new marked.Renderer();
        const old_rend = new marked.Renderer();
        renderer.link = (href, title, text) => {
          if (href.indexOf("http") != 0) {
            const escapedLink = removeDiacritics(href.toLowerCase()).replace(
              /[^\w]+/g,
              "-"
            );
            return `<a href="#/story/${
              this.story.uid
            }/${escapedLink}" title="${title}">${text}</a>`;
          } else {
            return old_rend.link(href, title, text);
          }
        };
        this.renderer = renderer;
        return marked(text || "", { renderer: this.renderer });
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
