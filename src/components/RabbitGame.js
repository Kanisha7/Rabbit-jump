import React, { useState, useEffect, useRef } from "react";
import "./RabbitGame.css";
import rabbitImg from "../assets/rabbit.png";
import obstacleImg from "../assets/obstacle.png";
import jumpSoundFile from "../assets/jump.mp3";
import gameOverSoundFile from "../assets/gameover.mp3";

const RabbitGame = () => {
  const [jumping, setJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const rabbitRef = useRef(null);
  const obstacleRef = useRef(null);
  const jumpSound = useRef(new Audio(jumpSoundFile));
  const gameOverSound = useRef(new Audio(gameOverSoundFile));

  // Jump action
  const handleJump = () => {
    if (!jumping && !gameOver) {
      setJumping(true);
      jumpSound.current.play();
      setTimeout(() => setJumping(false), 500);
    }
  };

  // Collision detection and score
  useEffect(() => {
    const interval = setInterval(() => {
      if (!rabbitRef.current || !obstacleRef.current) return;

      const obstacleLeft = obstacleRef.current.offsetLeft;
      const rabbitBottom = jumping ? 150 : 0;

      if (obstacleLeft < 100 && obstacleLeft > 50 && rabbitBottom < 50) {
        gameOverSound.current.play();
        setGameOver(true);
        clearInterval(interval);
      }

      if (obstacleLeft <= 0 && !gameOver) {
        setScore((prev) => prev + 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [jumping, gameOver]);

  // Spacebar jump
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") handleJump();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Reset game
  const resetGame = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>

      <div
        ref={rabbitRef}
        className={`rabbit ${jumping ? "jump" : ""}`}
        style={{ backgroundImage: `url(${rabbitImg})` }}
      ></div>

      {!gameOver && (
        <div
          ref={obstacleRef}
          className="obstacle"
          style={{
            backgroundImage: `url(${obstacleImg})`,
            animationDuration: `${Math.max(1.2, 2 - score * 0.05)}s`,
          }}
        ></div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default RabbitGame;
