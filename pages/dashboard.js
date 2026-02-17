import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Dashboard() {
  const [user, setUser] = useState({ email: 'demo@kryvlayer.com', id: 'user_123' })
  const [hasDatabaseConnected, setHasDatabaseConnected] = useState(false)
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false)
  const [databaseUrl, setDatabaseUrl] = useState('')
  const [domains, setDomains] = useState([])
  const [showAddDomain, setShowAddDomain] = useState(false)
  const [newDomain, setNewDomain] = useState({
    domain: '',
    websiteUrl: '',
    businessName: ''
  })
  const [loading, setLoading] = useState(false)

  const handleConnectDatabase = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/user/connect-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          databaseUrl: databaseUrl,
          databaseType: 'postgres'
        })
      })

      const data = await res.json()

      if (data.success) {
        setHasDatabaseConnected(true)
        setShowDatabaseSetup(false)
        alert('✅ Database connected!')
      } else {
        alert('❌ Connection failed: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDomain = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const analyzeRes = await fetch('/api/analyze/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: newDomain.websiteUrl })
      })
      const analysis = await analyzeRes.json()

      const domainRes = await fetch('/api/domains/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDomain,
          userId: user.id
        })
      })
      const domainData = await domainRes.json()

      if (domainData.success) {
        await fetch('/api/generate/auto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domainId: domainData.domainId })
        })

        alert('✅ Domain added! Pages are generating...')
        setShowAddDomain(false)
        setNewDomain({ domain: '', websiteUrl: '', businessName: '' })
      }
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <nav className="backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="KRYVLayer" className="w-8 h-8 rounded-lg" />
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">{user.email}</div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
          {/* Database Setup */}
          {!hasDatabaseConnected && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                🎉 Connect Your Database (Free Forever!)
              </h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Bring your own FREE Neon/Supabase database. Each user gets their own isolated storage - unlimited scaling!
              </p>

              {!showDatabaseSetup ? (
                <button
                  onClick={() => setShowDatabaseSetup(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
                >
                  Connect My Database
                </button>
              ) : (
                <form onSubmit={handleConnectDatabase} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold text-sm">
                      Database Connection URL (Postgres)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="postgresql://user:password@host/database"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      value={databaseUrl}
                      onChange={(e) => setDatabaseUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Get free database at <a href="https://neon.tech" target="_blank" className="text-purple-400 hover:underline">Neon.tech</a> or <a href="https://supabase.com" target="_blank" className="text-purple-400 hover:underline">Supabase.com</a>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {loading ? 'Connecting...' : 'Connect'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDatabaseSetup(false)}
                      className="px-6 py-3 bg-gray-800 rounded-lg font-semibold text-white hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Add Domain Section */}
          {hasDatabaseConnected && (
            <>
              <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Domains</h2>
                <button
                  onClick={() => setShowAddDomain(!showAddDomain)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
                >
                  + Add Domain
                </button>
              </div>

              {showAddDomain && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Add New Domain</h3>
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
                        placeholder="mycompany.com"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        value={newDomain.domain}
                        onChange={(e) => setNewDomain({...newDomain, domain: e.target.value})}
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        ⚡ Connect to KRYVLayer: Add CNAME record pointing to your-project.vercel.app
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
            </>
          )}
        </main>
      </div>
    </>
  )
}
