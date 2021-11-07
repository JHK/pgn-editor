import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
const Chess = require('chess.js');

export class Board {
  private cg: Api
  private engine: ChessEngine

  constructor(element: HTMLElement) {
    this.cg = Chessground(element, {
      movable: {
        free: false,
        events: { after: this.onMove() }
      },
      draggable: {
        showGhost: true,
      }
    })
    this.engine = new ChessEngine()
    this.updateChessGround()
  }

  undo(): void {
    this.engine.undo()
    this.updateChessGround()
  }

  private onMove() {
    return (orig: Key, dest: Key) => {
      console.log(`I got the move from ${orig} to ${dest}`)

      this.engine.move(orig, dest)
      this.updateChessGround()
      this.engine.log()
    }
  }

  private updateChessGround() {
    this.cg.set({
      turnColor: this.engine.color(),
      movable: {
        color: this.engine.color(),
        dests: this.engine.dests(),
      },
      fen: this.engine.fen(),
    })
  }
}

// wrapper of chess.js for compatibility with chessground
class ChessEngine {
  private chess: ChessInstance

  constructor() {
    this.chess = new Chess()
  }

  undo(): void {
    this.chess.undo()
  }

  move(from: Key, to: Key): void {
    this.chess.move({ from: (from as Square), to: (to as Square) })
  }

  fen(): string {
    return this.chess.fen()
  }

  log(): void {
    console.log(this.chess.ascii())
  }

  color(): Color {
    return (this.chess.turn() == 'w') ? 'white' : 'black'
  }

  dests(): Map<Key, Key[]> {
    const dests = new Map();
    this.chess.SQUARES.forEach(s => {
      const ms = this.chess.moves({ square: s, verbose: true });
      if (ms.length) dests.set(s, ms.map(m => m.to));
    });
    return dests;
  }
}
