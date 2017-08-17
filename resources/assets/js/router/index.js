import Vue from 'vue'
import Router from 'vue-router'
import Menu from '../app/menu/Menu.vue'
import Filter from '../app/filter/Filter.vue'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'filter'
      }
    },
    {
      path: '/filter',
      name: 'filter',
      component: Filter
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu
    },
  ]
})
