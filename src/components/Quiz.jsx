import { useState } from "react";
import { Card } from "antd"
import { supabase } from '../config/supabase'
import { useTimer } from "react-timer-hook";
import { useNavigate } from "react-router-dom";



//mengacak jawaban
const createRandom = (arr) => {
  let myArr = [...arr];  //membongkar array
  let randomizedArr = []; //wadah untuk array baru

  while (myArr.length > 0) {
    var randomIndex = Math.floor(Math.random() * myArr.length); //membuat nomor acak
    randomizedArr.push(myArr[randomIndex]); //mengacak array
    myArr.splice(randomIndex, 1);
  }
  return randomizedArr;
}


export const Quiz = (props) => {
  const navigate = useNavigate();
  const question = props.result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setInCorrect] = useState(0);
  const { correct_answer, incorrect_answers } = question[currentQuestion];


  const MyTimer = () => {
    const times = new Date();
    const expiryTimestamp = times.setSeconds(times.getSeconds() + 5); // 1 minutes timer
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
    } = useTimer({
      expiryTimestamp,
      onExpire: () => {
        setShowScore(true)
        return insertData()
      }
    });

    return (
      <div style={{ textAlign: 'center' }}>
        <p>Kerjakan Sebelum Waktu Habis</p>
        <div style={{ fontSize: '100px' }}>
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <p>{isRunning ? 'Running' : 'Not running'}</p>
      </div>
    );
  }

  const allAnswers = incorrect_answers
    ? incorrect_answers.concat(correct_answer)
    : [];

  async function insertData() {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          user_name: 'Sulistyo Pradana',
          score: score,
          correct: correct,
          incorrect: incorrect
        }
      ])
    // console.log(data)
    // console.log(error)
  }

  const handleAnswerOptionClick = (answer) => {
    if (correct_answer == answer) {
      setScore(score + 1)
      setCorrect(correct + 1)
    } else {
      setInCorrect(incorrect + 1)
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < question.length) {
      setCurrentQuestion(nextQuestion);
    } else {

      setShowScore(true)
      return insertData()

    }
  }


  const handleBack = () => (
    window.location.reload()
  )

  const randomizedArr = createRandom(allAnswers)
  console.log('benar :', correct_answer)
  return (
    <div className={"flex flex-col items-center justify-center px-6 py-8 mx-auto  md:h-screen lg:py-0"}>
      {showScore ? '' : <MyTimer />}
      <Card>
        {
          showScore ? (
            <>
              <div className='score-section'>
                You scored {score} out of {question.length}
              </div>
              <button onClick={handleBack} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg fill="#000000" height="10px" width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M0,0v512h512V0H0z M469.333,469.333H42.667V42.667h426.667V469.333z"></path> <path d="M110.931,243.242c-0.226,0.302-0.461,0.598-0.671,0.913c-0.204,0.304-0.38,0.62-0.566,0.932 c-0.17,0.285-0.349,0.564-0.506,0.857c-0.17,0.318-0.315,0.646-0.468,0.971c-0.145,0.306-0.297,0.607-0.428,0.921 c-0.13,0.315-0.236,0.637-0.35,0.957c-0.121,0.337-0.25,0.669-0.354,1.013c-0.097,0.32-0.168,0.646-0.249,0.969 c-0.089,0.351-0.187,0.698-0.258,1.055c-0.074,0.375-0.118,0.753-0.173,1.13c-0.044,0.311-0.104,0.617-0.135,0.933 c-0.138,1.4-0.138,2.811,0,4.211c0.031,0.315,0.09,0.621,0.135,0.933c0.054,0.377,0.098,0.756,0.173,1.13 c0.071,0.358,0.169,0.704,0.258,1.055c0.081,0.324,0.152,0.649,0.249,0.969c0.104,0.344,0.233,0.677,0.354,1.013 c0.115,0.32,0.22,0.642,0.35,0.957c0.13,0.314,0.283,0.615,0.428,0.921c0.153,0.325,0.297,0.653,0.468,0.971 c0.157,0.293,0.336,0.572,0.506,0.857c0.186,0.312,0.363,0.628,0.566,0.932c0.211,0.315,0.445,0.611,0.671,0.913 c0.191,0.255,0.368,0.516,0.571,0.764c0.439,0.535,0.903,1.05,1.392,1.54c0.007,0.008,0.014,0.016,0.021,0.023l85.333,85.333 c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17l-48.915-48.915H384c11.782,0,21.333-9.551,21.333-21.333 s-9.551-21.333-21.333-21.333H179.503l48.915-48.915c8.331-8.331,8.331-21.839,0-30.17s-21.839-8.331-30.17,0l-85.333,85.333 c-0.008,0.008-0.014,0.016-0.021,0.023c-0.488,0.49-0.952,1.004-1.392,1.54C111.299,242.726,111.122,242.987,110.931,243.242z"></path> </g> </g> </g> </g></svg>
                <span>Kembali</span>
              </button>

            </>
          ) : (
            <>


              <div className='question-section'>
                <div className='question-count'>
                  <span>Question {currentQuestion + 1}</span>/{question.length}
                </div>
                <div className='question-text font-bold'>{question[currentQuestion].question}</div>
              </div>
              <div className='answer-section'>
                {randomizedArr.map((answerOption, i) => (
                  <button className="btn bg-lime-400 p-2 rounded-md m-2" key={i} onClick={() => handleAnswerOptionClick(answerOption)}>{answerOption}</button>
                ))}
              </div>

            </>
          )}
      </Card >

    </div >
  )
}