// Test script for API endpoints
// Run with: node test-api.js

const axios = require('axios');

const HOST = "https://citizenx-9hk2.onrender.com";
const GET_CATEGORIES = `${HOST}/api/v1/categories`;
const GET_SUB_REPORTS = `${HOST}/api/v1/report/sub_reports`;

async function testCategoriesEndpoint() {
  console.log('🧪 Testing GET /api/v1/categories...');
  try {
    const response = await axios.get(GET_CATEGORIES);
    console.log('✅ Categories API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.categories;
  } catch (error) {
    console.error('❌ Categories API Error:', error.response?.data || error.message);
    return null;
  }
}

async function testSubReportsEndpoint(category, stateName) {
  console.log(`\n🧪 Testing GET /api/v1/report/sub_reports?category=${category || ''}&state_name=${stateName || ''}`);
  try {
    const params = {};
    if (category) params.category = category;
    if (stateName) params.state_name = stateName;

    const response = await axios.get(GET_SUB_REPORTS, { params });
    console.log('✅ Sub-reports API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Sub-reports API Error:', error.response?.data || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  // Test 1: Get all categories
  const categories = await testCategoriesEndpoint();
  
  if (categories && categories.length > 0) {
    const firstCategory = categories[0].name;
    
    // Test 2: Get sub-reports for first category
    await testSubReportsEndpoint(firstCategory);
    
    // Test 3: Get sub-reports with state filter
    await testSubReportsEndpoint('', 'Lagos');
    
    // Test 4: Get sub-reports with both filters
    await testSubReportsEndpoint(firstCategory, 'Lagos');
  }

  console.log('\n🏁 API Tests Complete!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCategoriesEndpoint, testSubReportsEndpoint };
