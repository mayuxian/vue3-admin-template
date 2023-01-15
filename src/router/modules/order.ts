import Layout from '@/layout/index.vue'
export default [
  {
    path: '/order',
    name: 'order',
    component: Layout,
    meta: {
      title: '订单中心',
    },
    // redirect: '/order/list',
    children: [
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/order/List.vue'),
        meta: {
          title: '订单信息',
          devide: true,
        },
      },
    ],
  },
]
