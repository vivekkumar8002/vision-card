import axios from 'axios';

async function run() {
  try {
    console.log('creating user');
    const signup = await axios.post('http://localhost:5000/api/users/signup', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    console.log('signup response', signup.data);
  } catch (e) {
    console.error('signup error', e.response?.status, e.response?.data || e.toString());
  }

  try {
    console.log('logging in');
    const login = await axios.post('http://localhost:5000/api/users/login', {
      email: 'testuser@example.com',
      password: 'password123',
    });
    console.log('login response', login.data);
  } catch (e) {
    console.error('login error', e.response?.status, e.response?.data || e.toString());
  }
}

run();
