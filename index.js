// SETUP ELEMENTS
const startBtn = document.getElementById("start-btn")
const nameInput = document.getElementById("name")
const numberInput = document.getElementById("quiz-length")
const categoryInput = document.getElementById("quiz-type")
const setupContainer = document.querySelector(".setup-container")


// IN-GAME ELEMENTS
const scoreDisplay = document.getElementById("player-score-display")
const questionCountDisplay = document.getElementById("question-count")
const questionDisplay = document.getElementById("question-display")
const quizContainer = document.querySelector(".quiz-container")
const answerObject = document.querySelector(".answer-container")
const incorrectAnswer = document.querySelectorAll(".incorrect")
const correctAnswer = document.getElementById("answer-correct")
const quizResultsContainer = document.querySelector(".quiz-results-container")
const finalScoreHeader = document.getElementById("results-header")
const finalScoreDisplay = document.getElementById("results-score")
const restartBtn = document.querySelectorAll(".restart")
const spinnerContainer = document.querySelector(".spinner-container")

// VARIABLES
let score = 0
let count = 0
let questionCounter = null
let totalQuestions = null
let category = ""
let questions = []
let currentQuestion = {}
let availableQuestions = "Might not need"
const correctBonus = 10
let playerName = ""

// EVENT LISTENERS
startBtn.addEventListener("click", startGame)
restartBtn.forEach(btn => {
    btn.addEventListener("click", restartGame)
})
answerObject.addEventListener("click", nextQuestion)
incorrectAnswer.forEach(item => {
    item.addEventListener("click", questionWrong)
})
correctAnswer.addEventListener("click", questionRight)

// FUNCTIONS
function startGame(event) {
    event.preventDefault()
    playerName = nameInput.value
    totalQuestions = numberInput.value
    category = categoryInput.value
    questionCounter = 1
    spinnerContainer.style.display = "flex"
    setupContainer.style.display = "none"

    scoreDisplay.innerHTML = `${playerName}'s Score: ${score}`
    questionCountDisplay.innerHTML = `Question ${questionCounter}`

    getQuestions()
}

async function getQuestions() {
    let categoryValue = ""

    switch(category) { //switches category string to numeric value needed for fetch request
        case "General Knowledge":
            categoryValue = "9"
            break
        case "Entertainment: Books":
            categoryValue = "10"
            break
        case "Entertainment: Film":
            categoryValue = "11"
            break
        case "Entertainment: Television":
            categoryValue = "14"
            break
        case "Entertainment: Music":
            categoryValue = "12"
            break
        case "Science & Nature":
            categoryValue = "17"
            break
        case "Sports":
            categoryValue = "21"
            break
        case "History":
            categoryValue = "23"
            break
        default:
            categoryValue = ""
    } 

    const quizPromise = await fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&category=${categoryValue}&type=multiple`)
    const quizData = await quizPromise.json()
    questions = quizData.results
    nextQuestion()
}

function nextQuestion() {
    if (count >= totalQuestions) {
        showResults()
    } else {
        setTimeout(() => {
            quizContainer.style.display = "flex"
            questionCountDisplay.innerHTML = `Question ${questionCounter} of ${totalQuestions}`
            scoreDisplay.innerHTML = `${playerName}'s Score: ${score}`
            questionDisplay.innerHTML = questions[count].question
            for (let i = answerObject.children.length; i >= 0; i--) { //this for loop randomizes the order of answers
                answerObject.appendChild(answerObject.children[Math.random() * i | 0])
            }
            correctAnswer.innerHTML = questions[count].correct_answer
            incorrectAnswer[0].innerHTML = questions[count].incorrect_answers[0]
            incorrectAnswer[1].innerHTML = questions[count].incorrect_answers[1]
            incorrectAnswer[2].innerHTML = questions[count].incorrect_answers[2]
            questionCounter ++
            count++
            correctAnswer.classList.remove("show-correct")
            incorrectAnswer.forEach(item => {item.classList.remove("show-incorrect")})
            spinnerContainer.style.display = "none"
        }, 3000)
    }
}

function questionRight(e) { //change selected option green
    correctAnswer.classList.add("show-correct")
    score += correctBonus
}

function questionWrong(e) { //change selected option red and show correct option green
    e.target.classList.add("show-incorrect")
    correctAnswer.classList.add("show-correct")
}

function showResults() {
    setTimeout(() => {
        let possibleScore = totalQuestions * 10 //used to calculate score percentage
        quizResultsContainer.style.display = "flex"
        quizContainer.style.display = "none"
        score >= totalQuestions * correctBonus/2 ? finalScoreHeader.innerHTML = `Congrats, ${playerName}!` :
            finalScoreHeader.innerHTML = `Eh, not very good, ${playerName}`
        finalScoreDisplay.innerHTML = `You scored ${score} points, which is ${score / possibleScore * 100}%`
    }, 3000)
}


function restartGame(event) {
    event.preventDefault()
    score = 0
    count = 0
    category = ""
    questionCounter = null
    totalQuestions = null
    letQuestions = []
    currentQuestion = {}
    availableQuestions = "Might not need"
    playerName = ""

    //resets form fields
    nameInput.value = ""
    numberInput.value = 5
    categoryInput.value = "General Knowledge"

    // makes setupContainer visible and quizResultsContainer hidden
    quizResultsContainer.style.display = "none"
    quizContainer.style.display = "none"
    setupContainer.style.display = "flex"
}