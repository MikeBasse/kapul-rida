import React, { useState, useRef, useEffect } from 'react'

const initialBooks = []
const readingThemes = {
  day: { bg: '#FFFFFF', text: '#1A1A1A', name: 'Day' },
  night: { bg: '#1A1A1A', text: '#CCCCCC', name: 'Night' },
  sepia: { bg: '#F4ECD8', text: '#5B4636', name: 'Sepia' },
  twilight: { bg: '#2C3E50', text: '#BDC3C7', name: 'Twilight' },
  console: { bg: '#0D0D0D', text: '#00FF00', name: 'Console' }
}
const bookLists = {
  all: { name: 'All Books', icon: '📚' },
  favorites: { name: 'Favorites', icon: '⭐' },
  toRead: { name: 'To Read', icon: '📖' },
  haveRead: { name: 'Have Read', icon: '✓' }
}

function KLSLogo({ size = 32 }) {
  return (<svg width={size} height={size} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#C35A37"/><text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">KLS</text></svg>)
}

const MenuIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>)
const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>)
const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
const PlusIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>)
const GridIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>)
const ListIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>)
const ChevronLeftIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>)
const ChevronRightIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>)
const SettingsIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82A1.65 1.65 0 0 0 3.51 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>)
const TOCIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>)
const StarIcon = ({ filled }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#FFD700" : "none"} stroke={filled ? "#FFD700" : "currentColor"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)
const MoreIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>)
const DeleteIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>)

