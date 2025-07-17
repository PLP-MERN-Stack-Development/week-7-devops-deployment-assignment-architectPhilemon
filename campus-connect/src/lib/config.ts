// Application configuration for different environments

interface Config {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  stripePublishableKey: string;
  environment: 'development' | 'production';
  features: {
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
  };
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  environment: (import.meta.env.NODE_ENV as 'development' | 'production') || 'development',
  features: {
    enableAnalytics: import.meta.env.NODE_ENV === 'production',
    enableErrorReporting: import.meta.env.NODE_ENV === 'production',
    enablePerformanceMonitoring: import.meta.env.NODE_ENV === 'production',
  }
};

// Validate required configuration
const validateConfig = () => {
  const requiredFields = ['supabaseUrl', 'supabaseAnonKey'];
  
  for (const field of requiredFields) {
    if (!config[field as keyof Config]) {
      throw new Error(`Missing required configuration: ${field}`);
    }
  }
  
  if (config.environment === 'production' && !config.stripePublishableKey) {
    console.warn('Warning: Stripe publishable key not configured for production');
  }
};

// Validate configuration on import
validateConfig();

export default config;