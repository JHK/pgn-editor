import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
const Chess = require('chess.js');

export class Board {
  constructor(element: HTMLElement) {
    const cg = Chessground(element, {})
    const engine = new Chess()
    cg.set({ movable: { events: { after: this.onMove(cg, engine) } } })
  }

  // see https://github.com/ornicar/chessground-examples/blob/54d28e177b2294e042169c8ddb5602a743361b5b/src/util.ts#L18
  private onMove(cg: Api, engine: ChessInstance) {
    return (orig: Key, dest: Key) => {
      console.log(`I got the move from ${orig} to ${dest}`)

      engine.move({ from: (orig as Square), to: (dest as Square) })
      cg.set({ fen: engine.fen() })

      console.log(engine.ascii())
    }
  }
}
