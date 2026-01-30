import React, { useState } from 'react'

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

This limit, when it exists, gives us the instantaneous rate of change of f at the point x.`
    },
    {
      id: 2,
      heading: "3.2 Basic Differentiation Rules",
      content: `Several fundamental rules make computing derivatives straightforward:

Power Rule: If f(x) = xⁿ, then f'(x) = nxⁿ⁻¹

Constant Rule: If f(x) = c (constant), then f'(x) = 0

Sum Rule: (f + g)' = f' + g'

Product Rule: (fg)' = f'g + fg'`
    },
    {
      id: 3,
      heading: "3.3 Practice Problems",
      content: `Apply the differentiation rules to solve:

Problem 1: Find f'(x) if f(x) = 5x³ - 2x² + 4x - 1

Problem 2: Differentiate g(x) = (x² + 1)(x - 3)`
    }
  ]
}

const getAIResponse = (type, text) => {
  const responses = {
    explain: {
      "derivative": "Think of a derivative as the 'speedometer' of a function. It tells you how fast your function is changing at any point.",
      "limit": "A limit describes what happens as we get infinitely close to something, without actually reaching it.",
      "power rule": "The Power Rule: bring the exponent down as a coefficient, then reduce the exponent by 1. So x⁵ becomes 5x⁴.",
      "default": "This concept relates to how functions change. Calculus gives us tools to measure instantaneous change."
    },
    solve: {
      "5x³ - 2x² + 4x - 1": "Step by step:\n\n• d/dx(5x³) = 15x²\n• d/dx(-2x²) = -4x\n• d/dx(4x) = 4\n• d/dx(-1) = 0\n\nAnswer: f'(x) = 15x² - 4x + 4",
      "default": "Select the specific problem text for a detailed walkthrough."
    },
    quiz: [
      { q: "What does the derivative represent geometrically?", a: "The slope of the tangent line at a point" },
      { q: "Using the power rule, what is the derivative of x⁷?", a: "7x⁶" },
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
  return "Select some text and I'll explain it."
}

function KapulLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="52" rx="38" ry="35" fill="#D4A574"/>
      <ellipse cx="22" cy="28" rx="14" ry="16" fill="#D4A574"/>
      <ellipse cx="22" cy="28" rx="10" ry="12" fill="#FFB6C1"/>
      <ellipse cx="78" cy="28" rx="14" ry="16" fill="#D4A574"/>
      <ellipse cx="78" cy="28" rx="10" ry="12" fill="#FFB6C1"/>
      <circle cx="35" cy="50" r="12" fill="#1a1a2e"/>
      <circle cx="65" cy="50" r="12" fill="#1a1a2e"/>
      <circle cx="38" cy="47" r="4" fill="#fff"/>
      <circle cx="68" cy="47" r="4" fill="#fff"/>
      <ellipse cx="50" cy="62" rx="6" ry="5" fill="#8B4513"/>
    </svg>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('reader')
  const [selectedText, setSelectedText] = useState('')
  const [showAI, setShowAI] = useState(false)
  const [aiResponse, setAIResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [highlights, setHighlights] = useState([])
  const [quizActive, setQuizActive] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleSelect = () => {
    const text = window.getSelection().toString().trim()
    if (text.length > 3) {
      setSelectedText(text)
      setShowAI(true)
      setAIResponse('')
    }
  }

  const handleAI = async (mode) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setAIResponse(getAIResponse(mode, selectedText))
    setIsLoading(false)
  }

  const startQuiz = () => {
    setQuizQuestions(getAIResponse('quiz', ''))
    setQuizIndex(0)
    setShowAnswer(false)
    setQuizActive(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; }
        body { background: #0a0a0f; }
        ::selection { background: rgba(251,191,36,0.4); }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        
        .app {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e4e4e7;
          font-family: 'DM Sans', sans-serif;
        }
        
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: rgba(10,10,15,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .logo-text {
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #D4A574, #FBBF24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .nav {
          display: flex;
          gap: 2px;
          background: rgba(255,255,255,0.03);
          padding: 3px;
          border-radius: 8px;
        }
        
        .nav-btn {
          padding: 8px 12px;
          background: none;
          border: none;
          border-radius: 6px;
          color: #71717a;
          font-size: 16px;
          cursor: pointer;
        }
        
        .nav-btn.active {
          background: rgba(251,191,36,0.15);
          color: #FBBF24;
        }
        
        .streak {
          padding: 4px 10px;
          background: rgba(251,191,36,0.1);
          border-radius: 12px;
          font-size: 12px;
          color: #FBBF24;
        }
        
        .main {
          padding: 12px;
        }
        
        .panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        
        .title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .subtitle {
          font-size: 13px;
          color: #71717a;
          margin-bottom: 12px;
        }
        
        .progress-bar {
          height: 3px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin-bottom: 6px;
        }
        
        .progress-fill {
          height: 100%;
          width: 35%;
          background: linear-gradient(90deg, #3B82F6, #8B5CF6);
          border-radius: 2px;
        }
        
        .progress-text {
          font-size: 11px;
          color: #52525b;
        }
        
        .section {
          margin-top: 20px;
        }
        
        .section-title {
          font-size: 15px;
          font-weight: 600;
          color: #FBBF24;
          margin-bottom: 10px;
        }
        
        .para {
          font-size: 14px;
          line-height: 1.7;
          color: #d4d4d8;
          margin-bottom: 10px;
        }
        
        .ai-panel {
          background: rgba(251,191,36,0.03);
          border-color: rgba(251,191,36,0.2);
        }
        
        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .ai-title {
          font-size: 15px;
          font-weight: 600;
          color: #FBBF24;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #71717a;
          font-size: 20px;
          cursor: pointer;
        }
        
        .selected-box {
          background: rgba(0,0,0,0.3);
          border-left: 3px solid #FBBF24;
          padding: 8px 10px;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        
        .selected-label {
          font-size: 10px;
          color: #71717a;
          text-transform: uppercase;
        }
        
        .selected-text {
          font-size: 13px;
          color: #a1a1aa;
          font-style: italic;
        }
        
        .ai-btns {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .ai-btn {
          flex: 1;
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #a1a1aa;
          font-size: 13px;
          cursor: pointer;
        }
        
        .ai-btn:active {
          background: rgba(251,191,36,0.15);
          color: #FBBF24;
        }
        
        .response {
          font-size: 13px;
          line-height: 1.6;
          color: #d4d4d8;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: #FBBF24;
          animation: pulse 1s infinite;
        }
        
        .hint {
          text-align: center;
          color: #71717a;
          font-size: 13px;
          margin-bottom: 16px;
        }
        
        .quiz-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .quiz-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,15,0.98);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 200;
        }
        
        .quiz-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          width: 100%;
          max-width: 360px;
          position: relative;
        }
        
        .quiz-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #71717a;
          margin-bottom: 16px;
        }
        
        .quiz-q {
          font-size: 17px;
          color: #fff;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .quiz-a {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          color: #d4d4d8;
        }
        
        .reveal-btn, .next-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .reveal-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
        }
        
        .next-btn {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          color: #fff;
        }
        
        .close-quiz {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #71717a;
          font-size: 22px;
          cursor: pointer;
        }
        
        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .stat {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 14px;
          text-align: center;
        }
        
        .stat-icon { font-size: 18px; }
        .stat-val { font-size: 22px; font-weight: 700; color: #fff; }
        .stat-label { font-size: 11px; color: #71717a; }
        
        .card-grid {
          display: grid;
          gap: 10px;
          margin-bottom: 12px;
        }
        
        .card {
          background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1));
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 10px;
          padding: 12px;
          font-size: 13px;
          color: #d4d4d8;
        }
        
        .highlight {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: rgba(251,191,36,0.05);
          border-left: 3px solid #FBBF24;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        
        .highlight-dot {
          width: 6px;
          height: 6px;
          background: #FBBF24;
          border-radius: 50%;
          margin-top: 6px;
        }
        
        .highlight-text {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
        }
        
        .lib-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .lib-title {
          font-size: 18px;
          font-weight: 700;
        }
        
        .add-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
        }
        
        .book {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
        }
        
        .book-cover {
          width: 45px;
          height: 60px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
        }
        
        .book-info { flex: 1; }
        .book-name { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .book-author { font-size: 12px; color: #71717a; margin-bottom: 8px; }
        .book-prog { height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 4px; }
        .book-prog-fill { height: 100%; background: linear-gradient(90deg, #3B82F6, #8B5CF6); border-radius: 2px; }
        .book-prog-text { font-size: 10px; color: #52525b; }
        
        .action-btn {
          padding: 10px 16px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
      
      <div className="app">
        <header className="header">
          <div className="logo">
            <KapulLogo />
            <span className="logo-text">Kapul</span>
          </div>
          <nav className="nav">
            {['reader', 'study', 'library'].map(tab => (
              <button
                key={tab}
                className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab); setQuizActive(false) }}
              >
                {tab === 'reader' ? '📖' : tab === 'study' ? '🧠' : '📚'}
              </button>
            ))}
          </nav>
          <div className="streak">🔥 5</div>
        </header>

        <main className="main">
          {activeTab === 'reader' && (
            <>
              <div className="panel" onMouseUp={handleSelect} onTouchEnd={handleSelect}>
                <div className="title">{sampleContent.title}</div>
                <div className="subtitle">{sampleContent.chapter}</div>
                <div className="progress-bar"><div className="progress-fill" /></div>
                <div className="progress-text">35% complete</div>
                
                {sampleContent.sections.map(s => (
                  <div key={s.id} className="section">
                    <div className="section-title">{s.heading}</div>
                    {s.content.split('\n\n').map((p, i) => (
                      <p key={i} className="para">{p}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className={`panel ${showAI ? 'ai-panel' : ''}`}>
                {showAI ? (
                  <>
                    <div className="ai-header">
                      <span className="ai-title">✦ Kapul AI</span>
                      <button className="close-btn" onClick={() => setShowAI(false)}>×</button>
                    </div>
                    
                    <div className="selected-box">
                      <div className="selected-label">Selected:</div>
                      <div className="selected-text">"{selectedText.slice(0, 60)}..."</div>
                    </div>
                    
                    <div className="ai-btns">
                      <button className="ai-btn" onClick={() => handleAI('explain')}>💡 Explain</button>
                      <button className="ai-btn" onClick={() => handleAI('solve')}>🧮 Solve</button>
                      <button className="ai-btn" onClick={() => setHighlights([...highlights, selectedText])}>🖍️ Save</button>
                    </div>
                    
                    {isLoading ? (
                      <div className="loading">● ● ●</div>
                    ) : aiResponse ? (
                      <div className="response">{aiResponse}</div>
                    ) : (
                      <div className="hint">Tap a button above</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="hint">✦ Select text to get explanations</div>
                    <button className="quiz-btn" onClick={startQuiz}>📝 Quiz me</button>
                  </>
                )}
              </div>
            </>
          )}

          {quizActive && (
            <div className="quiz-overlay">
              <div className="quiz-card">
                <div className="quiz-header">
                  <span>Quiz</span>
                  <span style={{color: '#FBBF24'}}>{quizIndex + 1}/{quizQuestions.length}</span>
                </div>
                <div className="quiz-q">{quizQuestions[quizIndex]?.q}</div>
                {showAnswer ? (
                  <>
                    <div className="quiz-a">{quizQuestions[quizIndex]?.a}</div>
                    <button className="next-btn" onClick={() => {
                      if (quizIndex < quizQuestions.length - 1) {
                        setQuizIndex(quizIndex + 1)
                        setShowAnswer(false)
                      } else {
                        setQuizActive(false)
                      }
                    }}>
                      {quizIndex < quizQuestions.length - 1 ? 'Next →' : 'Done ✓'}
                    </button>
                  </>
                ) : (
                  <button className="reveal-btn" onClick={() => setShowAnswer(true)}>Show Answer</button>
                )}
                <button className="close-quiz" onClick={() => setQuizActive(false)}>×</button>
              </div>
            </div>
          )}

          {activeTab === 'study' && (
            <>
              <div className="stats">
                <div className="stat">
                  <div className="stat-icon">📖</div>
                  <div className="stat-val">3</div>
                  <div className="stat-label">Pages</div>
                </div>
                <div className="stat">
                  <div className="stat-icon">✓</div>
                  <div className="stat-val">7</div>
                  <div className="stat-label">Solved</div>
                </div>
                <div className="stat">
                  <div className="stat-icon">🃏</div>
                  <div className="stat-val">12</div>
                  <div className="stat-label">Cards</div>
                </div>
                <div className="stat">
                  <div className="stat-icon">📈</div>
                  <div className="stat-val">73%</div>
                  <div className="stat-label">Score</div>
                </div>
              </div>

              <div className="panel">
                <div className="section-title">Flashcards</div>
                <div className="card-grid">
                  <div className="card">What is a derivative?</div>
                  <div className="card">Power Rule formula</div>
                </div>
                <button className="action-btn">Review Cards →</button>
              </div>

              <div className="panel">
                <div className="section-title">Highlights</div>
                {["The derivative measures rate of change", ...highlights].map((h, i) => (
                  <div key={i} className="highlight">
                    <div className="highlight-dot" />
                    <div className="highlight-text">{h}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'library' && (
            <>
              <div className="lib-header">
                <div className="lib-title">Library</div>
                <button className="add-btn">+ Add</button>
              </div>
              
              {[
                { title: "Introduction to Calculus", author: "Stewart", prog: 35, color: "#3B82F6" },
                { title: "Organic Chemistry", author: "Klein", prog: 12, color: "#10B981" },
                { title: "Physics Principles", author: "Halliday", prog: 67, color: "#F59E0B" },
                { title: "Linear Algebra", author: "Strang", prog: 0, color: "#8B5CF6" },
              ].map((b, i) => (
                <div key={i} className="book" onClick={() => setActiveTab('reader')}>
                  <div className="book-cover" style={{background: b.color}}>{b.title[0]}</div>
                  <div className="book-info">
                    <div className="book-name">{b.title}</div>
                    <div className="book-author">{b.author}</div>
                    <div className="book-prog">
                      <div className="book-prog-fill" style={{width: `${b.prog}%`}} />
                    </div>
                    <div className="book-prog-text">{b.prog}%</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </>
  )
}
