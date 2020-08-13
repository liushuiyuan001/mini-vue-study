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
