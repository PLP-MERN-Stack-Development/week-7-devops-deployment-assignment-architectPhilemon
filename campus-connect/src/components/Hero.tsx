import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import AuthModal from './AuthModal';
import { motion } from 'framer-motion';

const Hero = () => {
  const [authModal, setAuthModal] = React.useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
  }>({
    isOpen: false,
    mode: 'signup',
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

  return (
    <>
      <section className="relative h-full overflow-hidden">
        {/* Animated background using Framer Motion */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1400&q=80')", // Replace with your image path
          }}
        />

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-20 py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Connect, Learn, and
            <span className="text-blue-400 block">Grow Together</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students, faculty, and staff in building a vibrant campus community.
            Discover events, form study groups, and create lasting connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => openAuthModal('signup')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 px-6 py-4">
              <Play className="h-5 w-5" />
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
              <div>Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1,200+</div>
              <div>Campus Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">300+</div>
              <div>Universities</div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onModeChange={changeAuthMode}
      />
    </>
  );
};

export default Hero;
