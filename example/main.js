import { createApp } from '../lib/mini-vue.esm.js';
import App from './App.js'

const rootContainer = document.querySelector('#root')
console.log('rootContainer', rootContainer)
console.log('App', App)
console.log('createApp', createApp)
createApp(App).mount(rootContainer)
