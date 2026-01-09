// Test script to insert data into userskills table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zpfoyipheqjrqvfhhowl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZm95aXBoZXFqcnF2Zmhob3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTU2MzMsImV4cCI6MjA4MzM3MTYzM30.rxe0APFcbKpm_xf6cEk2pHotU5pQqsrkrEJQiH1GE48';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('\n🧪 Testing Insert Operation...\n');

  // First, check current user authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  console.log('Authentication Status:');
  if (authError) {
    console.log('❌ Auth Error:', authError.message);
    console.log('\n⚠️  WARNING: No user is authenticated!');
    console.log('This is why inserts are failing - RLS policies require authentication.');
    console.log('\nSOLUTION:');
    console.log('1. The user must be logged in through your app');
    console.log('2. Test the form after logging in at: http://localhost:3000/auth');
    console.log('3. Then navigate to: http://localhost:3000/test-skills');
    return;
  }
  
  if (!user) {
    console.log('❌ No user authenticated');
    console.log('\n⚠️  WARNING: You must be logged in to insert skills!');
    console.log('\nSOLUTION:');
    console.log('1. Start your dev server: npm run dev');
    console.log('2. Login at: http://localhost:3000/auth');
    console.log('3. Then test the skills form at: http://localhost:3000/test-skills');
    return;
  }

  console.log('✅ User authenticated:', user.email);
  console.log('User ID:', user.id);

  // Try to insert a test skill
  console.log('\n📝 Attempting to insert a test skill...');
  
  const testSkill = {
    user_id: user.id,
    skill_name: 'JavaScript',
    proficiency_level: 'advanced',
    years_of_experience: 5,
    category: 'programming',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('Test data:', JSON.stringify(testSkill, null, 2));

  const { data, error } = await supabase
    .from('userskills')
    .insert([testSkill])
    .select();

  if (error) {
    console.log('\n❌ Insert failed!');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Error details:', error.details);
    console.log('Error hint:', error.hint);

    if (error.code === '42501') {
      console.log('\n🔒 Permission Error - RLS Policy Issue');
      console.log('Even though you\'re authenticated here, the RLS policies require the user to be authenticated in the browser session.');
    }
  } else {
    console.log('\n✅ Insert successful!');
    console.log('Inserted data:', JSON.stringify(data, null, 2));
    
    // Clean up - delete the test record
    await supabase.from('userskills').delete().eq('id', data[0].id);
    console.log('\n🧹 Test record cleaned up');
  }
}

testInsert();
