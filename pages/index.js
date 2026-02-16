import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>KRYVLayer - Unlimited SEO Landing Pages</title>
        <meta name="description" content="Generate unlimited SEO-optimized landing pages for your SaaS in one click" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        {/* Hero Section */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">KRYV<span className="text-purple-400">Layer</span></h1>
            <a href="/dashboard" className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-500">
              Get Started →
            </a>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl font-bold mb-6">
              Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Unlimited
              </span> SEO Landing Pages
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              One-click setup. Connect your domain. Get thousands of AI-generated, 
              SEO-optimized landing pages instantly.
            </p>
            
            <div className="flex gap-4 justify-center mb-16">
              <a href="/dashboard" className="bg-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-500 transition">
                Start Free
              </a>
              <a href="#how-it-works" className="border border-purple-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-900/30 transition">
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-purple-400">∞</div>
                <div className="text-gray-400">Landing Pages</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">1-Click</div>
                <div className="text-gray-400">Setup</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">AI-Powered</div>
                <div className="text-gray-400">Content</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="mt-32 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-16">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
                <div className="text-3xl mb-4">1️⃣</div>
                <h4 className="text-xl font-bold mb-2">Connect Once</h4>
                <p className="text-gray-400">Add your business info and connect your domain. That's it.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
                <div className="text-3xl mb-4">2️⃣</div>
                <h4 className="text-xl font-bold mb-2">AI Generates</h4>
                <p className="text-gray-400">Our AI creates unique, SEO-optimized content for every page.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
                <div className="text-3xl mb-4">3️⃣</div>
                <h4 className="text-xl font-bold mb-2">Unlimited Pages</h4>
                <p className="text-gray-400">Get thousands of landing pages live on your domain instantly.</p>
              </div>
            </div>
          </div>

          {/* Example Pages */}
          <div className="mt-32 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-8">Example Generated Pages</h3>
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
              <div className="space-y-2 text-sm text-gray-300">
                <div>✓ yourdomain.com/real-estate-saas-london</div>
                <div>✓ yourdomain.com/fintech-saas-new-york</div>
                <div>✓ yourdomain.com/healthcare-saas-toronto</div>
                <div className="text-purple-400">+ Thousands more...</div>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 mt-32 border-t border-white/10 text-center text-gray-400">
          <p>© 2024 KRYVLayer. Powered by NEHIRA AI.</p>
        </footer>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </>
  )
}
