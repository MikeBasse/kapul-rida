import React, { useState, useRef, useEffect } from 'react'

const sampleContent = {
  title: "Introduction to Calculus",
  chapter: "Chapter 3: Derivatives",
  sections: [
    {
      id: 1,
      heading: "3.1 The Derivative Concept",
      content: `The derivative of a function measures the rate at which the function's value changes as its input changes. In simple terms, it tells us how steep the curve is at any given point.

Consider a function f(x). The derivative, denoted f'(x) or df/dx, is defined as:

f'(x) = lim[h→0] (f(x+h) - f(x)) / h

This limit, when it exists, gives us the instantaneous rate of change of f at the point x. Geometrically, this represents the slope of the tangent line to the curve at that point.`
    },
    {
      id: 2,
      heading: "3.2 Basic Differentiation Rules",
      content: `Several fundamental rules make computing derivatives straightforward:

Power Rule: If f(x) = xⁿ, then f'(x) = nxⁿ⁻¹

Constant Rule: If f(x) = c (constant), then f'(x) = 0

Sum Rule: (f + g)' = f' + g'

Product Rule: (fg)' = f'g + fg'

Quotient Rule: (f/g)' = (f'g - fg') / g²`
    },
    {
      id: 3,
      heading: "3.3 Practice Problems",
      content: `Apply the differentiation rules to solve:

Problem 1: Find f'(x) if f(x) = 5x³ - 2x² + 4x - 1

Problem 2: Differentiate g(x) = (x² + 1)(x - 3)

Problem 3: If y = (2x + 1) / (x - 1), find dy/dx`
    }
  ]
}

// Books with optional coverImage URL - use Google Drive direct links
// To get direct link from Google Drive: 
// 1. Share image as "Anyone with link"
// 2. Get file ID from the share link
// 3. Use format: https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
const initialBooks = [
  { 
    id: 1, 
    title: "Calculus", 
    author: "James Stewart", 
    progress: 35, 
    color: "#DA7756", 
    format: "pdf", 
    lastRead: "2 hours ago",
    coverImage: "https:drive.google.com/uc?export=view&id=1xqiwbEE4NiiwfC6JwvzIwuZip4quOQYR" // Add your Google Drive image URL here
  },
  { 
    id: 2, 
    title: "Organic Chemistry", 
    author: "David Klein", 
    progress: 12, 
    color: "#5A9A6E", 
    format: "pdf", 
    lastRead: "Yesterday",
    coverImage: "https://drive.google.com/uc?export=view&id=1GrQEXdvjJcKIpr0eoMpEbNCZSnXOyHmP"
  },
  { 
    id: 3, 
    title: "Physics", 
    author: "Halliday & Resnick", 
    progress: 67, 
    color: "#6B8ACE", 
    format: "epub", 
    lastRead: "3 days ago",
    coverImage: "https://drive.google.com/uc?export=view&id=1q2KO9rVlwwYD93uFtbu474tY2QThvlWS"
  },
  { 
    id: 4, 
    title: "Linear Algebra", 
    author: "Gilbert Strang", 
    progress: 8, 
    color: "#9B7AC7", 
    format: "pdf", 
    lastRead: "1 week ago",
    coverImage: "https://drive.google.com/uc?export=view&id=1CVu95jSVd1N5L0nhRFsuj922qDBQ0ehl"
  },
  { 
    id: 5, 
    title: "Biology", 
    author: "Campbell", 
    progress: 22, 
    color: "#C97A8B", 
    format: "pdf", 
    lastRead: "2 weeks ago",
    coverImage: "https://drive.google.com/uc?export=view&id=1wjqNt-P2YH9moUBYR7if2SD1cCZTEIy3"
  },
  { 
    id: 6, 
    title: "Chemistry", 
    author: "Zumdahl", 
    progress: 0, 
    color: "#5AADAD", 
    format: "epub", 
    lastRead: "New",
    coverImage: "https://drive.google.com/uc?export=view&id=1Ksix4GwUYu7SE121wi_bJNEUz5WFzN1M"
  }
]

