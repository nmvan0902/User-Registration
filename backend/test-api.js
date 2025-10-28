// Simple test script to verify the API endpoint
const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3001/user/register', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration failed with status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Test invalid data
async function testValidation() {
  try {
    const response = await axios.post('http://localhost:3001/user/register', {
      email: 'invalid-email',
      password: '123' // Too short
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Validation working correctly!');
      console.log('Validation errors:', error.response.data);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }
}

console.log('Testing User Registration API...');
console.log('Note: Make sure to set up your MySQL database first!\n');

// Run tests
testRegistration();
setTimeout(() => testValidation(), 1000);