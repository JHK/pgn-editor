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
new Board(boardInnerHtml);
