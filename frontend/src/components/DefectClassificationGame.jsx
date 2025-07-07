import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'animate.css';

const DefectClassificationGame = () => {
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [gameState, setGameState] = useState({
    currentIndex: 0,
    score: 0,
    timeLeft: 10,
    gameRunning: false
  });
  
  const scoreChartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const timerRef = useRef(null);
  
  // Animation styles
  const animationStyles = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes glow {
      0% { box-shadow: 0 0 5px #4CAF50; }
      50% { box-shadow: 0 0 20px #4CAF50; }
      100% { box-shadow: 0 0 5px #4CAF50; }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(10px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
    .glow-effect {
      animation: glow 2s infinite;
    }
    .pulse-effect {
      animation: pulse 2s infinite;
    }
    .float-effect {
      animation: float 3s ease-in-out infinite;
    }
    .fade-in-out {
      animation: fadeInOut 2s ease-in-out forwards;
    }
    .timer-bar {
      transition: width 1s linear;
    }
    .score-bar {
      transition: height 0.5s ease-out;
    }
    .overlay {
      transition: opacity 0.3s ease-in-out;
    }
    .overlay-content {
      transform: translateY(-20px);
      transition: transform 0.3s ease-in-out;
    }
    .overlay.show .overlay-content {
      transform: translateY(0);
    }
    .game-container {
      overflow: hidden;
    }
    .score-particles {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .particle {
      position: absolute;
      background: linear-gradient(45deg, #4CAF50, #2196F3);
      border-radius: 50%;
      animation: float 2s ease-in-out infinite;
    }
    .result-message {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      white-space: nowrap;
      font-weight: bold;
      z-index: 5;
      text-align: center;
      width: 120px;
      font-size: 1.2rem;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }
  `;
  
  // Function to save score
  const saveScore = (user, score) => {
    try {
      // Create a score object
      const scoreData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        score: score,
        date: new Date().toISOString()
      };
      
      // Store in localStorage
      const storedScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      storedScores.push(scoreData);
      localStorage.setItem('gameScores', JSON.stringify(storedScores));
      
      // Update state
      setUserScores(prev => [...prev, scoreData]);
      
      console.log('Score saved:', scoreData);
      return true;
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  };

  // Function to fetch user scores
  const fetchUserScores = async (userEmail) => {
    try {
      // Get scores from localStorage
      const storedScores = JSON.parse(localStorage.getItem('gameScores') || '[]');
      
      // Filter scores for the current user
      const userScores = storedScores.filter(score => score.userEmail === userEmail);
      
      setUserScores(userScores);
      console.log('Fetched scores:', userScores);
      return userScores;
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  };

  // Update score chart
  useEffect(() => {
    if (scoreChartRef.current && userScores.length > 0) {
      const ctx = scoreChartRef.current.getContext('2d');
      
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      // Prepare data for chart
      const labels = userScores.map((_, index) => `Attempt ${index + 1}`);
      const scores = userScores.map(score => score.score);
      
      // Create new chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Score',
            data: scores,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 200,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#fff'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#fff'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#fff'
              }
            }
          }
        }
      });
    }
  }, [userScores, showStats]);

  // Function to create particles
  const createParticles = () => {
    const container = document.querySelector('.score-particles');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.width = Math.random() * 8 + 4 + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(particle);
    }
  };

  // Function to show result message
  const showResultMessage = (message, isSuccess) => {
    const resultMessage = document.getElementById('resultMessage');
    if (!resultMessage) return;
    
    // Clear any existing timeout
    if (window.resultTimeout) {
      clearTimeout(window.resultTimeout);
    }
    
    // Reset the element to ensure animation plays again
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    
    // Force a reflow to ensure the animation resets
    void resultMessage.offsetWidth;
    
    // Set the message and animation class
    resultMessage.textContent = message;
    resultMessage.className = 'result-message fade-in-out';
    resultMessage.style.color = isSuccess ? '#4CAF50' : '#F44336';
    
    // Set new timeout to clear the message
    window.resultTimeout = setTimeout(() => {
      resultMessage.textContent = '';
    }, 3000);
  };

  // Function to show overlay
  const showOverlay = (content, duration = 2000) => {
    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlayContent');
    
    if (!overlay || !overlayContent) return;
    
    overlayContent.innerHTML = content;
    overlay.classList.add('show');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    
    setTimeout(() => {
      overlay.classList.remove('show');
      setTimeout(() => {
        overlay.classList.add('opacity-0', 'pointer-events-none');
      }, 300);
    }, duration);
  };

  // Function to parse CSV
  const parseCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const result = [];
    
    for(let i = 1; i < lines.length; i++) {
      if(!lines[i].trim()) continue;
      
      const obj = {};
      const currentline = lines[i].split(',');
      
      obj.image = 'train/' + currentline[0];
      obj.defect = currentline[3];
      
      if(!result.some(item => item.image === obj.image && item.defect === obj.defect)) {
        result.push(obj);
      }
    }
    
    return result;
  };

  // Load game data
  const loadGameData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/train/_annotations.csv');
      const csvData = await response.text();
      const annotations = parseCSV(csvData);
      
      const gameData = annotations
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(20, annotations.length));
      
      setGameData(gameData);
      setLoading(false);
      
      return gameData;
    } catch (error) {
      console.error('Error loading game data:', error);
      setLoading(false);
      throw error;
    }
  };

  // Handle registration form submission
  const handleRegistration = async (e) => {
    e.preventDefault();
    
    const name = e.target.userName.value;
    const email = e.target.userEmail.value;
    
    const user = {
      id: Date.now().toString(),
      name,
      email
    };
    
    setCurrentUser(user);
    setShowRegistration(false);
    
    try {
      await loadGameData();
      await fetchUserScores(email);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  };

  // Handle start/stop button click
  const handleStartStopGame = () => {
    setGameState(prev => {
      if (!prev.gameRunning) {
        // Start the game
        return { ...prev, gameRunning: true };
      } else {
        // Pause the game
        clearInterval(timerRef.current);
        return { ...prev, gameRunning: false };
      }
    });
  };

  // Function to start timer
  const startTimer = () => {
    clearInterval(timerRef.current);
    
    setGameState(prev => ({...prev, timeLeft: 10}));
    
    const timerEl = document.getElementById('timer');
    const timerBar = document.getElementById('timerBar');
    
    if (timerEl) timerEl.textContent = `Time: 10s`;
    if (timerBar) timerBar.style.width = '100%';
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        if (timerEl) timerEl.textContent = `Time: ${newTimeLeft}s`;
        if (timerBar) timerBar.style.width = `${(newTimeLeft/10) * 100}%`;
        
        if (newTimeLeft <= 0) {
          clearInterval(timerRef.current);
          showOverlay(`
            <div class="text-yellow-400 text-xl mb-4">⏰ Time's up!</div>
            <div class="text-gray-300">Moving to next image...</div>
          `, 1500);
          
          setTimeout(() => {
            setGameState(prev => ({
              ...prev, 
              currentIndex: prev.currentIndex + 1,
              timeLeft: 10
            }));
          }, 1500);
        }
        
        return {...prev, timeLeft: newTimeLeft};
      });
    }, 1000);
  };

  // Check answer
  const checkAnswer = (selected) => {
    if (!gameState.gameRunning) return;
    
    clearInterval(timerRef.current);
    const correct = gameData[gameState.currentIndex]?.defect;
    
    if (selected === correct) {
      // Update score
      setGameState(prev => ({...prev, score: prev.score + 10}));
      
      // Animate score
      const scoreBox = document.getElementById('scoreBox');
      if (scoreBox) {
        scoreBox.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => scoreBox.classList.remove('animate__animated', 'animate__pulse'), 1000);
      }
      
      // Update score bar
      const scoreBar = document.getElementById('scoreBar');
      if (scoreBar) {
        const percentage = ((gameState.score + 10) / 200) * 100;
        scoreBar.style.height = `${Math.min(percentage, 100)}%`;
      }
      
      // Create particles
      createParticles();
      
      // Show success message
      showResultMessage('✅ +10 points', true);
      
      showOverlay(`
        <div class="text-green-400 text-xl mb-4">✅ Correct!</div>
        <div class="text-gray-300">+10 points</div>
      `, 1500);
    } else {
      // Show failure message
      showResultMessage('❌ Wrong!', false);
      
      showOverlay(`
        <div class="text-red-400 text-xl mb-4">❌ Wrong!</div>
        <div class="text-gray-300">The correct answer was: ${correct}</div>
      `, 1500);
    }
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev, 
        currentIndex: prev.currentIndex + 1,
        timeLeft: 10
      }));
    }, 1500);
  };

  // Watch for changes in gameRunning state
  useEffect(() => {
    if (gameState.gameRunning && gameData.length > 0 && gameState.currentIndex < gameData.length) {
      startTimer();
    }
  }, [gameState.gameRunning, gameState.currentIndex, gameData.length]);

  // Handle game completion
  useEffect(() => {
    if (gameData.length > 0 && gameState.currentIndex >= gameData.length) {
      // Save score
      if (currentUser) {
        saveScore(currentUser, gameState.score);
      }
      
      // Reset game state
      setGameState(prev => ({
        ...prev,
        gameRunning: false,
      }));
      
      clearInterval(timerRef.current);
    }
  }, [gameState.currentIndex, gameData.length]);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        {/* Registration Overlay */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Welcome to Defect Classification Game</h2>
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="userName" 
                    name="userName" 
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
                  <input 
                    type="email" 
                    id="userEmail" 
                    name="userEmail" 
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect"
                >
                  Start Game
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Stats Overlay */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-400">Your Game Statistics</h2>
                <button 
                  onClick={() => setShowStats(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-300">Previous Attempts</h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <canvas ref={scoreChartRef} height="200"></canvas>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">Best Score</h3>
                  <p className="text-3xl font-bold text-green-400">
                    {userScores.length > 0 ? Math.max(...userScores.map(s => s.score), 0) : 0}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">Average Score</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {userScores.length > 0 
                      ? Math.round(userScores.reduce((a, b) => a + b.score, 0) / userScores.length) 
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Overlay Container */}
        <div id="overlay" className="fixed inset-0 bg-black bg-opacity-50 overlay opacity-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="overlay-content bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 transform">
            <div id="overlayContent" className="text-center">
              {/* Content will be dynamically inserted */}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
          <h2 className="text-3xl font-bold mb-4 text-center animate__animated animate__fadeIn">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              🧵 Spot the Defect!
            </span>
          </h2>

          {loading && (
            <div className="text-center text-xl text-gray-400 animate__animated animate__fadeIn">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              <p className="mt-2">Loading game data...</p>
            </div>
          )}

          {!loading && gameData.length > 0 && gameState.currentIndex < gameData.length && (
            <div className="flex-grow flex flex-col game-container">
              <div className="max-w-4xl mx-auto w-full flex-grow flex relative">
                {/* Main Game Area */}
                <div className="flex-grow flex flex-col pr-4 relative">
                  {/* Result Message */}
                  <div id="resultMessage" className="result-message"></div>
                  
                  {/* Timer and Controls Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div id="timer" className="text-xl font-bold text-green-400">Time: {gameState.timeLeft}s</div>
                      <div id="progress" className="text-gray-400 text-sm">
                        Image {gameState.currentIndex + 1} of {gameData.length}
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        id="timerBar" 
                        className="timer-bar bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                        style={{width: `${(gameState.timeLeft/10) * 100}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <button 
                        onClick={handleStartStopGame}
                        id="startStopBtn" 
                        className={`py-1 px-4 rounded-lg bg-gradient-to-r ${gameState.gameRunning ? 'from-yellow-500 to-red-500' : 'from-green-500 to-blue-500'} text-white font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect text-sm`}
                      >
                        {gameState.gameRunning ? 'Pause Game' : 'Start Game'}
                      </button>
                      <button 
                        onClick={() => setShowStats(true)}
                        className="py-1 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect text-sm"
                      >
                        View Stats
                      </button>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative mb-4 flex-grow flex items-center justify-center">
                    <img 
                      id="clothImage" 
                      src={gameData[gameState.currentIndex]?.image} 
                      alt="Garment image" 
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-lg"></div>
                  </div>

                  {/* Buttons Section */}
                  <div id="buttons" className="grid grid-cols-3 gap-2 mb-4">
                    {['Hole', 'Knot', 'Stain'].map(defect => (
                      <button 
                        key={defect}
                        onClick={() => checkAnswer(defect)}
                        className="py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect text-sm"
                      >
                        {defect}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score Panel */}
                <div className="w-24 flex flex-col items-center justify-center relative">
                  <div className="score-particles"></div>
                  <div className="text-center mb-2">
                    <div id="scoreBox" className="text-2xl font-bold text-green-400 glow-effect float-effect">
                      {gameState.score}
                    </div>
                    <div className="text-sm text-gray-400">Score</div>
                  </div>
                  <div className="w-4 bg-gray-700 rounded-full h-48 relative">
                    <div 
                      id="scoreBar" 
                      className="score-bar absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-blue-500 rounded-full" 
                      style={{height: `${Math.min((gameState.score / 200) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{Math.min(Math.round((gameState.score / 200) * 100), 100)}%</div>
                </div>
              </div>
            </div>
          )}

          {!loading && gameData.length > 0 && gameState.currentIndex >= gameData.length && (
            <div className="text-center animate__animated animate__fadeIn">
              <h3 className="text-3xl font-bold mb-4 text-green-400">Game Complete!</h3>
              <p className="text-xl mb-4">Final Score: {gameState.score}</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect"
                >
                  Play Again
                </button>
                <button 
                  onClick={() => setShowStats(true)}
                  className="py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-lg glow-effect"
                >
                  View Stats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DefectClassificationGame;