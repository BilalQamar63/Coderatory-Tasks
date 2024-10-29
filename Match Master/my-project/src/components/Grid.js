import React, { useState, useEffect } from 'react';
import '../styles/Grid.css';

const levels = [
  { targetScore: 50, maxMoves: 20, timeLimit: 60 },  
  { targetScore: 70, maxMoves: 40, timeLimit: 100 }, 
  { targetScore: 100, maxMoves: 50, timeLimit: 150 },
];


const symbolColorMap = {
  '★': '#fa3928',
  '♣': '#2832fa',
  '♦': '#239107',
  '♠': '#f0f71b',
  '♥': '#94218a',
  '☀': '#ffcc00',
  '☂': '#1e90ff',
  '♫': '#ff1493',
};


const symbols = Object.keys(symbolColorMap);
const rows = 8;
const cols = 8;


const Grid = () => {
  const [grid, setGrid] = useState(initializeGrid());
  const [selectedCells, setSelectedCells] = useState([]);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(levels[0].timeLimit);
  const [showPopup, setShowPopup] = useState(false);
  const [targetScore, setTargetScore] = useState(levels[0].targetScore);
  const [isPaused, setIsPaused] = useState(false)
  const [starCount, setStarCount] = useState(0);  
  const [boosterEnabled, setBoosterEnabled] = useState(false);  


  function initializeGrid() {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        return { color: symbolColorMap[symbol], symbol, isBomb: false, isRocket: null };
      })
    );
  }

  const createBomb = (i, j) => {
    const newGrid = [...grid];
    newGrid[i][j].isBomb = true; 
    newGrid[i][j].symbol = '💣'; 
    setGrid(newGrid);
  };


  const triggerBomb = (i, j) => {
    const newGrid = [...grid];
    let clearedCells = 0;

    for (let row = Math.max(0, i - 1); row <= Math.min(rows - 1, i + 1); row++) {
      for (let col = Math.max(0, j - 1); col <= Math.min(cols - 1, j + 1); col++) {
        if (newGrid[row][col].symbol !== null) {
          clearedCells++;
          newGrid[row][col] = { symbol: null, color: '#ffffff', isBomb: false, isRocket: null };
        }
      }
    }

    setScore((prevScore) => prevScore + clearedCells);
    setGrid(newGrid);
    setTimeout(() => shiftSymbolsDown(), 500);
  };


  const createRocket = (i, j, direction) => {
    const newGrid = [...grid];
    const rocketSymbol = direction === 'row' ? '🚀' : '🚀'; 
    newGrid[i][j] = { ...newGrid[i][j], isRocket: direction, symbol: rocketSymbol };
    setGrid(newGrid);
  };

  const triggerRocket = (i, j) => {
    const newGrid = [...grid];
    let clearedCells = 0;

    if (grid[i][j].isRocket === 'row') {
      for (let col = 0; col < cols; col++) {
        if (newGrid[i][col].symbol !== null) {
          newGrid[i][col] = { symbol: null, color: '#ffffff', isBomb: false, isRocket: null };
          clearedCells++;
        }
      }
    } else if (grid[i][j].isRocket === 'column') {
      for (let row = 0; row < rows; row++) {
        if (newGrid[row][j].symbol !== null) {
          newGrid[row][j] = { symbol: null, color: '#ffffff', isBomb: false, isRocket: null };
          clearedCells++;
        }
      }
    }

    setScore((prevScore) => prevScore + clearedCells);
    setGrid(newGrid);
    setTimeout(() => shiftSymbolsDown(), 500);
  };

  const swapCells = (first, second) => {
    const newGrid = [...grid];
    const temp = newGrid[first.i][first.j];
    newGrid[first.i][first.j] = newGrid[second.i][second.j];
    newGrid[second.i][second.j] = temp;
    setGrid(newGrid);
  };


  const checkMatches = () => {
    const newGrid = [...grid];
    let matchFound = false;


    const addToScoreAndReplace = (i, j, count, isRow) => {
      setScore((prevScore) => prevScore + count);
      for (let k = 0; k < count; k++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const cellSymbol = isRow ? newGrid[i][j - k].symbol : newGrid[i - k][j].symbol;

        if (cellSymbol === '★') {
          setStarCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount >= 6) {
              setBoosterEnabled(true); 
            }
            return newCount;
          });
        }
        if (isRow) {
          newGrid[i][j - k] = { symbol, color: symbolColorMap[symbol], isBomb: false, isRocket: null };
        } else {
          newGrid[i - k][j] = { symbol, color: symbolColorMap[symbol], isBomb: false, isRocket: null };
        }
      }
    };

    for (let i = 0; i < rows; i++) {
      let matchCount = 1;
      for (let j = 0; j < cols - 1; j++) {
        if (newGrid[i][j].symbol === newGrid[i][j + 1].symbol) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            addToScoreAndReplace(i, j, matchCount, true);
            matchFound = true;
            if (matchCount === 4) createBomb(i, j); 
            if (matchCount === 5) createRocket(i, j, 'row');
          }
          matchCount = 1;
        }
      }
      if (matchCount >= 3) {
        addToScoreAndReplace(i, cols - 1, matchCount, true);
        matchFound = true;
        if (matchCount === 4) createBomb(i, cols - 1); 
        if (matchCount === 5) createRocket(i, cols - 1, 'row');
      }
    }



    for (let j = 0; j < cols; j++) {
      let matchCount = 1;
      for (let i = 0; i < rows - 1; i++) {
        if (newGrid[i][j].symbol === newGrid[i + 1][j].symbol) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            addToScoreAndReplace(i, j, matchCount, false);
            matchFound = true;
            if (matchCount === 4) createBomb(i, j); 
            if (matchCount === 5) createRocket(i, j, 'column');
          }
          matchCount = 1;
        }
      }
      if (matchCount >= 3) {
        addToScoreAndReplace(rows - 1, j, matchCount, false);
        matchFound = true;
        if (matchCount === 4) createBomb(rows - 1, j); 
        if (matchCount === 5) createRocket(rows - 1, j, 'column');
      }
    }



    setGrid(newGrid);
    return matchFound;


  };


  const shiftSymbolsDown = () => {
    const newGrid = [...grid];
    for (let j = 0; j < cols; j++) {
      for (let i = rows - 1; i >= 0; i--) {
        if (newGrid[i][j].symbol === null) {
          for (let k = i - 1; k >= 0; k--) {
            if (newGrid[k][j].symbol !== null) {
              newGrid[i][j] = newGrid[k][j];
              newGrid[k][j] = { symbol: null, color: '#ffffff', isBomb: false, isRocket: null };
              break;
            }
          }
        }
      }
      for (let i = 0; i < rows; i++) {
        if (newGrid[i][j].symbol === null) {
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          newGrid[i][j] = { symbol, color: symbolColorMap[symbol], isBomb: false, isRocket: null };
        }
      }
    }
    setGrid(newGrid);
    checkMatches();
  };



  const handleCellClick = (i, j) => {
    if (grid[i][j].isBomb) {
      triggerBomb(i, j); 
      return;
    }

    if (grid[i][j].isRocket) {
      triggerRocket(i, j);
      return;
    }
    if (selectedCells.length > 0 && selectedCells[0].i === i && selectedCells[0].j === j) {
      setSelectedCells([]);
      return;
    }

    if (selectedCells.length === 0) {
      setSelectedCells([{ i, j }]);
    } else {
      const selectedCell = selectedCells[0]; 
      if (
        (Math.abs(selectedCell.i - i) === 1 && selectedCell.j === j) ||
        (Math.abs(selectedCell.j - j) === 1 && selectedCell.i === i)
      ) {
        swapCells(selectedCell, { i, j });
        setMoves((prevMoves) => prevMoves + 1);

        setTimeout(() => {
          setSelectedCells([]); 
        }, 500);

        setTimeout(() => {
          const matchFound = checkMatches();
          if (matchFound) {
            setTimeout(() => shiftSymbolsDown(), 500);
          }
        }, 500);
      }
    }

    checkLevelCompletion();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes > 0 ? `${minutes} min ` : ''}${remainingSeconds} s`;
  };

  const handlePopup = () => {
    setShowPopup(true);
    setIsPaused(true); 
  };
  const checkLevelCompletion = () => {
    const { targetScore, maxMoves } = levels[currentLevel];
    if (score >= targetScore || moves >= maxMoves) {
      setShowPopup(true);
    }
  };


  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prevLevel) => prevLevel + 1);
      setScore(0);
      setMoves(0);
      setGrid(initializeGrid());
      setTimeRemaining(levels[currentLevel + 1].timeLimit);
      setTargetScore(levels[currentLevel + 1].targetScore);
      setSelectedCells([]);
      setShowPopup(false);
      checkMatches()
     

    } else {
      setShowPopup(true);
    }
  };

  const handlePlayAgain = () => {
    if (currentLevel === levels.length - 1) {
      setCurrentLevel(0);
      setScore(0);
      setMoves(0);
      setGrid(initializeGrid());
      setTimeRemaining(levels[0].timeLimit);
      setTargetScore(levels[0].targetScore);
    } else {
      setScore(0);
      setMoves(0);
      setGrid(initializeGrid());
      setTimeRemaining(levels[currentLevel].timeLimit);
      setTargetScore(levels[currentLevel].targetScore);
    }
    setSelectedCells([]);
    setShowPopup(false);
  };

  useEffect(() => {
    const matchFound = checkMatches(); 
    if (matchFound) {
      shiftSymbolsDown(); 
    }
  }, []); 


  useEffect(() => {
    if (!isPaused && timeRemaining > 0 && currentLevel < levels.length) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handlePopup(); 
    }
  }, [timeRemaining, isPaused, currentLevel]);

  useEffect(() => {
   
    if (moves === levels.maxMoves) {
      handlePopup(); 
    }
  })


  useEffect(() => {
    if (showPopup) {
      setIsPaused(true); 
    } else {
      setIsPaused(false); 
    }
  }, [showPopup]);




  const triggerBooster = () => {
    const newGrid = [...grid];
    const cellsToRemove = [];

    while (cellsToRemove.length < 10) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);

      if (!cellsToRemove.some(cell => cell.i === randomRow && cell.j === randomCol)) {
        cellsToRemove.push({ i: randomRow, j: randomCol });
      }
    }

    let clearedCells = 0;

    cellsToRemove.forEach(({ i, j }) => {
      if (newGrid[i][j].symbol !== null) {
        clearedCells++;
        newGrid[i][j] = { symbol: null, color: '#ffffff', isBomb: false, isRocket: null };
      }
    });

    setScore((prevScore) => prevScore + clearedCells); 
    cellsToRemove.forEach(({ i, j }) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      newGrid[i][j] = { symbol, color: symbolColorMap[symbol], isBomb: false, isRocket: null };
    });

    setGrid(newGrid);
    setBoosterEnabled(false);  
    setStarCount(0);  
    setTimeout(() => shiftSymbolsDown(), 500);
  };



  return (
    <div className="game-container">

      <h1>Match Master Game</h1>
     
      <div className='main-container'>

        <div className="info">
          <p>Level: {currentLevel + 1}</p>
          <p>Target Score: {targetScore}</p>
          <p>Score: {score}</p>
          <p>Moves: {moves}/{levels[currentLevel].maxMoves}</p>
          <p>Remaining: {formatTime(timeRemaining)}</p>


      <button
          onClick={triggerBooster}
          disabled={!boosterEnabled}
          className={`booster-button ${boosterEnabled ? 'enabled' : 'disabled'}`}
        >
          Trigger Booster
        </button>
        </div>

        

        <div className={`grid`}>
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${selectedCells.some(cell => cell.i === i && cell.j === j) ? 'selected' : ''}`}
                style={{ backgroundColor: cell.color }}
                onClick={() => handleCellClick(i, j)}
              >
                {cell.symbol}
              </div>
            ))
          )}
        </div>
      </div>





      {showPopup && (
        <div className="popup">
          {score >= targetScore && currentLevel === levels.length - 1 ? (
            <p>Congratulations! You completed all levels! 🎉</p>
          ) : score >= targetScore ? (
            <p>Congratulations! You completed the level!</p>
          ) : (
            <p>Game Over! You reached the maximum moves or time.</p>
          )}

          {score >= targetScore && currentLevel < levels.length - 1 ? (
            <>
              <button onClick={handleNextLevel}>Next Level</button>
              <button onClick={handlePlayAgain}>Play Again</button>
            </>
          ) : (
            <button onClick={handlePlayAgain}>
              {currentLevel === levels.length - 1 ? "Play Again from Level 1" : "Play Again"}
            </button>
          )}
        </div>
      )}


    </div>
  );
};

export default Grid;
