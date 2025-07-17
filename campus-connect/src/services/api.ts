import { supabase } from '../lib/supabase';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Events API
  async getEvents(params?: { category?: string; search?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    return this.request(`/events?${queryParams}`);
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async joinEvent(id: string) {
    return this.request(`/events/${id}/join`, { method: 'POST' });
  }

  async leaveEvent(id: string) {
    return this.request(`/events/${id}/leave`, { method: 'POST' });
  }

  // Study Groups API
  async getStudyGroups(params?: { subject?: string; search?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.subject) queryParams.append('subject', params.subject);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    return this.request(`/study-groups?${queryParams}`);
  }

  async getStudyGroup(id: string) {
    return this.request(`/study-groups/${id}`);
  }

  async createStudyGroup(groupData: any) {
    return this.request('/study-groups', {
      method: 'POST',
      body: JSON.stringify(groupData)
    });
  }

  async joinStudyGroup(id: string) {
    return this.request(`/study-groups/${id}/join`, { method: 'POST' });
  }

  async leaveStudyGroup(id: string) {
    return this.request(`/study-groups/${id}/leave`, { method: 'POST' });
  }

  async getUserStudyGroups() {
    return this.request('/study-groups/user/my-groups');
  }

  // Chat API
  async getChatRooms() {
    return this.request('/chat/rooms');
  }

  async createDirectRoom(recipientId: string) {
    return this.request('/chat/rooms/direct', {
      method: 'POST',
      body: JSON.stringify({ recipientId })
    });
  }

  async createGroupRoom(name: string, participantIds: string[]) {
    return this.request('/chat/rooms/group', {
      method: 'POST',
      body: JSON.stringify({ name, participantIds })
    });
  }

  async getRoomMessages(roomId: string, limit = 50, offset = 0) {
    return this.request(`/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(roomId: string, content: string, type = 'text') {
    return this.request(`/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type })
    });
  }

  // Resources API
  async getResources(params?: { type?: string; subject?: string; search?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.subject) queryParams.append('subject', params.subject);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    return this.request(`/resources?${queryParams}`);
  }

  async getResource(id: string) {
    return this.request(`/resources/${id}`);
  }

  async uploadResource(resourceData: any) {
    return this.request('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData)
    });
  }

  async downloadResource(id: string) {
    return this.request(`/resources/${id}/download`, { method: 'POST' });
  }

  async rateResource(id: string, rating: number) {
    return this.request(`/resources/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    });
  }

  async getUserResources() {
    return this.request('/resources/user/my-uploads');
  }

  async getPopularResources() {
    return this.request('/resources/popular/trending');
  }

  // Users API
  async getUserProfile(id: string) {
    return this.request(`/users/profile/${id}`);
  }

  async updateUserProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async searchUsers(params?: { query?: string; university?: string; major?: string; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.append('query', params.query);
    if (params?.university) queryParams.append('university', params.university);
    if (params?.major) queryParams.append('major', params.major);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.request(`/users/search?${queryParams}`);
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async getUserAchievements() {
    return this.request('/users/achievements');
  }
}

export const apiService = new ApiService();