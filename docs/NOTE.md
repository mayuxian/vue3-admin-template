
## 描述项目的备忘录、说明等内容

- npm包：increase-memory-limit ，可以升级dev模式时V8引擎的内存限制
可再vite.config.ts中添加如下代码，展示获取当前的内存大小
```javascript
const v8 = require('v8')
console.log(v8.getHeapStatistics())
```
- 