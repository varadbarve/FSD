'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, Check, Moon, Sun, Trash2 } from 'lucide-react'

// Types
interface Doubt {
  id: number
  subject: string
  question: string
  answers: string[]
  isResolved: boolean
  createdAt: Date
}

interface User {
  username: string
  email: string
}

// Sample data
const initialDoubts: Doubt[] = [
  {
    id: 1,
    subject: 'Sample: CSS',
    question: 'How do I center a div both vertically and horizontally?',
    answers: ['You can use Flexbox! Set the parent container to display: flex;, justify-content: center;, and align-items: center;.'],
    isResolved: false,
    createdAt: new Date()
  },
  {
    id: 2,
    subject: 'Sample: Math',
    question: 'What is the Pythagorean theorem?',
    answers: ['In a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides: a² + b² = c².'],
    isResolved: true,
    createdAt: new Date()
  }
]

const defaultUsers = {
  'admin': 'password123',
  'user': 'mypass',
  'student': 'study123'
}

export default function ReactApp() {
  const [doubts, setDoubts] = useState<Doubt[]>(initialDoubts)
  const [filteredDoubts, setFilteredDoubts] = useState<Doubt[]>(initialDoubts)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  // Form states
  const [showLogin, setShowLogin] = useState(true)
  const [isSignup, setIsSignup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  
  // New doubt form
  const [newSubject, setNewSubject] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  
  // Login form
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDoubts = localStorage.getItem('react-doubts')
      const savedUser = localStorage.getItem('react-doubtUser')
      const savedTheme = localStorage.getItem('react-isDarkMode')
      
      if (savedDoubts) {
        const parsed = JSON.parse(savedDoubts)
        setDoubts(parsed)
        setFilteredDoubts(parsed)
      }
      
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser))
        setShowLogin(false)
      }
      
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true')
      }
    }
  }, [])

  // Apply theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode])

  // Filter and search doubts
  useEffect(() => {
    let filtered = doubts.filter((doubt: Doubt) => {
      const matchesSearch = doubt.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doubt.question.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filter === 'resolved') return matchesSearch && doubt.isResolved
      if (filter === 'unresolved') return matchesSearch && !doubt.isResolved
      return matchesSearch
    })
    
    setFilteredDoubts(filtered)
  }, [doubts, searchTerm, filter])

  // Save to localStorage with react prefix to avoid conflicts
  const saveDoubts = (newDoubts: Doubt[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('react-doubts', JSON.stringify(newDoubts))
    }
  }

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSignup) {
      const newUser = { username, email }
      setCurrentUser(newUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('react-doubtUser', JSON.stringify(newUser))
        localStorage.setItem('react-userAccounts', JSON.stringify({
          ...defaultUsers,
          [username]: password
        }))
      }
      setShowLogin(false)
    } else {
      const users = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('react-userAccounts') || JSON.stringify(defaultUsers))
        : defaultUsers
      
      if (users[username] === password) {
        const user = { username, email: `${username}@example.com` }
        setCurrentUser(user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('react-doubtUser', JSON.stringify(user))
        }
        setShowLogin(false)
      } else {
        alert('Invalid credentials!')
      }
    }
    
    setUsername('')
    setPassword('')
    setEmail('')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('react-doubtUser')
    }
    setShowLogin(true)
  }

  // Doubt management
  const addDoubt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim() || !newQuestion.trim()) return

    const newDoubt: Doubt = {
      id: Date.now(),
      subject: newSubject,
      question: newQuestion,
      answers: [],
      isResolved: false,
      createdAt: new Date()
    }

    const updatedDoubts = [newDoubt, ...doubts]
    setDoubts(updatedDoubts)
    saveDoubts(updatedDoubts)
    setNewSubject('')
    setNewQuestion('')
  }

  const addAnswer = (doubtId: number, answer: string) => {
    if (!answer.trim()) return

    const updatedDoubts = doubts.map((doubt: Doubt) =>
      doubt.id === doubtId
        ? { ...doubt, answers: [...doubt.answers, answer] }
        : doubt
    )
    setDoubts(updatedDoubts)
    saveDoubts(updatedDoubts)
  }

  const resolveDoubt = (doubtId: number) => {
    const updatedDoubts = doubts.map((doubt: Doubt) =>
      doubt.id === doubtId ? { ...doubt, isResolved: true } : doubt
    )
    setDoubts(updatedDoubts)
    saveDoubts(updatedDoubts)
  }

  const clearResolved = () => {
    if (confirm('Are you sure you want to clear all resolved doubts?')) {
      const updatedDoubts = doubts.filter((doubt: Doubt) => !doubt.isResolved)
      setDoubts(updatedDoubts)
      saveDoubts(updatedDoubts)
    }
  }

  const clearUnresolved = () => {
    if (confirm('Are you sure you want to clear all unresolved doubts?')) {
      const updatedDoubts = doubts.filter((doubt: Doubt) => doubt.isResolved)
      setDoubts(updatedDoubts)
      saveDoubts(updatedDoubts)
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This will log you out and reset everything.')) {
      setDoubts(initialDoubts)
      setCurrentUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('react-doubts')
        localStorage.removeItem('react-doubtUser')
        localStorage.removeItem('react-userAccounts')
        localStorage.removeItem('react-isDarkMode')
      }
      setShowLogin(true)
    }
  }

  // Statistics
  const totalDoubts = doubts.length
  const resolvedCount = doubts.filter((d: Doubt) => d.isResolved).length
  const unresolvedCount = totalDoubts - resolvedCount

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
            >
              ← Back to Home
            </a>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isSignup ? 'Sign Up' : 'Login'} - React Version
            </h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="react-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="react-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            {isSignup && (
              <div>
                <label htmlFor="react-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="react-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="react-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="react-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>
          
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
          
          {!isSignup && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
              <strong>Demo accounts:</strong><br />
              admin / password123<br />
              user / mypass<br />
              student / study123
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a 
                  href="/" 
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Home
                </a>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  🎓 Student Doubt Solver (React)
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsDarkMode(!isDarkMode)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('react-isDarkMode', (!isDarkMode).toString())
                    }
                  }}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={clearAllData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear All Data
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalDoubts}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Doubts</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{resolvedCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Resolved</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{unresolvedCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Unresolved</div>
            </div>
          </div>

          {/* New Doubt Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Post a New Doubt</h2>
            <form onSubmit={addDoubt} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., JavaScript, Calculus, Physics"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Question
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Describe your doubt in detail..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Doubt</span>
              </button>
            </form>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Doubts
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="react-search-input" className="sr-only">
                  Search doubts
                </label>
                <input
                  id="react-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by subject or question..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="react-filter-select" className="sr-only">
                  Filter doubts
                </label>
                <select
                  id="react-filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full md:w-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Doubts</option>
                  <option value="resolved">Resolved Only</option>
                  <option value="unresolved">Unresolved Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Unresolved Doubts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🤔 Unresolved Doubts</h2>
              <button
                onClick={clearUnresolved}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Unresolved</span>
              </button>
            </div>
            <DoubtList
              doubts={filteredDoubts.filter(d => !d.isResolved)}
              onAddAnswer={addAnswer}
              onResolve={resolveDoubt}
              isResolved={false}
            />
          </div>

          {/* Resolved Doubts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">✅ Resolved Doubts</h2>
              <button
                onClick={clearResolved}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Resolved</span>
              </button>
            </div>
            <DoubtList
              doubts={filteredDoubts.filter(d => d.isResolved)}
              onAddAnswer={addAnswer}
              onResolve={resolveDoubt}
              isResolved={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Doubt List Component
function DoubtList({ 
  doubts, 
  onAddAnswer, 
  onResolve, 
  isResolved 
}: {
  doubts: Doubt[]
  onAddAnswer: (id: number, answer: string) => void
  onResolve: (id: number) => void
  isResolved: boolean
}) {
  const [answerInputs, setAnswerInputs] = useState<{ [key: number]: string }>({})

  const handleAnswerSubmit = (doubtId: number, e: React.FormEvent) => {
    e.preventDefault()
    const answer = answerInputs[doubtId]
    if (answer?.trim()) {
      onAddAnswer(doubtId, answer)
      setAnswerInputs({ ...answerInputs, [doubtId]: '' })
    }
  }

  if (doubts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-4">{isResolved ? '✅' : '🤔'}</div>
        <p>No {isResolved ? 'resolved' : 'unresolved'} doubts found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {doubts.map((doubt) => (
        <div
          key={doubt.id}
          className={`doubt-card p-6 ${isResolved ? 'doubt-card-resolved' : 'doubt-card-unresolved'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {doubt.subject}
            </span>
            {!isResolved && (
              <button
                onClick={() => onResolve(doubt.id)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Mark Resolved</span>
              </button>
            )}
          </div>
          
          <p className="text-gray-800 dark:text-gray-200 mb-4 font-medium">
            {doubt.question}
          </p>
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <strong className="text-gray-700 dark:text-gray-300">Answers</strong>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-sm">
                {doubt.answers.length}
              </span>
            </div>
            
            {doubt.answers.length > 0 ? (
              <div className="space-y-2 mb-4">
                {doubt.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-l-green-500"
                  >
                    {answer}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                No answers yet. Be the first to help!
              </p>
            )}
            
            {!isResolved && (
              <form onSubmit={(e) => handleAnswerSubmit(doubt.id, e)} className="flex gap-2">
                <input
                  type="text"
                  value={answerInputs[doubt.id] || ''}
                  onChange={(e) => setAnswerInputs({ ...answerInputs, [doubt.id]: e.target.value })}
                  placeholder="Type your answer..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Answer
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}