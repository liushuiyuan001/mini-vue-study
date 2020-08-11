// 组件的类型
export const enum  ShapeFlags {
      // 最后的要渲染的 element类型
      ELEMENT = 1,
      // 组件类型
      STATEFUL_COMPONENT = 1 << 2,
      // vnode 的 children 为string类型
      TESXT_CHILDREN = 1 << 3,
      // vnode 的 children 为数组类型
      ARRAY_CHILDREN = 1 << 4,
}
