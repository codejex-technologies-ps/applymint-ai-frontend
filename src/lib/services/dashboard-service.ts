// Client-side dashboard service that works without direct database access
// This service will eventually make API calls to server-side endpoints
import type { DashboardStats } from '@/components/dashboard/stats-overview';
import type { RecentActivity } from '@/types';

// Mock data for development - in production this would call API endpoints
const generateMockStats = (hasActivity: boolean): DashboardStats => {
  if (!hasActivity) {
    return {
      jobsApplied: 0,
      interviews: 0,
      matchScore: 0,
      responseRate: 0,
      offers: 0,
      profileViews: 0,
    };
  }

  return {
    jobsApplied: Math.floor(Math.random() * 25) + 5,
    jobsAppliedChange: {
      value: Math.floor(Math.random() * 5) + 1,
      type: 'increase',
      label: 'this week',
    },
    interviews: Math.floor(Math.random() * 8) + 2,
    interviewsChange: {
      value: Math.floor(Math.random() * 3) + 1,
      type: 'increase',
      label: 'scheduled',
    },
    matchScore: Math.floor(Math.random() * 20) + 75,
    matchScoreChange: {
      value: 'Above average',
      type: 'increase',
    },
    responseRate: Math.floor(Math.random() * 40) + 40,
    responseRateChange: {
      value: `${Math.floor(Math.random() * 15) + 5}%`,
      type: 'increase',
      label: 'from last month',
    },
    offers: Math.floor(Math.random() * 3),
    offersChange: {
      value: 1,
      type: 'increase',
      label: 'pending',
    },
    profileViews: Math.floor(Math.random() * 100) + 50,
    profileViewsChange: {
      value: Math.floor(Math.random() * 20) + 5,
      type: 'increase',
      label: 'this week',
    },
  };
};

export const dashboardService = {
  // Get dashboard stats - this would eventually call /api/dashboard/stats
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user has any saved activity in localStorage (for demo purposes)
      const hasActivity = localStorage.getItem(`user-${userId}-has-activity`) === 'true';
      
      return generateMockStats(hasActivity);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return generateMockStats(false);
    }
  },

  // Get recent activity - this would eventually call /api/dashboard/activity
  async getRecentActivity(userId: string, limit = 10): Promise<RecentActivity[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const hasActivity = localStorage.getItem(`user-${userId}-has-activity`) === 'true';
      
      if (!hasActivity) {
        return [];
      }

      // Generate mock activities
      const activities = [
        {
          id: '1',
          type: 'APPLICATION_SUBMITTED' as const,
          title: 'Applied to Senior React Developer',
          description: 'at TechCorp Inc.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: '2',
          type: 'JOB_SAVED' as const,
          title: 'Saved Full Stack Engineer',
          description: 'at DataFlow Solutions',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          id: '3',
          type: 'APPLICATION_SUBMITTED' as const,
          title: 'Applied to Software Engineer',
          description: 'at AI Innovations',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
      ];

      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Get job recommendations - this would eventually call /api/dashboard/recommendations
  async getJobRecommendations(userId: string, limit = 5) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const recommendations = [
        {
          id: '1',
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary: { min: 120000, max: 150000, currency: 'USD' },
          matchScore: 94,
          postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRemote: true,
          tags: ['React', 'TypeScript', 'Node.js'],
          description: 'Join our innovative team building next-generation web applications...',
        },
        {
          id: '2',
          title: 'Full Stack Engineer',
          company: 'DataFlow Solutions',
          location: 'Austin, TX',
          salary: { min: 100000, max: 130000, currency: 'USD' },
          matchScore: 87,
          postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isRemote: false,
          tags: ['Node.js', 'Python', 'AWS'],
          description: 'Build scalable data processing systems for enterprise clients...',
        },
        {
          id: '3',
          title: 'Software Engineer',
          company: 'AI Innovations',
          location: 'Remote',
          salary: { min: 90000, max: 120000, currency: 'USD' },
          matchScore: 82,
          postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isRemote: true,
          tags: ['Machine Learning', 'Python', 'TensorFlow'],
          description: 'Work on AI-powered products that are changing the industry...',
        },
      ];

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      return [];
    }
  },

  // Check if user is first-time user
  async isFirstTimeUser(userId: string): Promise<boolean> {
    try {
      // Check localStorage for demo purposes
      const hasActivity = localStorage.getItem(`user-${userId}-has-activity`) === 'true';
      const tourCompleted = localStorage.getItem('dashboard-tour-completed') === 'true';
      
      return !hasActivity && !tourCompleted;
    } catch (error) {
      console.error('Error checking first-time user status:', error);
      return true;
    }
  },

  // Mark user as having activity (for demo purposes)
  markUserAsActive(userId: string): void {
    localStorage.setItem(`user-${userId}-has-activity`, 'true');
  },
};