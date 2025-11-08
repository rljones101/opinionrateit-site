const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000
});

async function testValidSignup() {
  console.log('✅ Testing Valid Signup (after rate limit reset)...\n');
  
  try {
    const response = await api.post('/users/signup', {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123!',
      passwordConfirm: 'SecurePassword123!',
      role: 'user'
    });
    
    if (response.status === 201) {
      console.log('✅ PASSED: Valid signup successful');
      console.log('   User created:', response.data.data.user.name);
      console.log('   User email:', response.data.data.user.email);
      
      // Check if cookies are set
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const jwtCookie = cookies.find(cookie => cookie.includes('jwt='));
        const refreshCookie = cookies.find(cookie => cookie.includes('refreshToken='));
        
        if (jwtCookie) {
          console.log('✅ PASSED: JWT cookie set');
          console.log('   Cookie details:', jwtCookie.split(';')[0]);
        } else {
          console.log('❌ FAILED: JWT cookie not set');
        }
        
        if (refreshCookie) {
          console.log('✅ PASSED: Refresh token cookie set');
        } else {
          console.log('❌ FAILED: Refresh token cookie not set');
        }
      } else {
        console.log('❌ FAILED: No cookies set');
      }
      
      return response.data.data.user;
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message.includes('duplicate')) {
      console.log('✅ PASSED: User already exists (expected for repeated tests)');
      
      // Test login instead
      console.log('\n🔐 Testing Login with existing user...');
      try {
        const loginResponse = await api.post('/users/login', {
          email: 'john.doe@example.com',
          password: 'SecurePassword123!'
        });
        
        if (loginResponse.status === 200) {
          console.log('✅ PASSED: Login successful');
          console.log('   User:', loginResponse.data.data.user.name);
          
          // Check cookies
          const cookies = loginResponse.headers['set-cookie'];
          if (cookies && cookies.some(cookie => cookie.includes('jwt'))) {
            console.log('✅ PASSED: JWT cookie set on login');
          }
        }
      } catch (loginError) {
        console.log('❌ FAILED: Login failed');
        console.log('   Error:', loginError.response?.data?.message || loginError.message);
      }
      
      return null;
    } else if (error.response?.status === 429) {
      console.log('⏳ Rate limit still active, please wait and try again');
      return null;
    } else {
      console.log('❌ FAILED: Valid signup failed');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data?.message || error.message);
      return null;
    }
  }
}

testValidSignup().catch(console.error);