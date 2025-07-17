import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: 'Tech Startup Workshop',
      date: 'Mar 15, 2025',
      time: '2:00 PM',
      location: 'Innovation Hub',
      attendees: 45,
      category: 'Workshop',
      image: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Study Group: Calculus II',
      date: 'Mar 16, 2025',
      time: '6:00 PM',
      location: 'Library Study Room 3',
      attendees: 12,
      category: 'Study Group',
      image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      title: 'Campus Food Festival',
      date: 'Mar 18, 2025',
      time: '11:00 AM',
      location: 'Main Quad',
      attendees: 230,
      category: 'Social',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Campus Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting events happening around campus and connect with like-minded students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendees}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Join Event
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;