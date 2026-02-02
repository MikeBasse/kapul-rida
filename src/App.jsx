import React, { useState, useRef, useEffect, useCallback } from 'react'

// PDF.js and EPUB.js will be loaded from CDN
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
const EPUBJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js'

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

// Empty library - ready for users to add their own books
const initialBooks = []

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

// Custom hook to load external scripts
function useScript(src, onLoad) {
  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      if (onLoad) onLoad()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = onLoad
    document.body.appendChild(script)
    return () => {
      // Don't remove the script on cleanup to allow reuse
    }
  }, [src, onLoad])
}

// KLS Logo
function KLSLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#C35A37"/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">KLS</text>
    </svg>
  )
}

// Icons
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

function ChevronLeftIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>)
}

function ChevronRightIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>)
}

function ZoomInIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>)
}

function ZoomOutIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>)
}

// PDF Viewer Component
function PDFViewer({ fileData, currentPage, onPageChange, onTotalPages, scale = 1.2 }) {
  const canvasRef = useRef(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageText, setPageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false)

  // Load PDF.js
  useScript(PDFJS_CDN, () => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN
      setPdfJsLoaded(true)
    }
  })

  // Load PDF document
  useEffect(() => {
    if (!pdfJsLoaded || !fileData) return

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(null)
        const loadingTask = window.pdfjsLib.getDocument({ data: fileData })
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        onTotalPages(pdf.numPages)
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError('Failed to load PDF. The file may be corrupted or password-protected.')
      } finally {
        setLoading(false)
      }
    }

    loadPdf()
  }, [fileData, pdfJsLoaded, onTotalPages])

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage)
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        await page.render(renderContext).promise

        // Extract text for AI features
        const textContent = await page.getTextContent()
        const text = textContent.items.map(item => item.str).join(' ')
        setPageText(text)
      } catch (err) {
        console.error('Error rendering page:', err)
      }
    }

    renderPage()
  }, [pdfDoc, currentPage, scale])

  if (loading) {
    return <div className="pdf-loading">Loading PDF...</div>
  }

  if (error) {
    return <div className="pdf-error">{error}</div>
  }

  return (
    <div className="pdf-viewer">
      <canvas ref={canvasRef} className="pdf-canvas" />
      <div className="pdf-text-layer" style={{ display: 'none' }}>{pageText}</div>
    </div>
  )
}

// EPUB Viewer Component
function EPUBViewer({ fileData, currentPage, onPageChange, onTotalPages }) {
  const viewerRef = useRef(null)
  const [book, setBook] = useState(null)
  const [rendition, setRendition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [epubJsLoaded, setEpubJsLoaded] = useState(false)
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(0)

  // Load EPUB.js
  useScript(EPUBJS_CDN, () => {
    if (window.ePub) {
      setEpubJsLoaded(true)
    }
  })

  // Load EPUB document
  useEffect(() => {
    if (!epubJsLoaded || !fileData || !viewerRef.current) return

    const loadEpub = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Clean up previous rendition
        if (rendition) {
          rendition.destroy()
        }

        const epub = window.ePub(fileData)
        setBook(epub)

        const rend = epub.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'paginated'
        })

        await rend.display()
        setRendition(rend)

        // Get chapters/spine items
        const spine = epub.spine
        if (spine && spine.items) {
          setChapters(spine.items)
          onTotalPages(spine.items.length)
        }

        // Handle location changes
        rend.on('relocated', (location) => {
          if (location.start && location.start.index !== undefined) {
            setCurrentChapter(location.start.index)
          }
        })

      } catch (err) {
        console.error('Error loading EPUB:', err)
        setError('Failed to load EPUB. The file may be corrupted.')
      } finally {
        setLoading(false)
      }
    }

    loadEpub()

    return () => {
      if (rendition) {
        rendition.destroy()
      }
    }
  }, [fileData, epubJsLoaded])

  // Navigate pages
  const goNext = useCallback(() => {
    if (rendition) {
      rendition.next()
    }
  }, [rendition])

  const goPrev = useCallback(() => {
    if (rendition) {
      rendition.prev()
    }
  }, [rendition])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  if (loading) {
    return <div className="epub-loading">Loading EPUB...</div>
  }

  if (error) {
    return <div className="epub-error">{error}</div>
  }

  return (
    <div className="epub-viewer">
      <div ref={viewerRef} className="epub-content" />
      <div className="epub-nav">
        <button className="epub-nav-btn" onClick={goPrev}><ChevronLeftIcon /></button>
        <span className="epub-chapter-info">
          {chapters.length > 0 ? `${currentChapter + 1} / ${chapters.length}` : ''}
        </span>
        <button className="epub-nav-btn" onClick={goNext}><ChevronRightIcon /></button>
      </div>
    </div>
  )
}

