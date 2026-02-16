import { useState } from 'react'
import Head from 'next/head'

export default function Dashboard() {
  const [step, setStep] = useState(1)
  const [businessData, setBusinessData] = useState({
    businessName: '',
    industry: '',
    targetCities: '',
    domain: '',
    keywords: ''
  })
  const [loading, setLoading] = useState(false)
  const [generatedPages, setGeneratedPages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Step 1: Save business setup
      const setupRes = await fetch('/api/business/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData)
      })
      const setupData = await setupRes.json()

      if (setupData.success) {
        setStep(2)
        
        // Step 2: Generate pages
        const genRes = await fetch('/api/generate/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessId: setupData.businessId })
        })
        const genData = await genRes.json()
        
        setGeneratedPages(genData.pages || [])
        setStep(3)
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
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        <nav className="container mx-auto px-4 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">KRYV<span className="text-purple-400">Layer</span> Dashboard</h1>
        </nav>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            <div className={`flex items-center ${step >= 1 ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600' : 'bg-gray-700'}`}>1</div>
              <span className="ml-2">Business Setup</span>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600' : 'bg-gray-700'}`}>2</div>
              <span className="ml-2">Generating</span>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600' : 'bg-gray-700'}`}>3</div>
              <span className="ml-2">Live Pages</span>
            </div>
          </div>

          {/* Step 1: Setup Form */}
          {step === 1 && (
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10">
              <h2 className="text-3xl font-bold mb-6">One-Time Setup</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold">Business Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                    placeholder="e.g., Acme SaaS"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Industry/Service</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                    placeholder="e.g., Real Estate SaaS, Fintech, Healthcare"
                    value={businessData.industry}
                    onChange={(e) => setBusinessData({...businessData, industry: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Target Keywords (comma-separated)</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                    placeholder="e.g., CRM software, project management, inventory system"
                    value={businessData.keywords}
                    onChange={(e) => setBusinessData({...businessData, keywords: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Target Cities (comma-separated)</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                    placeholder="e.g., London, New York, Toronto, Sydney"
                    value={businessData.targetCities}
                    onChange={(e) => setBusinessData({...businessData, targetCities: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Your Domain</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                    placeholder="e.g., mycompany.com or use subdomain.kryv.network"
                    value={businessData.domain}
                    onChange={(e) => setBusinessData({...businessData, domain: e.target.value})}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Or use free subdomain: yourname.kryv.network
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 py-4 rounded-lg font-bold text-lg hover:bg-purple-500 transition disabled:opacity-50"
                >
                  {loading ? 'Setting Up...' : 'Generate Pages →'}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Generating */}
          {step === 2 && (
            <div className="bg-white/5 backdrop-blur-lg p-12 rounded-xl border border-white/10 text-center">
              <div className="animate-spin w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">Generating Your Pages...</h2>
              <p className="text-gray-400">Our AI is creating unique content for each landing page. This takes about 30 seconds.</p>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">Pages Generated!</h2>
                <p className="text-gray-400">Your landing pages are now live at:</p>
                <p className="text-purple-400 font-mono text-lg mt-2">{businessData.domain}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-xl mb-4">Live Pages ({generatedPages.length}):</h3>
                {generatedPages.slice(0, 10).map((page, i) => (
                  <a
                    key={i}
                    href={`/${page.slug}`}
                    target="_blank"
                    className="block bg-white/5 p-4 rounded-lg border border-white/10 hover:border-purple-400 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-purple-300">/{page.slug}</span>
                      <span className="text-xs text-gray-500">→</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{page.title}</div>
                  </a>
                ))}
                {generatedPages.length > 10 && (
                  <p className="text-gray-400 text-center pt-4">
                    + {generatedPages.length - 10} more pages...
                  </p>
                )}
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full mt-8 bg-purple-600 py-3 rounded-lg font-bold hover:bg-purple-500 transition"
              >
                Create Another Campaign
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </>
  )
}
