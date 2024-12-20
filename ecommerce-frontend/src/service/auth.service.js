import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

class AuthService {
  async login(email, password) {
    const response = await axios.post(API_URL + 'login', {
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();