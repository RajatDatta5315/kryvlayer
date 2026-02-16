export default function PagePreview({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6">🎉 {pages.length} Pages Live!</h3>
      
      <div className="grid gap-4">
        {pages.slice(0, 10).map((page, i) => (
          <a
            key={i}
            href={`/${page.slug}`}
            target="_blank"
            className="group bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-400 font-mono text-sm mb-2">/{page.slug}</p>
                <p className="text-white font-semibold group-hover:text-purple-300 transition">
                  {page.title}
                </p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </a>
        ))}
        
        {pages.length > 10 && (
          <p className="text-center text-gray-400 py-4">
            + {pages.length - 10} more pages available
          </p>
        )}
      </div>
    </div>
  )
}
