import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Calendar, BookOpen, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription();
      }
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription();
      } else {
        setSubscription(null);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  const changeAuthMode = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return null;
    
    if (subscription.subscription_status === 'active') {
      return (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Campus Connect Pro
        </span>
      );
    }
    
    return null;
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/Campus Connect Logo with Bright Yellow Accents.png" 
                alt="Campus Connect" 
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-gray-900">Campus Connect</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Features</a>
              <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Events</a>
              <a href="#community" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Community</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">About</a>
            </nav>

            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">
                    Welcome, {user.user_metadata?.first_name || user.email}!
                  </span>
                  {getSubscriptionStatus()}
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => openAuthModal('signin')}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Join Now
                </button>
              </div>
            )}

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Features</a>
                <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Events</a>
                <a href="#community" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Community</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">About</a>
                {user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-2">
                      <span className="text-gray-700">
                        Welcome, {user.user_metadata?.first_name || user.email}!
                      </span>
                      {getSubscriptionStatus()}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => openAuthModal('signin')}
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => openAuthModal('signup')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Join Now
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onModeChange={changeAuthMode}
      />
    </>
  );
};

export default Header;