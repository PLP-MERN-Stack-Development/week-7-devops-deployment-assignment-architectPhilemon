import React, { useState } from 'react';
import { MapPin, Navigation, Search, Clock, Phone, Wifi, Coffee, Book, Car } from 'lucide-react';

const NavigationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const campusLocations = [
    {
      id: 1,
      name: 'Main Library',
      category: 'academic',
      description: 'Central library with study spaces, computer labs, and extensive book collection',
      hours: 'Mon-Fri: 7AM-11PM, Sat-Sun: 9AM-9PM',
      phone: '+1 (555) 123-4567',
      amenities: ['WiFi', 'Study Rooms', 'Computers', 'Printing'],
      coordinates: { lat: 40.7128, lng: -74.0060 },
      image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Student Union Building',
      category: 'social',
      description: 'Hub for student activities, dining, and campus organizations',
      hours: 'Mon-Fri: 6AM-12AM, Sat-Sun: 8AM-12AM',
      phone: '+1 (555) 123-4568',
      amenities: ['Food Court', 'Meeting Rooms', 'ATM', 'Bookstore'],
      coordinates: { lat: 40.7130, lng: -74.0058 },
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Computer Science Building',
      category: 'academic',
      description: 'State-of-the-art computer labs and classrooms for CS programs',
      hours: 'Mon-Fri: 7AM-10PM, Sat-Sun: 9AM-6PM',
      phone: '+1 (555) 123-4569',
      amenities: ['Computer Labs', 'WiFi', 'Study Areas', 'Printing'],
      coordinates: { lat: 40.7125, lng: -74.0065 },
      image: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Recreation Center',
      category: 'recreation',
      description: 'Fitness facilities, gymnasium, and sports equipment rental',
      hours: 'Mon-Fri: 5AM-11PM, Sat-Sun: 7AM-10PM',
      phone: '+1 (555) 123-4570',
      amenities: ['Gym', 'Pool', 'Courts', 'Locker Rooms'],
      coordinates: { lat: 40.7135, lng: -74.0055 },
      image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'Campus Dining Hall',
      category: 'dining',
      description: 'Main dining facility with diverse meal options and meal plans',
      hours: 'Mon-Fri: 7AM-9PM, Sat-Sun: 8AM-8PM',
      phone: '+1 (555) 123-4571',
      amenities: ['All-You-Can-Eat', 'Vegetarian Options', 'Takeout', 'Catering'],
      coordinates: { lat: 40.7132, lng: -74.0062 },
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      name: 'Parking Garage A',
      category: 'parking',
      description: 'Multi-level parking structure for students, faculty, and visitors',
      hours: '24/7 Access',
      phone: '+1 (555) 123-4572',
      amenities: ['Covered Parking', 'Security Cameras', 'Electric Charging', 'Handicap Access'],
      coordinates: { lat: 40.7120, lng: -74.0070 },
      image: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 7,
      name: 'Science Laboratory Complex',
      category: 'academic',
      description: 'Advanced research facilities for chemistry, biology, and physics',
      hours: 'Mon-Fri: 7AM-9PM, Sat: 9AM-5PM',
      phone: '+1 (555) 123-4573',
      amenities: ['Research Labs', 'Safety Equipment', 'Specialized Equipment', 'Study Areas'],
      coordinates: { lat: 40.7127, lng: -74.0067 },
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 8,
      name: 'Campus Coffee Shop',
      category: 'dining',
      description: 'Cozy coffee shop with study spaces and light snacks',
      hours: 'Mon-Fri: 6AM-8PM, Sat-Sun: 8AM-6PM',
      phone: '+1 (555) 123-4574',
      amenities: ['Coffee', 'Pastries', 'WiFi', 'Study Seating'],
      coordinates: { lat: 40.7133, lng: -74.0059 },
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Locations', icon: MapPin },
    { value: 'academic', label: 'Academic', icon: Book },
    { value: 'dining', label: 'Dining', icon: Coffee },
    { value: 'recreation', label: 'Recreation', icon: Navigation },
    { value: 'social', label: 'Social', icon: MapPin },
    { value: 'parking', label: 'Parking', icon: Car }
  ];

  const filteredLocations = campusLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      dining: 'bg-green-100 text-green-800',
      recreation: 'bg-purple-100 text-purple-800',
      social: 'bg-orange-100 text-orange-800',
      parking: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: any } = {
      'WiFi': Wifi,
      'Coffee': Coffee,
      'Study Rooms': Book,
      'Computers': Book,
      'Gym': Navigation,
      'Pool': Navigation,
      'Food Court': Coffee,
      'Parking': Car
    };
    return icons[amenity] || MapPin;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campus Navigation</h1>
          <p className="text-xl text-gray-600">Find buildings, facilities, and services across campus</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.value
                        ? 'bg-red-600 text-white'
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
        </div>

        {/* Campus Map Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Campus Map</h2>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map will be displayed here</p>
              <p className="text-sm text-gray-500">Click on locations below to view on map</p>
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div key={location.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src={location.image} 
                alt={location.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getCategoryColor(location.category)}`}>
                    {location.category}
                  </span>
                  <button className="text-red-600 hover:text-red-700">
                    <Navigation className="h-5 w-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{location.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{location.description}</p>
                
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {location.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                        {React.createElement(getAmenityIcon(amenity), { className: "h-3 w-3" })}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm flex items-center justify-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Access Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <Car className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Parking</span>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <Coffee className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Dining</span>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <Book className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Libraries</span>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <Wifi className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium">WiFi Zones</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;