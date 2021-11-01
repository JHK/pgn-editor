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

const cg = Chessground(boardInnerHtml, {});
const chess = new Chess();

function onMove(orig: Key, dest: Key, metadata: MoveMetadata) {
  // console.log(`I got the move from ${orig} to ${dest} (%O})`, metadata)

  const move = chess.move({ from: orig, to: dest });
  cg.set({ fen: chess.fen() })

  console.log(chess.ascii());
};

cg.set({ movable: { events: { after: onMove } } });
