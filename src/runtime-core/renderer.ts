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
   // 因为 n2 是新的vnode
   const { type, shapeFlag } = n2
   switch (type) {
         case 'text':                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
               // TODO
               break
         // 其中还有几个类型比如：static fragment comment
         default:
         // 这里基于shapeFlag 来处理
           if (shapeFlag & ShapeFlags.ELEMENT) {
                 console.log('处理 element')
                 processElement(n1, n2, container)
           } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                 console.log('处理 component')
                 processComponent(n1, n2, container)
           }
   }   
}

function processElement(n1, n2, element) {
      const oldProps = (n1 && n1.props) || {}
      const newProps = n2.props || {}
      // 应该更新 element
      console.log('应该更新 element')
      console.log('旧的 vnode', n1)
      console.log('新的 vnode', n2)

      // 需要把 el 挂载到新的 vnode
      const el = (n2.el = n1.el)

      // 对比 props
      patchProps(el, oldProps, newProps)

      // 对比children
      patchChildren(n1, n2, el)
}

function patchProps(el, oldProps, newProps) {
      // 对比 props 有以下几种情况
      // 1. oldProps 有，newProps 也有，但是 val 值变更了
      // 举个例子
      // 之前：oldProps.id = 1 更新后 newProps.id = 2

      // key 存在 oldProps 里 也存在 newProps 内
      // 以 newProps 作为基准
      for (const key in newProps) {
          const nextProps = newProps[key];
          const prevProps = oldProps[key];
          if (prevProps !== nextProps) {
            // 对比属性
            // 需要交给 host 来更新key
            hostPatchProp(el, key, prevProps, nextProps)
          }        
      }

      //2. oldProps有 而 newProps 没有了
      // 之前：{id: 1,tid: 2} 更新后：{id : 1}
      // 这种情况下我么就应该以 oldProps 作为基准，因为在newProps 里面是没有的 tid 的
      // 还需要注意一点， 如果这个key在newProps 里面已经存在了 说明已经处理过了 就不用再处理了
      for (const key in oldProps) {
           const prevProps = oldProps[key];
           const nextProps = null
           
           if (!(key in newProps)) {
                 // 这里是以 oldProps 为基准来遍历
                 // 而且得到的值是 newProps 内没有的
                 // 所有交给 host 更新的时候， 把新的值设置为 null
                 hostPatchProp(el, key, prevProps, nextProps)
           }
      }
}

function patchChildren(n1, n2, container) {
      const { shapeFlag: prevShapeFlag, children: c1 } = n1;
      const { shapeFlag, children: c2 } = n2;
      
      // 如果 n2 的children 是 text 类型的话
      // 就看看和之前的 n1 的 children 是不是一样的
      // 如果不一样的话直接重新设置一下 text 即可
      if (shapeFlag & ShapeFlags.TESXT_CHILDREN) {
            if (c2 !== c1) {
               console.log('类型为 text——children， 当前需要更新')
               hostSetElementText(container, c2)
            }
      } else {
            // 如果之前是 array_children
            // 现在还是 array_children 的话
            // 那么我们就需要对比两个 children
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
               if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                  patchKeyedChildren(c1, c2, container)
               }
            }
      }
}

function patchKeyedChildren(c1, c2, container) {
      let i = 0;
      let e1 = c1.length - 1 
      let e2 = c2.length - 1

      const isSameVNodeType = (n1, n2) => {
         return n1.type === n2.type && n1.key === n2.key
      }

      while (i <= e1 && i <= e2) {
         const prevChild = c1[i]
         const nextChild = c2[i]

         if (!isSameVNodeType(prevChild, nextChild)) {
               console.log('两个 child 不相等（从左往右比对）')
               console.log(`preChild:${prevChild}`)
               console.log(`nextChild:${nextChild}`)
               break
         }
         console.log('两个 child 相等，接下来对比两个child节点（从右往左对比）')
         patch(prevChild, nextChild, container)
         i++
      }

      if (i <= e1 && i <= e2 ) {
            
      }
}