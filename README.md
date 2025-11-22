# Dice Chess 🎲♟️

A unique chess variant where your moves are determined by the roll of the dice. Built with **Next.js**, **TypeScript**, and **Zustand**.

![Dice Chess Screenshot](public/pieces/w-knight.svg)
*(Note: Replace with an actual screenshot of the game board if available)*

## 🎮 How to Play

1.  **Roll the Dice**: At the start of your turn, roll 3 dice.
2.  **Unlock Pieces**: The faces of the dice determine which pieces you can move (e.g., if you roll a Knight, Rook, and Pawn, you can only move one of those pieces).
3.  **Make a Move**: Select a valid piece and move it according to standard chess rules.
4.  **Skip Turn**: If you have no legal moves based on your roll, you must skip your turn.
5.  **Win Condition**: Capture the opponent's **King** to win immediately! (No check/checkmate logic).

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/) & Custom SVGs

## 📂 Project Structure

Here's a quick overview of the key files in the project:

### Core Application
-   **`src/app/page.tsx`**: The main entry point for the game UI. Orchestrates the layout between the Board and the Sidebar.
-   **`src/app/layout.tsx`**: Root layout file. Handles global fonts (Geist), metadata (SEO), and global styles.
-   **`src/app/globals.css`**: Global CSS definitions, including Tailwind directives and custom theme colors.

### Components
-   **`src/components/Board.tsx`**: Renders the 8x8 chess board. Handles:
    -   Piece rendering (using SVG assets).
    -   Square highlighting (selected piece, legal moves, last move).
    -   User interaction (clicking squares to move).
-   **`src/components/Dice.tsx`**: Manages the dice rolling interface.
    -   Displays the current turn (White/Black).
    -   Shows animated dice rolls.
    -   Handles the "Skip Turn" logic when no moves are possible.

### Logic & State
-   **`src/lib/gameLogic.ts`**: The brain of the chess engine. Contains:
    -   `getLegalMoves`: Calculates valid moves for a piece.
    -   `isPathClear`: Checks for blocking pieces.
    -   `isKingInCheck` / `willMoveExposeKing`: Validates moves to prevent illegal states (though King capture ends the game, you still can't move into check).
-   **`src/store/useGameStore.ts`**: A global Zustand store that manages:
    -   `board`: The current state of the 8x8 grid.
    -   `turn`: Whose turn it is ('white' or 'black').
    -   `dice`: The current rolled values.
    -   `status`: Game phase ('rolling', 'moving', 'game-over').

### Assets
-   **`public/pieces/`**: High-quality SVG assets for all chess pieces (Cburnett style), ensuring crisp rendering at any screen size.

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/dice-chess.git
    cd dice-chess
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the game**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
