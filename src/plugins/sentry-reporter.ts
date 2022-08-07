import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import * as SentryIntegration from '@sentry/integrations'

import pkg from '@/../package.json'
import router from '@/router/index'

export default {
  install: (app: any, options: object) => {
    return //TODO:需要时，则删除return
    const isDev = import.meta.env.VITE_APP_ENV === 'dev'
    if (isDev) return //dev环境不上报。测试环境和生产环境上报。
    Sentry.init({
      Vue: app,
      dsn: '', //TODO:添加sentry的dsn
      integrations: [
        new Integrations.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          // tracingOrigins: ['localhost', /^\//],
        }),
        new SentryIntegration.Vue({
          Vue: app,
          attachProps: true,
          // tracing: false,
        }),
      ],
      debug: false,
      release: `${pkg.name}@${pkg?.version}`,
      environment:
        import.meta.env.VITE_APP_ENV || import.meta.env.VITE_APP_BASE_ENV,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    })
  },
}
