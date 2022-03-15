const correctAnswers = ['A','B','A', 'B'];
const form = document.querySelector('.form-quiz');
const scoreText =document.querySelector('.p-score');
let score = 0;

const getCorrectAnswers = () => {
  const answers = [];
  correctAnswers.forEach((_answer, index) => {
    const userAnswer = form[`question${index + 1}`].value;
    answers.push(userAnswer)
  })
  return answers;
}


const animateScore = () => {
  let counter = 0;
  const timer = setInterval(() => {
    scoreText.textContent = `Seu score é ${counter += 1}%`;
    if(counter === score) {
      clearInterval(timer)
    }
  },10)
}

const calculateScore = (answers) => {
  answers.forEach((answer,index) => {
    const isCorrectAnswer = answer === correctAnswers[index]
    if(isCorrectAnswer) score += 25;
  })
  animateScore();
}


const submitForm = event => {
  event.preventDefault();
  score = 0;
  const answers = getCorrectAnswers();
  calculateScore(answers);
  scrollTo({ top: 0, left: 0, behavior: "smooth"})
 
}

form.addEventListener('submit', submitForm)