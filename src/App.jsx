import React, { useState, useEffect } from 'react';

// Sample textbook content for demo
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

This limit, when it exists, gives us the instantaneous rate of change of f at the point x. Geometrically, this represents the slope of the tangent line to the curve at that point.

For example, if f(x) = x², then f'(x) = 2x. This tells us that the slope of the parabola y = x² at any point x is twice the x-coordinate.`
    },
    {
      id: 2,
      heading: "3.2 Basic Differentiation Rules",
      content: `Several fundamental rules make computing derivatives straightforward:

Power Rule: If f(x) = xⁿ, then f'(x) = nxⁿ⁻¹

Constant Rule: If f(x) = c (constant), then f'(x) = 0

Sum Rule: (f + g)' = f' + g'

Product Rule: (fg)' = f'g + fg'

Quotient Rule: (f/g)' = (f'g - fg') / g²

These rules can be combined to differentiate complex expressions. For instance, to find the derivative of h(x) = 3x⁴ + 2x² - 5x + 7:

h'(x) = 12x³ + 4x - 5`
    },
    {
      id: 3,
      heading: "3.3 Practice Problems",
      content: `Apply the differentiation rules to solve the following:

Problem 1: Find f'(x) if f(x) = 5x³ - 2x² + 4x - 1

Problem 2: Differentiate g(x) = (x² + 1)(x - 3)

Problem 3: If y = (2x + 1) / (x - 1), find dy/dx

Problem 4: The position of a particle is given by s(t) = t³ - 6t² + 9t + 2. Find the velocity function v(t) and determine when the particle is at rest.`
    }
  ]
};

// AI Response simulator
const getAIResponse = (type, text) => {
  const responses = {
    explain: {
      "derivative": "Think of a derivative as the 'speedometer' of a function. Just like a speedometer tells you how fast you're going at any instant, a derivative tells you how fast your function is changing at any point. If f(x) = x², the derivative 2x means: at x=3, the function is changing at a rate of 6 units per unit of x.",
      "limit": "A limit describes what happens as we get infinitely close to something, without actually reaching it. Imagine walking halfway to a wall, then half of that, then half again... You never touch the wall, but you get arbitrarily close. That's the idea behind limits.",
      "power rule": "The Power Rule is beautifully simple: bring the exponent down as a coefficient, then reduce the exponent by 1. So x⁵ becomes 5x⁴. It's like the exponent 'jumps down' and leaves behind one less of itself.",
      "default": "This concept relates to how functions change. The key insight is understanding that calculus gives us tools to measure instantaneous change, not just average change over an interval. Would you like me to break this down further with a specific example?"
    },
    solve: {
      "5x³ - 2x² + 4x - 1": `Let's solve this step by step using the Power Rule:

**Given:** f(x) = 5x³ - 2x² + 4x - 1

**Step 1:** Apply the power rule to each term separately

• d/dx(5x³) = 5 · 3x² = 15x²
• d/dx(-2x²) = -2 · 2x = -4x  
• d/dx(4x) = 4 · 1 = 4
• d/dx(-1) = 0 (constant rule)

**Step 2:** Combine the results

f'(x) = 15x² - 4x + 4

**Answer:** f'(x) = 15x² - 4x + 4`,
      "default": `I'll solve this step by step:

**Step 1:** Identify the rule(s) needed
**Step 2:** Apply each rule carefully
**Step 3:** Simplify the result

Select the specific problem text for a detailed walkthrough.`
    },
    quiz: [
      { q: "What does the derivative represent geometrically?", a: "The slope of the tangent line at a point" },
      { q: "Using the power rule, what is the derivative of x⁷?", a: "7x⁶" },
      { q: "What is the derivative of a constant?", a: "Zero" },
      { q: "If f'(x) = 0 at a point, what does this indicate?", a: "A horizontal tangent (possible max/min)" }
    ]
  };

  if (type === 'explain') {
    const key = Object.keys(responses.explain).find(k => text.toLowerCase().includes(k));
    return responses.explain[key] || responses.explain.default;
  }
  if (type === 'solve') {
    const key = Object.keys(responses.solve).find(k => text.includes(k));
    return responses.solve[key] || responses.solve.default;
  }
  if (type === 'quiz') {
    return responses.quiz;
  }
  return "I'm here to help you understand. Select some text and I'll explain it.";
};

