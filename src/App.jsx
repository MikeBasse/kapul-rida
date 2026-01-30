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
    await new Promise(r => setTimeout(r, 500))
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        
        :root {
          --bg: #ffffff;
          --bg-secondary: #f9fafb;
          --bg-tertiary: #f3f4f6;
          --border: #e5e7eb;
          --text: #1f2937;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --accent: #d97706;
          --accent-bg: #fffbeb;
          --accent-border: #fde68a;
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #1a1a1a;
            --bg-secondary: #222222;
            --bg-tertiary: #2a2a2a;
            --border: #333333;
            --text: #f3f4f6;
            --text-secondary: #9ca3af;
            --text-tertiary: #6b7280;
            --accent: #f59e0b;
            --accent-bg: #292524;
            --accent-border: #78350f;
          }
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
        }
        
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        /* Header - Claude style */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
        }
        
        .logo-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #d97706, #b45309);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        }
        
        .nav {
          display: flex;
          gap: 4px;
        }
        
        .nav-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .nav-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text);
        }
        
        .nav-btn.active {
          background: var(--bg-tertiary);
          color: var(--text);
        }
        
        /* Main content */
        .main {
          flex: 1;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 16px;
        }
        
        /* Reader */
        .doc-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        
        .doc-title {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }
        
        .doc-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        
        .progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .progress-bar {
          flex: 1;
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          width: 35%;
          background: var(--accent);
          border-radius: 2px;
        }
        
        .progress-text {
          font-size: 12px;
          color: var(--text-tertiary);
          white-space: nowrap;
        }
        
        .section {
          margin-bottom: 32px;
        }
        
        .section-heading {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 16px;
        }
        
        .paragraph {
          font-size: 16px;
          color: var(--text);
          margin-bottom: 16px;
          line-height: 1.75;
        }
        
        /* AI Panel */
        .ai-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 16px;
          transform: translateY(100%);
          transition: transform 0.25s ease;
          max-height: 60vh;
          overflow-y: auto;
          z-index: 200;
        }
        
        .ai-panel.open {
          transform: translateY(0);
        }
        
        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .ai-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 4px;
        }
        
        .selected-box {
          background: var(--accent-bg);
          border: 1px solid var(--accent-border);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        
        .selected-label {
          font-size: 11px;
          font-weight: 500;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .selected-text {
          font-size: 14px;
          color: var(--text);
        }
        
        .ai-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .ai-btn {
          flex: 1;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .ai-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--text-tertiary);
        }
        
        .ai-response {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text);
        }
        
        .loading {
          color: var(--text-tertiary);
          font-size: 14px;
        }
        
        /* Floating hint */
        .hint-bar {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 10px 16px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 150;
        }
        
        .hint-text {
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .quiz-btn {
          padding: 8px 16px;
          background: var(--accent);
          border: none;
          border-radius: 20px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        
        /* Quiz overlay */
        .quiz-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 300;
        }
        
        .quiz-card {
          background: var(--bg);
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
          position: relative;
        }
        
        .quiz-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        
        .quiz-progress {
          color: var(--accent);
          font-weight: 600;
        }
        
        .quiz-question {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 20px;
          color: var(--text);
          margin-bottom: 24px;
          line-height: 1.5;
        }
        
        .quiz-answer {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          color: #065f46;
        }
        
        @media (prefers-color-scheme: dark) {
          .quiz-answer {
            background: #064e3b;
            border-color: #065f46;
            color: #d1fae5;
          }
        }
        
        .answer-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          opacity: 0.7;
        }
        
        .primary-btn {
          width: 100%;
          padding: 12px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .secondary-btn {
          width: 100%;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .close-quiz {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-tertiary);
          cursor: pointer;
        }
        
        /* Study tab */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
        }
        
        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 16px;
        }
        
        .card-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .card-item {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 14px;
          color: var(--text);
        }
        
        .highlight-item {
          background: var(--accent-bg);
          border-left: 3px solid var(--accent);
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: 0 8px 8px 0;
          font-size: 14px;
          color: var(--text);
        }
        
        /* Library tab */
        .lib-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .lib-title {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 24px;
          font-weight: 600;
        }
        
        .add-btn {
          padding: 8px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text);
          cursor: pointer;
        }
        
        .book-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .book-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .book-item:hover {
          border-color: var(--text-tertiary);
        }
        
        .book-cover {
          width: 48px;
          height: 64px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }
        
        .book-info {
          flex: 1;
          min-width: 0;
        }
        
        .book-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 2px;
        }
        
        .book-author {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .book-progress {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .book-progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .header {
            padding: 16px 24px;
          }
          
          .nav-btn {
            padding: 8px 20px;
          }
          
          .main {
            padding: 40px 24px;
          }
          
          .doc-title {
            font-size: 36px;
          }
          
          .ai-panel {
            position: fixed;
            bottom: auto;
            top: 80px;
            left: auto;
            right: 24px;
            width: 380px;
            max-height: calc(100vh - 120px);
            border: 1px solid var(--border);
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.1);
            transform: translateX(calc(100% + 24px));
          }
          
          .ai-panel.open {
            transform: translateX(0);
          }
          
          .hint-bar {
            bottom: 24px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
      
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">K</div>
            <span>Kapul Reader</span>
          </div>
          <nav className="nav">
            <button 
              className={`nav-btn ${activeTab === 'reader' ? 'active' : ''}`}
              onClick={() => setActiveTab('reader')}
            >
              Read
            </button>
            <button 
              className={`nav-btn ${activeTab === 'study' ? 'active' : ''}`}
              onClick={() => setActiveTab('study')}
            >
              Study
            </button>
            <button 
              className={`nav-btn ${activeTab === 'library' ? 'active' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              Library
            </button>
          </nav>
        </header>

        <main className="main">
          {activeTab === 'reader' && (
            <div onMouseUp={handleSelect} onTouchEnd={handleSelect}>
              <div className="doc-header">
                <h1 className="doc-title">{sampleContent.title}</h1>
                <p className="doc-subtitle">{sampleContent.chapter}</p>
                <div className="progress-row">
                  <div className="progress-bar">
                    <div className="progress-fill" />
                  </div>
                  <span className="progress-text">35%</span>
                </div>
              </div>
              
              {sampleContent.sections.map(section => (
                <div key={section.id} className="section">
                  <h2 className="section-heading">{section.heading}</h2>
                  {section.content.split('\n\n').map((para, i) => (
                    <p key={i} className="paragraph">{para}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'study' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Pages read</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">7</div>
                  <div className="stat-label">Problems</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Flashcards</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">73%</div>
                  <div className="stat-label">Score</div>
                </div>
              </div>

              <div className="section-title">Flashcards</div>
              <div className="card-list">
                <div className="card-item">What is a derivative?</div>
                <div className="card-item">Power Rule formula</div>
                <div className="card-item">Derivative of a constant</div>
              </div>

              <div className="section-title">Highlights</div>
              {["The derivative measures rate of change", "f'(x) = lim[h→0] (f(x+h) - f(x)) / h", ...highlights].map((h, i) => (
                <div key={i} className="highlight-item">{h}</div>
              ))}
            </>
          )}

          {activeTab === 'library' && (
            <>
              <div className="lib-header">
                <h1 className="lib-title">Library</h1>
                <button className="add-btn">+ Add book</button>
              </div>
              
              <div className="book-list">
                {[
                  { title: "Introduction to Calculus", author: "Stewart", progress: 35, color: "#3b82f6" },
                  { title: "Organic Chemistry", author: "Klein", progress: 12, color: "#10b981" },
                  { title: "Physics Principles", author: "Halliday", progress: 67, color: "#f59e0b" },
                  { title: "Linear Algebra", author: "Strang", progress: 0, color: "#8b5cf6" },
                ].map((book, i) => (
                  <div key={i} className="book-item" onClick={() => setActiveTab('reader')}>
                    <div className="book-cover" style={{background: book.color}}>
                      {book.title[0]}
                    </div>
                    <div className="book-info">
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">{book.author}</div>
                      <div className="book-progress">
                        <div className="book-progress-fill" style={{width: `${book.progress}%`}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Floating hint bar */}
        {activeTab === 'reader' && !showAI && (
          <div className="hint-bar">
            <span className="hint-text">Select text to explain</span>
            <button className="quiz-btn" onClick={startQuiz}>Quiz me</button>
          </div>
        )}

        {/* AI Panel */}
        <div className={`ai-panel ${showAI ? 'open' : ''}`}>
          <div className="ai-header">
            <span className="ai-title">Kapul AI</span>
            <button className="close-btn" onClick={() => setShowAI(false)}>×</button>
          </div>
          
          {selectedText && (
            <div className="selected-box">
              <div className="selected-label">Selected text</div>
              <div className="selected-text">{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}</div>
            </div>
          )}
          
          <div className="ai-actions">
            <button className="ai-btn" onClick={() => handleAI('explain')}>Explain</button>
            <button className="ai-btn" onClick={() => handleAI('solve')}>Solve</button>
            <button className="ai-btn" onClick={() => setHighlights([...highlights, selectedText])}>Save</button>
          </div>
          
          {isLoading ? (
            <div className="loading">Thinking...</div>
          ) : aiResponse && (
            <div className="ai-response">{aiResponse}</div>
          )}
        </div>

        {/* Quiz Modal */}
        {quizActive && (
          <div className="quiz-overlay" onClick={() => setQuizActive(false)}>
            <div className="quiz-card" onClick={e => e.stopPropagation()}>
              <div className="quiz-header">
                <span>Quiz</span>
                <span className="quiz-progress">{quizIndex + 1} of {quizQuestions.length}</span>
              </div>
              <div className="quiz-question">{quizQuestions[quizIndex]?.q}</div>
              
              {showAnswer ? (
                <>
                  <div className="quiz-answer">
                    <div className="answer-label">Answer</div>
                    {quizQuestions[quizIndex]?.a}
                  </div>
                  <button className="primary-btn" onClick={() => {
                    if (quizIndex < quizQuestions.length - 1) {
                      setQuizIndex(quizIndex + 1)
                      setShowAnswer(false)
                    } else {
                      setQuizActive(false)
                    }
                  }}>
                    {quizIndex < quizQuestions.length - 1 ? 'Next question' : 'Done'}
                  </button>
                </>
              ) : (
                <button className="secondary-btn" onClick={() => setShowAnswer(true)}>
                  Show answer
                </button>
              )}
              
              <button className="close-quiz" onClick={() => setQuizActive(false)}>×</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
