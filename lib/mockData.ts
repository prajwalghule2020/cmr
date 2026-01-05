// Skill lifecycle stages
export type SkillLifecycle = 'emerging' | 'growing' | 'mature' | 'declining' | 'stable';

export interface Skill {
  id: string;
  name: string;
  category: string;
  lifecycle: SkillLifecycle;
  growthRate: number; // percentage
  diffusion: number; // 0-100 adoption score
  riskScore: number; // 0-100
  demandTrend: number[]; // last 12 months
  salaryImpact: number; // percentage increase
  jobPostings: number;
  timeToAcquire: string; // e.g., "3-6 months"
}

export interface CareerPathNode {
  id: string;
  title: string;
  skills: string[];
  timeline: string;
  probability: number; // likelihood based on current skills
  salaryRange: string;
  outcomes: string[]; // IDs of next possible nodes
}

export interface SkillRecommendation {
  skillId: string;
  skillName: string;
  reason: string;
  metrics: {
    growthRate: number;
    diffusion: number;
    riskScore: number;
    marketDemand: string;
  };
  sources: string[];
}

// Mock Skills Data
export const skillsData: Skill[] = [
  {
    id: 'sk-001',
    name: 'Large Language Models',
    category: 'AI/ML',
    lifecycle: 'emerging',
    growthRate: 234,
    diffusion: 28,
    riskScore: 35,
    demandTrend: [12, 18, 24, 35, 48, 62, 78, 95, 112, 138, 165, 198],
    salaryImpact: 32,
    jobPostings: 45200,
    timeToAcquire: '6-12 months',
  },
  {
    id: 'sk-002',
    name: 'Prompt Engineering',
    category: 'AI/ML',
    lifecycle: 'growing',
    growthRate: 187,
    diffusion: 42,
    riskScore: 45,
    demandTrend: [8, 15, 28, 42, 58, 75, 92, 108, 125, 142, 158, 175],
    salaryImpact: 24,
    jobPostings: 32100,
    timeToAcquire: '2-4 months',
  },
  {
    id: 'sk-003',
    name: 'Kubernetes',
    category: 'DevOps',
    lifecycle: 'mature',
    growthRate: 18,
    diffusion: 78,
    riskScore: 15,
    demandTrend: [142, 145, 148, 152, 155, 158, 160, 162, 165, 168, 170, 172],
    salaryImpact: 18,
    jobPostings: 89400,
    timeToAcquire: '4-6 months',
  },
  {
    id: 'sk-004',
    name: 'TypeScript',
    category: 'Programming',
    lifecycle: 'mature',
    growthRate: 24,
    diffusion: 85,
    riskScore: 10,
    demandTrend: [165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220],
    salaryImpact: 15,
    jobPostings: 156000,
    timeToAcquire: '2-3 months',
  },
  {
    id: 'sk-005',
    name: 'React Native',
    category: 'Mobile',
    lifecycle: 'stable',
    growthRate: 8,
    diffusion: 72,
    riskScore: 22,
    demandTrend: [85, 86, 87, 88, 89, 90, 90, 91, 91, 92, 92, 93],
    salaryImpact: 12,
    jobPostings: 42300,
    timeToAcquire: '3-5 months',
  },
  {
    id: 'sk-006',
    name: 'jQuery',
    category: 'Programming',
    lifecycle: 'declining',
    growthRate: -15,
    diffusion: 45,
    riskScore: 78,
    demandTrend: [95, 92, 88, 84, 80, 76, 72, 68, 65, 62, 58, 55],
    salaryImpact: -5,
    jobPostings: 12400,
    timeToAcquire: '1-2 months',
  },
  {
    id: 'sk-007',
    name: 'Rust',
    category: 'Programming',
    lifecycle: 'growing',
    growthRate: 89,
    diffusion: 35,
    riskScore: 28,
    demandTrend: [25, 30, 36, 42, 50, 58, 68, 78, 88, 100, 112, 125],
    salaryImpact: 28,
    jobPostings: 18200,
    timeToAcquire: '6-9 months',
  },
  {
    id: 'sk-008',
    name: 'Vector Databases',
    category: 'Data',
    lifecycle: 'emerging',
    growthRate: 312,
    diffusion: 18,
    riskScore: 42,
    demandTrend: [5, 8, 14, 22, 35, 52, 78, 105, 138, 175, 218, 265],
    salaryImpact: 35,
    jobPostings: 8900,
    timeToAcquire: '3-6 months',
  },
];

