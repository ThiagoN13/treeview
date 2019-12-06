/* eslint-disable */
/**
 * Adicionar dinamicamente todos so componentes desta pasta
 */
import Vue from 'vue'

const files = require.context('.', true, /\.vue$/)

files.keys().forEach(key => {
  if (key === './index.js') return
  const module = files(key).default
  if (!module.name) {
    return console.warn(`O componente nao foi inicializado. Propriedade "name" do componente nao foi configurado.`)
  }

  Vue.component(module.name, module)
})
