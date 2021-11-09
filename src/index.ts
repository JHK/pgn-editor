import * as _ from 'lodash';
import '../assets/chessground.css';
import '../assets/theme.css';
import '../assets/index.css';
import '../assets/layout.css';
import { Board } from './board';

const boardElement = document.getElementById('board')
const board = new Board(boardElement);

const undoButton = document.getElementById('undo')
undoButton.onclick = function () { board.undo() }

const pgnArea = document.getElementById('pgn') as HTMLTextAreaElement
board.afterPgnUpdate = function (pgn: string) {
  pgnArea.value = pgn
}