function PDFViewer({ fileData, book, onBack, onUpdateBook }) {
  const canvasRef = useRef(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [currentPage, setCurrentPage] = useState(book?.currentPage || 1)
  const [totalPages, setTotalPages] = useState(book?.totalPages || 0)
  const [scale, setScale] = useState(1.5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rendering, setRendering] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState('day')

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true)
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
            script.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; resolve() }
            script.onerror = reject
            document.head.appendChild(script)
          })
        }
        const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(fileData) }).promise
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }
    }
    if (fileData) loadPdf()
  }, [fileData])

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || rendering) return
    const render = async () => {
      setRendering(true)
      try {
        const page = await pdfDoc.getPage(currentPage)
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        canvas.height = viewport.height
        canvas.width = viewport.width
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        onUpdateBook?.({ ...book, currentPage, totalPages, progress: Math.round((currentPage / totalPages) * 100), lastRead: 'Just now' })
      } catch (err) { console.error(err) }
      finally { setRendering(false) }
    }
    render()
  }, [pdfDoc, currentPage, scale])

  const t = readingThemes[theme]
  const goTo = (p) => p >= 1 && p <= totalPages && setCurrentPage(p)

  if (loading) return (<div className="reader-screen" style={{background:t.bg}}><div className="reader-header"><button className="reader-btn" onClick={onBack}><ChevronLeftIcon/></button><span className="reader-title">{book?.title}</span><div style={{width:40}}/></div><div className="reader-loading"><div className="loading-spinner"/><p>Loading PDF...</p></div></div>)
  if (error) return (<div className="reader-screen"><div className="reader-header"><button className="reader-btn" onClick={onBack}><ChevronLeftIcon/></button><span className="reader-title">{book?.title}</span><div style={{width:40}}/></div><div className="reader-error"><p>⚠️ {error}</p><button className="primary-btn" onClick={onBack}>Go Back</button></div></div>)

  return (
    <div className="reader-screen" style={{background:t.bg}}>
      <div className="reader-header" style={{background:t.bg,borderColor:theme==='night'?'#333':'#E8E6E3'}}>
        <button className="reader-btn" onClick={onBack} style={{color:t.text}}><ChevronLeftIcon/></button>
        <span className="reader-title" style={{color:t.text}}>{book?.title}</span>
        <button className="reader-btn" onClick={()=>setShowSettings(!showSettings)} style={{color:t.text}}><SettingsIcon/></button>
      </div>
      {showSettings && (
        <div className="reader-settings" style={{background:t.bg}}>
          <div className="settings-section"><span className="settings-label" style={{color:t.text}}>Theme</span>
            <div className="theme-options">{Object.entries(readingThemes).map(([k,v])=>(<button key={k} className={`theme-btn ${theme===k?'active':''}`} style={{background:v.bg,color:v.text,border:`2px solid ${theme===k?'#C35A37':'#ccc'}`}} onClick={()=>setTheme(k)}>{v.name.charAt(0)}</button>))}</div>
          </div>
          <div className="settings-section"><span className="settings-label" style={{color:t.text}}>Zoom: {Math.round(scale*100)}%</span>
            <div className="zoom-controls"><button className="zoom-btn" onClick={()=>setScale(s=>Math.max(0.5,s-0.25))}>−</button><input type="range" min="50" max="300" value={scale*100} onChange={e=>setScale(e.target.value/100)} className="zoom-slider"/><button className="zoom-btn" onClick={()=>setScale(s=>Math.min(3,s+0.25))}>+</button></div>
          </div>
        </div>
      )}
      <div className="reader-content" style={{background:theme==='night'?'#0D0D0D':'#525659'}}>
        <div className="pdf-container">{rendering&&<div className="page-rendering">Loading...</div>}<canvas ref={canvasRef} className="pdf-canvas"/></div>
      </div>
      <div className="reader-footer" style={{background:t.bg,borderColor:theme==='night'?'#333':'#E8E6E3'}}>
        <button className="nav-btn" onClick={()=>goTo(currentPage-1)} disabled={currentPage<=1}><ChevronLeftIcon/></button>
        <div className="page-info" style={{color:t.text}}><input type="number" value={currentPage} onChange={e=>goTo(parseInt(e.target.value)||1)} min={1} max={totalPages} className="page-input" style={{background:theme==='night'?'#333':'#f5f5f5',color:t.text}}/><span>/ {totalPages}</span></div>
        <div className="progress-bar-container"><div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${(currentPage/totalPages)*100}%`}}/></div></div>
        <button className="nav-btn" onClick={()=>goTo(currentPage+1)} disabled={currentPage>=totalPages}><ChevronRightIcon/></button>
      </div>
    </div>
  )
}

function EPUBViewer({ fileData, book, onBack, onUpdateBook }) {
  const viewerRef = useRef(null)
  const [rendition, setRendition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toc, setToc] = useState([])
  const [showTOC, setShowTOC] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState('day')

  useEffect(() => {
    const loadEpub = async () => {
      try {
        setLoading(true)
        if (!window.ePub) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js'
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }
        if (!viewerRef.current) { setTimeout(loadEpub, 100); return }
        const epub = window.ePub(fileData)
        const rend = epub.renderTo(viewerRef.current, { width: '100%', height: '100%', spread: 'none', flow: 'paginated' })
        await rend.display()
        setRendition(rend)
        const nav = await epub.loaded.navigation
        if (nav?.toc) setToc(nav.toc)
        rend.on('relocated', loc => { if (loc?.start?.percentage) onUpdateBook?.({ ...book, progress: Math.round(loc.start.percentage*100), lastRead: 'Just now' }) })
        setLoading(false)
      } catch (err) { setError(err.message); setLoading(false) }
    }
    if (fileData) loadEpub()
    return () => rendition?.destroy()
  }, [fileData])

  useEffect(() => {
    if (rendition) {
      const t = readingThemes[theme]
      rendition.themes.default({ body: { background: t.bg, color: t.text } })
    }
  }, [theme, rendition])

  useEffect(() => {
    const handleKey = e => { if (e.key === 'ArrowRight') rendition?.next(); if (e.key === 'ArrowLeft') rendition?.prev() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [rendition])

  const t = readingThemes[theme]

  if (loading) return (<div className="reader-screen" style={{background:t.bg}}><div className="reader-header"><button className="reader-btn" onClick={onBack}><ChevronLeftIcon/></button><span className="reader-title">{book?.title}</span><div style={{width:40}}/></div><div className="reader-loading"><div className="loading-spinner"/><p>Loading EPUB...</p></div><div ref={viewerRef} style={{display:'none'}}/></div>)
  if (error) return (<div className="reader-screen"><div className="reader-header"><button className="reader-btn" onClick={onBack}><ChevronLeftIcon/></button><span className="reader-title">{book?.title}</span><div style={{width:40}}/></div><div className="reader-error"><p>⚠️ {error}</p><button className="primary-btn" onClick={onBack}>Go Back</button></div></div>)

  return (
    <div className="reader-screen" style={{background:t.bg}}>
      <div className="reader-header" style={{background:t.bg,borderColor:theme==='night'?'#333':'#E8E6E3'}}>
        <button className="reader-btn" onClick={onBack} style={{color:t.text}}><ChevronLeftIcon/></button>
        <span className="reader-title" style={{color:t.text}}>{book?.title}</span>
        <div className="reader-header-actions">
          <button className="reader-btn" onClick={()=>setShowTOC(!showTOC)} style={{color:t.text}}><TOCIcon/></button>
          <button className="reader-btn" onClick={()=>setShowSettings(!showSettings)} style={{color:t.text}}><SettingsIcon/></button>
        </div>
      </div>
      {showTOC && toc.length > 0 && (<div className="toc-panel" style={{background:t.bg}}><div className="toc-header" style={{borderColor:theme==='night'?'#333':'#E8E6E3'}}><span style={{color:t.text}}>Contents</span><button className="reader-btn" onClick={()=>setShowTOC(false)} style={{color:t.text}}><CloseIcon/></button></div><div className="toc-list">{toc.map((item,i)=>(<button key={i} className="toc-item" onClick={()=>{rendition?.display(item.href);setShowTOC(false)}} style={{color:t.text}}>{item.label}</button>))}</div></div>)}
      {showSettings && (<div className="reader-settings" style={{background:t.bg}}><div className="settings-section"><span className="settings-label" style={{color:t.text}}>Theme</span><div className="theme-options">{Object.entries(readingThemes).map(([k,v])=>(<button key={k} className={`theme-btn ${theme===k?'active':''}`} style={{background:v.bg,color:v.text,border:`2px solid ${theme===k?'#C35A37':'#ccc'}`}} onClick={()=>setTheme(k)}>{v.name.charAt(0)}</button>))}</div></div></div>)}
      <div className="reader-content epub-content" style={{background:t.bg}}><div ref={viewerRef} className="epub-viewer-area"/></div>
      <div className="reader-footer epub-footer" style={{background:t.bg,borderColor:theme==='night'?'#333':'#E8E6E3'}}>
        <button className="nav-btn large" onClick={()=>rendition?.prev()} style={{color:t.text}}><ChevronLeftIcon/></button>
        <div className="progress-bar-container"><div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${book?.progress||0}%`}}/></div></div>
        <button className="nav-btn large" onClick={()=>rendition?.next()} style={{color:t.text}}><ChevronRightIcon/></button>
      </div>
    </div>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [books, setBooks] = useState(initialBooks)
  const [currentList, setCurrentList] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [currentBook, setCurrentBook] = useState(null)
  const [viewingFile, setViewingFile] = useState(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showBookMenu, setShowBookMenu] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)
  const sidebarRef = useRef(null)

  const showNotif = (msg, type = 'info') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000) }

  useEffect(() => {
    const handleClick = e => { if (sidebarRef.current && !sidebarRef.current.contains(e.target) && sidebarOpen) setSidebarOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [sidebarOpen])

  const handleFileUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    const name = file.name.toLowerCase()
    const isPdf = name.endsWith('.pdf'), isEpub = name.endsWith('.epub')
    if (!isPdf && !isEpub) { showNotif('Only PDF and EPUB files supported', 'error'); return }
    setIsUploading(true); setUploadProgress(0); setShowAddMenu(false)
    try {
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onprogress = ev => ev.lengthComputable && setUploadProgress(Math.round((ev.loaded/ev.total)*100))
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsArrayBuffer(file)
      })
      const colors = ['#E74C3C','#3498DB','#2ECC71','#9B59B6','#F39C12','#1ABC9C','#E91E63','#00BCD4']
      const format = isPdf ? 'pdf' : 'epub'
      const newBook = { id: Date.now(), title: file.name.replace(/\.(pdf|epub)$/i,''), author: 'Unknown Author', progress: 0, color: colors[Math.floor(Math.random()*colors.length)], format, lastRead: 'New', fileData: arrayBuffer, fileName: file.name, currentPage: 1, totalPages: 0, isFavorite: false, status: 'toRead' }
      setBooks(prev => [newBook, ...prev])
      showNotif(`"${newBook.title}" added`, 'success')
      setCurrentBook(newBook)
      setViewingFile({ data: arrayBuffer, name: file.name, format, book: newBook })
    } catch (err) { showNotif('Failed to read file', 'error') }
    finally { setIsUploading(false); setUploadProgress(0); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  const openBook = book => {
    if (book.fileData) {
      setCurrentBook(book)
      setViewingFile({ data: book.fileData, name: book.fileName, format: book.format, book })
      setBooks(books.map(b => b.id === book.id ? { ...b, lastRead: 'Just now', status: 'reading' } : b))
    }
    setSidebarOpen(false); setShowBookMenu(null)
  }

  const updateBook = ub => { setBooks(books.map(b => b.id === ub.id ? ub : b)); setCurrentBook(ub) }
  const closeViewer = () => { setViewingFile(null); setCurrentBook(null) }
  const toggleFav = (id, e) => { e?.stopPropagation(); setBooks(books.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)); setShowBookMenu(null) }
  const setStatus = (id, status, e) => { e?.stopPropagation(); setBooks(books.map(b => b.id === id ? { ...b, status } : b)); setShowBookMenu(null) }
  const deleteBook = (id, e) => { e?.stopPropagation(); const b = books.find(x => x.id === id); if (confirm(`Remove "${b?.title}"?`)) { setBooks(books.filter(x => x.id !== id)); showNotif('Book removed'); if (currentBook?.id === id) closeViewer() } setShowBookMenu(null) }

  const getFiltered = () => {
    let f = books
    if (currentList === 'favorites') f = f.filter(b => b.isFavorite)
    else if (currentList === 'toRead') f = f.filter(b => b.status === 'toRead')
    else if (currentList === 'haveRead') f = f.filter(b => b.status === 'haveRead')
    if (searchQuery) { const q = searchQuery.toLowerCase(); f = f.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) }
    return f
  }

  const filtered = getFiltered()
  const recent = books.filter(b => b.lastRead !== 'New').slice(0, 4)

  if (viewingFile) {
    return viewingFile.format === 'pdf' 
      ? <><style>{styles}</style><PDFViewer fileData={viewingFile.data} book={viewingFile.book} onBack={closeViewer} onUpdateBook={updateBook}/></>
      : <><style>{styles}</style><EPUBViewer fileData={viewingFile.data} book={viewingFile.book} onBack={closeViewer} onUpdateBook={updateBook}/></>
  }

  return (
    <><style>{styles}</style>
    <div className="app">
      <input ref={fileInputRef} type="file" accept=".pdf,.epub" onChange={handleFileUpload} className="file-input"/>
      <div className={`sidebar-overlay ${sidebarOpen?'open':''}`} onClick={()=>setSidebarOpen(false)}/>
      <aside ref={sidebarRef} className={`sidebar ${sidebarOpen?'open':''}`}>
        <div className="sidebar-header"><div className="sidebar-logo"><KLSLogo size={36}/><div className="sidebar-brand"><span className="brand-name">Kapul Reader</span><span className="brand-tagline">Reading is easy!</span></div></div></div>
        <nav className="sidebar-nav"><div className="nav-section"><span className="nav-section-title">Library</span>
          {Object.entries(bookLists).map(([k,list])=>(<button key={k} className={`nav-item ${currentList===k?'active':''}`} onClick={()=>{setCurrentList(k);setSidebarOpen(false)}}><span className="nav-icon">{list.icon}</span><span className="nav-label">{list.name}</span><span className="nav-count">{k==='all'?books.length:k==='favorites'?books.filter(b=>b.isFavorite).length:k==='toRead'?books.filter(b=>b.status==='toRead').length:books.filter(b=>b.status==='haveRead').length}</span></button>))}
        </div></nav>
        <div className="sidebar-footer"><span className="footer-text">Kapul Learning Systems</span></div>
      </aside>
      <header className="header">
        <div className="header-left">
          <button className="header-btn" onClick={()=>setSidebarOpen(true)}><MenuIcon/></button>
          {showSearch ? (<div className="search-container"><SearchIcon/><input type="text" className="search-input" placeholder="Search books..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} autoFocus/><button className="search-close" onClick={()=>{setShowSearch(false);setSearchQuery('')}}><CloseIcon/></button></div>) : (<h1 className="header-title">{bookLists[currentList]?.name||'Library'}</h1>)}
        </div>
        <div className="header-right">
          {!showSearch && (<><button className="header-btn" onClick={()=>setShowSearch(true)}><SearchIcon/></button><div className="view-toggle"><button className={`view-btn ${viewMode==='grid'?'active':''}`} onClick={()=>setViewMode('grid')}><GridIcon/></button><button className={`view-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}><ListIcon/></button></div><button className="header-btn accent" onClick={()=>setShowAddMenu(true)}><PlusIcon/></button></>)}
        </div>
      </header>
      <main className="main">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📚</div><h2 className="empty-title">{searchQuery?'No books found':currentList==='favorites'?'No favorites yet':currentList==='toRead'?'Nothing to read':currentList==='haveRead'?'No completed books':'Welcome to Kapul Reader'}</h2><p className="empty-text">{searchQuery?'Try different search':currentList!=='all'?'Books appear when you add them':'Upload PDF or EPUB files to start reading'}</p>{!searchQuery&&currentList==='all'&&(<button className="primary-btn large" onClick={()=>setShowAddMenu(true)}><PlusIcon/> Add Your First Book</button>)}</div>
        ) : (<>
          {currentList==='all'&&recent.length>0&&!searchQuery&&(<section className="recent-section"><h2 className="section-title">Continue Reading</h2><div className="recent-scroll">{recent.map(book=>(<div key={book.id} className="recent-card" onClick={()=>openBook(book)}><div className="recent-cover" style={{background:book.color}}><span className="cover-letter">{book.title.charAt(0)}</span><span className="cover-format">{book.format.toUpperCase()}</span></div><div className="recent-info"><span className="recent-title">{book.title}</span><div className="recent-progress"><div className="progress-track"><div className="progress-fill" style={{width:`${book.progress}%`}}/></div><span className="progress-text">{book.progress}%</span></div></div></div>))}</div></section>)}
          <section className="books-section">
            {(currentList!=='all'||searchQuery||recent.length===0)&&(<h2 className="section-title">{searchQuery?`Results for "${searchQuery}"`:bookLists[currentList]?.name}</h2>)}
            {viewMode==='grid'?(
              <div className="book-grid">{filtered.map(book=>(<div key={book.id} className="book-card" onClick={()=>openBook(book)}><div className="book-cover" style={{background:book.color}}><span className="cover-letter large">{book.title.charAt(0)}</span>{book.isFavorite&&<span className="favorite-badge">⭐</span>}<span className="format-badge">{book.format.toUpperCase()}</span>{book.progress>0&&<div className="cover-progress"><div className="cover-progress-fill" style={{width:`${book.progress}%`}}/></div>}<button className="book-menu-btn" onClick={e=>{e.stopPropagation();setShowBookMenu(showBookMenu===book.id?null:book.id)}}><MoreIcon/></button>{showBookMenu===book.id&&(<div className="book-menu" onClick={e=>e.stopPropagation()}><button onClick={e=>toggleFav(book.id,e)}><StarIcon filled={book.isFavorite}/> {book.isFavorite?'Remove Favorite':'Add Favorite'}</button><button onClick={e=>setStatus(book.id,'toRead',e)}>📖 To Read</button><button onClick={e=>setStatus(book.id,'haveRead',e)}>✓ Mark Read</button><button className="danger" onClick={e=>deleteBook(book.id,e)}><DeleteIcon/> Remove</button></div>)}</div><div className="book-info"><span className="book-title">{book.title}</span><span className="book-author">{book.author}</span></div></div>))}</div>
            ):(
              <div className="book-list">{filtered.map(book=>(<div key={book.id} className="book-list-item" onClick={()=>openBook(book)}><div className="list-cover" style={{background:book.color}}><span>{book.title.charAt(0)}</span></div><div className="list-info"><div className="list-title-row"><span className="list-title">{book.title}</span>{book.isFavorite&&<StarIcon filled/>}</div><span className="list-author">{book.author}</span><div className="list-meta"><span className="list-format">{book.format.toUpperCase()}</span><span className="list-progress">{book.progress}%</span><span className="list-time">{book.lastRead}</span></div></div><button className="list-menu-btn" onClick={e=>{e.stopPropagation();setShowBookMenu(showBookMenu===book.id?null:book.id)}}><MoreIcon/></button>{showBookMenu===book.id&&(<div className="book-menu list-menu" onClick={e=>e.stopPropagation()}><button onClick={e=>toggleFav(book.id,e)}><StarIcon filled={book.isFavorite}/> {book.isFavorite?'Remove Favorite':'Add Favorite'}</button><button onClick={e=>setStatus(book.id,'toRead',e)}>📖 To Read</button><button onClick={e=>setStatus(book.id,'haveRead',e)}>✓ Mark Read</button><button className="danger" onClick={e=>deleteBook(book.id,e)}><DeleteIcon/> Remove</button></div>)}</div>))}</div>
            )}
          </section>
        </>)}
      </main>
      {showAddMenu&&(<div className="modal-overlay" onClick={()=>setShowAddMenu(false)}><div className="add-menu" onClick={e=>e.stopPropagation()}><div className="add-menu-header"><h3>Add to Library</h3><button className="close-btn" onClick={()=>setShowAddMenu(false)}><CloseIcon/></button></div><div className="add-menu-content"><button className="add-option" onClick={()=>fileInputRef.current?.click()}><div className="add-option-icon pdf">📕</div><div className="add-option-text"><span className="add-option-title">PDF Document</span><span className="add-option-desc">Books, articles, documents</span></div></button><button className="add-option" onClick={()=>fileInputRef.current?.click()}><div className="add-option-icon epub">📗</div><div className="add-option-text"><span className="add-option-title">EPUB Book</span><span className="add-option-desc">E-books, novels, magazines</span></div></button></div></div></div>)}
      {isUploading&&(<div className="upload-toast"><div className="upload-content"><span>Uploading...</span><div className="upload-bar"><div className="upload-fill" style={{width:`${uploadProgress}%`}}/></div><span>{uploadProgress}%</span></div></div>)}
      {notification&&(<div className={`notification ${notification.type}`}>{notification.msg}</div>)}
    </div></>
  )
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}html,body,#root{height:100%}:root{--bg-primary:#FFF;--bg-secondary:#F5F5F5;--bg-tertiary:#EEE;--text-primary:#212121;--text-secondary:#757575;--text-tertiary:#9E9E9E;--border:#E0E0E0;--accent:#C35A37;--accent-light:#D4714F;--success:#4CAF50;--error:#F44336;--shadow:0 2px 8px rgba(0,0,0,0.1)}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg-primary);color:var(--text-primary);line-height:1.5;-webkit-font-smoothing:antialiased}.app{min-height:100vh;display:flex;flex-direction:column}.file-input{display:none}.sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;opacity:0;visibility:hidden;transition:all .3s}.sidebar-overlay.open{opacity:1;visibility:visible}.sidebar{position:fixed;top:0;left:0;bottom:0;width:280px;background:var(--bg-primary);z-index:300;transform:translateX(-100%);transition:transform .3s ease;display:flex;flex-direction:column;box-shadow:var(--shadow)}.sidebar.open{transform:translateX(0)}.sidebar-header{padding:20px;border-bottom:1px solid var(--border)}.sidebar-logo{display:flex;align-items:center;gap:12px}.sidebar-brand{display:flex;flex-direction:column}.brand-name{font-size:18px;font-weight:600}.brand-tagline{font-size:12px;color:var(--text-secondary)}.sidebar-nav{flex:1;padding:12px;overflow-y:auto}.nav-section{margin-bottom:20px}.nav-section-title{font-size:11px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.5px;padding:8px 12px}.nav-item{display:flex;align-items:center;gap:12px;width:100%;padding:12px;background:none;border:none;border-radius:8px;cursor:pointer;transition:all .15s;color:var(--text-secondary);font-size:14px;text-align:left}.nav-item:hover{background:var(--bg-secondary);color:var(--text-primary)}.nav-item.active{background:rgba(195,90,55,0.1);color:var(--accent)}.nav-icon{font-size:18px}.nav-label{flex:1}.nav-count{font-size:12px;color:var(--text-tertiary);background:var(--bg-secondary);padding:2px 8px;border-radius:10px}.sidebar-footer{padding:16px;border-top:1px solid var(--border);text-align:center}.footer-text{font-size:11px;color:var(--text-tertiary)}.header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg-primary);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}.header-left{display:flex;align-items:center;gap:12px;flex:1}.header-right{display:flex;align-items:center;gap:8px}.header-title{font-size:18px;font-weight:600}.header-btn{display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:none;border:none;border-radius:50%;cursor:pointer;color:var(--text-secondary);transition:all .15s}.header-btn:hover{background:var(--bg-secondary);color:var(--text-primary)}.header-btn.accent{background:var(--accent);color:#fff}.header-btn.accent:hover{background:var(--accent-light)}.search-container{display:flex;align-items:center;gap:8px;flex:1;background:var(--bg-secondary);border-radius:8px;padding:8px 12px}.search-container svg{color:var(--text-tertiary);flex-shrink:0}.search-input{flex:1;border:none;background:none;outline:none;font-size:15px;color:var(--text-primary)}.search-close{background:none;border:none;cursor:pointer;color:var(--text-tertiary)}.view-toggle{display:flex;background:var(--bg-secondary);border-radius:8px;padding:2px;gap:2px}.view-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:none;border:none;border-radius:6px;cursor:pointer;color:var(--text-tertiary);transition:all .15s}.view-btn:hover{color:var(--text-secondary)}.view-btn.active{background:var(--bg-primary);color:var(--text-primary);box-shadow:var(--shadow)}.main{flex:1;padding:16px;max-width:1200px;margin:0 auto;width:100%}.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center}.empty-icon{font-size:64px;margin-bottom:20px}.empty-title{font-size:22px;font-weight:600;margin-bottom:8px}.empty-text{font-size:14px;color:var(--text-secondary);margin-bottom:24px;max-width:300px}.primary-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;transition:background .15s}.primary-btn:hover{background:var(--accent-light)}.primary-btn.large{padding:14px 28px;font-size:16px}.section-title{font-size:13px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px}.recent-section{margin-bottom:28px}.recent-scroll{display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}.recent-scroll::-webkit-scrollbar{display:none}.recent-card{flex-shrink:0;width:140px;cursor:pointer;transition:transform .15s}.recent-card:hover{transform:translateY(-2px)}.recent-cover{aspect-ratio:3/4;border-radius:8px;margin-bottom:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;box-shadow:var(--shadow)}.cover-letter{font-size:36px;font-weight:600;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.2)}.cover-letter.large{font-size:48px}.cover-format{position:absolute;bottom:8px;right:8px;font-size:9px;font-weight:600;color:#fff;background:rgba(0,0,0,0.4);padding:2px 6px;border-radius:4px}.recent-info{padding:0 4px}.recent-title{font-size:13px;font-weight:500;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}.recent-progress{display:flex;align-items:center;gap:8px}.progress-track{flex:1;height:3px;background:var(--bg-tertiary);border-radius:2px}.progress-fill{height:100%;background:var(--accent);border-radius:2px}.progress-text{font-size:11px;color:var(--text-tertiary)}.book-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:16px}.book-card{cursor:pointer;transition:transform .15s}.book-card:hover{transform:translateY(-2px)}.book-cover{aspect-ratio:3/4;border-radius:8px;margin-bottom:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;box-shadow:var(--shadow)}.favorite-badge{position:absolute;top:8px;left:8px;font-size:14px}.format-badge{position:absolute;bottom:8px;right:8px;font-size:9px;font-weight:600;color:#fff;background:rgba(0,0,0,0.4);padding:2px 6px;border-radius:4px}.cover-progress{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(0,0,0,0.3)}.cover-progress-fill{height:100%;background:#fff}.book-menu-btn{position:absolute;top:4px;right:4px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.4);border:none;color:#fff;cursor:pointer;opacity:0;transition:opacity .15s;display:flex;align-items:center;justify-content:center}.book-card:hover .book-menu-btn{opacity:1}.book-menu{position:absolute;top:36px;right:4px;background:var(--bg-primary);border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);min-width:180px;z-index:10;overflow:hidden}.book-menu button{display:flex;align-items:center;gap:10px;width:100%;padding:12px 14px;background:none;border:none;font-size:13px;color:var(--text-primary);cursor:pointer;text-align:left}.book-menu button:hover{background:var(--bg-secondary)}.book-menu button.danger{color:var(--error)}.book-info{padding:0 4px}.book-title{font-size:13px;font-weight:500;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}.book-author{font-size:11px;color:var(--text-secondary);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.book-list{display:flex;flex-direction:column;gap:8px}.book-list-item{display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-primary);border:1px solid var(--border);border-radius:10px;cursor:pointer;transition:all .15s;position:relative}.book-list-item:hover{border-color:var(--text-tertiary)}.list-cover{width:48px;height:64px;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#fff}.list-info{flex:1;min-width:0}.list-title-row{display:flex;align-items:center;gap:8px}.list-title{font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.list-author{font-size:12px;color:var(--text-secondary);margin-bottom:4px}.list-meta{display:flex;align-items:center;gap:12px}.list-format{font-size:10px;font-weight:600;color:var(--text-tertiary);background:var(--bg-secondary);padding:2px 6px;border-radius:4px}.list-progress,.list-time{font-size:11px;color:var(--text-tertiary)}.list-menu-btn{width:32px;height:32px;border-radius:50%;background:none;border:none;color:var(--text-tertiary);cursor:pointer;display:flex;align-items:center;justify-content:center}.list-menu-btn:hover{background:var(--bg-secondary)}.book-menu.list-menu{top:50px;right:12px}.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;justify-content:center;z-index:400;padding:16px}.add-menu{width:100%;max-width:400px;background:var(--bg-primary);border-radius:16px 16px 0 0;overflow:hidden;animation:slideUp .3s ease}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}.add-menu-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)}.add-menu-header h3{font-size:18px;font-weight:600}.close-btn{width:32px;height:32px;border-radius:50%;background:var(--bg-secondary);border:none;cursor:pointer;color:var(--text-secondary);display:flex;align-items:center;justify-content:center}.add-menu-content{padding:12px}.add-option{display:flex;align-items:center;gap:14px;width:100%;padding:14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:12px;cursor:pointer;margin-bottom:8px;transition:all .15s}.add-option:hover{border-color:var(--accent)}.add-option-icon{font-size:32px}.add-option-text{text-align:left}.add-option-title{font-size:15px;font-weight:500;display:block;margin-bottom:2px}.add-option-desc{font-size:12px;color:var(--text-secondary)}.upload-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--bg-primary);border-radius:12px;padding:14px 20px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:500}.upload-content{display:flex;align-items:center;gap:12px}.upload-bar{width:100px;height:4px;background:var(--bg-tertiary);border-radius:2px}.upload-fill{height:100%;background:var(--accent);border-radius:2px;transition:width .2s}.notification{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--text-primary);color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:500;animation:fadeIn .2s ease}.notification.success{background:var(--success)}.notification.error{background:var(--error)}@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}.reader-screen{position:fixed;inset:0;display:flex;flex-direction:column;z-index:500}.reader-header{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid var(--border);min-height:56px}.reader-btn{width:40px;height:40px;border-radius:50%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);transition:all .15s}.reader-btn:hover{background:rgba(0,0,0,0.05)}.reader-title{font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}.reader-header-actions{display:flex;gap:4px}.reader-loading,.reader-error{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}.loading-spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.reader-content{flex:1;overflow:auto}.pdf-container{display:flex;justify-content:center;padding:20px;min-height:100%}.pdf-canvas{box-shadow:0 4px 20px rgba(0,0,0,0.3)}.page-rendering{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:#fff;padding:8px 16px;border-radius:6px;font-size:13px}.epub-content{padding:0}.epub-viewer-area{width:100%;height:100%}.reader-settings{padding:16px;border-bottom:1px solid var(--border)}.settings-section{margin-bottom:16px}.settings-section:last-child{margin-bottom:0}.settings-label{display:block;font-size:12px;font-weight:600;text-transform:uppercase;margin-bottom:8px}.theme-options{display:flex;gap:8px}.theme-btn{width:40px;height:40px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:transform .15s}.theme-btn:hover{transform:scale(1.05)}.zoom-controls{display:flex;align-items:center;gap:12px}.zoom-btn{width:32px;height:32px;border-radius:50%;background:var(--bg-secondary);border:1px solid var(--border);font-size:18px;cursor:pointer}.zoom-slider{flex:1}.toc-panel{position:absolute;top:56px;left:0;right:0;max-height:60%;overflow-y:auto;border-bottom:1px solid var(--border);z-index:10}.toc-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);font-weight:600}.toc-list{padding:8px}.toc-item{display:block;width:100%;padding:12px;background:none;border:none;border-radius:6px;font-size:14px;text-align:left;cursor:pointer}.toc-item:hover{background:rgba(0,0,0,0.05)}.reader-footer{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid var(--border)}.nav-btn{width:40px;height:40px;border-radius:50%;background:none;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}.nav-btn:hover:not(:disabled){background:var(--bg-secondary)}.nav-btn:disabled{opacity:.3;cursor:not-allowed}.nav-btn.large{width:48px;height:48px}.page-info{display:flex;align-items:center;gap:6px;font-size:14px}.page-input{width:50px;padding:6px;border:1px solid var(--border);border-radius:6px;text-align:center;font-size:14px}.progress-bar-container{flex:1}.progress-bar-bg{height:4px;background:var(--bg-tertiary);border-radius:2px}.progress-bar-fill{height:100%;background:var(--accent);border-radius:2px;transition:width .3s}@media(min-width:600px){.book-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}.modal-overlay{align-items:center;padding:20px}.add-menu{border-radius:16px;max-width:420px}}@media(min-width:900px){.book-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:20px}}
`
