import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'AI Tools',
      description: 'Discover cutting-edge AI tools to boost your productivity and creativity.',
      icon: '🤖'
    },
    {
      title: 'YouTube Channels',
      description: 'Find the best educational YouTube channels for learning and skill development.',
      icon: '📺'
    },
    {
      title: 'Online Courses',
      description: 'Access comprehensive courses from top platforms and institutions.',
      icon: '🎓'
    },
    {
      title: 'Websites & Resources',
      description: 'Explore curated websites and resources for developers and students.',
      icon: '🌐'
    }
  ];

  const stats = [
    { label: 'AI Tools', value: '500+' },
    { label: 'YouTube Channels', value: '200+' },
    { label: 'Courses', value: '1000+' },
    { label: 'Happy Users', value: '10K+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/app.logo.jpg" 
                alt="Sankat Mochan Logo" 
                className="h-24 w-24 rounded-2xl object-cover shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover the Best{' '}
              <span className="gradient-text">AI Tools</span>
              <br />
              for Learning & Development
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your one-stop platform to find AI tools, YouTube channels, courses, and websites 
              tailored for students and developers. Start your learning journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/search"
                className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
              >
                <span>🔍</span>
                <span>Start Searching</span>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="btn-outline text-lg px-8 py-3"
                >
                  Sign Up Free
                </Link>
              )}
            </div>

            {/* Search Preview */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-3 text-gray-500 mb-4">
                  <span>🔍</span>
                  <span className="text-sm">Try searching for:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['ChatGPT alternatives', 'React tutorials', 'Machine Learning courses', 'Design tools'].map((term) => (
                    <Link
                      key={term}
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full text-sm transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover, learn, and grow with our comprehensive collection of resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Accelerate Your Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and developers who are already using Sankat Mochan 
            to discover amazing resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/search"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-md font-medium transition-colors"
                >
                  Explore Resources
                </Link>
              </>
            ) : (
              <Link
                to="/search"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Start Searching</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 