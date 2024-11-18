<template>
  <div class="cart">
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length" class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item._id" class="cart-item">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name">
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-price">${{ item.price }}</p>
            <p class="item-subtotal">Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
          <div class="quantity-controls">
            <button @click="updateQuantity(item._id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item._id, item.quantity + 1)">+</button>
          </div>
          <button class="remove-btn" @click="removeFromCart(item._id)">Remove</button>
        </div>
      </div>
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-details">
          <div class="summary-row">
            <span>Items ({{ cartItems.length }}):</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>
        <button 
          class="checkout-btn" 
          @click="handleCheckout"
          :disabled="isProcessing"
        >
          {{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}
        </button>
      </div>
    </div>
    <div v-else class="empty-cart">
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any items to your cart yet.</p>
      <router-link to="/products" class="continue-shopping">Continue Shopping</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CartView',
  data() {
    return {
      isProcessing: false
    }
  },
  computed: {
    ...mapGetters(['cartItems', 'cartTotal'])
  },
  methods: {
    updateQuantity(productId, quantity) {
      if (quantity >= 1) {
        this.$store.commit('UPDATE_QUANTITY', { productId, quantity })
      }
    },
    removeFromCart(productId) {
      this.$store.commit('REMOVE_FROM_CART', productId)
    },
    async handleCheckout() {
      if (this.cartItems.length === 0) return;
      
      this.isProcessing = true;
      try {
        const result = await this.$store.dispatch('checkout');
        if (result.success) {
          alert('Order placed successfully!');
          this.$router.push('/products');
        } else {
          alert(result.error || 'Failed to place order');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('An error occurred during checkout');
      } finally {
        this.isProcessing = false;
      }
    }
  }
}
</script>

<style scoped>
.cart {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cart-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.item-price {
  font-size: 1.1em;
  color: #2c3e50;
  margin: 5px 0;
}

.item-subtotal {
  color: #666;
  font-size: 0.9em;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #f5f5f5;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls span {
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  padding: 8px 16px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background: #ff1111;
}

.cart-summary {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: fit-content;
}

.cart-summary h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.summary-details {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.summary-row.total {
  border-top: 2px solid #ddd;
  border-bottom: none;
  margin-top: 10px;
  padding-top: 15px;
  font-weight: bold;
  font-size: 1.2em;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #3aa876;
}

.checkout-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-cart h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 20px;
}

.continue-shopping {
  display: inline-block;
  padding: 12px 24px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.continue-shopping:hover {
  background: #3aa876;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 100px 1fr;
    grid-template-rows: auto auto;
  }

  .quantity-controls {
    grid-column: 2;
    justify-content: flex-start;
  }

  .remove-btn {
    grid-column: 2;
    justify-self: flex-start;
  }
}
</style>