import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
const Chess = require('chess.js');

export class Board {
  private cg: Api
  private chess: ChessInstance

  constructor(element: HTMLElement) {
    this.cg = Chessground(element, {})
    this.chess = new Chess()
    this.cg.set({ movable: { events: { after: this.onMove() } } })
    this.updateChessGround()
  }

  private onMove() {
    return (orig: Key, dest: Key) => {
      console.log(`I got the move from ${orig} to ${dest}`)

      this.chess.move({ from: (orig as Square), to: (dest as Square) })
      this.updateChessGround()

      console.log(this.chess.ascii())
    }
  }

  private updateChessGround() {
    this.cg.set({
      turnColor: this.toColor(),
      movable: {
        color: this.toColor(),
        dests: this.toDests(),
      },
      fen: this.chess.fen(),
    })
  }

  private toColor(): Color {
    return (this.chess.turn() == 'w') ? 'white' : 'black'
  }

  private toDests(): Map<Key, Key[]> {
    const dests = new Map();
    this.chess.SQUARES.forEach(s => {
      const ms = this.chess.moves({ square: s, verbose: true });
      if (ms.length) dests.set(s, ms.map(m => m.to));
    });
    return dests;
  }
}
