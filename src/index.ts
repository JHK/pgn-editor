import * as _ from 'lodash';
import './css/layout.scss';
import './css/chessground.css';
import './css/theme.css';
import './css/index.css';

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'

import { PGNEditor } from './pgn-editor';
import { HTMLTextElementEditor, HTMLDateElementEditor, HTMLTextWithPrefixElementEditor, HTMLResultElementEditor } from './html-element-editor';
import { LoadFromText } from './load-from-text';

const boardElement = document.getElementById('board')
const editor = new PGNEditor(boardElement);

const undoButton = document.getElementById('undo') as HTMLButtonElement
undoButton.onclick = function () { editor.undo() }

const pgnArea = document.getElementById('pgn') as HTMLTextAreaElement
editor.afterPgnUpdate(function (pgn: string) {
  pgnArea.value = pgn
  pgnArea.scrollTop = pgnArea.scrollHeight
})

const copyButton = document.getElementById('copy') as HTMLButtonElement
copyButton.onclick = function () {
  navigator.clipboard.writeText(pgnArea.value).then(function() {
    // TODO: visual feedback
  })
}

new HTMLTextElementEditor(document.getElementById('white') as HTMLSpanElement).
  afterEdit((value) => { editor.header("White", value) })
// TODO: rating

new HTMLTextElementEditor(document.getElementById('black') as HTMLSpanElement).
  afterEdit((value) => { editor.header("Black", value) })
// TODO: rating

new HTMLTextElementEditor(document.getElementById('event') as HTMLSpanElement).
  afterEdit((value) => { editor.header("Event", value) })

new HTMLTextElementEditor(document.getElementById('site') as HTMLSpanElement).
  afterEdit((value) => { editor.header("Site", value) })

new HTMLTextWithPrefixElementEditor("Round ", document.getElementById('round') as HTMLSpanElement).
  afterEdit((value) => { editor.header("Round", value) })

new HTMLDateElementEditor(document.getElementById('date') as HTMLSpanElement).
  afterEdit((value) => { editor.header("Date", value) })

new HTMLResultElementEditor(document.getElementById('result') as HTMLSpanElement).
  afterEdit((value) => { editor.header("Result", value) })

while (boardElement.clientWidth != boardElement.parentElement.clientWidth) {
  boardElement.style.width = boardElement.parentElement.clientWidth + "px"
  boardElement.style.height = boardElement.clientWidth + "px"
}

const textLoader = new LoadFromText(document.body)
textLoader.open(document.getElementById('open') as HTMLButtonElement)
