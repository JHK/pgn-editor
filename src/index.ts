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
