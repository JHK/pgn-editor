import * as _ from 'lodash';
import './css/layout.scss';
import './css/chessground.css';
import './css/theme.css';
import './css/index.css';
import { Board } from './board';
import { HTMLTextElementEditor, HTMLDateElementEditor, HTMLTextWithPrefixElementEditor } from './html-element-editor';

const boardElement = document.getElementById('board')
const board = new Board(boardElement);

const undoButton = document.getElementById('undo') as HTMLButtonElement
undoButton.onclick = function () { board.undo() }

const pgnArea = document.getElementById('pgn') as HTMLTextAreaElement
board.afterPgnUpdate = function (pgn: string) {
  pgnArea.value = pgn
  pgnArea.scrollTop = pgnArea.scrollHeight
}

const copyButton = document.getElementById('copy') as HTMLButtonElement
copyButton.onclick = function () {
  navigator.clipboard.writeText(pgnArea.value).then(function() {
    // TODO: visual feedback
  })
}

new HTMLTextElementEditor(document.getElementById('white') as HTMLSpanElement).
  afterEdit((value) => { board.header("White", value) })
// TODO: rating

new HTMLTextElementEditor(document.getElementById('black') as HTMLSpanElement).
  afterEdit((value) => { board.header("Black", value) })
// TODO: rating

new HTMLTextElementEditor(document.getElementById('event') as HTMLSpanElement).
  afterEdit((value) => { board.header("Event", value) })

new HTMLTextElementEditor(document.getElementById('site') as HTMLSpanElement).
  afterEdit((value) => { board.header("Site", value) })

new HTMLTextWithPrefixElementEditor("Round ", document.getElementById('round') as HTMLSpanElement).
  afterEdit((value) => { board.header("Round", value) })

new HTMLDateElementEditor(document.getElementById('date') as HTMLSpanElement).
  afterEdit((value) => { board.header("Date", value) })

// TODO: result
