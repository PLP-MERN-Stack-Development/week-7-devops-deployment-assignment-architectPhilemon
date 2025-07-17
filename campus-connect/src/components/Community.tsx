import React from 'react';
import { Star, Quote } from 'lucide-react';
import AuthModal from './AuthModal';

const Community = () => {
  const [authModal, setAuthModal] = React.useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signup'
  });

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signup' });
  };

  const changeAuthMode = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Senior',
      content: 'Campus Connect helped me find my study group for advanced algorithms. We went from struggling individually to acing our exams together!',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Business Major',
      content: 'I discovered so many networking events through this platform. It\'s been instrumental in building my professional connections.',
      avatar: 'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Psychology Student',
      content: 'The campus chat feature is amazing! I can get help with coursework instantly and have made great friends along the way.',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5
    }
  ];

  return (
    <section id="community" className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Loved by Students Everywhere
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of students who have transformed their campus experience with Campus Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Join Our Community?</h3>
            <p className="text-blue-100 mb-6">Start connecting with your campus today - it's completely free!</p>
            <button 
              onClick={() => openAuthModal('signup')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
            >
              Create Your Profile
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={authModal.isOpen}
          onClose={closeAuthModal}
          mode={authModal.mode}
          onModeChange={changeAuthMode}
        />
      </div>
    </section>
  );
};

export default Community;