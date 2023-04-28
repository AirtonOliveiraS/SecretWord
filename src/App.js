//CSS
import './App.css';

//REACT
import { useCallback, useEffect, useState } from 'react';

//DATA
import { wordsList } from './data/words';

//COMPONENTS
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';


const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  //console.log(words)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setguessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)



  const pickedWordandCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category)
    //pick a random word

    const word = words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)


    return { word, category }


  },[words]);

  //start game
  const startGame = useCallback(() => {
    //pickedWord e category 
    clearLetterStates();
    const { word, category } = pickedWordandCategory();


    //Create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)

  },[pickedWordandCategory]);

  //processo da letras
  const verifyLetter = (letter) => {
    const normalizeletter = letter.toLowerCase()

    if (guessedLetters.includes(normalizeletter) || wrongLetters.includes(normalizeletter)) {
      return;
    }

    if (letters.includes(normalizeletter)) {
      setguessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeletter
      ])

    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeletter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }

  };

  const clearLetterStates = () => {
    setguessedLetters([]);
    setWrongLetters([]);
  }
  useEffect(() => {

    if (guesses <= 0) {
      clearLetterStates()
      setGameStage(stages[2].name)
    }

  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if (guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100);
      startGame();

      
    }

  }, [guessedLetters, letters, startGame])



  //Recomexar o jogo
  const RetryGame = () => {

    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);


  };


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' &&
        (<Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />)}
      {gameStage === 'end' && <GameOver RetryGame={RetryGame} score={score} />}

    </div>
  );
}

export default App;
