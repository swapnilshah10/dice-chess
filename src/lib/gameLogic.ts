import { Board, Piece, PieceType, Player, Position } from '../types';

export function isValidMove(
    board: Board,
    from: Position,
    to: Position,
    turn: Player,
    dice: PieceType[]
): boolean {
    const piece = board[from.row][from.col];
    if (!piece) return false;
    if (piece.player !== turn) return false;

    // Dice Constraint: Piece type must be in rolled dice
    if (!dice.includes(piece.type)) return false;

    // Destination check
    const target = board[to.row][to.col];
    if (target && target.player === turn) return false; // Cannot capture own piece

    // Pinning Check: Does this move expose the King?
    if (wouldExposeKing(board, from, to, turn)) return false;

    const dy = to.row - from.row;
    const dx = to.col - from.col;
    const absDy = Math.abs(dy);
    const absDx = Math.abs(dx);

    switch (piece.type) {
        case 'pawn': {
            const direction = piece.player === 'white' ? -1 : 1;
            const startRow = piece.player === 'white' ? 6 : 1;

            // Move forward 1
            if (dx === 0 && dy === direction && !target) return true;
            // Move forward 2
            if (
                dx === 0 &&
                dy === 2 * direction &&
                from.row === startRow &&
                !target &&
                !board[from.row + direction][from.col]
            )
                return true;
            // Capture
            if (absDx === 1 && dy === direction && target) return true;

            return false;
        }
        case 'rook':
            if (dy !== 0 && dx !== 0) return false;
            return isPathClear(board, from, to);
        case 'knight':
            return (absDy === 2 && absDx === 1) || (absDy === 1 && absDx === 2);
        case 'bishop':
            if (absDy !== absDx) return false;
            return isPathClear(board, from, to);
        case 'queen':
            if (dy !== 0 && dx !== 0 && absDy !== absDx) return false;
            return isPathClear(board, from, to);
        case 'king':
            return absDy <= 1 && absDx <= 1;
        default:
            return false;
    }
}

function isPathClear(board: Board, from: Position, to: Position): boolean {
    const dy = Math.sign(to.row - from.row);
    const dx = Math.sign(to.col - from.col);
    let r = from.row + dy;
    let c = from.col + dx;

    while (r !== to.row || c !== to.col) {
        if (board[r][c]) return false;
        r += dy;
        c += dx;
    }
    return true;
}

export function getLegalMoves(
    board: Board,
    from: Position,
    turn: Player,
    dice: PieceType[]
): Position[] {
    const moves: Position[] = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(board, from, { row: r, col: c }, turn, dice)) {
                moves.push({ row: r, col: c });
            }
        }
    }
    return moves;
}

export function isKingMissing(board: Board): Player | null {
    let whiteKing = false;
    let blackKing = false;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece?.type === 'king') {
                if (piece.player === 'white') whiteKing = true;
                if (piece.player === 'black') blackKing = true;
            }
        }
    }

    if (!whiteKing) return 'black';
    if (!blackKing) return 'white';
    return null;
}

// Helper to check if a move would expose the King to attacks (Pin/Check)
function wouldExposeKing(board: Board, from: Position, to: Position, turn: Player): boolean {
    // 1. Find the King (or where it moves to)
    let kingPos: Position | null = null;

    // If moving the King, check the destination
    const piece = board[from.row][from.col];
    if (piece && piece.type === 'king') {
        kingPos = to;
    } else {
        // Otherwise find current King pos
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.type === 'king' && p.player === turn) {
                    kingPos = { row: r, col: c };
                    break;
                }
            }
            if (kingPos) break;
        }
    }

    if (!kingPos) return false; // Should not happen

    // 2. Simulate the move
    const tempBoard = board.map(row => [...row]);
    tempBoard[to.row][to.col] = tempBoard[from.row][from.col];
    tempBoard[from.row][from.col] = null;

    // 3. Check for attackers

    // Sliding pieces (Rook, Bishop, Queen)
    const directions = [
        { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }, // Orthogonal
        { dr: -1, dc: -1 }, { dr: -1, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 } // Diagonal
    ];

    for (const { dr, dc } of directions) {
        let r = kingPos.row + dr;
        let c = kingPos.col + dc;

        // Immediate neighbor check (King vs King) - Kings cannot touch
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const p = tempBoard[r][c];
            if (p && p.player !== turn && p.type === 'king') return true;
        }

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const p = tempBoard[r][c];
            if (p) {
                if (p.player !== turn) {
                    const isOrthogonal = dr === 0 || dc === 0;
                    const isDiagonal = !isOrthogonal;

                    if (
                        (isOrthogonal && (p.type === 'rook' || p.type === 'queen')) ||
                        (isDiagonal && (p.type === 'bishop' || p.type === 'queen'))
                    ) {
                        return true;
                    }
                }
                break;
            }
            r += dr;
            c += dc;
        }
    }

    // Knight attacks
    const knightMoves = [
        { dr: -2, dc: -1 }, { dr: -2, dc: 1 }, { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
        { dr: 1, dc: -2 }, { dr: 1, dc: 2 }, { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
    ];
    for (const { dr, dc } of knightMoves) {
        const r = kingPos.row + dr;
        const c = kingPos.col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const p = tempBoard[r][c];
            if (p && p.player !== turn && p.type === 'knight') return true;
        }
    }

    // Pawn attacks
    // If I am White, I am attacked by Black pawns from "above" (row - 1)
    // If I am Black, I am attacked by White pawns from "below" (row + 1)
    const attackRow = kingPos.row + (turn === 'white' ? -1 : 1);
    if (attackRow >= 0 && attackRow < 8) {
        if (kingPos.col - 1 >= 0) {
            const p = tempBoard[attackRow][kingPos.col - 1];
            if (p && p.player !== turn && p.type === 'pawn') return true;
        }
        if (kingPos.col + 1 < 8) {
            const p = tempBoard[attackRow][kingPos.col + 1];
            if (p && p.player !== turn && p.type === 'pawn') return true;
        }
    }

    return false;
}

export function hasAnyLegalMoves(
    board: Board,
    turn: Player,
    dice: PieceType[]
): boolean {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === turn && dice.includes(piece.type)) {
                for (let tr = 0; tr < 8; tr++) {
                    for (let tc = 0; tc < 8; tc++) {
                        if (isValidMove(board, { row: r, col: c }, { row: tr, col: tc }, turn, dice)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}
