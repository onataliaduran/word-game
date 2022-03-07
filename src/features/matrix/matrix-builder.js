
class MatrixBuilder {

  matrix;

  constructor(rows, cols) {
    this.matrix = this.create(rows, cols);
  }

  create(rows, cols) {
    let cellDefinition = { letter: '', status: '' };
    return [...new Array(rows)].map(row => new Array(cols).fill(cellDefinition));
  }

  getMatrix() {
    return this.matrix;
  }

  updateRow(letter, row) {
    const cellAvailable = this.matrix[row].findIndex(cell => cell.letter === '');
    if(cellAvailable !== -1) {
      this.matrix[row][cellAvailable].letter = letter;
    } else {
      console.log('No cells available'); 
    } 

    return 

  }

  deleteLatest() {}

  deleteAll() {}

}

export default MatrixBuilder;