// Kapul (Cuscus) SVG Logo Component
const KapulLogo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Face */}
    <ellipse cx="50" cy="52" rx="38" ry="35" fill="#D4A574"/>
    <ellipse cx="50" cy="52" rx="38" ry="35" fill="url(#furGradient)"/>
    
    {/* Ears */}
    <ellipse cx="22" cy="28" rx="14" ry="16" fill="#D4A574"/>
    <ellipse cx="22" cy="28" rx="10" ry="12" fill="#FFB6C1"/>
    <ellipse cx="78" cy="28" rx="14" ry="16" fill="#D4A574"/>
    <ellipse cx="78" cy="28" rx="10" ry="12" fill="#FFB6C1"/>
    
    {/* Face markings - spotted pattern */}
    <circle cx="30" cy="40" r="6" fill="#C49A6C" opacity="0.5"/>
    <circle cx="70" cy="45" r="5" fill="#C49A6C" opacity="0.5"/>
    <circle cx="65" cy="35" r="4" fill="#C49A6C" opacity="0.4"/>
    
    {/* Eyes - large and round like a cuscus */}
    <circle cx="35" cy="50" r="12" fill="#1a1a2e"/>
    <circle cx="65" cy="50" r="12" fill="#1a1a2e"/>
    
    {/* Eye shine */}
    <circle cx="38" cy="47" r="4" fill="#fff"/>
    <circle cx="68" cy="47" r="4" fill="#fff"/>
    <circle cx="33" cy="53" r="2" fill="#fff" opacity="0.5"/>
    <circle cx="63" cy="53" r="2" fill="#fff" opacity="0.5"/>
    
    {/* Nose */}
    <ellipse cx="50" cy="62" rx="6" ry="5" fill="#8B4513"/>
    <ellipse cx="50" cy="61" rx="3" ry="2" fill="#A0522D"/>
    
    {/* Mouth */}
    <path d="M44 70 Q50 76 56 70" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round"/>
    
    {/* Whisker dots */}
    <circle cx="38" cy="65" r="1.5" fill="#8B4513"/>
    <circle cx="32" cy="62" r="1.5" fill="#8B4513"/>
    <circle cx="62" cy="65" r="1.5" fill="#8B4513"/>
    <circle cx="68" cy="62" r="1.5" fill="#8B4513"/>
    
    {/* Gradient definition */}
    <defs>
      <radialGradient id="furGradient" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E8C89E"/>
        <stop offset="100%" stopColor="#C49A6C"/>
      </radialGradient>
    </defs>
  </svg>
);

