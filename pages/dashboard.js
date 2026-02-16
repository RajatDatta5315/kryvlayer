import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Dashboard() {
  const [user, setUser] = useState({ email: 'demo@kryvlayer.com', id: 1 }) // Demo user
  const [domains, setDomains] = useState([])
  const [showAddDomain, setShowAddDomain] = useState(false)
  const [newDomain, setNewDomain] = useState({
    domain: '',
    websiteUrl: '',
    businessName: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    // Fetch user's domains
    const res = await fetch(`/api/domains/list?userId=${user.id}`)
    const data = await res.json()
    setDomains(data.domains || [])
  }

  const handleAddDomain = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Step 1: Analyze website
      const analyzeRes = await fetch('/api/analyze/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: newDomain.websiteUrl })
      })
      const analysis = await analyzeRes.json()

      // Step 2: Create domain
      const domainRes = await fetch('/api/domains/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDomain,
          userId: user.id,
          keywords: analysis.keywords,
          cities: analysis.cities
        })
      })
      const domainData = await domainRes.json()

      // Step 3: Generate pages
      await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domainData.domainId })
      })

      alert('✅ Domain added! Pages are being generated...')
      setShowAddDomain(false)
      fetchDomains()
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard - KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* Top Bar */}
        <nav className="backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="KRYVLayer" className="w-8 h-8 rounded-lg" />
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">{user.email}</div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-12">
          {/* Add Domain Button */}
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Your Domains</h2>
            <button
              onClick={() => setShowAddDomain(!showAddDomain)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
            >
              + Add Domain
            </button>
          </div>

          {/* Add Domain Form */}
          {showAddDomain && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Add New Domain</h3>
              <form onSubmit={handleAddDomain} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Your Website URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://mycompany.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    value={newDomain.websiteUrl}
                    onChange={(e) => setNewDomain({...newDomain, websiteUrl: e.target.value})}
                  />
                  <p className="text-sm text-gray-400 mt-2">Our AI will analyze your site automatically</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme SaaS Inc."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    value={newDomain.businessName}
                    onChange={(e) => setNewDomain({...newDomain, businessName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Domain for Landing Pages</label>
                  <input
                    type="text"
                    required
                    placeholder="mycompany.com or subdomain.kryv.network"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    value={newDomain.domain}
                    onChange={(e) => setNewDomain({...newDomain, domain: e.target.value})}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    ⚡ Point your domain to Vercel: <code className="bg-gray-900 px-2 py-1 rounded">76.76.21.21</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg text-white hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? '🚀 Analyzing & Generating...' : 'Add Domain & Generate Pages'}
                </button>
              </form>
            </div>
          )}

          {/* Domains Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domains.map((domain, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{domain.business_name}</h3>
                    <p className="text-purple-400 font-mono text-sm">{domain.domain}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                    Live
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Pages</p>
                    <p className="text-2xl font-bold text-white">{domain.page_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-white">{domain.total_views || 0}</p>
                  </div>
                </div>

                <a 
                  href={`/domain/${domain.id}`}
                  className="block text-center py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                >
                  View All Pages →
                </a>
              </div>
            ))}
          </div>

          {domains.length === 0 && !showAddDomain && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-6">No domains added yet</p>
              <button
                onClick={() => setShowAddDomain(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white hover:scale-105 transition-transform"
              >
                Add Your First Domain
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
