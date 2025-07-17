import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, MapPin, Plus, Search, Filter, Star } from 'lucide-react';
import { apiService } from '../services/api';

const StudyGroupsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [studyGroups, setStudyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudyGroups();
  }, [selectedSubject, searchTerm]);

  const loadStudyGroups = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStudyGroups({
        subject: selectedSubject,
        search: searchTerm,
        limit: 20
      });
      setStudyGroups(data.studyGroups || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load study groups');
      setStudyGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Business', label: 'Business' },
    { value: 'Languages', label: 'Languages' }
  ];

  const handleJoinGroup = async (groupId: string) => {
    try {
      await apiService.joinStudyGroup(groupId);
      // Reload groups to update member count
      loadStudyGroups();
    } catch (err: any) {
      alert(err.message || 'Failed to join study group');
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[(difficulty || 'Intermediate') as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Groups</h1>
          <p className="text-xl text-gray-600">Join collaborative study sessions and excel together</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  {subjects.map(subject => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Group
              </button>
            </div>
          </div>
        </div>

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGroups.map((group) => (
            <div key={group._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getDifficultyColor(group.difficulty || 'Intermediate')}`}>
                    {group.difficulty || 'Intermediate'}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{group.rating || '4.5'}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-green-600 font-medium text-sm mb-3">{group.subject}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{group.description}</p>
                
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{group.members?.length || 0}/{group.maxMembers} members</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{group.meetingSchedule}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{group.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(group.tags || [group.subject]).map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    by {group.createdBy?.firstName} {group.createdBy?.lastName}
                  </span>
                  <button 
                    onClick={() => handleJoinGroup(group._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {studyGroups.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {error ? 'Error loading study groups' : 'No study groups found'}
            </h3>
            <p className="text-gray-600">
              {error || 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGroupsPage;