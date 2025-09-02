import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import NotFound from '@/views/404.vue'
import Jobs from '@/views/Job.vue'
import Triggers from '@/views/Trigger.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Jobs
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: NotFound,
    component: NotFound
  },
  {
    path: '/hello',
    component: Layout,
    children: [
      {
        path: '',
        component: HelloWorld
      }
    ]
  },
  {
    path: '/jobs',
    component: Layout,
    children: [
      {
        path: '/jobs',
        component: Jobs
      }
    ]
  },
  {
    path: '/triggers',
    component: Layout,
    children: [
      {
        path: '/triggers',
        component: Triggers
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router