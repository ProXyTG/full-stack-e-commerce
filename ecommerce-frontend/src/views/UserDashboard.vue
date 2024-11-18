<template>
  <div class="user-dashboard">
    <header class="dashboard-header">
      <h1>User Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ user.username }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </header>

    <div class="dashboard-content">
      <div class="profile-section">
        <h2>My Profile</h2>
        <div class="profile-details">
          <div class="detail-item">
            <label>Username:</label>
            <span>{{ user.username }}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>
          <div class="detail-item">
            <label>Role:</label>
            <span>{{ user.role }}</span>
          </div>
        </div>
        <button @click="showEditProfile = true" class="edit-profile-btn">
          Edit Profile
        </button>
      </div>

      <!-- Edit Profile Modal -->
      <div v-if="showEditProfile" class="modal">
        <div class="modal-content">
          <h3>Edit Profile</h3>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label>Username</label>
              <input v-model="editForm.username" type="text" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="editForm.email" type="email" required>
            </div>
            <div class="form-group">
              <label>New Password (optional)</label>
              <input v-model="editForm.password" type="password">
            </div>
            <div class="modal-buttons">
              <button type="submit" class="save-btn">Save Changes</button>
              <button type="button" @click="showEditProfile = false" class="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserDashboard',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      showEditProfile: false,
      editForm: {
        username: '',
        email: '',
        password: ''
      }
    }
  },
  created() {
    this.editForm.username = this.user.username;
    this.editForm.email = this.user.email;
  },
  methods: {
    async updateProfile() {
      try {
        const response = await axios.put(`http://localhost:5000/api/users/profile`, this.editForm);
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        this.showEditProfile = false;
        // Show success message
      } catch (error) {
        console.error('Error updating profile:', error);
        // Show error message
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
.user-dashboard {
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

.profile-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-details {
  margin: 20px 0;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item label {
  font-weight: bold;
  margin-right: 10px;
  min-width: 100px;
  display: inline-block;
}

.edit-profile-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>