const getAIResponse = (type, text) => {
  const responses = {
    explain: {
      "derivative": "A derivative measures how fast something changes. Think of it like a speedometer — it tells you your speed at any exact moment, not your average speed over a trip.",
      "limit": "A limit describes approaching a value without necessarily reaching it. Like walking halfway to a wall, then half of that remaining distance, forever getting closer but never touching.",
      "power rule": "The Power Rule: multiply by the exponent, then subtract 1 from the exponent. So x⁵ becomes 5x⁴.",
      "default": "This relates to measuring change. Select a specific term for a more detailed explanation."
    },
    solve: {
      "5x³ - 2x² + 4x - 1": "Applying the power rule to each term:\n\n• 5x³ → 15x²\n• -2x² → -4x\n• 4x → 4\n• -1 → 0\n\nAnswer: f'(x) = 15x² - 4x + 4",
      "default": "Select a specific problem to see the step-by-step solution."
    },
    quiz: [
      { q: "What does the derivative represent geometrically?", a: "The slope of the tangent line at a point" },
      { q: "What is the derivative of x⁷?", a: "7x⁶" },
      { q: "What is the derivative of a constant?", a: "Zero" }
    ]
  }
  if (type === 'explain') {
    const key = Object.keys(responses.explain).find(k => text.toLowerCase().includes(k))
    return responses.explain[key] || responses.explain.default
  }
  if (type === 'solve') {
    const key = Object.keys(responses.solve).find(k => text.includes(k))
    return responses.solve[key] || responses.solve.default
  }
  if (type === 'quiz') return responses.quiz
  return "Select text to get an explanation."
}

// KLS Logo - styled like Anthropic's 'A' logo
function KLSLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#C35A37"/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">KLS</text>
    </svg>
  )
}

// Book Cover Component - shows image if available, fallback to color
function BookCover({ book, size = "normal" }) {
  const [imageError, setImageError] = useState(false)
  const hasImage = book.coverImage && !imageError

  const sizeStyles = {
    small: { width: '38px', height: '54px', fontSize: '15px', titleSize: '0px' },
    medium: { width: '44px', height: '62px', fontSize: '18px', titleSize: '0px' },
    normal: { width: '100%', height: '100%', fontSize: '28px', titleSize: '9px' }
  }
  const s = sizeStyles[size] || sizeStyles.normal

  if (hasImage) {
    return (
      <div className="book-cover-image-wrap" style={size !== 'normal' ? { width: s.width, height: s.height } : {}}>
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="book-cover-image"
          onError={() => setImageError(true)}
        />
        {book.progress > 0 && size === 'normal' && (
          <div className="book-progress-line">
            <div className="book-progress-line-fill" style={{width: `${book.progress}%`}} />
          </div>
        )}
      </div>
    )
  }

  // Fallback to color cover
  if (size === 'normal') {
    return (
      <div className="book-cover" style={{background: book.color}}>
        <span className="book-initial">{book.title.charAt(0)}</span>
        <span className="book-cover-title">{book.title}</span>
        {book.progress > 0 && (
          <div className="book-progress-line">
            <div className="book-progress-line-fill" style={{width: `${book.progress}%`}} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className="book-cover-small" 
      style={{
        background: book.color, 
        width: s.width, 
        height: s.height, 
        fontSize: s.fontSize
      }}
    >
      {book.title.charAt(0)}
    </div>
  )
}

function MenuIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>)
}

function LibraryIcon({ active }) {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>)
}

function ReadIcon({ active }) {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>)
}

function StudyIcon({ active }) {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>)
}

function GridIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>)
}

function ListIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>)
}

function PlusIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>)
}

function SearchIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>)
}

function CloseIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
}

function ImageIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>)
}