// Career Path Mock Data
export const careerPaths: CareerPathNode[] = [
  {
    id: 'cp-001',
    title: 'Current Position',
    skills: ['JavaScript', 'React', 'Node.js'],
    timeline: 'Now',
    probability: 100,
    salaryRange: '$85,000 - $110,000',
    outcomes: ['cp-002', 'cp-003'],
  },
  {
    id: 'cp-002',
    title: 'Senior Frontend Engineer',
    skills: ['TypeScript', 'React', 'Testing', 'Performance'],
    timeline: '1-2 years',
    probability: 75,
    salaryRange: '$120,000 - $150,000',
    outcomes: ['cp-004', 'cp-005'],
  },
  {
    id: 'cp-003',
    title: 'Full-Stack Developer',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    timeline: '1-2 years',
    probability: 65,
    salaryRange: '$115,000 - $145,000',
    outcomes: ['cp-005', 'cp-006'],
  },
  {
    id: 'cp-004',
    title: 'Staff Engineer (Frontend)',
    skills: ['Architecture', 'Team Leadership', 'Performance', 'Accessibility'],
    timeline: '3-5 years',
    probability: 45,
    salaryRange: '$180,000 - $240,000',
    outcomes: [],
  },
  {
    id: 'cp-005',
    title: 'AI/ML Engineer',
    skills: ['LLMs', 'Python', 'Vector Databases', 'MLOps'],
    timeline: '2-4 years',
    probability: 55,
    salaryRange: '$160,000 - $220,000',
    outcomes: [],
  },
  {
    id: 'cp-006',
    title: 'Engineering Manager',
    skills: ['Leadership', 'Strategy', 'Hiring', 'Mentoring'],
    timeline: '3-5 years',
    probability: 40,
    salaryRange: '$170,000 - $230,000',
    outcomes: [],
  },
];

// Skill Recommendations
export const skillRecommendations: SkillRecommendation[] = [
  {
    skillId: 'sk-001',
    skillName: 'Large Language Models',
    reason: 'High growth trajectory with strong alignment to your existing JavaScript/TypeScript foundation',
    metrics: {
      growthRate: 234,
      diffusion: 28,
      riskScore: 35,
      marketDemand: 'Very High',
    },
    sources: [
      'LinkedIn Talent Insights Q4 2025',
      'Stack Overflow Developer Survey 2025',
      'Burning Glass Technologies Labor Market Data',
    ],
  },
  {
    skillId: 'sk-008',
    skillName: 'Vector Databases',
    reason: 'Emerging technology with rapid adoption in AI applications; complements LLM skills',
    metrics: {
      growthRate: 312,
      diffusion: 18,
      riskScore: 42,
      marketDemand: 'High',
    },
    sources: [
      'Gartner Emerging Technologies Report 2025',
      'Indeed Hiring Lab Analysis',
      'GitHub Octoverse 2025',
    ],
  },
  {
    skillId: 'sk-007',
    skillName: 'Rust',
    reason: 'Growing demand in systems programming and WebAssembly; low risk, high salary impact',
    metrics: {
      growthRate: 89,
      diffusion: 35,
      riskScore: 28,
      marketDemand: 'Medium-High',
    },
    sources: [
      'TIOBE Programming Index',
      'JetBrains Developer Ecosystem Survey 2025',
      'Dice Tech Salary Report',
    ],
  },
];

// User profile mock
export interface UserProfile {
  name: string;
  email: string;
  currentRole: string;
  experience: string;
  skills: string[];
  interests: string[];
  goals: string[];
}

export const mockUserProfile: UserProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  currentRole: 'Frontend Developer',
  experience: '3-5 years',
  skills: ['JavaScript', 'React', 'Node.js', 'CSS', 'Git'],
  interests: ['AI/ML', 'System Design', 'Open Source'],
  goals: ['Become a Staff Engineer', 'Learn AI/ML', 'Increase compensation'],
};

// Industry categories
export const skillCategories = [
  'AI/ML',
  'Programming',
  'DevOps',
  'Data',
  'Mobile',
  'Cloud',
  'Security',
  'Design',
];

// Time periods for filtering
export const timePeriods = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
];
