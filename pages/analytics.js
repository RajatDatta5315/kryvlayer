import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Analytics - KRYVLayer</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">📊 Analytics Dashboard</h1>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-2xl">
              <p className="text-purple-300 text-sm mb-2">Total Pages</p>
              <p className="text-4xl font-bold">{stats?.totalPages || 0}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-2xl">
              <p className="text-blue-300 text-sm mb-2">Total Views</p>
              <p className="text-4xl font-bold">{stats?.totalViews || 0}</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-900 to-pink-800 p-6 rounded-2xl">
              <p className="text-pink-300 text-sm mb-2">Businesses</p>
              <p className="text-4xl font-bold">{stats?.totalBusinesses || 0}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-2xl">
              <p className="text-green-300 text-sm mb-2">Avg. Views/Page</p>
              <p className="text-4xl font-bold">
                {stats?.avgViewsPerPage?.toFixed(1) || 0}
              </p>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">🔥 Top Performing Pages</h2>
            <div className="space-y-4">
              {stats?.topPages?.map((page, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-purple-400 font-mono text-sm">/{page.slug}</p>
                    <p className="text-gray-300">{page.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{page.views}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