export default function App() {
  const [activeTab, setActiveTab] = useState('library')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [showAI, setShowAI] = useState(false)
  const [aiResponse, setAIResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [highlights, setHighlights] = useState([])
  const [quizActive, setQuizActive] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [books, setBooks] = useState(initialBooks)
  const [viewMode, setViewMode] = useState('grid')
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBook, setCurrentBook] = useState(null)
  const [showImageInput, setShowImageInput] = useState(null) // book id for adding cover
  const [imageUrl, setImageUrl] = useState('')
  
  const fileInputRef = useRef(null)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [sidebarOpen])

  const handleTabChange = (tab) => { setActiveTab(tab); setSidebarOpen(false) }
  const handleSelect = () => {
    const text = window.getSelection().toString().trim()
    if (text.length > 3) { setSelectedText(text); setShowAI(true); setAIResponse('') }
  }
  const handleAI = async (mode) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 500))
    setAIResponse(getAIResponse(mode, selectedText))
    setIsLoading(false)
  }
  const startQuiz = () => { setQuizQuestions(getAIResponse('quiz', '')); setQuizIndex(0); setShowAnswer(false); setQuizActive(true) }
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const fileName = file.name.toLowerCase()
    const isPdf = fileName.endsWith('.pdf')
    const isEpub = fileName.endsWith('.epub')
    if (!isPdf && !isEpub) { setUploadError('Only PDF and EPUB files are supported'); setTimeout(() => setUploadError(''), 3000); return }
    const colors = ['#DA7756', '#5A9A6E', '#6B8ACE', '#9B7AC7', '#C97A8B', '#5AADAD', '#D4915D', '#7A8C5A']
    const newBook = {
      id: Date.now(), 
      title: file.name.replace(/\.(pdf|epub)$/i, ''), 
      author: 'Unknown Author', 
      progress: 0,
      color: colors[Math.floor(Math.random() * colors.length)], 
      format: isPdf ? 'pdf' : 'epub', 
      lastRead: 'New',
      coverImage: ''
    }
    setBooks([newBook, ...books]); setShowAddMenu(false); setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerFileUpload = () => { if (fileInputRef.current) fileInputRef.current.click(); setShowAddMenu(false) }
  const deleteBook = (bookId, e) => { e.stopPropagation(); if (confirm('Remove this book?')) setBooks(books.filter(b => b.id !== bookId)) }
  const openBook = (book) => { setCurrentBook(book); setActiveTab('reader'); setSidebarOpen(false) }

  // Add cover image to a book
  const addCoverImage = (bookId) => {
    if (!imageUrl.trim()) return
    setBooks(books.map(b => b.id === bookId ? { ...b, coverImage: imageUrl.trim() } : b))
    setShowImageInput(null)
    setImageUrl('')
  }

  // Open image input modal
  const openImageInput = (bookId, e) => {
    e.stopPropagation()
    setShowImageInput(bookId)
    const book = books.find(b => b.id === bookId)
    setImageUrl(book?.coverImage || '')
  }

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  const recentBooks = [...books].filter(b => b.progress > 0).sort((a, b) => b.progress - a.progress).slice(0, 4)

  const styles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    :root {
      --bg-primary: #FFFFFF;
      --bg-secondary: #FAF9F7;
      --bg-tertiary: #F4F3F1;
      --border: #E8E6E3;
      --border-light: #DDD;
      --text-primary: #1F1F1E;
      --text-secondary: #666560;
      --text-tertiary: #9D9D97;
      --accent: #C35A37;
      --accent-light: #D4714F;
      --accent-bg: #FEF7F5;
      --accent-border: #F5DDD5;
      --danger: #C44;
      --success: #4A8C5A;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    .app { min-height: 100vh; display: flex; flex-direction: column; }
    .header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--bg-primary); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .menu-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: transparent; border: none; border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
    .menu-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .logo { display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 15px; color: var(--text-primary); }
    .logo-text { font-weight: 500; letter-spacing: -0.01em; }
    .header-actions { display: flex; gap: 8px; }
    .icon-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
    .icon-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .icon-btn.accent { background: var(--accent); border-color: var(--accent); color: white; }
    .icon-btn.accent:hover { background: var(--accent-light); }
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index: 200; opacity: 0; visibility: hidden; transition: all 0.2s; }
    .sidebar-overlay.open { opacity: 1; visibility: visible; }
    .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 256px; background: var(--bg-primary); border-right: 1px solid var(--border); z-index: 300; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
    .sidebar.open { transform: translateX(0); }
    .sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 12px; border-bottom: 1px solid var(--border); }
    .sidebar-logo { display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 15px; }
    .sidebar-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: transparent; border: none; border-radius: 6px; color: var(--text-secondary); cursor: pointer; }
    .sidebar-close:hover { background: var(--bg-tertiary); }
    .sidebar-nav { flex: 1; padding: 10px; display: flex; flex-direction: column; gap: 2px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: transparent; border: none; border-radius: 8px; color: var(--text-secondary); font-size: 14px; font-weight: 450; cursor: pointer; transition: all 0.15s; text-align: left; width: 100%; }
    .nav-item:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .nav-item.active { background: var(--accent-bg); color: var(--accent); }
    .sidebar-footer { padding: 14px; border-top: 1px solid var(--border); }
    .sidebar-footer-text { font-size: 11px; color: var(--text-tertiary); text-align: center; }
    .main { flex: 1; width: 100%; max-width: 960px; margin: 0 auto; padding: 20px 16px; }
    .library-container { animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .search-bar { display: flex; align-items: center; gap: 10px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; margin-bottom: 24px; }
    .search-bar:focus-within { border-color: var(--border-light); }
    .search-bar svg { color: var(--text-tertiary); }
    .search-input { flex: 1; background: none; border: none; outline: none; font-size: 14px; color: var(--text-primary); }
    .search-input::placeholder { color: var(--text-tertiary); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .section-title { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
    .continue-section { margin-bottom: 28px; }
    .continue-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
    .continue-scroll::-webkit-scrollbar { display: none; }
    .continue-card { flex-shrink: 0; width: 240px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 10px; padding: 12px; display: flex; gap: 12px; cursor: pointer; transition: all 0.15s; }
    .continue-card:hover { border-color: var(--border-light); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .continue-cover { width: 44px; height: 62px; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.12); overflow: hidden; }
    .continue-cover img { width: 100%; height: 100%; object-fit: cover; }
    .continue-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
    .continue-title { font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .continue-author { font-size: 11px; color: var(--text-secondary); margin-bottom: 8px; }
    .continue-progress-row { display: flex; align-items: center; gap: 8px; }
    .continue-progress-bar { flex: 1; height: 3px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
    .continue-progress-fill { height: 100%; background: var(--accent); border-radius: 2px; }
    .continue-progress-text { font-size: 11px; color: var(--text-tertiary); }
    .lib-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .lib-controls { display: flex; gap: 6px; }
    .view-toggle { display: flex; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
    .view-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 28px; background: transparent; border: none; color: var(--text-tertiary); cursor: pointer; }
    .view-btn:hover { color: var(--text-secondary); }
    .view-btn.active { background: var(--bg-primary); color: var(--text-primary); box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .book-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .book-card { cursor: pointer; transition: transform 0.15s; position: relative; }
    .book-card:hover { transform: translateY(-2px); }
    .book-cover-wrap { position: relative; aspect-ratio: 2/3; margin-bottom: 8px; }
    .book-cover { width: 100%; height: 100%; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
    .book-cover::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.08) 100%); }
    .book-cover-image-wrap { width: 100%; height: 100%; border-radius: 4px; overflow: hidden; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .book-cover-image { width: 100%; height: 100%; object-fit: cover; display: block; }
    .book-cover-small { border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.12); overflow: hidden; }
    .book-cover-small img { width: 100%; height: 100%; object-fit: cover; }
    .book-initial { font-size: 28px; font-weight: 600; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.15); position: relative; z-index: 1; }
    .book-cover-title { font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.85); text-align: center; margin-top: 4px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; position: relative; z-index: 1; }
    .book-progress-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,0.25); }
    .book-progress-line-fill { height: 100%; background: white; }
    .book-actions { position: absolute; top: 6px; right: 6px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
    .book-card:hover .book-actions { opacity: 1; }
    .book-action-btn { width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.5); border: none; color: white; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .book-action-btn:hover { background: rgba(0,0,0,0.7); }
    .book-action-btn.delete:hover { background: var(--danger); }
    .book-title { font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .book-author { font-size: 11px; color: var(--text-secondary); }
    .book-list { display: flex; flex-direction: column; gap: 6px; }
    .book-list-item { display: flex; gap: 12px; padding: 10px 12px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.15s; position: relative; }
    .book-list-item:hover { border-color: var(--border-light); background: var(--bg-secondary); }
    .book-list-cover { width: 38px; height: 54px; border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; color: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); overflow: hidden; }
    .book-list-cover img { width: 100%; height: 100%; object-fit: cover; }
    .book-list-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
    .book-list-title { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 2px; }
    .book-list-author { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; }
    .book-list-meta { display: flex; align-items: center; gap: 10px; }
    .book-list-progress { flex: 1; max-width: 100px; height: 3px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
    .book-list-progress-fill { height: 100%; background: var(--accent); }
    .book-list-percent { font-size: 11px; color: var(--text-tertiary); }
    .book-list-time { font-size: 11px; color: var(--text-tertiary); }
    .book-list-actions { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
    .book-list-item:hover .book-list-actions { opacity: 1; }
    .book-list-action-btn { width: 28px; height: 28px; border-radius: 6px; background: var(--bg-tertiary); border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .book-list-action-btn:hover { background: var(--border); color: var(--text-primary); }
    .book-list-action-btn.delete:hover { background: var(--danger); color: white; }
    .empty-state { text-align: center; padding: 50px 20px; }
    .empty-icon { font-size: 44px; margin-bottom: 14px; opacity: 0.5; }
    .empty-text { font-size: 14px; color: var(--text-secondary); margin-bottom: 18px; }
    .empty-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: var(--accent); border: none; border-radius: 8px; color: white; font-size: 14px; font-weight: 500; cursor: pointer; }
    .reader-container { animation: fadeIn 0.2s ease; max-width: 640px; margin: 0 auto; }
    .doc-header { margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
    .doc-title { font-size: 24px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.02em; }
    .doc-subtitle { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }
    .progress-row { display: flex; align-items: center; gap: 10px; }
    .progress-bar { flex: 1; height: 3px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--accent); border-radius: 2px; }
    .progress-text { font-size: 12px; color: var(--text-tertiary); }
    .section { margin-bottom: 24px; }
    .section-heading { font-size: 17px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; }
    .paragraph { font-size: 15px; color: var(--text-primary); margin-bottom: 12px; line-height: 1.7; }
    .study-container { animation: fadeIn 0.2s ease; max-width: 640px; margin: 0 auto; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
    .stat-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 10px; padding: 14px; text-align: center; }
    .stat-value { font-size: 26px; font-weight: 600; color: var(--text-primary); }
    .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
    .study-section-title { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 10px; }
    .card-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    .card-item { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; font-size: 14px; color: var(--text-primary); cursor: pointer; transition: all 0.15s; }
    .card-item:hover { border-color: var(--border-light); background: var(--bg-secondary); }
    .highlight-item { background: var(--accent-bg); border-left: 3px solid var(--accent); padding: 10px 14px; margin-bottom: 6px; border-radius: 0 8px 8px 0; font-size: 14px; color: var(--text-primary); }
    .ai-panel { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg-primary); border-top: 1px solid var(--border); padding: 16px; transform: translateY(100%); transition: transform 0.25s ease; max-height: 55vh; overflow-y: auto; z-index: 200; box-shadow: 0 -4px 16px rgba(0,0,0,0.06); }
    .ai-panel.open { transform: translateY(0); }
    .ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .ai-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--accent); }
    .close-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: transparent; border: none; border-radius: 6px; color: var(--text-secondary); cursor: pointer; }
    .close-btn:hover { background: var(--bg-tertiary); }
    .selected-box { background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
    .selected-label { font-size: 11px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 4px; }
    .selected-text { font-size: 14px; color: var(--text-primary); }
    .ai-actions { display: flex; gap: 8px; margin-bottom: 12px; }
    .ai-btn { flex: 1; padding: 10px 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-primary); cursor: pointer; transition: all 0.15s; }
    .ai-btn:hover { background: var(--bg-tertiary); }
    .ai-response { font-size: 14px; line-height: 1.65; color: var(--text-primary); white-space: pre-line; }
    .loading { color: var(--text-tertiary); font-size: 14px; }
    .hint-bar { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; align-items: center; background: var(--bg-primary); border: 1px solid var(--border); padding: 8px 14px; border-radius: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); z-index: 150; }
    .hint-text { font-size: 13px; color: var(--text-secondary); }
    .quiz-btn { padding: 6px 14px; background: var(--accent); border: none; border-radius: 16px; color: white; font-size: 13px; font-weight: 500; cursor: pointer; }
    .quiz-overlay, .image-input-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 400; }
    .quiz-card { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 14px; padding: 22px; width: 100%; max-width: 380px; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .quiz-header { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; }
    .quiz-progress { color: var(--accent); font-weight: 600; }
    .quiz-question { font-size: 17px; font-weight: 500; color: var(--text-primary); margin-bottom: 18px; line-height: 1.4; }
    .quiz-answer { background: rgba(74,140,90,0.08); border: 1px solid rgba(74,140,90,0.2); border-radius: 8px; padding: 12px; margin-bottom: 12px; color: var(--success); }
    .answer-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 4px; opacity: 0.8; }
    .primary-btn { width: 100%; padding: 12px; background: var(--accent); border: none; border-radius: 8px; color: white; font-size: 14px; font-weight: 500; cursor: pointer; }
    .secondary-btn { width: 100%; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 14px; font-weight: 500; cursor: pointer; }
    .close-quiz { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 22px; color: var(--text-tertiary); cursor: pointer; }
    .upload-error { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); background: var(--danger); color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; z-index: 500; }
    .add-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 350; display: flex; align-items: flex-end; justify-content: center; }
    .add-menu { background: var(--bg-primary); border-top-left-radius: 14px; border-top-right-radius: 14px; width: 100%; max-width: 420px; padding: 18px; animation: slideUp 0.2s ease; }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .add-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .add-menu-title { font-size: 16px; font-weight: 600; }
    .add-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; margin-bottom: 8px; transition: all 0.15s; }
    .add-menu-item:hover { border-color: var(--border-light); }
    .add-menu-icon { width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .add-menu-icon.pdf { background: rgba(201,100,66,0.1); }
    .add-menu-icon.epub { background: rgba(90,154,110,0.1); }
    .add-menu-text { flex: 1; }
    .add-menu-item-title { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .add-menu-item-desc { font-size: 12px; color: var(--text-secondary); }
    .file-input { display: none; }
    .image-input-card { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 14px; padding: 22px; width: 100%; max-width: 400px; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .image-input-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .image-input-subtitle { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }
    .image-url-input { width: 100%; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: var(--text-primary); margin-bottom: 12px; outline: none; }
    .image-url-input:focus { border-color: var(--accent); }
    .image-url-input::placeholder { color: var(--text-tertiary); }
    .image-input-help { font-size: 11px; color: var(--text-tertiary); margin-bottom: 16px; line-height: 1.5; }
    .image-input-buttons { display: flex; gap: 8px; }
    .image-input-buttons button { flex: 1; }
    @media (min-width: 768px) {
      .main { padding: 28px 24px; }
      .book-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; }
      .stats-grid { grid-template-columns: repeat(4, 1fr); }
      .ai-panel { position: fixed; bottom: auto; top: 70px; left: auto; right: 20px; width: 320px; max-height: calc(100vh - 100px); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateX(calc(100% + 20px)); }
      .ai-panel.open { transform: translateX(0); }
      .add-menu-overlay { align-items: center; }
      .add-menu { border-radius: 12px; max-width: 360px; }
    }
    @media (min-width: 1024px) { .book-grid { grid-template-columns: repeat(5, 1fr); } }
    @media (min-width: 1280px) { .book-grid { grid-template-columns: repeat(6, 1fr); } }
  `

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <input ref={fileInputRef} type="file" accept=".pdf,.epub" onChange={handleFileUpload} className="file-input" />
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
        <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo"><KLSLogo size={28} /><span>Kapul Reader</span></div>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><CloseIcon /></button>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => handleTabChange('library')}><LibraryIcon active={activeTab === 'library'} />Library</button>
            <button className={`nav-item ${activeTab === 'reader' ? 'active' : ''}`} onClick={() => handleTabChange('reader')}><ReadIcon active={activeTab === 'reader'} />Read</button>
            <button className={`nav-item ${activeTab === 'study' ? 'active' : ''}`} onClick={() => handleTabChange('study')}><StudyIcon active={activeTab === 'study'} />Study</button>
          </nav>
          <div className="sidebar-footer"><div className="sidebar-footer-text">Kapul Learning Society</div></div>
        </aside>
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}><MenuIcon /></button>
            <div className="logo"><KLSLogo size={32} /><span className="logo-text">Kapul Reader</span></div>
          </div>
          <div className="header-actions">{activeTab === 'library' && <button className="icon-btn accent" onClick={() => setShowAddMenu(true)}><PlusIcon /></button>}</div>
        </header>
        <main className="main">
          {activeTab === 'library' && (
            <div className="library-container">
              <div className="search-bar"><SearchIcon /><input type="text" className="search-input" placeholder="Search books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
              {recentBooks.length > 0 && !searchQuery && (
                <div className="continue-section">
                  <div className="section-header"><h2 className="section-title">Continue Reading</h2></div>
                  <div className="continue-scroll">
                    {recentBooks.map(book => (
                      <div key={book.id} className="continue-card" onClick={() => openBook(book)}>
                        <div className="continue-cover" style={{background: book.coverImage ? 'transparent' : book.color}}>
                          {book.coverImage ? <img src={book.coverImage} alt={book.title} /> : book.title.charAt(0)}
                        </div>
                        <div className="continue-info">
                          <div className="continue-title">{book.title}</div>
                          <div className="continue-author">{book.author}</div>
                          <div className="continue-progress-row"><div className="continue-progress-bar"><div className="continue-progress-fill" style={{width: `${book.progress}%`}} /></div><span className="continue-progress-text">{book.progress}%</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="lib-header">
                <h2 className="section-title">{searchQuery ? `Results for "${searchQuery}"` : 'All Books'}</h2>
                <div className="lib-controls">
                  <div className="view-toggle">
                    <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><GridIcon /></button>
                    <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><ListIcon /></button>
                  </div>
                </div>
              </div>
              {filteredBooks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <div className="empty-text">{searchQuery ? 'No books found' : 'Your library is empty'}</div>
                  {!searchQuery && <button className="empty-btn" onClick={() => setShowAddMenu(true)}><PlusIcon /> Add your first book</button>}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="book-grid">
                  {filteredBooks.map(book => (
                    <div key={book.id} className="book-card" onClick={() => openBook(book)}>
                      <div className="book-cover-wrap">
                        {book.coverImage ? (
                          <div className="book-cover-image-wrap">
                            <img src={book.coverImage} alt={book.title} className="book-cover-image" />
                            {book.progress > 0 && <div className="book-progress-line"><div className="book-progress-line-fill" style={{width: `${book.progress}%`}} /></div>}
                          </div>
                        ) : (
                          <div className="book-cover" style={{background: book.color}}>
                            <span className="book-initial">{book.title.charAt(0)}</span>
                            <span className="book-cover-title">{book.title}</span>
                            {book.progress > 0 && <div className="book-progress-line"><div className="book-progress-line-fill" style={{width: `${book.progress}%`}} /></div>}
                          </div>
                        )}
                        <div className="book-actions">
                          <button className="book-action-btn" onClick={(e) => openImageInput(book.id, e)} title="Add cover image"><ImageIcon /></button>
                          <button className="book-action-btn delete" onClick={(e) => deleteBook(book.id, e)} title="Delete">×</button>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">{book.author}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="book-list">
                  {filteredBooks.map(book => (
                    <div key={book.id} className="book-list-item" onClick={() => openBook(book)}>
                      <div className="book-list-cover" style={{background: book.coverImage ? 'transparent' : book.color}}>
                        {book.coverImage ? <img src={book.coverImage} alt={book.title} /> : book.title.charAt(0)}
                      </div>
                      <div className="book-list-info">
                        <div className="book-list-title">{book.title}</div>
                        <div className="book-list-author">{book.author}</div>
                        <div className="book-list-meta"><div className="book-list-progress"><div className="book-list-progress-fill" style={{width: `${book.progress}%`}} /></div><span className="book-list-percent">{book.progress}%</span><span className="book-list-time">{book.lastRead}</span></div>
                      </div>
                      <div className="book-list-actions">
                        <button className="book-list-action-btn" onClick={(e) => openImageInput(book.id, e)} title="Add cover image"><ImageIcon /></button>
                        <button className="book-list-action-btn delete" onClick={(e) => deleteBook(book.id, e)} title="Delete">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'reader' && (
            <div className="reader-container" onMouseUp={handleSelect} onTouchEnd={handleSelect}>
              <div className="doc-header">
                <h1 className="doc-title">{currentBook?.title || sampleContent.title}</h1>
                <p className="doc-subtitle">{sampleContent.chapter}</p>
                <div className="progress-row"><div className="progress-bar"><div className="progress-fill" style={{width: `${currentBook?.progress || 35}%`}} /></div><span className="progress-text">{currentBook?.progress || 35}%</span></div>
              </div>
              {sampleContent.sections.map(section => (<div key={section.id} className="section"><h2 className="section-heading">{section.heading}</h2>{section.content.split('\n\n').map((para, i) => (<p key={i} className="paragraph">{para}</p>))}</div>))}
            </div>
          )}
          {activeTab === 'study' && (
            <div className="study-container">
              <div className="stats-grid"><div className="stat-card"><div className="stat-value">3</div><div className="stat-label">Pages read</div></div><div className="stat-card"><div className="stat-value">7</div><div className="stat-label">Problems</div></div><div className="stat-card"><div className="stat-value">12</div><div className="stat-label">Flashcards</div></div><div className="stat-card"><div className="stat-value">73%</div><div className="stat-label">Score</div></div></div>
              <div className="study-section-title">Flashcards</div>
              <div className="card-list"><div className="card-item">What is a derivative?</div><div className="card-item">Power Rule formula</div><div className="card-item">Derivative of a constant</div></div>
              <div className="study-section-title">Highlights</div>
              {["The derivative measures rate of change", "f'(x) = lim[h→0] (f(x+h) - f(x)) / h", ...highlights].map((h, i) => (<div key={i} className="highlight-item">{h}</div>))}
            </div>
          )}
        </main>
        {activeTab === 'reader' && !showAI && (<div className="hint-bar"><span className="hint-text">Select text to explain</span><button className="quiz-btn" onClick={startQuiz}>Quiz me</button></div>)}
        <div className={`ai-panel ${showAI ? 'open' : ''}`}>
          <div className="ai-header"><span className="ai-title"><KLSLogo size={20} />Kapul AI</span><button className="close-btn" onClick={() => setShowAI(false)}><CloseIcon /></button></div>
          {selectedText && <div className="selected-box"><div className="selected-label">Selected text</div><div className="selected-text">{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}</div></div>}
          <div className="ai-actions"><button className="ai-btn" onClick={() => handleAI('explain')}>Explain</button><button className="ai-btn" onClick={() => handleAI('solve')}>Solve</button><button className="ai-btn" onClick={() => setHighlights([...highlights, selectedText])}>Save</button></div>
          {isLoading ? <div className="loading">Thinking...</div> : aiResponse && <div className="ai-response">{aiResponse}</div>}
        </div>
        {quizActive && (
          <div className="quiz-overlay" onClick={() => setQuizActive(false)}>
            <div className="quiz-card" onClick={e => e.stopPropagation()}>
              <div className="quiz-header"><span>Quiz</span><span className="quiz-progress">{quizIndex + 1} of {quizQuestions.length}</span></div>
              <div className="quiz-question">{quizQuestions[quizIndex]?.q}</div>
              {showAnswer ? (<><div className="quiz-answer"><div className="answer-label">Answer</div>{quizQuestions[quizIndex]?.a}</div><button className="primary-btn" onClick={() => { if (quizIndex < quizQuestions.length - 1) { setQuizIndex(quizIndex + 1); setShowAnswer(false) } else { setQuizActive(false) } }}>{quizIndex < quizQuestions.length - 1 ? 'Next question' : 'Done'}</button></>) : (<button className="secondary-btn" onClick={() => setShowAnswer(true)}>Show answer</button>)}
              <button className="close-quiz" onClick={() => setQuizActive(false)}>×</button>
            </div>
          </div>
        )}
        {showAddMenu && (
          <div className="add-menu-overlay" onClick={() => setShowAddMenu(false)}>
            <div className="add-menu" onClick={e => e.stopPropagation()}>
              <div className="add-menu-header"><span className="add-menu-title">Add to Library</span><button className="close-btn" onClick={() => setShowAddMenu(false)}><CloseIcon /></button></div>
              <div className="add-menu-item" onClick={triggerFileUpload}><div className="add-menu-icon pdf">📕</div><div className="add-menu-text"><div className="add-menu-item-title">PDF Document</div><div className="add-menu-item-desc">Upload a PDF file</div></div></div>
              <div className="add-menu-item" onClick={triggerFileUpload}><div className="add-menu-icon epub">📗</div><div className="add-menu-text"><div className="add-menu-item-title">EPUB Book</div><div className="add-menu-item-desc">Upload an EPUB file</div></div></div>
            </div>
          </div>
        )}
        {showImageInput !== null && (
          <div className="image-input-overlay" onClick={() => { setShowImageInput(null); setImageUrl('') }}>
            <div className="image-input-card" onClick={e => e.stopPropagation()}>
              <div className="image-input-title">Add Cover Image</div>
              <div className="image-input-subtitle">Paste a direct image URL from Google Drive or any image host</div>
              <input 
                type="text" 
                className="image-url-input" 
                placeholder="https://drive.google.com/uc?export=view&id=..." 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                autoFocus
              />
              <div className="image-input-help">
                For Google Drive: Share image → Get link → Replace "/file/d/FILE_ID/view" with "/uc?export=view&id=FILE_ID"
              </div>
              <div className="image-input-buttons">
                <button className="secondary-btn" onClick={() => { setShowImageInput(null); setImageUrl('') }}>Cancel</button>
                <button className="primary-btn" onClick={() => addCoverImage(showImageInput)}>Save</button>
              </div>
              <button className="close-quiz" onClick={() => { setShowImageInput(null); setImageUrl('') }}>×</button>
            </div>
          </div>
        )}
        {uploadError && <div className="upload-error">{uploadError}</div>}
      </div>
    </>
  )
}