// Kapul Reader App Component
export default function KapulReaderApp() {
  const [activeTab, setActiveTab] = useState('reader');
  const [selectedText, setSelectedText] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const [aiMode, setAIMode] = useState('explain');
  const [isLoading, setIsLoading] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState({
    pagesRead: 3,
    problemsSolved: 7,
    flashcardsReviewed: 12,
    streakDays: 5,
    comprehension: 73
  });

  // Handle text selection in reader
  const handleTextSelect = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length > 3) {
      setSelectedText(text);
      setShowAIPanel(true);
      setAiResponse('');
    }
  };

  // AI action handlers
  const handleAIAction = async (mode) => {
    setAiMode(mode);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
    
    const response = getAIResponse(mode, selectedText);
    setAiResponse(response);
    setIsLoading(false);
  };

  // Add highlight
  const addHighlight = () => {
    if (selectedText && !highlights.includes(selectedText)) {
      setHighlights([...highlights, selectedText]);
    }
  };

  // Convert to flashcard
  const addFlashcard = () => {
    if (selectedText && aiResponse) {
      setFlashcards([...flashcards, { front: selectedText, back: aiResponse }]);
    }
  };

  // Start quiz
  const startQuiz = () => {
    const questions = getAIResponse('quiz', '');
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setShowQuizAnswer(false);
    setQuizActive(true);
  };

  return (
    <div style={styles.container}>
      {/* Background gradient */}
      <div style={styles.bgGradient} />
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}><KapulLogo /></div>
          <span style={styles.logoText}>Kapul Reader</span>
        </div>
        <nav style={styles.nav}>
          {['reader', 'study', 'library'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setQuizActive(false); }}
              style={{
                ...styles.navButton,
                ...(activeTab === tab ? styles.navButtonActive : {})
              }}
            >
              {tab === 'reader' && '📖'}
              {tab === 'study' && '🧠'}
              {tab === 'library' && '📚'}
              <span style={styles.navLabel}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </nav>
        <div style={styles.streak}>
          🔥 {studyStats.streakDays} day streak
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Reader Tab */}
        {activeTab === 'reader' && (
          <div style={styles.readerContainer}>
            {/* Document Panel */}
            <div 
              style={styles.documentPanel}
              onMouseUp={handleTextSelect}
            >
              <div style={styles.documentHeader}>
                <h1 style={styles.bookTitle}>{sampleContent.title}</h1>
                <p style={styles.chapterTitle}>{sampleContent.chapter}</p>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: '35%'}} />
                </div>
                <span style={styles.progressText}>Page 47 of 132 · 35% complete</span>
              </div>
              
              <div style={styles.documentContent}>
                {sampleContent.sections.map(section => (
                  <div key={section.id} style={styles.section}>
                    <h2 style={styles.sectionHeading}>{section.heading}</h2>
                    <div style={styles.sectionContent}>
                      {section.content.split('\n\n').map((para, i) => (
                        <p key={i} style={styles.paragraph}>{para}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Mode Overlay */}
              {quizActive && (
                <div style={styles.quizOverlay}>
                  <div style={styles.quizCard}>
                    <div style={styles.quizHeader}>
                      <span>Quiz: Chapter 3</span>
                      <span style={styles.quizProgress}>{currentQuizIndex + 1} / {quizQuestions.length}</span>
                    </div>
                    <div style={styles.quizQuestion}>
                      {quizQuestions[currentQuizIndex]?.q}
                    </div>
                    {showQuizAnswer ? (
                      <div style={styles.quizAnswer}>
                        <span style={styles.answerLabel}>Answer:</span>
                        {quizQuestions[currentQuizIndex]?.a}
                      </div>
                    ) : (
                      <button 
                        style={styles.revealButton}
                        onClick={() => setShowQuizAnswer(true)}
                      >
                        Reveal Answer
                      </button>
                    )}
                    {showQuizAnswer && (
                      <div style={styles.quizActions}>
                        <button 
                          style={styles.quizActionBtn}
                          onClick={() => {
                            if (currentQuizIndex < quizQuestions.length - 1) {
                              setCurrentQuizIndex(currentQuizIndex + 1);
                              setShowQuizAnswer(false);
                            } else {
                              setQuizActive(false);
                            }
                          }}
                        >
                          {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
                        </button>
                      </div>
                    )}
                    <button 
                      style={styles.closeQuiz}
                      onClick={() => setQuizActive(false)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Panel */}
            <div style={{
              ...styles.aiPanel,
              ...(showAIPanel ? styles.aiPanelOpen : {})
            }}>
              {showAIPanel ? (
                <>
                  <div style={styles.aiHeader}>
                    <span style={styles.aiTitle}>✦ Kapul AI</span>
                    <button 
                      style={styles.closeButton}
                      onClick={() => setShowAIPanel(false)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  {selectedText && (
                    <div style={styles.selectedTextBox}>
                      <span style={styles.selectedLabel}>Selected:</span>
                      <p style={styles.selectedContent}>"{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}"</p>
                    </div>
                  )}

                  <div style={styles.aiActions}>
                    <button 
                      style={{...styles.aiActionBtn, ...(aiMode === 'explain' ? styles.aiActionBtnActive : {})}}
                      onClick={() => handleAIAction('explain')}
                    >
                      💡 Explain
                    </button>
                    <button 
                      style={{...styles.aiActionBtn, ...(aiMode === 'solve' ? styles.aiActionBtnActive : {})}}
                      onClick={() => handleAIAction('solve')}
                    >
                      🧮 Solve
                    </button>
                    <button 
                      style={styles.aiActionBtn}
                      onClick={addHighlight}
                    >
                      🖍️ Highlight
                    </button>
                  </div>

                  <div style={styles.aiResponse}>
                    {isLoading ? (
                      <div style={styles.loadingDots}>
                        <span style={styles.dot}>●</span>
                        <span style={{...styles.dot, animationDelay: '0.2s'}}>●</span>
                        <span style={{...styles.dot, animationDelay: '0.4s'}}>●</span>
                      </div>
                    ) : aiResponse ? (
                      <>
                        <div style={styles.responseContent}>
                          {aiResponse.split('\n').map((line, i) => (
                            <p key={i} style={line.startsWith('**') ? styles.boldLine : styles.responseLine}>
                              {line.replace(/\*\*/g, '')}
                            </p>
                          ))}
                        </div>
                        <button 
                          style={styles.flashcardBtn}
                          onClick={addFlashcard}
                        >
                          + Add to Flashcards
                        </button>
                      </>
                    ) : (
                      <p style={styles.aiPlaceholder}>
                        Choose an action above to get AI assistance with your selection.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div style={styles.aiCollapsed}>
                  <p style={styles.aiHint}>
                    <span style={styles.hintIcon}>✦</span>
                    Select any text to get instant explanations
                  </p>
                  <button 
                    style={styles.quizButton}
                    onClick={startQuiz}
                  >
                    📝 Quiz me on this chapter
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Tab */}
        {activeTab === 'study' && (
          <div style={styles.studyContainer}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>📖</span>
                <span style={styles.statValue}>{studyStats.pagesRead}</span>
                <span style={styles.statLabel}>Pages Today</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>✓</span>
                <span style={styles.statValue}>{studyStats.problemsSolved}</span>
                <span style={styles.statLabel}>Problems Solved</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>🃏</span>
                <span style={styles.statValue}>{studyStats.flashcardsReviewed}</span>
                <span style={styles.statLabel}>Cards Reviewed</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statIcon}>📈</span>
                <span style={styles.statValue}>{studyStats.comprehension}%</span>
                <span style={styles.statLabel}>Comprehension</span>
              </div>
            </div>

            <div style={styles.studySection}>
              <h2 style={styles.studySectionTitle}>Your Flashcards ({flashcards.length + 3})</h2>
              <div style={styles.flashcardGrid}>
                {[
                  { front: "What is a derivative?", back: "The rate of change of a function" },
                  { front: "Power Rule formula", back: "d/dx(xⁿ) = nxⁿ⁻¹" },
                  { front: "Derivative of a constant", back: "Always equals zero" },
                  ...flashcards
                ].slice(0, 6).map((card, i) => (
                  <div key={i} style={styles.flashcard}>
                    <div style={styles.flashcardFront}>{card.front}</div>
                  </div>
                ))}
              </div>
              <button style={styles.reviewButton}>
                Start Review Session →
              </button>
            </div>

            <div style={styles.studySection}>
              <h2 style={styles.studySectionTitle}>Highlights ({highlights.length + 2})</h2>
              <div style={styles.highlightsList}>
                {[
                  "The derivative of a function measures the rate at which the function's value changes",
                  "f'(x) = lim[h→0] (f(x+h) - f(x)) / h",
                  ...highlights
                ].map((h, i) => (
                  <div key={i} style={styles.highlightItem}>
                    <span style={styles.highlightMark} />
                    <span style={styles.highlightText}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div style={styles.libraryContainer}>
            <div style={styles.libraryHeader}>
              <h2 style={styles.libraryTitle}>Your Library</h2>
              <button style={styles.addBookBtn}>+ Add Book</button>
            </div>
            
            <div style={styles.bookGrid}>
              {[
                { title: "Introduction to Calculus", author: "Stewart", progress: 35, color: "#3B82F6" },
                { title: "Organic Chemistry", author: "Klein", progress: 12, color: "#10B981" },
                { title: "Physics: Principles", author: "Halliday", progress: 67, color: "#F59E0B" },
                { title: "Linear Algebra", author: "Strang", progress: 0, color: "#8B5CF6" },
                { title: "Biology: Life", author: "Campbell", progress: 45, color: "#EC4899" },
                { title: "Statistics", author: "Freedman", progress: 23, color: "#06B6D4" },
              ].map((book, i) => (
                <div 
                  key={i} 
                  style={styles.bookCard}
                  onClick={() => setActiveTab('reader')}
                >
                  <div style={{...styles.bookCover, background: `linear-gradient(135deg, ${book.color}, ${book.color}dd)`}}>
                    <span style={styles.bookInitial}>{book.title.charAt(0)}</span>
                  </div>
                  <div style={styles.bookInfo}>
                    <h3 style={styles.bookName}>{book.title}</h3>
                    <p style={styles.bookAuthor}>{book.author}</p>
                    <div style={styles.bookProgress}>
                      <div style={{...styles.bookProgressFill, width: `${book.progress}%`}} />
                    </div>
                    <span style={styles.bookProgressText}>{book.progress}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Inline Styles Animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        ::selection {
          background: rgba(251, 191, 36, 0.4);
        }
      `}</style>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#e4e4e7',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgGradient: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    fontFamily: "'Fraunces', serif",
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #D4A574, #FBBF24)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  nav: {
    display: 'flex',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    padding: '6px',
    borderRadius: '12px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#a1a1aa',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  navButtonActive: {
    background: 'rgba(251, 191, 36, 0.15)',
    color: '#FBBF24',
  },
  navLabel: {
    fontSize: '14px',
  },
  streak: {
    padding: '8px 16px',
    background: 'rgba(251, 191, 36, 0.1)',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FBBF24',
  },
  main: {
    padding: '24px 32px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  readerContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    animation: 'fadeIn 0.4s ease',
  },
  documentPanel: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '32px 48px',
    position: 'relative',
    maxHeight: 'calc(100vh - 140px)',
    overflowY: 'auto',
  },
  documentHeader: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  bookTitle: {
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: "'Fraunces', serif",
    marginBottom: '4px',
    color: '#fff',
  },
  chapterTitle: {
    fontSize: '16px',
    color: '#71717a',
    marginBottom: '16px',
  },
  progressBar: {
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#52525b',
  },
  documentContent: {
    lineHeight: 1.8,
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: "'Fraunces', serif",
    marginBottom: '16px',
    color: '#FBBF24',
  },
  sectionContent: {},
  paragraph: {
    marginBottom: '16px',
    color: '#d4d4d8',
    fontSize: '16px',
  },
  aiPanel: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '100px',
    transition: 'all 0.3s ease',
  },
  aiPanelOpen: {
    background: 'rgba(251, 191, 36, 0.03)',
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  aiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  aiTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FBBF24',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#71717a',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  selectedTextBox: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    borderLeft: '3px solid #FBBF24',
  },
  selectedLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#71717a',
    display: 'block',
    marginBottom: '4px',
  },
  selectedContent: {
    fontSize: '14px',
    color: '#a1a1aa',
    fontStyle: 'italic',
    margin: 0,
  },
  aiActions: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  aiActionBtn: {
    flex: 1,
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#a1a1aa',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  aiActionBtnActive: {
    background: 'rgba(251, 191, 36, 0.15)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    color: '#FBBF24',
  },
  aiResponse: {
    minHeight: '150px',
  },
  loadingDots: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    padding: '40px 0',
  },
  dot: {
    fontSize: '12px',
    color: '#FBBF24',
    animation: 'pulse 1s ease infinite',
  },
  responseContent: {
    animation: 'fadeIn 0.3s ease',
  },
  responseLine: {
    fontSize: '14px',
    color: '#d4d4d8',
    marginBottom: '8px',
    lineHeight: 1.6,
  },
  boldLine: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '600',
    marginBottom: '8px',
    marginTop: '12px',
  },
  flashcardBtn: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: '1px dashed rgba(251, 191, 36, 0.3)',
    borderRadius: '8px',
    color: '#FBBF24',
    cursor: 'pointer',
    fontSize: '13px',
    marginTop: '16px',
    transition: 'all 0.2s',
  },
  aiPlaceholder: {
    color: '#52525b',
    fontSize: '14px',
    textAlign: 'center',
    padding: '40px 0',
  },
  aiCollapsed: {
    textAlign: 'center',
  },
  aiHint: {
    color: '#71717a',
    fontSize: '14px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  hintIcon: {
    color: '#FBBF24',
  },
  quizButton: {
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  quizOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(10, 10, 15, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    animation: 'fadeIn 0.3s ease',
  },
  quizCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#71717a',
  },
  quizProgress: {
    color: '#FBBF24',
    fontWeight: '600',
  },
  quizQuestion: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '24px',
    lineHeight: 1.5,
  },
  quizAnswer: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    animation: 'fadeIn 0.3s ease',
  },
  answerLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#10B981',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  revealButton: {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
  },
  quizActions: {
    display: 'flex',
    gap: '12px',
  },
  quizActionBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  closeQuiz: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#71717a',
    cursor: 'pointer',
    fontSize: '18px',
  },
  studyContainer: {
    animation: 'fadeIn 0.4s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  statIcon: {
    fontSize: '24px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: "'Fraunces', serif",
    color: '#fff',
  },
  statLabel: {
    fontSize: '13px',
    color: '#71717a',
  },
  studySection: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  studySectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#fff',
  },
  flashcardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  flashcard: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '10px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  flashcardFront: {
    fontSize: '14px',
    color: '#d4d4d8',
    lineHeight: 1.5,
  },
  reviewButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  highlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(251, 191, 36, 0.05)',
    borderRadius: '8px',
    borderLeft: '3px solid #FBBF24',
  },
  highlightMark: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#FBBF24',
    marginTop: '6px',
    flexShrink: 0,
  },
  highlightText: {
    fontSize: '14px',
    color: '#a1a1aa',
    lineHeight: 1.5,
  },
  libraryContainer: {
    animation: 'fadeIn 0.4s ease',
  },
  libraryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  libraryTitle: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: "'Fraunces', serif",
  },
  addBookBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  bookCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bookCover: {
    width: '60px',
    height: '80px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bookInitial: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    fontFamily: "'Fraunces', serif",
  },
  bookInfo: {
    flex: 1,
    minWidth: 0,
  },
  bookName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bookAuthor: {
    fontSize: '13px',
    color: '#71717a',
    marginBottom: '12px',
  },
  bookProgress: {
    height: '3px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  bookProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
    borderRadius: '2px',
  },
  bookProgressText: {
    fontSize: '11px',
    color: '#52525b',
  },
};
