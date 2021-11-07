import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
const Chess = require('chess.js');

export class Board {
  cg: Api
  chess: ChessInstance

  constructor(element: HTMLElement) {
    this.cg = Chessground(element, {})
    this.chess = new Chess()
    this.cg.set({ movable: { events: { after: this.onMove(this) } } })
  }

  // see https://github.com/ornicar/chessground-examples/blob/54d28e177b2294e042169c8ddb5602a743361b5b/src/util.ts#L18
  private onMove(self: Board) {
    return (orig: Key, dest: Key) => {
      console.log(`I got the move from ${orig} to ${dest}`)

      self.chess.move({ from: (orig as Square), to: (dest as Square) })
      self.cg.set({ fen: self.chess.fen() })

      console.log(self.chess.ascii())
    }
  }
}
