import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { products } from '../stripe-config';
import AuthModal from './AuthModal';

const PricingSection = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signup'
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

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) {
      setAuthModal({ isOpen: true, mode: 'signup' });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscribed = subscription?.subscription_status === 'active';

  const features = [
    'Access to all campus events',
    'Join unlimited study groups',
    'Real-time campus chat',
    'Resource sharing platform',
    'Interactive campus navigation',
    'Achievement tracking system',
    'Priority customer support',
    'Early access to new features'
  ];

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Campus Connect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get full access to all features and connect with your campus community
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                      {product.mode === 'subscription' && (
                        <span className="text-gray-600 ml-2">/month</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(product.priceId, product.mode)}
                    disabled={isLoading || isSubscribed}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                      isSubscribed
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Processing...
                      </>
                    ) : isSubscribed ? (
                      'Currently Subscribed'
                    ) : (
                      `Subscribe to ${product.name}`
                    )}
                  </button>

                  {isSubscribed && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      You have full access to all Campus Connect features
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Questions about our pricing? Need help choosing the right plan?
            </p>
            <a 
              href="mailto:support@campusconnect.edu" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact our support team
            </a>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signup' })}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ isOpen: true, mode })}
      />
    </>
  );
};

export default PricingSection;