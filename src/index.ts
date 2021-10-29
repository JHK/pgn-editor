import * as _ from 'lodash';
import '../assets/chessground.css';
import '../assets/theme.css';
import { Chessground } from 'chessground';
import { MoveMetadata } from 'chessground/types';
import { Key } from 'chessground/types';
const Chess = require('chess.js'); // import { Chess } from 'chess.js'; // does not work

const boardHtml = document.createElement('div');
boardHtml.classList.add('blue');
boardHtml.classList.add('merida');

const boardInnerHtml = document.createElement('div');
boardInnerHtml.classList.add('cg-wrap');
boardHtml.appendChild(boardInnerHtml);

document.body.appendChild(boardHtml);

const config = {};
const ground = Chessground(boardInnerHtml, config);

const chess = new Chess();

function onMove(orig: Key, dest: Key, metadata: MoveMetadata) {
  // FIXME: en-passant removes a piece
  chess.move({from: orig, to: dest});
  console.log(chess.ascii());
  return false;
};

ground.set({ movable: { events: { after: onMove } } });
