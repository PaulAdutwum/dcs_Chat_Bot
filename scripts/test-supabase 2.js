// Test script for Supabase integration
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate a test user ID
const testUserId = `test-${Date.now()}`;

// Run tests
async function runTests() {
  console.log('🧪 Starting Supabase connection test...');
  
  try {
    // Test 1: Check connection
    console.log('\n📡 Test 1: Checking database connection...');
    const { error: connectionError } = await supabase
      .from('user_interactions')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    console.log('✅ Connection successful');
    
    // Test 2: Insert test data
    console.log('\n📝 Test 2: Inserting test data...');
    const { data: insertData, error: insertError } = await supabase
      .from('user_interactions')
      .insert({
        user_id: testUserId,
        interaction_type: 'test',
        content: {
          message: 'This is a test message',
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      });
      
    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`);
    }
    console.log('✅ Test data inserted successfully');
    
    // Test 3: Retrieve test data
    console.log('\n🔍 Test 3: Retrieving test data...');
    const { data: retrieveData, error: retrieveError } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (retrieveError) {
      throw new Error(`Retrieve failed: ${retrieveError.message}`);
    }
    
    if (retrieveData && retrieveData.length > 0) {
      console.log('✅ Test data retrieved successfully:');
      console.log(JSON.stringify(retrieveData[0], null, 2));
    } else {
      throw new Error('No data retrieved');
    }
    
    // Test 4: Delete test data
    console.log('\n🗑️ Test 4: Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('user_interactions')
      .delete()
      .eq('user_id', testUserId);
      
    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`);
    }
    console.log('✅ Test data cleaned up successfully');
    
    // All tests passed
    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
    console.log('You can now run your application and it will log user interactions to Supabase.');
    
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the tests
runTests(); 