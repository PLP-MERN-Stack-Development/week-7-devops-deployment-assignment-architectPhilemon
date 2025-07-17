import React, { useState } from 'react';
import { Trophy, Star, Award, Target, Calendar, Users, BookOpen, MessageCircle, TrendingUp } from 'lucide-react';

const AchievementsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userStats = {
    totalPoints: 1250,
    level: 8,
    nextLevelPoints: 1500,
    rank: 42,
    totalUsers: 2847
  };

  const achievements = [
    {
      id: 1,
      title: 'Early Adopter',
      description: 'One of the first 100 users to join Campus Connect',
      icon: '🌟',
      category: 'milestone',
      points: 100,
      earnedAt: '2025-01-15T10:00:00Z',
      rarity: 'legendary',
      progress: 100
    },
    {
      id: 2,
      title: 'Study Buddy',
      description: 'Joined 5 study groups',
      icon: '📚',
      category: 'academic',
      points: 75,
      earnedAt: '2025-02-01T14:30:00Z',
      rarity: 'rare',
      progress: 100
    },
    {
      id: 3,
      title: 'Event Enthusiast',
      description: 'Attended 10 campus events',
      icon: '🎉',
      category: 'social',
      points: 150,
      earnedAt: '2025-02-15T16:45:00Z',
      rarity: 'epic',
      progress: 100
    },
    {
      id: 4,
      title: 'Knowledge Sharer',
      description: 'Uploaded 20 academic resources',
      icon: '📖',
      category: 'academic',
      points: 200,
      earnedAt: '2025-02-20T09:15:00Z',
      rarity: 'epic',
      progress: 100
    },
    {
      id: 5,
      title: 'Social Butterfly',
      description: 'Connected with 50 students',
      icon: '🦋',
      category: 'social',
      points: 125,
      earnedAt: '2025-02-25T11:20:00Z',
      rarity: 'rare',
      progress: 100
    },
    {
      id: 6,
      title: 'Chat Master',
      description: 'Send 1000 messages in campus chat',
      icon: '💬',
      category: 'social',
      points: 100,
      earnedAt: null,
      rarity: 'common',
      progress: 75
    },
    {
      id: 7,
      title: 'Perfect Attendance',
      description: 'Attend events for 30 consecutive days',
      icon: '📅',
      category: 'milestone',
      points: 300,
      earnedAt: null,
      rarity: 'legendary',
      progress: 60
    },
    {
      id: 8,
      title: 'Resource Hunter',
      description: 'Download 100 academic resources',
      icon: '🔍',
      category: 'academic',
      points: 50,
      earnedAt: null,
      rarity: 'common',
      progress: 85
    }
  ];

  const categories = [
    { value: 'all', label: 'All Achievements', icon: Trophy },
    { value: 'academic', label: 'Academic', icon: BookOpen },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'milestone', label: 'Milestones', icon: Target }
  ];

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const inProgressAchievements = achievements.filter(a => !a.earnedAt);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityGlow = (rarity: string) => {
    const glows = {
      common: '',
      rare: 'shadow-blue-200',
      epic: 'shadow-purple-200',
      legendary: 'shadow-yellow-200'
    };
    return glows[rarity as keyof typeof glows] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Achievements</h1>
          <p className="text-xl text-gray-600">Track your progress and earn recognition for your campus engagement</p>
        </div>

        {/* User Stats */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{userStats.totalPoints}</div>
              <div className="text-yellow-100">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">Level {userStats.level}</div>
              <div className="text-yellow-100">Current Level</div>
              <div className="w-full bg-yellow-300 rounded-full h-2 mt-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">#{userStats.rank}</div>
              <div className="text-yellow-100">Campus Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{earnedAchievements.length}</div>
              <div className="text-yellow-100">Achievements Earned</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border-2 ${
                achievement.earnedAt ? getRarityColor(achievement.rarity) : 'border-gray-200'
              } ${achievement.earnedAt ? getRarityGlow(achievement.rarity) : ''}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex items-center gap-2">
                    {achievement.earnedAt && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Earned
                      </div>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                
                {!achievement.earnedAt && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-600">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{achievement.points} points</span>
                  </div>
                  {achievement.earnedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Achievements */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {earnedAchievements.slice(0, 5).map((achievement, index) => (
              <div key={achievement.id} className={`p-4 flex items-center gap-4 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-600 mb-1">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{achievement.points}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campus Leaderboard</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Top Achievers This Month</h3>
            </div>
            {[
              { rank: 1, name: 'Sarah Chen', points: 2450, avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { rank: 2, name: 'Alex Rodriguez', points: 2280, avatar: 'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { rank: 3, name: 'Emily Johnson', points: 2150, avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100' },
              { rank: 42, name: 'You', points: userStats.totalPoints, avatar: null, isCurrentUser: true }
            ].map((user, index) => (
              <div key={index} className={`p-4 flex items-center gap-4 ${index !== 0 ? 'border-t border-gray-100' : ''} ${user.isCurrentUser ? 'bg-yellow-50' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.rank === 1 ? 'bg-yellow-400 text-white' :
                  user.rank === 2 ? 'bg-gray-400 text-white' :
                  user.rank === 3 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {user.rank}
                </div>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold ${user.isCurrentUser ? 'text-yellow-700' : 'text-gray-900'}`}>
                    {user.name}
                  </h4>
                </div>
                <div className="flex items-center text-yellow-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">{user.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;