const TEMPLATES = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'High-converting landing page for SaaS products',
    preview: '<!DOCTYPE html><html><body style="background:#0a0a14;color:#fff;font-family:sans-serif;padding:2rem;text-align:center"><h1>{{keyword}} in {{city}}</h1><p>{{businessName}} provides enterprise-grade {{keyword}} solutions.</p><button style="padding:1rem 2rem;background:linear-gradient(135deg,#7c3aed,#db2777);border:none;border-radius:12px;color:#fff;font-weight:700;cursor:pointer">Start Free Trial</button></body></html>'
  },
  {
    id: 'local-business',
    name: 'Local Business',
    description: 'SEO-optimized for local searches',
    preview: '<!DOCTYPE html><html><body style="background:#fff;color:#000;font-family:sans-serif;padding:2rem"><h1>Best {{keyword}} in {{city}}</h1><p>Top-rated {{businessName}} serving {{city}} since 2020.</p><div style="margin-top:2rem"><strong>📍 Location:</strong> {{city}}<br><strong>⭐ Rating:</strong> 4.9/5</div></body></html>'
  },
  {
    id: 'comparison',
    name: 'Comparison Page',
    description: 'Compare products or services',
    preview: '<!DOCTYPE html><html><body style="background:#f8f9fa;color:#000;font-family:sans-serif;padding:2rem"><h1>{{keyword}} Comparison in {{city}}</h1><p>Compare the best {{keyword}} options available in {{city}}.</p><table style="width:100%;margin-top:2rem;border-collapse:collapse"><tr><th style="border:1px solid #ddd;padding:1rem">Feature</th><th style="border:1px solid #ddd;padding:1rem">{{businessName}}</th><th style="border:1px solid #ddd;padding:1rem">Competitor</th></tr><tr><td style="border:1px solid #ddd;padding:1rem">Price</td><td style="border:1px solid #ddd;padding:1rem">$99/mo</td><td style="border:1px solid #ddd;padding:1rem">$149/mo</td></tr></table></body></html>'
  }
]

export default function handler(req, res) {
  return res.status(200).json({ success: true, templates: TEMPLATES })
}
