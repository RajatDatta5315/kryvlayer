import { useState } from 'react'

export default function SetupForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    keywords: '',
    targetCities: '',
    domain: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Business Name (e.g., Acme SaaS)"
        required
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        value={formData.businessName}
        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
      />
      
      <input
        type="text"
        placeholder="Industry (e.g., Real Estate SaaS)"
        required
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        value={formData.industry}
        onChange={(e) => setFormData({...formData, industry: e.target.value})}
      />

      <textarea
        placeholder="Keywords (comma-separated: CRM software, project management)"
        required
        rows="3"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        value={formData.keywords}
        onChange={(e) => setFormData({...formData, keywords: e.target.value})}
      />

      <textarea
        placeholder="Cities (comma-separated: London, New York, Toronto)"
        required
        rows="3"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        value={formData.targetCities}
        onChange={(e) => setFormData({...formData, targetCities: e.target.value})}
      />

      <input
        type="text"
        placeholder="Domain (or use: yourname.kryv.network)"
        required
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
        value={formData.domain}
        onChange={(e) => setFormData({...formData, domain: e.target.value})}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '🚀 Generating Pages...' : 'Generate My Pages →'}
      </button>
    </form>
  )
}
