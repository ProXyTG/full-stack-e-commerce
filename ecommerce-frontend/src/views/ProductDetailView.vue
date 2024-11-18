<template>
  <div class="product-detail" v-if="product">
    <div class="product-container">
      <div class="product-image">
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name">
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="description">{{ product.description }}</p>
        <p class="price">${{ product.price }}</p>
        <button class="add-to-cart" @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    Loading...
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductDetailView',
  data() {
    return {
      product: null
    }
  },
  async created() {
    try {
      const id = this.$route.params.id
      const response = await axios.get(`http://localhost:5000/api/products/${id}`)
      this.product = response.data
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  },
  methods: {
    addToCart() {
      this.$store.commit('ADD_TO_CART', this.product)
      // Optional: Show a success message or notification
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  padding: 20px;
}

.product-info h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.add-to-cart {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.add-to-cart:hover {
  background-color: #3aa876;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }
}
</style>