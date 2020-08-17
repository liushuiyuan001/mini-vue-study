import { ShapeFlags } from '../shared';

export const createVNode = function (
  type: any,
  props: any = {},
  children?: string | Array<any>
) {
  // 注意 type 有可能是string 也有可能是对象
  // 如果是对象的话 那么就是用户设置的 options
  // type为string的时候
  // createVNode('div')
  // type 为组件对象的时候
  // createVNode(App)
  const vnode = {
      el: null,
      component: null,
      key: props.key || null,
      type,
      props,
      children,
      shapeFlag: getShapeFlags(type)
  }

  // 基于 children 再次设置shapeFlag
  if (Array.isArray(children)){
        vnode.shapeFlag  |= ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TESXT_CHILDREN
  }

  return vnode
};


function getShapeFlags(type: any) {
      return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}