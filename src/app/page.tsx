'use client'

import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🎓 Student Doubt Solver
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Choose your preferred version of the application
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Original HTML Version */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Original HTML Version
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>✅ Vanilla JavaScript</li>
                <li>✅ Original dark theme</li>
                <li>✅ All features from your HTML file</li>
                <li>✅ React CDN integration</li>
                <li>✅ Complete functionality</li>
              </ul>
              <button 
                onClick={() => {
                  window.location.href = '/original'
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-block text-center mb-2"
              >
                Open Original HTML App
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Or{' '}
                <a 
                  href="/original" 
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  click here for direct access
                </a>
              </p>
            </div>

            {/* React Version */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Modern React Version
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>✅ Modern React hooks</li>
                <li>✅ TypeScript support</li>
                <li>✅ Tailwind CSS styling</li>
                <li>✅ Component architecture</li>
                <li>✅ Better maintainability</li>
              </ul>
              <button 
                onClick={() => window.location.href = '/react-app'}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Open React App
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Quick Start Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">For Original HTML Version:</h3>
              <ol className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>1. Click "Open Original HTML App" button</li>
                <li>2. Or visit: 
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded ml-2 text-sm">
                    /original
                  </code>
                </li>
                <li>3. Use demo accounts: admin/password123</li>
                <li>4. All your original features work</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">For React Version:</h3>
              <ol className="text-gray-600 dark:text-gray-400 space-y-2">
                <li>1. Click "Switch to React App"</li>
                <li>2. Modern component architecture</li>
                <li>3. TypeScript type safety</li>
                <li>4. Tailwind CSS styling</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Demo Accounts & Direct Links:</h4>
            <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
              <div>
                <p><strong>Demo Accounts:</strong></p>
                <p><strong>admin</strong> / password123</p>
                <p><strong>user</strong> / mypass</p>
                <p><strong>student</strong> / study123</p>
              </div>
              <div className="mt-4">
                <p><strong>Direct URLs:</strong></p>
                <p>Original HTML: 
                  <a 
                    href="/original" 
                    className="underline hover:text-blue-500 ml-1"
                  >
                    /original
                  </a>
                </p>
                <p>React Version: 
                  <a 
                    href="/react-app" 
                    className="underline hover:text-blue-500 ml-1"
                  >
                    /react-app
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}