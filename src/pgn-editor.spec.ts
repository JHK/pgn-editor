import { expect } from 'chai';
import { PGNEditor } from './pgn-editor'

describe('PGN Editor', () => {
  it('should load PGNs', () => {
    const editor = new PGNEditor({
      board: document.getElementById('board'),
      white: document.getElementById('white'),
      black: document.getElementById('black'),
      event: document.getElementById('event'),
      site: document.getElementById('site'),
      round: document.getElementById('round'),
      date: document.getElementById('date'),
      result: document.getElementById('result'),
    })
    expect(editor.loadPGN("1. e4 d5 2. exd5 c6 3. dxc6 Bd7 4. cxb7 Bc8")).to.be.true
  })

  it('shouldn\'t load invalid PGNs', () => {
    const editor = new PGNEditor({
      board: document.getElementById('board'),
      white: document.getElementById('white'),
      black: document.getElementById('black'),
      event: document.getElementById('event'),
      site: document.getElementById('site'),
      round: document.getElementById('round'),
      date: document.getElementById('date'),
      result: document.getElementById('result'),
    })
    expect(editor.loadPGN("foo bar")).to.be.false
  })
})
