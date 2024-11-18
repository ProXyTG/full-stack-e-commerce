<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ user.username }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </header>

    <div class="dashboard-content">
      <div class="stats-cards">
        <div class="card">
          <h3>Total Orders</h3>
          <p>{{ totalOrders }}</p>
        </div>
        <div class="card">
          <h3>Total Revenue</h3>
          <p>${{ totalRevenue.toFixed(2) }}</p>
        </div>
      </div>

      <div class="orders-table">
        <h2>Orders Management</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>{{ order._id.slice(-6) }}</td>
              <td>
                <ul class="items-list">
                  <li v-for="item in order.items" :key="item.productId">
                    {{ item.name }} (x{{ item.quantity }})
                  </li>
                </ul>
              </td>
              <td>${{ order.totalAmount.toFixed(2) }}</td>
              <td>
                <select 
                  v-model="order.status" 
                  @change="updateOrderStatus(order)"
                  :class="order.status"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td>
                <button @click="deleteOrder(order._id)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      orders: [],
      totalOrders: 0,
      totalRevenue: 0
    }
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: false
        });
        this.orders = response.data;
        this.totalOrders = this.orders.length;
        this.totalRevenue = this.orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + order.totalAmount, 0);
      } catch (error) {
        console.error('Error fetching orders:', error.response || error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    async updateOrderStatus(order) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:5000/api/orders/${order._id}`, 
          { status: order.status },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        await this.fetchOrders();
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    },
    async deleteOrder(orderId) {
      if (confirm('Are you sure you want to delete this order?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          await this.fetchOrders();
        } catch (error) {
          console.error('Error deleting order:', error);
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.orders-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.items-list li {
  margin-bottom: 4px;
}

select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

select.pending {
  background-color: #ffc107;
}

select.completed {
  background-color: #28a745;
  color: white;
}

select.cancelled {
  background-color: #dc3545;
  color: white;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>