import './App.css';
import { useState, useEffect } from 'react';
import Modal from './components/modal/modal';
import MatrixHelper from './features/matrix/matrix-helper';
import { FiBarChart2 } from 'react-icons/fi';
import { Keyboard } from './keyboard';

function App() {

  let hiddenWord = 'acres';

  let initialStats = {
    rounds: 0,
    wins: 0
  }

  let guideModalDetails = {
    title: 'Cómo jugar',
    btnTxt: '¡JUGAR!'
  }

  let statsModalDetails = {
    title: 'Estadísticas',
    btnTxt: 'Aceptar'
  }

  useEffect(() => {
    const matrixInitialState = new MatrixHelper(5, 5);
    setMatrix(matrixInitialState.getMatrix());
  }, []);

  
  let keyboard = [
    { id: 1, symbol: 'q' }, 
    { id: 2, symbol: 'w' }, 
    { id: 3, symbol: 'e' }, 
    { id: 4, symbol: 'r' },  
    { id: 5, symbol: 't' },
    { id: 6, symbol: 'y' },
    { id: 7, symbol: 'u' },
    { id: 8, symbol: 'i' },
    { id: 9, symbol: 'o' },
    { id: 10, symbol: 'p'},
    { id: 11, symbol: 'a'},
    { id: 12, symbol: 's'},
    { id: 13, symbol: 'd'},
    { id: 14, symbol: 'f'},
    { id: 15, symbol: 'g'},
    { id: 16, symbol: 'h'},
    { id: 17, symbol: 'j'},
    { id: 18, symbol: 'k'},
    { id: 19, symbol: 'l'},
    { id: 20, symbol: 'ñ'},
    { id: 21, symbol: 'z'},
    { id: 22, symbol: 'x'},
    { id: 23, symbol: 'c'},
    { id: 24, symbol: 'v'},
    { id: 25, symbol: 'b'},
    { id: 26, symbol: 'n'},
    { id: 27, symbol: 'm'},
  ];

  const eg1 = [
    {letter: 'g', status: 'bg-green-600'}, 
    {letter: 'a', status: ''}, 
    {letter: 't', status: ''}, 
    {letter: 'o', status: ''},
    {letter: 's', status: ''},
  ];

  const eg2 = [
    {letter: 'v', status: ''}, 
    {letter: 'o', status: ''}, 
    {letter: 'c', status: 'bg-amber-400'}, 
    {letter: 'a', status: ''},
    {letter: 'l', status: ''},
  ];

  const eg3 = [
    {letter: 'c', status: ''}, 
    {letter: 'a', status: ''}, 
    {letter: 'n', status: ''}, 
    {letter: 't', status: ''},
    {letter: 'o', status: 'bg-neutral-300'},
  ];

  const [matrix, setMatrix] = useState([]);
  const [matrixIndex, setMatrixIndex] = useState(0);

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const [stats, setStats] = useState(initialStats);


  // ********** TIMER LOGIC ********** //
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(false);

  useEffect(() => {
    const visitedBefore = localStorage.getItem('VISITED');
    if(!visitedBefore) {
      localStorage.setItem('VISITED', 'true');
      setShowGuideModal(true);
    } 
  }, []);

  useEffect(() => {
    let timerId;

    if(runTimer) {
      setCountDown(60 * 5);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if(countDown < 0 && runTimer) {
      console.log("expired");
      setRunTimer(false);
      setCountDown(0);
      clearMatrix();
    }
  }, [countDown, runTimer]);

  const togglerTimer = () => setRunTimer((t) => !t);
  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);
  // ********** END - TIMER LOGIC ********** //


  const matrixController = (input) => {
    console.log('matrixIndex', matrixIndex);
    let currentMatrixState = [...matrix];
    MatrixHelper.updateRow(input, currentMatrixState[matrixIndex]);
    setMatrix([...currentMatrixState]);
  }

  const onKeyEnter = (keySelected) => {
    matrixController(keySelected);
  }

  const onDeleteKey = () => {
    const currentMatrixState = [...matrix];
    const currentRow = currentMatrixState[matrixIndex]; 
    MatrixHelper.deleteLatest(currentRow);
    setMatrix([...currentMatrixState]);
  }

  const checkWord = (string, row) => {
    let word = row.map(item => item.letter).join('');
    if(word !== string) {

      // CHECK EACH LETTER
      row.forEach((item, index) => {
        if (item.letter !== string[index]) {
          item.status = string.includes(item.letter) ? 'bg-amber-400' : 'bg-neutral-300';
        } else {
          item.status = 'bg-green-600';
        }
      });

      // *** NEXT ROW *** //
      setMatrixIndex(matrixIndex => matrixIndex + 1);

    } else {
      let currentStats = {...stats};
      currentStats.wins += 1;
      setStats(currentStats);
      setShowStatsModal(true);
      clearMatrix();
      console.log('estadisticas finales', currentStats);
    }
    console.log('THE FINAL OBJ => ', row);
  }

  const clearMatrix = () => {
    const matrixInitialState = new MatrixHelper(5, 5);
    setMatrix(matrixInitialState.getMatrix());
    setMatrixIndex(matrixIndex => 0);
  }

  const play = () => {
    let currentStats = {...stats};
    currentStats.rounds += 1;
    setStats(currentStats);
    setShowGuideModal(false);
    setShowStatsModal(false);
    // togglerTimer();
  }

  const onSubmitWord = () => {
    console.log('Enter');

    if(matrix[matrixIndex].at(-1).letter !== '') {
      checkWord(hiddenWord, matrix[matrixIndex]); 
    } 
   
    if(matrix.at(-1).at(-1).letter !== '') {
      console.log('// ***** Llegué al final ***** //');
      setShowStatsModal(true);
      clearMatrix();
    }
  }

  return (
    <div className="container mx-auto py-9 flex justify-center">

      {/*  *** HEADER *** */}
      <div className="w-80">
        <header className="bg-neutral-100 w-full rounded rounded-md p-2 flex justify-between items-center">
          <button onClick={() => setShowGuideModal(true)} className="bg-neutral-500 rounded-full w-4 h-4 flex justify-center items-center">
            <p className="text-white">?</p>
          </button>
          <h1 className="font-semibold">WORDLE</h1>
          <div>
            <button onClick={() => setShowStatsModal(true)} className="bg-neutral-500 text-white w-5 h-4 rounded-sm flex justify-center items-center">
              <FiBarChart2 />
            </button>
            <div></div>
          </div>
        </header>

        {/*  *** MATRIX *** */}
        <div className="my-5 flex justify-center">
          <div>
            {matrix.map((row, i) => {
              return (
                <div key={i} className="flex">
                  {row.map((cell, i) => {
                    return (
                      <div key={i} className={`${cell.status ? cell.status : 'bg-neutral-200'} w-12 h-12 rounded-sm m-0.5 flex justify-center items-center`}>
                        <p className={`uppercase text-lg font-bold ${cell.status && 'text-white'}`}>{cell.letter}</p>
                      </div>
                      )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/*  *** KEYBOARD *** */}
        <Keyboard keys={keyboard} keyHandler={onKeyEnter} deleteHandler={onDeleteKey} submitWordHandler={onSubmitWord} />

        {/*  *** MODALS *** */}
        <Modal showToggler={showGuideModal} event={play} details={guideModalDetails}>
          <div>
            <p className="text-xs">
              Adivina la palabra oculta en cinco intentos.<br/> 
              Cada intento debe ser una palabra válida de 5 letras.<br/><br/>
              Después de cada intento el color de las letras cambia<br/>
              para mostrar qué tan cerca estás de acertar la palabra.<br/><br/>
            </p>
            <p className="text-xs font-bold">Ejemplos</p>
            <div className="my-2 flex justify-center">
              {eg1.map((cell, i) => {
                return (
                  <div key={i} className={`${cell.status ? cell.status : 'bg-neutral-200'} w-12 h-12 rounded-sm m-0.5 flex justify-center items-center`}>
                    <p className={`uppercase text-lg font-bold ${cell.status && 'text-white'}`}>{cell.letter}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs">La letra G está en la palabra y en la posición correcta.</p>

            <div className="my-2 flex justify-center">
              {eg2.map((cell, i) => {
                return (
                  <div key={i} className={`${cell.status ? cell.status : 'bg-neutral-200'} w-12 h-12 rounded-sm m-0.5 flex justify-center items-center`}>
                    <p className={`uppercase text-lg font-bold ${cell.status && 'text-white'}`}>{cell.letter}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs">La letra C está en la palabra, pero en la posición incorrecta.</p>

            <div className="my-2 flex justify-center">
              {eg3.map((cell, i) => {
                return (
                  <div key={i} className={`${cell.status ? cell.status : 'bg-neutral-200'} w-12 h-12 rounded-sm m-0.5 flex justify-center items-center`}>
                    <p className={`uppercase text-lg font-bold ${cell.status && 'text-white'}`}>{cell.letter}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs">La letra O no está en la palabra.</p>

            <p className="text-xs my-2">
              Puede haber letras repetidas. Las pistas son<br/>
              independientes de cada letra.
            </p>

            <p className="text-xs text-center mt-5 mb-3">¡Una palabra nueva cada 5 minutos!</p>
          </div>
        </Modal>

        <Modal showToggler={showStatsModal} event={play} details={statsModalDetails}>
          <div className="flex space-x-7">
            <div className="p-3 flex justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xl">{stats.rounds}</p>
                <p>Jugadas</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <p className="text-xl">{stats.wins}</p>
                <p>Victorias</p>
              </div>
            </div>
          </div>
        </Modal>

      </div>

    </div>
  );
}

export default App; 