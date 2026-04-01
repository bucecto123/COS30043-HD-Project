// frontend/src/store/index.js
import { createStore } from 'vuex'
import auth from './auth'
import products from './products'

export default createStore({
  modules: {
    auth,
    products
  }
})
