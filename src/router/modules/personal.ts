import Layout from '@/layout/index.vue'
export default [
  {
    path: '/personal',
    name: 'personal',
    component: Layout,
    meta: {
      title: '个人中心',
    },
    redirect: '/personal/info',
    children: [
      {
        path: '/personal/info',
        name: 'personalInfo',
        component: () => import('@/views/personal/Detail.vue'),
        meta: {
          title: '个人信息',
        },
      },
    ],
  },
]
