import { ShapeFlags } from '../shared';
import { createComponentInstance } from './component'
import {
      hostCreateElement,
      hostSetElementText,
      hostPatchProp,
      hostInsert,
      hostRemove
} from './render-api'
import { queueJob } from './scheduler'
import { effect } from '@vue/reactivity'
import { h } from './h'

export const render = (vnode, container) => {
   console.log('调用 patch')
   patch(null, vnode, container)
};

function patch(n1, n2, container = null) {
    // 基于 n2 的类型来判断
    // 因为 n2 是新的 vnode
    const { type, shapeFlag } = n2
    switch (type) {
          case 'text':
             // TODO
             break;
          // 其中还有几个类型比如： static fragment comment
          
          default:
          // 这里就基于 shapeFlag 来处理
          if (shapeFlag & shapeFlag.ELEMENT) {
            console.log("处理 element")
            processElement(n1, n2, container)
          } else if (shapeFlag & shapeFlag.STATEFUL_COMPONENT) {
            console.log("处理 component")
            processComponent(n1, n2, container)
          }
    }
}

function processElement(n1, n2, container) {
     if (!n1) {
         mountElement(n2, container)  
     } else {
         // todo
         updateElement(n1, n2, container)  
     }
}

function updateElement(n1, n2, container) {
      const oldProps = (n1 && n1.props) || {}
      const newProps = n2.props || {}
      // 应该更新 element
      console.log("应该更新 element")
      console.log("旧的 vnode", n1)
      console.log("新的 vnode", n2)

      // 需要把 el 挂载到新的 vnode
      const el = (n2.el = n1.el)

      // 对比 props
      patchProps(el, oldProps, newProps)

      //对比children
      patchChildren(n1, n2, el)
}

function patchProps(el, oldProps, newProps) {
      // 对比 props 有以下几种情况
      //1. oldProps 有， newProps 也有，但是 val 值变更了
      // 举个栗子
      // 之前：oldProps.id = 1, 更新后：newProps.id = 2

      // key 存在 oldProps 里 也存在 newProps 内
      // 以 newProps 作为基准
      for (const key in newProps) {
            const prevProp = oldProps[key]
            const nextProp = newProps[key]
            if (prevProp !== nextProp) {
                  // 对比属性
                  // 需要交给 host 来更新key
                  hostPatchProp(el, key, prevProp, nextProp)
            }
      }

      // 2. oldProps 有，而 newProps 没有了
      // 之前： {id:1, tId:2}  更新后： {id: 1}
      // 这种情况下我们就应该以 oldProps 作为基准， 因为在 newProps 里面是没有的 tId 的
      // 还需要注意一点，如果这个 key 在 newProps 里面已经存在了 说明已经处理过了 就不要再处理了
      for (const key in oldProps) {
            const prevProp = oldProps[key]
            const nextProp = null
            if (!(key in newProps)) {
                  // 这里以 oldProps 为基准来遍历
                  // 而且得到的值是 newProps 内没有的
                  // 所以交给 host 更新的时候， 把新的值设置为 null
                  hostPatchProp(el, key, prevProp, newProps)
            }
      }
}