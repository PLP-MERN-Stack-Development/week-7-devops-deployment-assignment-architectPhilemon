import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Star, Upload, Search, Filter, FileText, Video, Image, File } from 'lucide-react';
import { apiService } from '../services/api';

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResources();
  }, [selectedType, selectedSubject, searchTerm]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await apiService.getResources({
        type: selectedType,
        subject: selectedSubject,
        search: searchTerm,
        limit: 20
      });
      setResources(data.resources || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'notes', label: 'Notes' },
    { value: 'cheatsheet', label: 'Cheat Sheets' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'textbook', label: 'Textbooks' },
    { value: 'video', label: 'Videos' },
    { value: 'other', label: 'Other' }
  ];

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Business', label: 'Business' },
    { value: 'Engineering', label: 'Engineering' }
  ];

  const handleDownload = async (resourceId: string) => {
    try {
      const data = await apiService.downloadResource(resourceId);
      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank');
      // Reload resources to update download count
      loadResources();
    } catch (err: any) {
      alert(err.message || 'Failed to download resource');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      notes: FileText,
      cheatsheet: BookOpen,
      assignment: File,
      textbook: BookOpen,
      video: Video,
      other: File
    };
    return icons[type as keyof typeof icons] || File;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      notes: 'bg-blue-100 text-blue-800',
      cheatsheet: 'bg-green-100 text-green-800',
      assignment: 'bg-purple-100 text-purple-800',
      textbook: 'bg-orange-100 text-orange-800',
      video: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Resources</h1>
          <p className="text-xl text-gray-600">Share and discover study materials, notes, and academic content</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                {subjects.map(subject => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Upload Resource
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div key={resource._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                      <TypeIcon className="inline h-4 w-4 mr-1" />
                      {resource.type}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{resource.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({resource.ratingCount})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-orange-600 font-medium text-sm mb-1">{resource.subject}</p>
                  <p className="text-gray-500 text-sm mb-3">{resource.course}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(resource.tags || []).map((tag: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>by {resource.uploadedBy?.firstName} {resource.uploadedBy?.lastName}</span>
                    <span>{formatDate(resource.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      {resource.downloads} downloads
                    </div>
                    <button 
                      onClick={() => handleDownload(resource._id)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {resources.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {error ? 'Error loading resources' : 'No resources found'}
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

export default ResourcesPage;