// Database connection testing utilities
// Use this to verify your Drizzle setup is working correctly

import { db, checkConnection, closeConnection } from './connection';
import { profiles } from './schema';

// Test basic connection
export async function testBasicConnection(): Promise<boolean> {
  console.log('Testing basic database connection...');
  
  try {
    const isConnected = await checkConnection();
    if (isConnected) {
      console.log('✅ Database connection successful');
      return true;
    } else {
      console.log('❌ Database connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return false;
  }
}

// Test schema access
export async function testSchemaAccess(): Promise<boolean> {
  console.log('Testing database schema access...');
  
  try {
    // Try to query the profiles table (should exist in Supabase)
    const result = await db
      .select({ count: profiles.id })
      .from(profiles)
      .limit(1);
    
    console.log('✅ Schema access successful');
    console.log(`Found ${result.length} profile records`);
    return true;
  } catch (error) {
    console.error('❌ Schema access failed:', error);
    return false;
  }
}

// Test basic CRUD operations (non-destructive)
export async function testCrudOperations(): Promise<boolean> {
  console.log('Testing basic CRUD operations...');
  
  try {
    // Test SELECT (read)
    const selectResult = await db
      .select()
      .from(profiles)
      .limit(5);
    
    console.log(`✅ SELECT test passed (found ${selectResult.length} records)`);
    
    // Note: We won't test INSERT/UPDATE/DELETE without proper user ID
    // These would require actual authentication context
    
    return true;
  } catch (error) {
    console.error('❌ CRUD test failed:', error);
    return false;
  }
}

// Complete connection test suite
export async function runConnectionTests(): Promise<void> {
  console.log('🧪 Starting Drizzle ORM connection tests...\n');
  
  const tests = [
    { name: 'Basic Connection', test: testBasicConnection },
    { name: 'Schema Access', test: testSchemaAccess },
    { name: 'CRUD Operations', test: testCrudOperations },
  ];
  
  let passedTests = 0;
  
  for (const { name, test } of tests) {
    console.log(`\n🔍 Running ${name} test...`);
    try {
      const passed = await test();
      if (passed) {
        console.log(`✅ ${name} test passed`);
        passedTests++;
      } else {
        console.log(`❌ ${name} test failed`);
      }
    } catch (error) {
      console.error(`❌ ${name} test error:`, error);
    }
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Drizzle ORM is ready to use.');
  } else {
    console.log('⚠️  Some tests failed. Please check your configuration.');
    console.log('\n📝 Troubleshooting tips:');
    console.log('1. Verify DATABASE_URL is set correctly in .env.local');
    console.log('2. Ensure your Supabase database is accessible');
    console.log('3. Check that the profiles table exists in your database');
    console.log('4. Verify your database password and connection string');
  }
  
  // Clean up connections
  try {
    await closeConnection();
    console.log('\n🔌 Database connections closed');
  } catch (error) {
    console.error('Warning: Error closing connections:', error);
  }
}

// CLI runner
if (require.main === module) {
  runConnectionTests().catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}