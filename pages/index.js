import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>KRYVLayer - Unlimited SEO Landing Pages</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="Generate unlimited SEO-optimized landing pages for your SaaS instantly" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* Animated Background - Fixed z-index */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '700ms'}}></div>
        </div>

        {/* Navigation - Fixed z-index and mobile padding */}
        <nav className="relative z-20 backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src="/logo.png" 
                  alt="KRYVLayer" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-lg shadow-purple-500/50" 
                />
                <h1 className="text-lg sm:text-2xl font-bold">
                  <span className="text-white">KRYV</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Layer</span>
                </h1>
              </div>
              <a 
                href="/dashboard" 
                className="group relative px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-sm sm:text-base text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                <span className="relative z-10">Get Started</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section - Fixed z-index and mobile padding */}
        <main className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Powered by NEHIRA AI
              </div>

              {/* Main Heading - Responsive text sizes */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
                Generate{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                    Infinite
                  </span>
                  <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8">
                    <path d="M0,4 Q75,0 150,4 T300,4" fill="none" stroke="url(#gradient)" strokeWidth="3"/>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                SEO Landing Pages
              </h2>

              <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Connect your domain. Add your website URL. Our AI reads your site and generates 
                <span className="text-purple-400 font-semibold"> thousands of unique landing pages</span> automatically.
              </p>

              {/* CTA Buttons - Mobile friendly */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-20 px-4">
                <a 
                  href="/dashboard"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-base sm:text-lg font-bold text-white overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                
                <a 
                  href="#how-it-works"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-base sm:text-lg font-semibold text-white hover:bg-white/10 transition-all"
                >
                  See How It Works
                </a>
              </div>

              {/* Stats Grid - Mobile responsive */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto mb-12 sm:mb-20 px-4">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:bg-white/10 transition-all">
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-1 sm:mb-2">∞</div>
                  <div className="text-gray-400 font-medium text-xs sm:text-base">Landing Pages</div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:bg-white/10 transition-all">
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-1 sm:mb-2">1-Click</div>
                  <div className="text-gray-400 font-medium text-xs sm:text-base">Setup</div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:bg-white/10 transition-all">
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-1 sm:mb-2">AI</div>
                  <div className="text-gray-400 font-medium text-xs sm:text-base">Powered</div>
                </div>
              </div>
            </div>

            {/* How It Works - Mobile padding fixed */}
            <div id="how-it-works" className="max-w-6xl mx-auto mt-16 sm:mt-32 px-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-8 sm:mb-16">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    step: '1',
                    title: 'Connect Your Website',
                    description: 'Add your website URL and connect your domain once. That\'s all the setup you need.',
                    icon: '🔗'
                  },
                  {
                    step: '2',
                    title: 'AI Analyzes & Generates',
                    description: 'Our NEHIRA AI reads your site, extracts keywords, and creates 1000+ unique landing pages.',
                    icon: '🤖'
                  },
                  {
                    step: '3',
                    title: 'Pages Go Live',
                    description: 'All pages are instantly live on YOUR domain with SEO-optimized content.',
                    icon: '🚀'
                  }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="group relative backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-purple-500/50 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all"></div>
                    <div className="relative z-10">
                      <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{item.icon}</div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {item.step}
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Pages - Mobile friendly */}
            <div className="max-w-4xl mx-auto mt-16 sm:mt-32 px-4">
              <h3 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-8">
                Example Generated Pages
              </h3>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8">
                <div className="space-y-2 sm:space-y-3 font-mono text-xs sm:text-sm">
                  {[
                    'yourdomain.com/crm-software-london',
                    'yourdomain.com/project-management-new-york',
                    'yourdomain.com/inventory-system-toronto',
                    'yourdomain.com/fintech-saas-singapore',
                    'yourdomain.com/real-estate-platform-dubai'
                  ].map((url, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-purple-400 transition-colors">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="break-all">{url}</span>
                    </div>
                  ))}
                  <div className="pt-3 sm:pt-4 text-purple-400 font-semibold text-xs sm:text-sm">
                    + Thousands more auto-generated...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 mt-16 sm:mt-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-gray-400 text-sm">
            <p>© 2026 KRYVLayer. Powered by NEHIRA AI.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
