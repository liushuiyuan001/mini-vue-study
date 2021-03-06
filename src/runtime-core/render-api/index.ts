// 源码里面这些接口是由 runtime-dom 来实现
// 这里先简单实现
// 后面也修改成和源码一样的实现
export const hostCreateElement = (type) => {
   console.log("hostCreateElement", type);
   const element = document.createElement(type);
   return element   
};

export const hostSetElementText = (el, text) => {
   console.log("hostSetElementText", el, text);
   el.innerText = text   
}

export const hostPatchProp = (el, key, preValue, nextValue) => {
   // preValue 之前的值
   // 为了之后 update 做准备的值
   // nextValue 当前的值
   console.log(`hostPatchProp 设置属性：${key} 值：${nextValue}`)
   console.log(`key: ${key} 之前的值是：${preValue}`)
   
   switch (key) {
         case 'id':
         case 'tid':
           if (nextValue === null || nextValue === undefined) {
                 el.removeAttribute(key)
           } else {
                 el.setAttribute(key, nextValue)
           }
            break;
         case "onclick":
            // todo
            // 先临时实现click 事件
            el.addEventListener("click", nextValue)
            break;     
   }
}

export const hostInsert = (child, parent, anchor = null) => {
    console.log("hostInsert")
    if (anchor) {
       parent.insertBefore(child, anchor)
    } else {
       parent.appendChild(child)
    }  
}

export const hostRemove = (child) => {
    const parent = child.parentNode
    if (parent) {
          parent.removeChild(child)
    }
}