import React from 'react';
import { Calendar, Users, BookOpen, MessageCircle, MapPin, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Event Discovery',
      description: 'Find and join campus events, workshops, and activities that match your interests.',
      color: 'text-blue-600',
      path: '/events'
    },
    {
      icon: Users,
      title: 'Study Groups',
      description: 'Form study groups with classmates and collaborate on projects and assignments.',
      color: 'text-green-600',
      path: '/study-groups'
    },
    {
      icon: MessageCircle,
      title: 'Campus Chat',
      description: 'Connect with fellow students, ask questions, and share knowledge in real-time.',
      color: 'text-purple-600',
      path: '/chat'
    },
    {
      icon: BookOpen,
      title: 'Resource Sharing',
      description: 'Share and discover study materials, notes, and academic resources.',
      color: 'text-orange-600',
      path: '/resources'
    },
    {
      icon: MapPin,
      title: 'Campus Navigation',
      description: 'Navigate your campus with interactive maps and location-based services.',
      color: 'text-red-600',
      path: '/navigation'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges and recognition for your campus involvement and achievements.',
      color: 'text-yellow-600',
      path: '/achievements'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Campus Life
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform brings together all the tools and features you need to make the most of your campus experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              to={feature.path}
              key={index}
              className="block bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-6`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
