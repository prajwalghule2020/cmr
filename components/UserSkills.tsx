"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X, Loader2 } from 'lucide-react';

interface Skill {
  skill_name: string;
  proficiency_level: string;
  years_of_experience: number;
  category: string;
}

interface UserSkillsProps {
  onSubmitSuccess?: () => void;
}

export default function UserSkills({ onSubmitSuccess }: UserSkillsProps) {
  const { supabaseUser } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([
    { skill_name: '', proficiency_level: '', years_of_experience: 0, category: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingSkills, setExistingSkills] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (supabaseUser) {
      fetchExistingSkills();
    }
  }, [supabaseUser]);

  const fetchExistingSkills = async () => {
    if (!supabaseUser) return;

    try {
      const { data, error } = await supabase
        .from('userskills')
        .select('*')
        .eq('user_id', supabaseUser.id);

      if (error) {
        console.error('Error fetching skills:', error);
        return;
      }

      if (data && data.length > 0) {
        setExistingSkills(data);
        setSkills(data.map(skill => ({
          skill_name: skill.skill_name,
          proficiency_level: skill.proficiency_level,
          years_of_experience: skill.years_of_experience,
          category: skill.category
        })));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addSkillField = () => {
    setSkills([...skills, { skill_name: '', proficiency_level: '', years_of_experience: 0, category: '' }]);
  };

  const removeSkillField = (index: number) => {
    if (skills.length > 1) {
      const newSkills = skills.filter((_, i) => i !== index);
      setSkills(newSkills);
    }
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabaseUser) {
      toast.error('You must be logged in to save skills');
      return;
    }

    // Validate that at least one skill is filled
    const validSkills = skills.filter(skill => 
      skill.skill_name.trim() !== '' && 
      skill.proficiency_level !== '' && 
      skill.category !== ''
    );

    if (validSkills.length === 0) {
      toast.error('Please add at least one skill with all required fields');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 Starting to save skills for user:', supabaseUser.id);
      console.log('📝 Valid skills to save:', validSkills);

      // First, delete existing skills for this user
      console.log('🗑️ Deleting existing skills...');
      const { error: deleteError } = await supabase
        .from('userskills')
        .delete()
        .eq('user_id', supabaseUser.id);

      if (deleteError) {
        console.error('❌ Delete error:', deleteError);
        throw deleteError;
      }
      console.log('✅ Existing skills deleted (if any)');

      // Insert new skills
      const skillsToInsert = validSkills.map(skill => ({
        user_id: supabaseUser.id,
        skill_name: skill.skill_name.trim(),
        proficiency_level: skill.proficiency_level,
        years_of_experience: Number(skill.years_of_experience) || 0,
        category: skill.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('💾 Inserting skills:', skillsToInsert);
      const { data, error } = await supabase
        .from('userskills')
        .insert(skillsToInsert)
        .select();

      if (error) {
        console.error('❌ Insert error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Skills saved successfully:', data);
      toast.success(`Successfully saved ${validSkills.length} skill(s)!`);
      setExistingSkills(data || []);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error: any) {
      console.error('❌ Error saving skills:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save skills. ';
      if (error.code === '42P01' || error.code === 'PGRST205') {
        errorMessage += 'Table "userskills" does not exist. Please run the SQL setup script in Supabase.';
      } else if (error.code === '42501') {
        errorMessage += 'Permission denied. Please check Row Level Security policies.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check the console for details.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!supabaseUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Please Log In</CardTitle>
          <CardDescription>You need to be logged in to manage your skills.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Your Skills Profile</CardTitle>
        <CardDescription>
          Add your skills to help us generate a personalized career pathway. You can add multiple skills with their proficiency levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 relative">
              {skills.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeSkillField(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`skill-name-${index}`}>
                    Skill Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`skill-name-${index}`}
                    placeholder="e.g., JavaScript, Python, Project Management"
                    value={skill.skill_name}
                    onChange={(e) => updateSkill(index, 'skill_name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`category-${index}`}>
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={skill.category}
                    onValueChange={(value) => updateSkill(index, 'category', value)}
                  >
                    <SelectTrigger id={`category-${index}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="analytical">Analytical</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`proficiency-${index}`}>
                    Proficiency Level <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={skill.proficiency_level}
                    onValueChange={(value) => updateSkill(index, 'proficiency_level', value)}
                  >
                    <SelectTrigger id={`proficiency-${index}`}>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience-${index}`}>Years of Experience</Label>
                  <Input
                    id={`experience-${index}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={skill.years_of_experience || ''}
                    onChange={(e) => updateSkill(index, 'years_of_experience', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addSkillField}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Skill
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto sm:ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Skills'
              )}
            </Button>
          </div>
        </form>

        {existingSkills.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3">Currently Saved Skills ({existingSkills.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {existingSkills.map((skill, index) => (
                <div key={index} className="text-sm p-2 bg-muted rounded">
                  <div className="font-medium">{skill.skill_name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {skill.proficiency_level} • {skill.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
