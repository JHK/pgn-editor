import * as _ from 'lodash';
import './css/layout.scss';
import './css/chessground.css';
import './css/theme.css';
import './css/index.css';

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'

import { PGNEditor } from './pgn-editor';
import { LoadFromText } from './load-from-text';

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

const undoButton = document.getElementById('undo') as HTMLButtonElement
undoButton.onclick = function () { editor.undo() }

const pgnArea = document.getElementById('pgn') as HTMLTextAreaElement
editor.afterPgnUpdate(function (pgn: string) {
  pgnArea.value = pgn
  pgnArea.scrollTop = pgnArea.scrollHeight
})

const copyButton = document.getElementById('copy') as HTMLButtonElement
copyButton.onclick = function () {
  navigator.clipboard.writeText(pgnArea.value)
}

const textLoader = new LoadFromText(document.body)
textLoader.onSubmit(function (pgn: string) {
  return editor.loadPGN(pgn)
})
const openButton = document.getElementById('open') as HTMLButtonElement
openButton.addEventListener('click', function () {
  textLoader.open()
})

// TODO: maybe there is someone who actually understands CSS ¯\_(ツ)_/¯
const boardElement = document.getElementById('board')
while (boardElement.clientWidth != boardElement.parentElement.clientWidth) {
  boardElement.style.width = boardElement.parentElement.clientWidth + "px"
  boardElement.style.height = boardElement.clientWidth + "px"
}
