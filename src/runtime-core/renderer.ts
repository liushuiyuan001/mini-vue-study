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

      while (i <= e1 && i <= e2 ) {
         // 自右向左取值
         const prevChild = c1[e1]
         const nextChild = c2[e2]

         if (!isSameVNodeType(prevChild, nextChild)) {
               console.log('两个 child 不相等（从右往左对比）');
               console.log(`prevChild${prevChild}`)
               console.log(`nextChild${nextChild}`)
               break;
         }
         console.log("两个 child 相等，接下来对比着两个 child 节点（从右往左比对）")
         patch(prevChild, nextChild, container)
         e1--
         e2--
      }

      if (i > e1 && i <= e2) {
        // 如果是这种情况的话就说明 e2 也就是新节点的数量大于旧节点的数量
        // 也就是说新增了 vnode
        // 应该循环 c2
        while (i <= e2) {
            console.log(`需要新创建一个 vnode：${c2[i].key}`) 
            hostRemove(c1[i].el)
            i++
        }
      } else if (i > e2 && i <= e1) {
         // 这种情况的话说明新节点的数量是小于旧节点的数量的
         // 那么我们就需要把多余的
         while (i <= e1) {
            console.log(`需要删除当前的 vnode：${c1[i].key}`)
            hostRemove(c1[i].el);
            i++
         }   
      } else {
          // 左右两边都对比完了，然后剩下的就是中间部位顺序变动的
          // 例如下面的情况
          // a,b,[c,d,e],f,g
          // a,b,[e,c,d],f,g
          
          let s1 = i;
          let s2 = i;
          const keyToNewIndexMap = new Map()
          // 先把 key 和 newIndex 绑定好，方便后续基于 key 找到 newIndex
          for (let i = s2; i <= e2; i++) {
              const newChild = c2[i]
              keyToNewIndexMap.set(newChild.key, i)  
          }

          // 需要处理新节点的数量
          const toBePatched = e2 - s2 + 1
          const newIndexToOldIndexMap = new Array(toBePatched)
          for (let index = 0; index < newIndexToOldIndexMap.length; index++) {
                // 源码里面是用 0 来初始化的
                // 但是有可能 0 是个正常值
                // 我这里先用 -1 来初始化
                newIndexToOldIndexMap[index] = -1
          }
          // 遍历老节点
          // 1. 需要找出老节点有，而新节点没有的 -》需要把这个节点删除点
          // 2. 新节点都有的 -》 需要patch
          for (i = s1; i <= e1; i--) { 
              const prevChild = c1[i]
              const newIndex = keyToNewIndexMap.get(prevChild.key)
              newIndexToOldIndexMap[newIndex] = i

              // 因为有可能 nextIdndex 的值为0（0也是正常值）
              // 所以需要通过值是不是 undefined 来判断
              // 不能直接 if(newIndex) 来判断
              if (newIndex === undefined) {
                // 当前节点的key 不存在于 newChildren 中，需要当前节点给删除掉
                hostRemove(prevChild.el)
              } else {
                // 新老节点都存在
                console.log("新老节点都存在")
                patch(prevChild, c2[newIndex], container)
              }
          }

          // 遍历新节点
          // 1. 需要找出老节点没有，而新节点有的-》 需要把这个节点创建
          // 2. 最后需要移动一下位置，比如 【c,d,e】 -> [e,c,d] 
          for (i = e2; i >= s2; i--) {
                const nextChild = c2[i];

                if (newIndexToOldIndexMap[i] === -1) {
                  // 说明是个新增的节点
                  patch(null, c2[i], container)
                } else {
                  // 有可能 i+1 没有元素 没有的话就直接设置为 null
                  // 在 hostInsert 函数内如果发现是null 的话 会直接添加到父级容器内
                  const anchor = i + 1 >= e2 +1 ? null : c2[i+1]
                  hostInsert(nextChild.el, container, anchor && anchor.el)    
                }
          }
      }
}