import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
import { HTMLDateElementEditor, HTMLEditor, HTMLResultElementEditor, HTMLTextElementEditor, HTMLTextWithPrefixElementEditor } from './html-element-editor';
const Chess = require('chess.js');

export enum Color {
  White = "white",
  Black = "black"
}

export enum Piece {
  King = "k",
  Queen = "q",
  Rook = "r",
  Bishop = "b",
  Knight = "n",
  Pawn = "p"
}

export type PieceType = Piece.King | Piece.Queen | Piece.Rook | Piece.Bishop | Piece.Knight | Piece.Pawn

export type PromotionPiece = Exclude < PieceType, Piece.Pawn | Piece.King >

export interface EditorParams {
  board: HTMLElement
  white: HTMLElement
  black: HTMLElement
  event: HTMLElement
  site: HTMLElement
  round: HTMLElement
  date: HTMLElement
  result: HTMLElement
}

export class PGNEditor {
  private cg: Api
  private engine: ChessEngine
  private metadataSvc: MetadataService

  constructor(editorParams: EditorParams) {
    this.cg = Chessground(editorParams.board, {
      movable: {
        free: false,
        events: { after: this.onMove() }
      },
      draggable: {
        showGhost: true,
      }
    })
    this.engine = new ChessEngine()
    this.metadataSvc = new MetadataService(editorParams)
    this.metadataSvc.setEngineCallbacks(this.engine)
    this.updateChessGround()
  }

  // http://www.chessclub.com/help/PGN-spec
  afterPgnUpdate(fn: (pgn: string) => any) {
    this.engine.afterPgnUpdateFn = fn
    fn(this.engine.pgn())
  }

  mayPromote(fn: (mayPromote: boolean) => void) {
    this.engine.mayPromoteFn = fn
    fn(this.engine.mayPromote())
  }

  setPromotionPiece(piece: PromotionPiece) {
    this.engine.setPromotionPiece(piece)
  }

  loadPGN(pgn: string): boolean {
    if (!this.engine.loadPGN(pgn)) {
      return false
    }

    this.metadataSvc.load(this.engine)
    this.updateChessGround()
    return true
  }

  undo(): void {
    this.engine.undo()
    this.updateChessGround()
  }

  private onMove() {
    return (orig: Key, dest: Key) => {
      this.engine.move(orig, dest)
      this.updateChessGround()
      this.maybeUpdateResult()
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

  private maybeUpdateResult() {
    if (this.engine.inCheckmate()) {
      if (this.engine.color() == Color.Black) {
        // next move would be black, i.e. white won the game
        this.engine.header("Result", "1-0")
        this.metadataSvc.result.setValue("1-0")
      } else {
        this.engine.header("Result", "0-1")
        this.metadataSvc.result.setValue("0-1")
      }
    }
    else if (this.engine.inDraw()) {
      this.engine.header("Result", "1/2-1/2")
      this.metadataSvc.result.setValue("1/2-1/2")
    }
  }
}

class MetadataService {
  white: HTMLEditor // TODO: rating
  black: HTMLEditor // TODO: rating
  event: HTMLEditor
  site: HTMLEditor
  round: HTMLEditor
  date: HTMLEditor
  result: HTMLEditor

  constructor(editorParams: EditorParams) {
    this.white = new HTMLTextElementEditor(editorParams.white)
    this.black = new HTMLTextElementEditor(editorParams.black)
    this.event = new HTMLTextElementEditor(editorParams.event)
    this.site = new HTMLTextElementEditor(editorParams.site)
    this.round = new HTMLTextWithPrefixElementEditor("Round ", editorParams.round)
    this.date = new HTMLDateElementEditor(editorParams.date)
    this.result = new HTMLResultElementEditor(editorParams.result)
  }

  setEngineCallbacks(engine: ChessEngine) {
    this.white.afterEdit((value) => { engine.header("White", value) })
    this.black.afterEdit((value) => { engine.header("Black", value) })
    this.event.afterEdit((value) => { engine.header("Event", value) })
    this.site.afterEdit((value) => { engine.header("Site", value) })
    this.round.afterEdit((value) => { engine.header("Round", value) })
    this.date.afterEdit((value) => { engine.header("Date", value) })
    this.result.afterEdit((value) => { engine.header("Result", value) })
  }

  load(engine: ChessEngine) {
    this.white.setValue(engine.getHeader("White"))
    this.black.setValue(engine.getHeader("Black"))
    this.event.setValue(engine.getHeader("Event"))
    this.site.setValue(engine.getHeader("Site"))
    this.round.setValue(engine.getHeader("Round"))
    this.date.setValue(engine.getHeader("Date"))
    this.result.setValue(engine.getHeader("Result"))
  }
}

// wrapper of chess.js for compatibility with chessground
class ChessEngine {
  private chess: ChessInstance
  private promotionType: PromotionPiece

  afterPgnUpdateFn: (pgn: string) => any = () => { }
  mayPromoteFn: (mayPromote: boolean) => void = () => { }

  constructor() {
    this.chess = new Chess()
  }

  undo(): void {
    this.chess.undo()
    this.afterPgnUpdateFn(this.pgn())
    this.mayPromoteFn(this.mayPromote())
  }

  move(from: Key, to: Key): void {
    this.chess.move({ from: (from as Square), to: (to as Square), promotion: this.promotionType })
    this.afterPgnUpdateFn(this.pgn())
    this.mayPromoteFn(this.mayPromote())
  }

  fen(): string {
    return this.chess.fen()
  }

  pgn(): string {
    return this.chess.pgn()
  }

  loadPGN(pgn: string): boolean {
    if (!this.chess.load_pgn(pgn)) {
      return false
    }

    this.afterPgnUpdateFn(this.pgn())
    this.mayPromoteFn(this.mayPromote())
    return true
  }

  setPromotionPiece(piece: PromotionPiece) {
    this.promotionType = piece
  }

  inCheckmate(): boolean {
    return this.chess.in_checkmate()
  }

  inDraw(): boolean {
    return this.chess.in_draw() || this.chess.in_stalemate() || this.chess.insufficient_material()
  }

  // returns true if the next turn allows a promotion
  mayPromote(): boolean {
    const row = (this.chess.turn() == 'w') ? '7' : '2'
    for (var letter of 'abcdefgh'.split('')) {
      const square = letter + row as Square
      const piece  = this.chess.get(square)
      if (piece && piece.type == 'p' && piece.color == this.chess.turn()) {
        if (this.chess.moves({ square: square }).length)
          return true
      }
    }
    return false
  }

  promoteTo(pieceType: PromotionPiece) {
    this.promotionType = pieceType
  }

  header(key: string, value: string): void {
    if (this.getHeader(key) == undefined && !value) {return}

    this.chess.header(key, value)
    this.afterPgnUpdateFn(this.pgn())
  }

  getHeader(key: string): string {
    const headers = this.chess.header()
    return headers[key]
  }

  log(): void {
    console.log(this.chess.ascii())
  }

  color(): Color {
    return (this.chess.turn() == 'w') ? Color.White : Color.Black
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
