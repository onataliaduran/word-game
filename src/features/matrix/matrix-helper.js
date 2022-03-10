
class MatrixHelper {

  matrix;

  constructor(rows, cols) {
    this.matrix = this.create(rows, cols);
  }

  create(rows, cols) {
    console.log('MatrixHelper runs');
    let cellDefinition = { letter: '', status: '' };
    // PROBLEM WITH THE FILL METHOD : If the first parameter is an object, each slot in the array will reference that object.
    // let matrix = [...new Array(rows)].map(row => new Array(cols).fill({...cellDefinition}));
    // TODO improve the complexity 
    return [...new Array(rows)].map(row => [...new Array(cols)].map(col => ({...cellDefinition})));
  }

  getMatrix() {
    return this.matrix;
  }

  static updateRow(letter, row) {
    const cellAvailable = row.findIndex(cell => cell.letter === '');
    if(cellAvailable !== -1) {
      row[cellAvailable].letter = letter;
    } else {
      console.log('No cells available');
    }   
  }

  static deleteLatest(row) {
    const cellAvailable = row.findIndex(cell => cell.letter === '');
    if(cellAvailable > 0) {
      row[cellAvailable - 1].letter = '';
    }
  }
  

}

export default MatrixHelper;

