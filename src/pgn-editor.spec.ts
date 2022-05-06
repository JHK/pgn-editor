import { expect } from 'chai';
import { PGNEditor } from './pgn-editor'

let editor: PGNEditor = null;

describe('PGN Editor', () => {
  beforeEach(() => {
    editor = new PGNEditor({
      board: document.getElementById('board'),
      white: document.getElementById('white'),
      black: document.getElementById('black'),
      event: document.getElementById('event'),
      site: document.getElementById('site'),
      round: document.getElementById('round'),
      date: document.getElementById('date'),
      result: document.getElementById('result'),
    })
  });

  context("PGNs", () => {
    it('should load when valid', () => {
      expect(editor.loadPGN("1. e4 d5 2. exd5 c6 3. dxc6 Bd7 4. cxb7 Bc8")).to.be.true
    })

    it('shouldn\'t load when invalid', () => {
      expect(editor.loadPGN("foo bar")).to.be.false
    })
  })

  context("Promotion", () => {
    it('May not promote in starting position', () => {
      let mayPromote = false
      editor.mayPromote((p) => { mayPromote = p})
      editor.loadPGN("")
      expect(mayPromote).to.be.false
    })

    it('May promote in after some moves', () => {
      let mayPromote = false
      editor.mayPromote((p) => { mayPromote = p})
      editor.loadPGN("1. e4 e5 2. f4 f6 3. fxe5 d6 4. exf6 Ne7 5. fxg7 c6")
      expect(mayPromote).to.be.true
    })
  })

  context("afterPgnUpdate", () => {
    it("Runs callback", () => {
      let pgn = ""
      editor.afterPgnUpdate((p) => { pgn = p })
      editor.loadPGN("1. e4 d5 2. exd5 c6 3. dxc6 Bd7 4. cxb7 Bc8")
      expect(pgn).to.equal("1. e4 d5 2. exd5 c6 3. dxc6 Bd7 4. cxb7 Bc8")
    })
  })

  context("undo", () => {
    it("Allows to undo moves", () => {
      let pgn = ""
      editor.afterPgnUpdate((p) => { pgn = p })
      editor.loadPGN("1. e4 d5 2. exd5 c6 3. dxc6 Bd7 4. cxb7 Bc8")
      editor.undo()
      expect(pgn).to.equal("1. e4 d5 2. exd5 c6 3. dxc6 Bd7 4. cxb7")
    })
  })
})
