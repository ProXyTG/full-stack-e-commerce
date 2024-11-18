import axios from 'axios'
import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: []
  },
  mutations: {
    ADD_TO_CART(state, product) {
      const existingItem = state.cart.find(item => item._id === product._id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        state.cart.push({ ...product, quantity: 1 })
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item._id !== productId)
    },
    UPDATE_QUANTITY(state, { productId, quantity }) {
      const item = state.cart.find(item => item._id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    CLEAR_CART(state) {
      state.cart = []
    }
  },
  actions: {
    async checkout({ state, commit }) {
      try {
        const orderData = {
          items: state.cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totalAmount: state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
        }

        await axios.post('http://localhost:5000/api/orders', orderData)
        commit('CLEAR_CART')
        return { success: true }
      } catch (error) {
        console.error('Checkout error:', error)
        return { success: false, error: 'Failed to process order' }
      }
    }
  },
  getters: {
    cartItems: state => state.cart,
    cartTotal: state => {
      return state.cart.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    }
  }
})