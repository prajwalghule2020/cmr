# UserSkills Component - Setup & Usage Guide

## Overview
The `UserSkills` component is a form that allows authenticated users to input and manage their skills for personalized career pathway generation. Skills are stored in a Supabase database table called `userSkills`.

## Database Setup

### 1. Create the Database Table
1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Open the file `supabase-userSkills-setup.sql` from your project root
4. Copy and paste the SQL code into the SQL Editor
5. Click **Run** to execute the script

This will create:
- The `userSkills` table with proper schema
- Indexes for performance optimization
- Row Level Security (RLS) policies to ensure users can only access their own data
- Automatic timestamp updates

### Table Schema
```
userSkills
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key to auth.users)
├── skill_name (TEXT, Required)
├── proficiency_level (TEXT, Required) - Values: beginner, intermediate, advanced, expert
├── years_of_experience (NUMERIC, Default: 0)
├── category (TEXT, Required) - Values: technical, programming, design, management, communication, analytical, creative, other
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Component Features

### ✅ Key Functionality
- **Multi-skill input**: Users can add multiple skills at once
- **Dynamic form fields**: Add/remove skill entries as needed
- **Validation**: Required fields and data type validation
- **Proficiency levels**: Beginner, Intermediate, Advanced, Expert
- **Skill categories**: 8 different categories to choose from
- **Years of experience**: Optional numeric field
- **Real-time feedback**: Toast notifications for success/error states
- **Existing skills display**: Shows currently saved skills
- **Auto-save**: Replaces all skills on submit (upsert behavior)

### 🎨 Form Fields
1. **Skill Name** (Required) - Text input for the skill name
2. **Category** (Required) - Dropdown selection
3. **Proficiency Level** (Required) - Dropdown selection
4. **Years of Experience** (Optional) - Numeric input

## Usage Examples

### Basic Usage (in a page or component)
```tsx
import UserSkills from '@/components/UserSkills';

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <UserSkills />
    </div>
  );
}
```

### With Callback (redirect after successful save)
```tsx
import UserSkills from '@/components/UserSkills';
import { useRouter } from 'next/navigation';

export default function SkillsSetupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to dashboard after saving skills
    router.push('/dashboard');
  };

  return (
    <div className="container py-8">
      <UserSkills onSubmitSuccess={handleSuccess} />
    </div>
  );
}
```

### Example Integration in Profile Setup Flow
```tsx
// app/profile-setup/page.tsx
import UserSkills from '@/components/UserSkills';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <UserSkills 
        onSubmitSuccess={() => {
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
```

## User Flow

1. **User logs in** → Authentication handled by `AuthContext`
2. **User navigates to skills form** → Component checks authentication
3. **User fills out skills** → Can add multiple skills
4. **User submits form** → Data validated and sent to Supabase
5. **Skills saved** → Success notification shown
6. **Optional callback** → Redirect or other action executed

## Security

- **Row Level Security (RLS)** is enabled on the `userSkills` table
- Users can only view, insert, update, and delete their own skills
- `user_id` is automatically set from the authenticated user's session
- All queries are scoped to the authenticated user's ID

## Validation

The component includes validation for:
- Required fields (skill_name, proficiency_level, category)
- Authentication check (must be logged in)
- At least one valid skill must be provided
- Numeric validation for years of experience

## Dependencies

All required dependencies are already in your project:
- `@supabase/supabase-js` - Supabase client
- `react-hook-form` - Form handling (available but not required)
- `zod` - Validation (available but not required)
- `sonner` - Toast notifications
- `lucide-react` - Icons
- Radix UI components (Button, Input, Select, Card, Label)

## Troubleshooting

### "Failed to save skills"
- Ensure the `userSkills` table exists in Supabase
- Check that RLS policies are properly configured
- Verify environment variables are set correctly:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "You must be logged in"
- User needs to authenticate first
- Check that `AuthContext` is properly configured
- Verify Supabase session is active

### Skills not appearing after save
- Check browser console for errors
- Verify the `userSkills` table structure matches the schema
- Ensure RLS policies allow SELECT operations

## Future Enhancements

Potential improvements you could add:
- Search/autocomplete for skill names
- Skill recommendations based on category
- Import skills from LinkedIn or resume
- Skill endorsements/verification
- Tag-based skill grouping
- Analytics on skill trends
