import { expect } from 'chai';
import { PGNEditor } from './pgn-editor'

describe('PGN Editor', () => {
  it('should initialize the object', () => {
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

    expect(editor.loadPGN("")).to.be.true
  });
  it('checking default options', () => {
    expect(1).to.equal(1)
    // const options = new Options(); // this will be your class

    // /* detect retina */
    // expect(options.detectRetina).to.be.false; // Do I need to explain anything? It's like writing in English!

    // /* fps limit */
    // expect(options.fpsLimit).to.equal(30); // As I said 3 lines above

    // expect(options.interactivity.modes.emitters).to.be.empty; // emitters property is an array and for this test must be empty, this syntax works with strings too
    // expect(options.particles.color).to.be.an("object").to.have.property("value").to.equal("#fff"); // this is a little more complex, but still really clear
  });
});
