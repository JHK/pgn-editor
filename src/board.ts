import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
const Chess = require('chess.js');

export class Board {
  private cg: Api
  private engine: ChessEngine

  // http://www.chessclub.com/help/PGN-spec
  afterPgnUpdate: (pgn: string) => any

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
    this.afterPgnUpdate = () => { }
    this.updateUI()
  }

  undo(): void {
    this.engine.undo()
    this.updateUI()
  }

  updateUI(): void {
    this.updateChessGround()
    this.afterPgnUpdate(this.engine.pgn())
  }

  header(key: string, value: string): void {
    this.engine.header(key, value)
    this.afterPgnUpdate(this.engine.pgn())
  }

  private onMove() {
    return (orig: Key, dest: Key) => {
      console.log(`I got the move from ${orig} to ${dest}`)

      this.engine.move(orig, dest)
      this.updateUI()
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

  pgn(): string {
    return this.chess.pgn()
  }

  header(key: string, value: string): void {
    this.chess.header(key, value)
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
