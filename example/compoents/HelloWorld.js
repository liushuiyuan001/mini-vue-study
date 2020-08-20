import { h, ref} from '../../lib/mini-vue.esm.js';

// 临时模拟使用refs
// 后面需要支持在啊setip 内导出
// 然后在 render 内导出
// 这需要实现 proxy

window.count = ref(1)
export default {
      name: 'HelloWorld',
      setup() {},
      render() {
         return h('div', {tid: 'HelloWorld'}, `hello world: count: ${window.count.value}`)
      }
}
