const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

// Configure axios to include cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000
});

async function testInputValidation() {
  console.log('🔍 Testing Input Validation...\n');
  
  // Test 1: Invalid email format
  try {
    const response = await api.post('/users/signup', {
      name: 'Test User',
      email: 'invalid-email',
      password: 'Password123!',
      passwordConfirm: 'Password123!',
      role: 'user'
    });
    console.log('❌ FAILED: Invalid email should be rejected');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ PASSED: Invalid email rejected');
      console.log('   Error:', error.response.data.message);
    } else {
      console.log('❌ UNEXPECTED ERROR:', error.message);
    }
  }
  
  // Test 2: Weak password
  try {
    const response = await api.post('/users/signup', {
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
      passwordConfirm: '123',
      role: 'user'
    });
    console.log('❌ FAILED: Weak password should be rejected');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ PASSED: Weak password rejected');
      console.log('   Error:', error.response.data.message);
    } else {
      console.log('❌ UNEXPECTED ERROR:', error.message);
    }
  }
  
  // Test 3: Invalid name (numbers/special chars)
  try {
    const response = await api.post('/users/signup', {
      name: 'Test123!@#',
      email: 'test@example.com',
      password: 'Password123!',
      passwordConfirm: 'Password123!',
      role: 'user'
    });
    console.log('❌ FAILED: Invalid name should be rejected');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ PASSED: Invalid name rejected');
      console.log('   Error:', error.response.data.message);
    } else {
      console.log('❌ UNEXPECTED ERROR:', error.message);
    }
  }
  
  console.log('\n');
}

async function testRateLimiting() {
  console.log('🚦 Testing Rate Limiting...\n');
  
  let successCount = 0;
  let rateLimitedCount = 0;
  
  // Make 7 rapid login attempts (should hit rate limit at 6th)
  for (let i = 1; i <= 7; i++) {
    try {
      const response = await api.post('/users/login', {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
      successCount++;
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimitedCount++;
        console.log(`✅ PASSED: Request ${i} rate limited`);
        console.log('   Message:', error.response.data.message || 'Rate limited');
      } else if (error.response?.status === 401) {
        // Expected for wrong credentials
        successCount++;
      } else {
        console.log(`❌ UNEXPECTED ERROR on request ${i}:`, error.message);
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (rateLimitedCount > 0) {
    console.log(`✅ PASSED: Rate limiting working (${rateLimitedCount} requests blocked)`);
  } else {
    console.log('❌ FAILED: Rate limiting not working');
  }
  
  console.log('\n');
}

async function testSecurityHeaders() {
  console.log('🛡️ Testing Security Headers...\n');
  
  try {
    const response = await api.get('/users/me');
    const headers = response.headers;
    
    // Check for security headers
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'content-security-policy'
    ];
    
    securityHeaders.forEach(header => {
      if (headers[header]) {
        console.log(`✅ PASSED: ${header} header present`);
        console.log(`   Value: ${headers[header]}`);
      } else {
        console.log(`❌ FAILED: ${header} header missing`);
      }
    });
    
  } catch (error) {
    // Expected 401 for unauthorized request, but we can still check headers
    if (error.response) {
      const headers = error.response.headers;
      console.log('✅ Headers received from error response');
      
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options', 
        'x-xss-protection'
      ];
      
      securityHeaders.forEach(header => {
        if (headers[header]) {
          console.log(`✅ PASSED: ${header} header present`);
        } else {
          console.log(`❌ FAILED: ${header} header missing`);
        }
      });
    }
  }
  
  console.log('\n');
}

async function testValidSignup() {
  console.log('✅ Testing Valid Signup...\n');
  
  try {
    const response = await api.post('/users/signup', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'SecurePassword123!',
      passwordConfirm: 'SecurePassword123!',
      role: 'user'
    });
    
    if (response.status === 201) {
      console.log('✅ PASSED: Valid signup successful');
      console.log('   User created:', response.data.data.user.name);
      
      // Check if cookies are set
      const cookies = response.headers['set-cookie'];
      if (cookies && cookies.some(cookie => cookie.includes('jwt'))) {
        console.log('✅ PASSED: JWT cookie set');
      } else {
        console.log('❌ FAILED: JWT cookie not set');
      }
      
      return response.data.data.user;
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message.includes('duplicate')) {
      console.log('✅ PASSED: User already exists (expected for repeated tests)');
      return null;
    } else {
      console.log('❌ FAILED: Valid signup failed');
      console.log('   Error:', error.response?.data?.message || error.message);
      return null;
    }
  }
  
  console.log('\n');
}

async function runAllTests() {
  console.log('🔒 Security Testing Suite\n');
  console.log('='.repeat(50));
  
  await testInputValidation();
  await testRateLimiting();
  await testSecurityHeaders();
  await testValidSignup();
  
  console.log('='.repeat(50));
  console.log('🏁 Security tests completed!');
}

// Run the tests
runAllTests().catch(console.error);