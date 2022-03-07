import './App.css';
import { useState, useEffect } from 'react';
import Modal from './components/modal/modal';
import MatrixBuilder from './features/matrix/matrix-builder';
import { FiBarChart2, FiDelete } from "react-icons/fi";

function App() {

  let hiddenWord = 'acres';
  let limit = 5;

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

  // const matrixBuilder = (rows, cols) => {
  //   let cellDefinition = { letter: '', status: '' };
  //   return [...new Array(rows)].map(row => new Array(cols).fill({...cellDefinition}));
  // }

  // let matrixInitialState = matrixBuilder(5, 5);

  let matrixInitialState = [
    [
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' }
    ], 
    [
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' }
    ], 
    [
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' }
    ],
    [
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' }
    ],  
    [
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' },
      { letter: '', status: '' }
    ],
  ];

  let keyboard = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];

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

  const [matrix, setMatrix] = useState(matrixInitialState);
  const [tryouts, setTryouts] = useState(1);
  const [matrixIndex, setMatrixIndex] = useState(0);

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(false);

  const [stats, setStats] = useState(initialStats);

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
      clear();
    }
  }, [countDown, runTimer]);


  const togglerTimer = () => setRunTimer((t) => !t);

  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);


  const keyboardHandler = (keySelected) => {
    // *** MATRIX LOGIC *** //
    if(tryouts <= limit) {
      let currentMatrixState = [...matrix];
      updateRow(keySelected, currentMatrixState[matrixIndex]);    
      setMatrix([...currentMatrixState]);

      if(matrix[matrixIndex][limit - 1].letter !== '') {
        checkWord(hiddenWord, matrix[matrixIndex]);
      }
      console.log('THE MATRIX', matrix);

    } else {
      console.log('YOU LOSE');
      setShowStatsModal(true);
      clear();
    }
    // *** END - FILLING MATRIX LOGIC *** //
  }

  const checkWord = (string, array) => {
    let word = array.map(item => item.letter).join('');
    if(word !== string) {
      // CHECK EACH LETTER
      array.forEach((item, index) => {
        if (item.letter !== string[index]) {
          item.status = string.includes(item.letter) ? 'bg-amber-400' : 'bg-neutral-300';
        } else {
          item.status = 'bg-green-600';
        }
      });

      // *** NEXT ROW *** //
      setMatrixIndex(matrixIndex => matrixIndex + 1);
      setTryouts(tryouts => tryouts + 1);
    } else {
      console.log('palabra correcta...MODAL ESTADISTICAS');
      let currentStats = {...stats};
      currentStats.wins += 1;
      setStats(currentStats);
      setShowStatsModal(true);
      clear();
      console.log('estadisticas finales', currentStats);
    }
    console.log('THE FINAL OBJ => ', array);
  }


  const updateRow = (letter, row) => {
    const cellAvailable = row.findIndex(cell => cell.letter === '');
    if(cellAvailable !== -1) {
      row[cellAvailable].letter = letter;
    } else {
      console.log('No cells available');
    }   
  }

  const deleteHandler = () => {
    const currentMatrixState = [...matrix];
    const currentRow = currentMatrixState[matrixIndex];
    const cellAvailable = currentRow.findIndex(cell => cell.letter === '');

    if(cellAvailable > 0) {
      currentRow[cellAvailable - 1].letter = '';
      setMatrix([...currentMatrixState]);
    }
  }

  const play = () => {
    let currentStats = {...stats};
    currentStats.rounds += 1;
    setStats(currentStats);
    setShowGuideModal(false);
    setShowStatsModal(false);
    // togglerTimer();
  }

  const clear = () => {
    setMatrix(matrixInitialState);
    setMatrixIndex(matrixIndex => 0);
    setTryouts(tryouts => 1);
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
        <div className="bg-neutral-100 p-5 rounded-md">
          <div className="bg-neutral-100 grid grid-cols-10 gap-1">
            {keyboard.map((key) => {
              return (
                <button key={key} className="bg-neutral-200 py-2 rounded-sm flex justify-center items-center">
                  <p className="uppercase text-neutral-700 text-xs font-semibold" onClick={() => keyboardHandler(key)}>{key}</p>
                </button>
              )
            })}
            <button className="col-span-2 bg-neutral-200 py-2 rounded-sm flex justify-center items-center">
              <p className="text-neutral-700" onClick={deleteHandler}>
                <FiDelete />
              </p>
            </button>
          </div>
          
        </div>

        {/*  *** MODALS *** */}
        <Modal show={showGuideModal} event={play} details={guideModalDetails}>
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

        <Modal show={showStatsModal} event={play} details={statsModalDetails}>
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