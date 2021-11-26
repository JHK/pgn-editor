import * as _ from 'lodash';
import './css/layout.scss';
import './css/chessground.css';
import './css/theme.css';
import './css/index.css';
import './css/tooltip.css';
import './css/alert.css';

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'

import { PGNEditor, PromotionPiece } from './pgn-editor'
import { LoadDialog, SaveDialog } from './overlay'
import { PromotionButton } from './promotion'

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

const saveDialog = new SaveDialog(document.body)
const pgnArea = document.getElementById('pgn') as HTMLTextAreaElement
editor.afterPgnUpdate(function (pgn: string) {
  pgnArea.value = pgn
  pgnArea.scrollTop = pgnArea.scrollHeight
  saveDialog.updatePGN(pgn)
})

const saveButton = document.getElementById('save') as HTMLButtonElement
saveButton.addEventListener('click', function () {
  saveDialog.show()
})

const promotionButton = new PromotionButton(document.getElementById('promote'))
promotionButton.setPromotionPiece(function (piece: PromotionPiece) {
  editor.setPromotionPiece(piece)
})
editor.mayPromote(function(mayPromote: boolean) {
  promotionButton.setVisibility(mayPromote)
})

const loadDialog = new LoadDialog(document.body)
loadDialog.onSubmit(function (pgn: string) {
  return editor.loadPGN(pgn)
})
const openButton = document.getElementById('open') as HTMLButtonElement
openButton.addEventListener('click', function () {
  loadDialog.open()
})

// TODO: maybe there is someone who actually understands CSS ¯\_(ツ)_/¯
const boardElement = document.getElementById('board')
while (boardElement.clientWidth != boardElement.parentElement.clientWidth) {
  boardElement.style.width = boardElement.parentElement.clientWidth + "px"
  boardElement.style.height = boardElement.clientWidth + "px"
}
