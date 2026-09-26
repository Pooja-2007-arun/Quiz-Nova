let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let questionNumber = 0;
let currentAnswer;
let currentMode = "";
let memorySequence = [];
let gameQuestions = [];
let answered = false;

const TOTAL_QUESTIONS = 10;

const questions = [
    {
        question: "Which planet is called the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1
    },
    {
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        answer: 2
    },
    {
        question: "How many days are in a week?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        question: "Which is the largest ocean?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: 3
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        answer: 1
    },
    {
        question: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        answer: 1
    },
    {
        question: "Which animal is known as the King of the Jungle?",
        options: ["Tiger", "Elephant", "Lion", "Leopard"],
        answer: 2
    },
    {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        question: "Which star is closest to Earth?",
        options: ["Sun", "Sirius", "Polaris", "Vega"],
        answer: 0
    },
    {
        question: "What is the opposite of 'Ancient'?",
        options: ["Old", "Modern", "Historic", "Past"],
        answer: 1
    }
];

// START GAME
function startGame(mode) {
    currentMode = mode;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    questionNumber = 0;
    answered = false;

    document.getElementById("game-area").style.display = "block";
    document.getElementById("results").style.display = "none";

    document.getElementById("score").textContent = "Score: 0";
    document.getElementById("feedback").textContent = "";

    if (mode === "quiz") {
        gameQuestions = [...questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, TOTAL_QUESTIONS);

        startQuiz();
    } else if (mode === "math") {
        startMath();
    } else if (mode === "memory") {
        startMemory();
    }
}

// GENERAL KNOWLEDGE
function startQuiz() {
    if (questionNumber >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }

    answered = false;

    const q = gameQuestions[questionNumber];
    currentAnswer = q.answer;

    document.getElementById("question").textContent =
        q.question;

    document.getElementById("progress").textContent =
        `Question: ${questionNumber + 1} / ${TOTAL_QUESTIONS}`;

    const options = document.getElementById("options");
    options.innerHTML = "";

    q.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(index);
        options.appendChild(btn);
    });

    document.getElementById("feedback").textContent = "";
}

// MATH CHALLENGE
function startMath() {
    if (questionNumber >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }

    answered = false;

    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 10) + 1;

    currentAnswer = a + b;

    document.getElementById("question").textContent =
        `${a} + ${b} = ?`;

    document.getElementById("progress").textContent =
        `Question: ${questionNumber + 1} / ${TOTAL_QUESTIONS}`;

    const options = document.getElementById("options");
    options.innerHTML = "";

    let answers = [
        currentAnswer,
        currentAnswer + 2,
        currentAnswer - 1,
        currentAnswer + 5
    ];

    // Ensure all options are unique
    answers = [...new Set(answers)];

    while (answers.length < 4) {
        const value = currentAnswer +
            Math.floor(Math.random() * 15) - 7;

        if (!answers.includes(value) && value >= 0) {
            answers.push(value);
        }
    }

    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(answer);
        options.appendChild(btn);
    });

    document.getElementById("feedback").textContent = "";
}

// MEMORY CHALLENGE
function startMemory() {
    if (questionNumber >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }

    answered = false;

    memorySequence = Array.from(
        { length: Math.min(4 + questionNumber, 9) },
        () => Math.floor(Math.random() * 9) + 1
    );

    document.getElementById("progress").textContent =
        `Question: ${questionNumber + 1} / ${TOTAL_QUESTIONS}`;

    document.getElementById("question").textContent =
        "Remember: " + memorySequence.join(" ");

    document.getElementById("feedback").textContent =
        "Memorize the sequence!";

    const options = document.getElementById("options");
    options.innerHTML = "";

    setTimeout(() => {
        // Don't display an old memory question if game has ended
        if (answered || currentMode !== "memory") return;

        document.getElementById("question").textContent =
            "Enter the sequence you remember:";

        options.innerHTML = "";

        const input = document.createElement("input");
        input.id = "memory-input";
        input.placeholder = "Enter numbers";
        input.style.padding = "12px";
        input.style.borderRadius = "8px";

        const btn = document.createElement("button");
        btn.textContent = "Submit";
        btn.onclick = checkMemory;

        options.appendChild(input);
        options.appendChild(btn);
    }, 3000);
}

// CHECK QUIZ AND MATH ANSWERS
function checkAnswer(answer) {
    if (answered) return;
    answered = true;

    if (answer === currentAnswer) {
        score += 10;
        correctAnswers++;

        document.getElementById("feedback").textContent =
            "Correct! +10 points 🎉";
    } else {
        wrongAnswers++;

        document.getElementById("feedback").textContent =
            "Incorrect! The correct answer was " +
            (currentMode === "quiz"
                ? gameQuestions[questionNumber].options[currentAnswer]
                : currentAnswer);
    }

    updateScore();
    questionNumber++;

    document.querySelectorAll("#options button")
        .forEach(btn => btn.disabled = true);

    setTimeout(() => {
        if (currentMode === "math") {
            startMath();
        } else {
            startQuiz();
        }
    }, 1000);
}

// CHECK MEMORY ANSWER
function checkMemory() {
    if (answered) return;

    const input = document.getElementById("memory-input");

    if (!input || input.value.trim() === "") {
        document.getElementById("feedback").textContent =
            "Please enter the sequence first!";
        return;
    }

    answered = true;

    const answer = input.value.replace(/\s/g, "");

    if (answer === memorySequence.join("")) {
        score += 10;
        correctAnswers++;

        document.getElementById("feedback").textContent =
            "Amazing memory! +10 points 🎉";
    } else {
        wrongAnswers++;

        document.getElementById("feedback").textContent =
            "Incorrect! Sequence: " + memorySequence.join("");
    }

    updateScore();
    questionNumber++;

    setTimeout(() => {
        startMemory();
    }, 1500);
}

// UPDATE SCORE
function updateScore() {
    document.getElementById("score").textContent =
        "Score: " + score;
}

// DISPLAY FINAL RESULTS
function endGame() {
    document.getElementById("game-area").style.display = "none";
    document.getElementById("results").style.display = "block";

    const accuracy = Math.round(
        (correctAnswers / TOTAL_QUESTIONS) * 100
    );

    document.getElementById("final-score").textContent =
        `Your Score: ${score} / ${TOTAL_QUESTIONS * 10}`;

    document.getElementById("correct-count").textContent =
        `Correct Answers: ${correctAnswers}`;

    document.getElementById("wrong-count").textContent =
        `Wrong Answers: ${wrongAnswers}`;

    document.getElementById("accuracy").textContent =
        `Accuracy: ${accuracy}%`;

    // Save best score for this mode
    const key = "quiznova-best-" + currentMode;
    const previousBest = Number(localStorage.getItem(key)) || 0;

    if (score > previousBest) {
        localStorage.setItem(key, score);
    }

    document.getElementById("feedback").textContent = "";
}

// PLAY AGAIN
function playAgain() {
    startGame(currentMode);
}