// Document Reader Component (combines PDF and EPUB viewers)
function DocumentReader({ book, onUpdateBook }) {
  const [currentPage, setCurrentPage] = useState(book?.currentPage || 1)
  const [totalPages, setTotalPages] = useState(book?.totalPages || 0)
  const [scale, setScale] = useState(1.2)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      const progress = Math.round((newPage / totalPages) * 100)
      onUpdateBook({ ...book, currentPage: newPage, progress })
    }
  }

  const handleTotalPages = (pages) => {
    setTotalPages(pages)
    onUpdateBook({ ...book, totalPages: pages })
  }

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3))
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5))

  if (!book?.fileData) {
    return null
  }

  return (
    <div className="document-reader">
      <div className="reader-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
            <ChevronLeftIcon />
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button className="toolbar-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
            <ChevronRightIcon />
          </button>
        </div>
        {book.format === 'pdf' && (
          <div className="toolbar-right">
            <button className="toolbar-btn" onClick={handleZoomOut}><ZoomOutIcon /></button>
            <span className="zoom-info">{Math.round(scale * 100)}%</span>
            <button className="toolbar-btn" onClick={handleZoomIn}><ZoomInIcon /></button>
          </div>
        )}
      </div>
      
      <div className="reader-content">
        {book.format === 'pdf' ? (
          <PDFViewer
            fileData={book.fileData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onTotalPages={handleTotalPages}
            scale={scale}
          />
        ) : (
          <EPUBViewer
            fileData={book.fileData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onTotalPages={handleTotalPages}
          />
        )}
      </div>
    </div>
  )
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
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
  
  const startQuiz = () => { 
    setQuizQuestions(getAIResponse('quiz', '')); 
    setQuizIndex(0); 
    setShowAnswer(false); 
    setQuizActive(true) 
  }
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const fileName = file.name.toLowerCase()
    const isPdf = fileName.endsWith('.pdf')
    const isEpub = fileName.endsWith('.epub')
    
    if (!isPdf && !isEpub) { 
      setUploadError('Only PDF and EPUB files are supported')
      setTimeout(() => setUploadError(''), 3000)
      return 
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        }
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })

      const colors = ['#DA7756', '#5A9A6E', '#6B8ACE', '#9B7AC7', '#C97A8B', '#5AADAD', '#D4915D', '#7A8C5A']
      const newBook = {
        id: Date.now(), 
        title: file.name.replace(/\.(pdf|epub)$/i, ''), 
        author: 'Unknown Author', 
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)], 
        format: isPdf ? 'pdf' : 'epub', 
        lastRead: 'New',
        coverImage: '',
        fileData: arrayBuffer,
        totalPages: 0,
        currentPage: 1
      }
      
      setBooks([newBook, ...books])
      setShowAddMenu(false)
      setUploadError('')
      
    } catch (err) {
      console.error('Error reading file:', err)
      setUploadError('Failed to read file. Please try again.')
      setTimeout(() => setUploadError(''), 3000)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerFileUpload = () => { 
    if (fileInputRef.current) fileInputRef.current.click()
    setShowAddMenu(false) 
  }
  
  const deleteBook = (bookId, e) => { 
    e.stopPropagation()
    if (confirm('Remove this book?')) {
      setBooks(books.filter(b => b.id !== bookId))
      if (currentBook?.id === bookId) {
        setCurrentBook(null)
        setActiveTab('library')
      }
    }
  }
  
  const openBook = (book) => { 
    setCurrentBook(book)
    setActiveTab('reader')
    setSidebarOpen(false)
    
    // Update last read
    setBooks(books.map(b => 
      b.id === book.id ? { ...b, lastRead: 'Just now' } : b
    ))
  }

  const updateBook = (updatedBook) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b))
    setCurrentBook(updatedBook)
  }

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const recentBooks = [...books]
    .filter(b => b.progress > 0 || b.fileData)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 4)

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
    .main.reader-mode { max-width: 100%; padding: 0; }
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
    .continue-cover { width: 44px; height: 62px; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.12); overflow: hidden; position: relative; }
    .continue-cover img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
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
    .book-cover-wrap { position: relative; aspect-ratio: 2/3; margin-bottom: 8px; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .book-cover { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; position: relative; }
    .book-cover::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.08) 100%); pointer-events: none; z-index: 1; }
    .book-cover-image { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
    .image-loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-tertiary); background: var(--bg-tertiary); }
    .book-initial { font-size: 28px; font-weight: 600; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.15); position: relative; z-index: 1; }
    .book-cover-title { font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.85); text-align: center; margin-top: 4px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; position: relative; z-index: 1; }
    .book-progress-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,0.25); z-index: 2; }
    .book-progress-line-fill { height: 100%; background: white; }
    .book-actions { position: absolute; top: 6px; right: 6px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; z-index: 3; }
    .book-card:hover .book-actions { opacity: 1; }
    .book-action-btn { width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.6); border: none; color: white; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .book-action-btn:hover { background: rgba(0,0,0,0.8); }
    .book-action-btn.delete:hover { background: var(--danger); }
    .book-format-badge { position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.5); color: white; font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 4px; z-index: 3; }
    .book-title { font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .book-author { font-size: 11px; color: var(--text-secondary); }
    .book-list { display: flex; flex-direction: column; gap: 6px; }
    .book-list-item { display: flex; gap: 12px; padding: 10px 12px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.15s; position: relative; }
    .book-list-item:hover { border-color: var(--border-light); background: var(--bg-secondary); }
    .book-list-cover { width: 38px; height: 54px; border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; color: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); overflow: hidden; position: relative; }
    .book-list-cover img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
    .book-list-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
    .book-list-title { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 2px; display: flex; align-items: center; gap: 8px; }
    .book-list-format { background: var(--bg-tertiary); color: var(--text-secondary); font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; }
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
    
    /* Empty State */
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 56px; margin-bottom: 16px; }
    .empty-title { font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
    .empty-text { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
    .empty-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: var(--accent); border: none; border-radius: 10px; color: white; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
    .empty-btn:hover { background: var(--accent-light); }
    
    /* Document Reader Styles */
    .document-reader { display: flex; flex-direction: column; height: calc(100vh - 57px); background: var(--bg-secondary); }
    .reader-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: var(--bg-primary); border-bottom: 1px solid var(--border); }
    .toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 8px; }
    .toolbar-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
    .toolbar-btn:hover:not(:disabled) { background: var(--bg-tertiary); color: var(--text-primary); }
    .toolbar-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info, .zoom-info { font-size: 13px; color: var(--text-secondary); min-width: 100px; text-align: center; }
    .zoom-info { min-width: 50px; }
    .reader-content { flex: 1; overflow: auto; display: flex; justify-content: center; padding: 20px; }
    
    /* PDF Viewer Styles */
    .pdf-viewer { display: flex; flex-direction: column; align-items: center; }
    .pdf-canvas { max-width: 100%; height: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background: white; }
    .pdf-loading, .pdf-error, .epub-loading, .epub-error { display: flex; align-items: center; justify-content: center; height: 300px; font-size: 14px; color: var(--text-secondary); }
    .pdf-error, .epub-error { color: var(--danger); }
    
    /* EPUB Viewer Styles */
    .epub-viewer { width: 100%; max-width: 800px; display: flex; flex-direction: column; }
    .epub-content { flex: 1; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); min-height: 500px; }
    .epub-nav { display: flex; justify-content: center; align-items: center; gap: 20px; padding: 16px; }
    .epub-nav-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 50%; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
    .epub-nav-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
    .epub-chapter-info { font-size: 13px; color: var(--text-secondary); }
    
    /* Sample content reader */
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
    
    /* No file data message */
    .no-file-message { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; text-align: center; padding: 20px; }
    .no-file-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
    .no-file-text { font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; }
    .no-file-subtext { font-size: 12px; color: var(--text-tertiary); }
    
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
    .summary-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; }
    .summary-card p { font-size: 14px; line-height: 1.7; color: var(--text-primary); margin-bottom: 12px; }
    .summary-card p:last-child { margin-bottom: 0; }
    .summary-card strong { color: var(--text-primary); font-weight: 600; }
    .summary-card ul { margin: 0 0 12px 0; padding-left: 20px; }
    .summary-card li { font-size: 14px; line-height: 1.6; color: var(--text-primary); margin-bottom: 6px; }
    .summary-card li:last-child { margin-bottom: 0; }
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
    .upload-progress { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); background: var(--bg-primary); border: 1px solid var(--border); padding: 12px 20px; border-radius: 8px; font-size: 14px; z-index: 500; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .upload-progress-bar { width: 100px; height: 4px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
    .upload-progress-fill { height: 100%; background: var(--accent); transition: width 0.2s; }
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
    .image-input-card { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 14px; padding: 22px; width: 100%; max-width: 420px; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .image-input-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .image-input-subtitle { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }
    .image-url-input { width: 100%; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: var(--text-primary); margin-bottom: 12px; outline: none; }
    .image-url-input:focus { border-color: var(--accent); }
    .image-url-input::placeholder { color: var(--text-tertiary); }
    .image-input-help { font-size: 12px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6; padding: 12px; background: var(--bg-secondary); border-radius: 8px; }
    .image-input-help strong { color: var(--text-primary); }
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
          <div className="sidebar-footer"><div className="sidebar-footer-text">Kapul Learning System</div></div>
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
                        <div className="continue-cover" style={{background: book.color}}>
                          {book.title.charAt(0)}
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
                  <div className="empty-title">{searchQuery ? 'No books found' : 'Welcome to Kapul Reader'}</div>
                  <div className="empty-text">{searchQuery ? 'Try a different search term' : 'Upload PDF or EPUB files to start reading'}</div>
                  {!searchQuery && <button className="empty-btn" onClick={() => setShowAddMenu(true)}><PlusIcon /> Add Your First Book</button>}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="book-grid">
                  {filteredBooks.map(book => (
                    <div key={book.id} className="book-card" onClick={() => openBook(book)}>
                      <div className="book-cover-wrap">
                        <div className="book-cover" style={{background: book.color}}>
                          <span className="book-initial">{book.title.charAt(0)}</span>
                          <span className="book-cover-title">{book.title}</span>
                        </div>
                        {book.progress > 0 && <div className="book-progress-line"><div className="book-progress-line-fill" style={{width: `${book.progress}%`}} /></div>}
                        <div className="book-format-badge">{book.format.toUpperCase()}</div>
                        <div className="book-actions">
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
                      <div className="book-list-cover" style={{background: book.color}}>
                        {book.title.charAt(0)}
                      </div>
                      <div className="book-list-info">
                        <div className="book-list-title">
                          {book.title}
                          <span className="book-list-format">{book.format.toUpperCase()}</span>
                        </div>
                        <div className="book-list-author">{book.author}</div>
                        <div className="book-list-meta"><div className="book-list-progress"><div className="book-list-progress-fill" style={{width: `${book.progress}%`}} /></div><span className="book-list-percent">{book.progress}%</span><span className="book-list-time">{book.lastRead}</span></div>
                      </div>
                      <div className="book-list-actions">
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
              {!currentBook ? (
                <div className="no-file-message">
                  <div className="no-file-icon">📖</div>
                  <div className="no-file-text">No book selected</div>
                  <div className="no-file-subtext">Select a book from your library or upload a new one</div>
                  <button className="primary-btn" style={{ marginTop: 16, width: 'auto', padding: '10px 20px' }} onClick={() => setShowAddMenu(true)}>
                    <PlusIcon /> Upload a Book
                  </button>
                </div>
              ) : !currentBook.fileData ? (
                <div className="no-file-message">
                  <div className="no-file-icon">⚠️</div>
                  <div className="no-file-text">File not loaded</div>
                  <div className="no-file-subtext">This book's file data is missing. Please re-upload the file.</div>
                </div>
              ) : null}
            </div>
          )}
          {activeTab === 'study' && (
            <div className="study-container">
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-value">3</div><div className="stat-label">Pages read</div></div>
                <div className="stat-card"><div className="stat-value">7</div><div className="stat-label">Problems</div></div>
                <div className="stat-card"><div className="stat-value">12</div><div className="stat-label">Flashcards</div></div>
                <div className="stat-card"><div className="stat-value">73%</div><div className="stat-label">Score</div></div>
              </div>
              
              <div className="study-section-title">Summary</div>
              <div className="summary-card">
                <p>This chapter introduces the fundamental concept of <strong>derivatives</strong> — a measure of how a function changes as its input changes. The derivative represents the instantaneous rate of change and geometrically corresponds to the slope of the tangent line at any point on a curve.</p>
                <p><strong>Key differentiation rules covered:</strong></p>
                <ul>
                  <li><strong>Power Rule:</strong> If f(x) = xⁿ, then f'(x) = nxⁿ⁻¹</li>
                  <li><strong>Constant Rule:</strong> The derivative of a constant is zero</li>
                  <li><strong>Sum Rule:</strong> (f + g)' = f' + g'</li>
                  <li><strong>Product Rule:</strong> (fg)' = f'g + fg'</li>
                  <li><strong>Quotient Rule:</strong> (f/g)' = (f'g - fg') / g²</li>
                </ul>
                <p>These rules provide the foundation for computing derivatives of more complex functions.</p>
              </div>

              <div className="study-section-title">Flashcards</div>
              <div className="card-list">
                <div className="card-item">What is a derivative?</div>
                <div className="card-item">Power Rule formula</div>
                <div className="card-item">Derivative of a constant</div>
              </div>
              
              <div className="study-section-title">Highlights</div>
              {["The derivative measures rate of change", "f'(x) = lim[h→0] (f(x+h) - f(x)) / h", ...highlights].map((h, i) => (<div key={i} className="highlight-item">{h}</div>))}
            </div>
          )}
        </main>
        {activeTab === 'reader' && !showAI && !currentBook?.fileData && (<div className="hint-bar"><span className="hint-text">Select text to explain</span><button className="quiz-btn" onClick={startQuiz}>Quiz me</button></div>)}
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
              <div className="add-menu-item" onClick={triggerFileUpload}><div className="add-menu-icon pdf">📕</div><div className="add-menu-text"><div className="add-menu-item-title">PDF Book or Document</div><div className="add-menu-item-desc">Upload a PDF file</div></div></div>
              <div className="add-menu-item" onClick={triggerFileUpload}><div className="add-menu-icon epub">📗</div><div className="add-menu-text"><div className="add-menu-item-title">EPUB Book or Document</div><div className="add-menu-item-desc">Upload an EPUB file</div></div></div>
            </div>
          </div>
        )}
        {isUploading && (
          <div className="upload-progress">
            <span>Uploading...</span>
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span>{uploadProgress}%</span>
          </div>
        )}
        {uploadError && <div className="upload-error">{uploadError}</div>}
      </div>
    </>
  )
}
