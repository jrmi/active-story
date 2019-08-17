import Vue from 'vue';
import Router from 'vue-router';
import StoryManager from './views/StoryManager.vue';
import StoryView from './views/StoryView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: StoryManager
    },
    {
      path: '/story/:story/:scene',
      name: 'story',
      component: StoryView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
