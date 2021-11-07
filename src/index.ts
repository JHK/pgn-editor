import * as _ from 'lodash';
import '../assets/chessground.css';
import '../assets/theme.css';
import { Board } from './board';

const boardHtml = document.createElement('div');
boardHtml.classList.add('blue');
boardHtml.classList.add('merida');
document.body.appendChild(boardHtml);

const boardInnerHtml = document.createElement('div');
boardInnerHtml.classList.add('cg-wrap');
boardHtml.appendChild(boardInnerHtml);
const board = new Board(boardInnerHtml);

const undoButton = document.createElement('button')
undoButton.innerHTML = 'Undo'
undoButton.onclick = function () { board.undo() }
document.body.appendChild(undoButton)

const pgnField = document.createElement('textarea');
pgnField.contentEditable = 'false'
board.afterPgnUpdate = function (pgn: string) {
  pgnField.value = pgn
}
document.body.appendChild(pgnField)
