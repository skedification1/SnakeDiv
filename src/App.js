import './App.css';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
const Canv = HTMLCanvasElement;
//const CanvasProps = React.DetailedHTMLProps.CanvasHTMLAttributes;
function App({ ...props }) {
  /////////////////////////////-------divSnake

  const [formMap, setFormMap] = React.useState([]); // rendered form
  const [snakeHeadX, setSnakeHeadX] = React.useState(6); //X
  const [snakeHeadY, setSnakeHeadY] = React.useState(6); //Y
  const [snakeArr, setSnakeArr] = React.useState([]); //  snake arr of number [snakeLength]
  let initX = 0;
  let initY = 0;
  let formParams = 25; // 25x25...
  const [snakeLength, setSnakeLength] = React.useState(5); // snake lenth number
  const [appleX, setAppleX] = React.useState(9);
  const [appleY, setAppleY] = React.useState(9);
  const [scoreApple, setScoreApple] = React.useState(0);

  ///////////////////////////////////////////////////////////////clean
  console.log('new_formMap_ = ', formMap);

  const completeSnakeMap = () => {
    let testArrY = [];
    for (let i = 0; i < formParams; i++) {
      testArrY[i] = '_';
    }
    for (let i = 0; i < formParams; i++) {
      setFormMap((formMap) => [...formMap, testArrY]);
    }
    console.log('new_map_formMap_ = ', formMap);
  };
  //////////////////////////SNAKE

  const changeOneSnake = (i = snakeHeadX, j = snakeHeadY) => {
    let mapArr = snakeArr; //for taking[0][0] to delete prev

    if (snakeArr.length < snakeLength) {
      setSnakeArr((snakeArr) => [...snakeArr, { x: i, y: j }]);

      const changedArr = formMap.map((x, index) =>
        index === i ? x.map((y, index) => (index === j ? 'S' : y)) : x,
      );
      setFormMap(changedArr);
    } else {
      //  setSnakeArr(snakeArr.splice(1, snakeLength - 1));
      //  setSnakeArr((snakeArr) => [...snakeArr, { x: i, y: j }]);
      ///////////////////////////////////////////////////////===========
      setSnakeArr([...snakeArr.splice(1, snakeLength - 1), { x: i, y: j }]);
      console.log('snakeArr___2___', snakeArr);
      const changedArr = formMap.map((x, index) =>
        index === i ? x.map((y, index) => (index === j ? 'S' : y)) : x,
      );
      const deleteArr = changedArr.map((x, index) =>
        index === mapArr[0].x ? x.map((y, index) => (index === mapArr[0].y ? 'D' : y)) : x,
      );
      setFormMap(deleteArr);
    }
    ///////////////////////////////////////////
  };

  const appleAdd = () => {
    const appleAdd = formMap.map((x, index) =>
      index === appleX ? x.map((y, index) => (index === appleY ? 'A' : y)) : x,
    );
    const appleAdd2 = appleAdd.map((x, index) =>
      index === snakeHeadX ? x.map((y, index) => (index === snakeHeadY ? 'S' : y)) : x,
    );
    setFormMap(appleAdd2);
  };

  const appleChecker = (x = 0, y = 0) => {
    brokeSnake();
    if (brokeSnake() === false) {
      return gameOver();
    }
    if (appleX === snakeHeadX + x && appleY === snakeHeadY + y) {
      console.log('APPLEEEEEE');
      setSnakeLength(snakeLength + 1);
      setAppleX(Math.floor(Math.random() * (25 - 0) + 0));
      setAppleY(Math.floor(Math.random() * (25 - 0) + 0));
      setScoreApple(scoreApple + 1);
    }

    appleAdd();
  };

  /////////////////////////////////////
  useEffect(() => {
    if (formMap.length === 0) {
      completeSnakeMap();
    } else {
      changeOneSnake();
    }
  }, [snakeHeadX, snakeHeadY, snakeLength]);
  //telegram(1, 1); // вызывает постоянный ререндер

  const brokeSnake = () => {
    if (snakeHeadX > formParams || snakeHeadX < 0 || snakeHeadY > formParams || snakeHeadY < 0) {
      alert('OverMap, Your score is: ', scoreApple);
      gameOver();
      return false;
    }

    for (let i = 0; i < snakeArr.length - 1; i++) {
      if (snakeArr[i].x === snakeHeadX && snakeArr[i].y === snakeHeadY) {
        alert('Brolke - the snake ate itself: ', scoreApple);
        gameOver();
        return false;
      } else {
        console.log('SNAKE NOT_Broke______');
      }
    }
  };

  const [navigateTick, setNavigateTick] = React.useState('right');
  const handlerClicker = (e) => {
    switch (e) {
      case 'ArrowUp':
        // pushUp();
        setNavigateTick('up');
        break;
      case 'ArrowDown':
        //  pushDown();
        setNavigateTick('down');
        break;
      case 'ArrowLeft':
        // pushLeft();
        setNavigateTick('left');
        break;
      case 'ArrowRight':
        // pushRight();
        setNavigateTick('right');
        break;
      case ' ':
        console.log('spaceeeee', e);
        push();
        break;
      default:
        console.log('default---------------', e);
    }
  };

  const [tickRate, setTickRate] = React.useState(null);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  useInterval(() => {
    // Your custom logic here
    if (navigateTick === 'right') {
      pushRight();
    } else if (navigateTick === 'left') {
      pushLeft();
    } else if (navigateTick === 'down') {
      pushDown();
    } else if (navigateTick === 'up') {
      pushUp();
    }
  }, tickRate);
  ///////////////////////////////////////=====

  const [iStartSnake, setIStartSnake] = React.useState(0);
  const [tickStrSnake, setTickStrSnake] = React.useState(0);

  useInterval(() => {
    if (iStartSnake < snakeLength) {
      setSnakeHeadX(snakeHeadX + 1);
      setIStartSnake(iStartSnake + 1);
    }
  }, tickStrSnake);

  const push = () => {
    setTickStrSnake(null);

    if (tickRate === null) {
      setTickRate(220);
    } else {
      setTickRate(null);
    }

    appleAdd();
  };

  const pushRight = () => {
    if (
      snakeArr[snakeArr.length - 2].x === snakeHeadX + 1 &&
      snakeArr[snakeArr.length - 2].y === snakeHeadY
    ) {
      setSnakeHeadX(snakeHeadX - 1);
      setNavigateTick('left');
    } else {
      setSnakeHeadX(snakeHeadX + 1);
      setNavigateTick('right');
      console.log('snakeHeadX-snakeHeadY ', snakeHeadX, ' - ', snakeHeadY);
      appleChecker(1, 0);
    }
  };

  const pushLeft = () => {
    if (
      snakeArr[snakeArr.length - 2].x === snakeHeadX - 1 &&
      snakeArr[snakeArr.length - 2].y === snakeHeadY
    ) {
      setSnakeHeadX(snakeHeadX + 1);
      setNavigateTick('right');
    } else {
      setSnakeHeadX(snakeHeadX - 1);
      setNavigateTick('left');
      console.log('snakeHeadX-snakeHeadY ', snakeHeadX, ' - ', snakeHeadY);
      appleChecker(-1, 0);
    }
  };

  const pushDown = () => {
    if (
      snakeArr[snakeArr.length - 2].x === snakeHeadX &&
      snakeArr[snakeArr.length - 2].y === snakeHeadY + 1
    ) {
      setSnakeHeadY(snakeHeadY - 1);
      setNavigateTick('up');
    } else {
      setSnakeHeadY(snakeHeadY + 1);
      setNavigateTick('down');
      console.log('snakeHeadX-snakeHeadY ', snakeHeadX, ' - ', snakeHeadY);
      appleChecker(0, 1);
    }
  };

  const pushUp = () => {
    if (
      snakeArr[snakeArr.length - 2].x === snakeHeadX &&
      snakeArr[snakeArr.length - 2].y === snakeHeadY - 1
    ) {
      setSnakeHeadY(snakeHeadY + 1);
      setNavigateTick('down');
    } else {
      setSnakeHeadY(snakeHeadY - 1);
      setNavigateTick('up');
      console.log('snakeHeadX-snakeHeadY ', snakeHeadX, ' - ', snakeHeadY);
      appleChecker(0, -1);
    }
  };

  const gameOver = () => {
    setTickRate(null);
    setFormMap([]);

    setSnakeArr([]);
    setSnakeHeadX(6);
    setSnakeHeadY(6);
    setSnakeLength(5);
    setAppleX(9);
    setAppleY(9);
    setScoreApple(0);

    setIStartSnake(0);
    setTickStrSnake(1);
  };

  return (
    <div
      className="container"
      onKeyUp={(e) => {
        handlerClicker(e.key);
      }}
      tabIndex="0">
      <div className="App">
        <div className="scorePanel">Total score is {scoreApple}</div>
        <div className="bcgForm2">
          {/* {[...new Array(20)].map(() => { */}
          {formMap.length > 0 ? (
            formMap.map(() => {
              initY = 0;
              initX++;

              return (
                <>
                  <div>
                    {[...new Array(formParams)].map(() => {
                      initY++;

                      if (formMap[initX - 1][initY - 1] === 'S') {
                        return <div className="snake"> </div>;
                      } else if (formMap[initX - 1][initY - 1] === 'A') {
                        return <div className="applePoint"> </div>;
                      } else {
                        return <div className="formPoint"> </div>;
                      }
                    })}
                  </div>
                </>
              );
            })
          ) : (
            <div>ZERRO</div>
          )}
        </div>
        <div className="btnsPanel">
          <button
            className="btn"
            onClick={() => {
              push();
            }}>
            Start
          </button>

          <button
            className="btn"
            onClick={() => {
              pushLeft();
            }}>
            Left
          </button>
          <button
            className="btn"
            onClick={() => {
              pushRight();
            }}
            onKeyDown={pushRight}>
            Right
          </button>
          <button
            className="btn"
            onClick={() => {
              pushUp();
            }}>
            Up
          </button>
          <button
            className="btn"
            onClick={() => {
              pushDown();
            }}>
            Down
          </button>
          <button
            className="btn"
            onClick={() => {
              gameOver();
            }}>
            New
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

//let bcgForm = [];
//bcgForm[0] = []; // теперь  - двумерный массив
// bcgForm[0][0] = 1; // теперь  - трехмерный массив
//arr[i][j] = 5  -> testArr.map((x, index)=>index === i ? x.map((y, index)=>index === j ? 5: y) : x)
