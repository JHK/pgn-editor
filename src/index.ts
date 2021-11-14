import * as _ from 'lodash';
import './css/layout.scss';
import './css/chessground.css';
import './css/theme.css';
import './css/index.css';
import { Board } from './board';

const boardElement = document.getElementById('board')
const board = new Board(boardElement);

const undoButton = document.getElementById('undo')
undoButton.onclick = function () { board.undo() }

const pgnArea = document.getElementById('pgn') as HTMLTextAreaElement
board.afterPgnUpdate = function (pgn: string) {
  pgnArea.value = pgn
  pgnArea.scrollTop = pgnArea.scrollHeight
}

const eventInput = document.getElementById('event') as HTMLInputElement
eventInput.addEventListener('keyup', function () {
  board.header("Event", eventInput.value)
})

const siteInput = document.getElementById('site') as HTMLInputElement
siteInput.addEventListener('keyup', function () {
  board.header("Site", siteInput.value)
})

const dateInput = document.getElementById('date') as HTMLInputElement
dateInput.addEventListener('change', function () {
  board.header("Date", dateInput.value)
})

const roundInput = document.getElementById('round') as HTMLInputElement
roundInput.addEventListener('keyup', function () {
  board.header("Round", roundInput.value)
})

const whiteNameInput = document.getElementById('name_white') as HTMLInputElement
whiteNameInput.addEventListener('keyup', function () {
  board.header("White", whiteNameInput.value)
})

const whiteRatingInput = document.getElementById('rating_white') as HTMLInputElement
whiteRatingInput.addEventListener('keyup', function () {
  board.header("WhiteELO", whiteRatingInput.value)
})

const blackNameInput = document.getElementById('name_black') as HTMLInputElement
blackNameInput.addEventListener('keyup', function () {
  board.header("Black", blackNameInput.value)
})

const blackRatingInput = document.getElementById('rating_black') as HTMLInputElement
blackRatingInput.addEventListener('keyup', function () {
  board.header("BlackELO", blackRatingInput.value)
})
