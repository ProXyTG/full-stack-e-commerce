<template>
  <div class="products">
    <h1>Our Products</h1>
    <div class="products-grid">
      <div v-for="product in products" 
           :key="product._id" 
           class="product-card"
           @click="goToProduct(product._id)">
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name">
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p class="price">${{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductsView',
  data() {
    return {
      products: []
    }
  },
  methods: {
    goToProduct(id) {
      this.$router.push(`/products/${id}`)
    }
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5000/api/products')
      this.products = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }
}
</script>

<style scoped>
.products {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* ... rest of your existing styles ... */
</style>