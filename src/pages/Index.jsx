import React, { useState } from "react";
import { Box, Button, Flex, Grid, Heading, Text, useColorModeValue } from "@chakra-ui/react";

const BOARD_SIZE = 8;
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const Index = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 2, 2: 2 });
  const [validMoves, setValidMoves] = useState(getValidMoves(board, 1));

  function initializeBoard() {
    const board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
    board[3][3] = 2;
    board[3][4] = 1;
    board[4][3] = 1;
    board[4][4] = 2;
    return board;
  }

  function isValidMove(board, row, col, player) {
    if (board[row][col] !== null) {
      return false;
    }
    return DIRECTIONS.some((dir) => {
      let r = row + dir[0];
      let c = col + dir[1];
      let flipped = false;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (board[r][c] === null) {
          break;
        }
        if (board[r][c] === player) {
          if (flipped) {
            return true;
          }
          break;
        }
        flipped = true;
        r += dir[0];
        c += dir[1];
      }
    });
  }

  function getValidMoves(board, player) {
    const validMoves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(board, row, col, player)) {
          validMoves.push([row, col]);
        }
      }
    }
    return validMoves;
  }

  function placePiece(row, col) {
    if (!isValidMove(board, row, col, currentPlayer)) {
      return;
    }
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;
    flipPieces(newBoard, row, col, currentPlayer);
    setBoard(newBoard);
    updateScores(newBoard);
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    const nextValidMoves = getValidMoves(newBoard, nextPlayer);
    setValidMoves(nextValidMoves);
    if (nextValidMoves.length > 0) {
      setCurrentPlayer(nextPlayer);
    } else {
      const finalValidMoves = getValidMoves(newBoard, currentPlayer);
      if (finalValidMoves.length === 0) {
        endGame(newBoard);
      }
    }
  }

  function flipPieces(board, row, col, player) {
    DIRECTIONS.forEach((dir) => {
      let r = row + dir[0];
      let c = col + dir[1];
      let flipped = false;
      const flippedPieces = [];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (board[r][c] === null) {
          break;
        }
        if (board[r][c] === player) {
          if (flipped) {
            flippedPieces.forEach(([fr, fc]) => {
              board[fr][fc] = player;
            });
          }
          break;
        }
        flippedPieces.push([r, c]);
        flipped = true;
        r += dir[0];
        c += dir[1];
      }
    });
  }

  function updateScores(board) {
    const scores = { 1: 0, 2: 0 };
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== null) {
          scores[cell]++;
        }
      });
    });
    setScores(scores);
  }

  function endGame(board) {
    const winner = scores[1] > scores[2] ? 1 : scores[1] < scores[2] ? 2 : 0;
    let message;
    if (winner === 0) {
      message = "It's a tie!";
    } else {
      message = `Player ${winner} wins!`;
    }
    alert(message);
  }

  function handlePass() {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
    setValidMoves(getValidMoves(board, nextPlayer));
  }

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Othello
      </Heading>
      <Flex mb={4} alignItems="center">
        <Text mr={4}>
          Player 1: {scores[1]} | Player 2: {scores[2]}
        </Text>
        <Text fontWeight="bold">Current Player: {currentPlayer}</Text>
        <Button ml={4} onClick={handlePass} disabled={validMoves.length > 0} colorScheme="blue">
          Pass
        </Button>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Heading as="h1" mb={4}>
          Othello
        </Heading>
        <Grid gridTemplateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gridTemplateRows={`repeat(${BOARD_SIZE}, 1fr)`} gap={1} bg="white" border="2px solid black" p={2} mb={4} width="400px">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Box key={`${rowIndex}-${colIndex}`} border="1px solid black" display="flex" justifyContent="center" alignItems="center" onClick={() => placePiece(rowIndex, colIndex)} cursor={isValidMove(board, rowIndex, colIndex, currentPlayer) ? "pointer" : "default"}>
                {cell === 1 && <Box w="80%" h="80%" borderRadius="50%" bg="black" />}
                {cell === 2 && <Box w="80%" h="80%" borderRadius="50%" bg="white" />}
              </Box>
            ))
          )}
        </Grid>
        <Flex mb={4} alignItems="center">
          <Text mr={4}>
            Player 1: {scores[1]} | Player 2: {scores[2]}
          </Text>
          <Text fontWeight="bold">Current Player: {currentPlayer}</Text>
          <Button ml={4} onClick={handlePass} disabled={validMoves.length > 0} colorScheme="blue">
            Pass
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Index;
