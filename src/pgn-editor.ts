import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
import { ChessInstance, Square } from 'chess.js';
import { HTMLDateElementEditor, HTMLEditor, HTMLResultElementEditor, HTMLTextElementEditor, HTMLTextWithPrefixElementEditor } from './html-element-editor';
const Chess = require('chess.js');

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
    this.updateMetadata(engine, "White", this.white)
    this.updateMetadata(engine, "Black", this.black)
    this.updateMetadata(engine, "Event", this.event)
    this.updateMetadata(engine, "Site", this.site)
    this.updateMetadata(engine, "Round", this.round)
    this.updateMetadata(engine, "Date", this.date)
    this.updateMetadata(engine, "Result", this.result)
  }

  private updateMetadata(engine: ChessEngine, PGNKey: string, editor: HTMLEditor) {
    const value = engine.getHeader(PGNKey)
    editor.setValue(value)
  }
}

// wrapper of chess.js for compatibility with chessground
class ChessEngine {
  private chess: ChessInstance

  afterPgnUpdateFn: (pgn: string) => any = () => { }

  constructor() {
    this.chess = new Chess()
  }

  undo(): void {
    this.chess.undo()
    this.afterPgnUpdateFn(this.pgn())
  }

  move(from: Key, to: Key): void {
    this.chess.move({ from: (from as Square), to: (to as Square) })
    this.afterPgnUpdateFn(this.pgn())
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
    return true
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
