import Layout from '@/layout/index.vue'
export default [
  {
    path: '/order',
    name: 'order',
    authKey: 'order_center',
    component: Layout,
    meta: {
      icon: 'component',
      title: '订单中心',
    },
    // redirect: '/order/list',
    children: [
      {
        path: 'list',
        name: 'orderList',
        authKey: 'order_list',
        component: () => import('@/views/order/List.vue'),
        meta: {
          icon: 'list',
          title: '订单信息',
          devide: true,
        },
      },
    ],
  },
]
