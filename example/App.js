import { h, ref, reactive } from '../lib/mini-vue.esm.js';
import NextTicker from './compoents/NextTicker.js';
import HelloWorld from './compoents/HelloWorld.js'
import PatchChildren from './compoents/PatchChildren.js'

console.log('h', h)
export default {
      name: 'App',
      setup() {},

      render() {
           return h("div", { tId: 1},[
               h("p", {}, "主页"),
               h(PatchChildren)  
           ]) 
      }
}