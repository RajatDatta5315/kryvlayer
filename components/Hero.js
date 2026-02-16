export default function Hero() {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
        Unlimited SEO Pages in 1 Click
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        Generate thousands of AI-powered landing pages instantly. 
        No coding. No setup headaches.
      </p>
      <a 
        href="/dashboard"
        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform"
      >
        Start Building →
      </a>
    </div>
  )
}
