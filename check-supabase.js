// Quick diagnostic script to check Supabase connection and table
// Run this with: node check-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual values from .env file
const supabaseUrl = 'https://zpfoyipheqjrqvfhhowl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZm95aXBoZXFqcnF2Zmhob3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTU2MzMsImV4cCI6MjA4MzM3MTYzM30.rxe0APFcbKpm_xf6cEk2pHotU5pQqsrkrEJQiH1GE48';

console.log('\n🔍 Checking Supabase Configuration...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('\n📡 Testing connection to Supabase...');
    
    // Try to query the userskills table
    const { data, error } = await supabase
      .from('userskills')
      .select('*')
      .limit(1);

    if (error) {
      console.error('\n❌ Error querying userskills table:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
      
      if (error.code === '42P01' || error.code === 'PGRST204' || error.code === 'PGRST205') {
        console.log('\n📋 SOLUTION: Table does not exist!');
        console.log('Please run the SQL script in Supabase:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Copy the contents of supabase-userSkills-setup.sql');
        console.log('5. Paste and run the script');
      } else if (error.code === '42501') {
        console.log('\n🔒 SOLUTION: Permission denied!');
        console.log('Row Level Security policies may not be set correctly.');
        console.log('Make sure you ran the complete SQL setup script.');
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Table "userskills" exists and is accessible');
      console.log(`Found ${data?.length || 0} existing records`);
      if (data && data.length > 0) {
        console.log('\nSample data:', JSON.stringify(data[0], null, 2));
      }
    }
  } catch (err) {
    console.error('\n❌ Unexpected error:', err.message);
  }
}

checkDatabase();
