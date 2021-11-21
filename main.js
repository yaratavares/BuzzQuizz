//modificacao da DOM pagina 1

const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');

promisse.then(takeAllQuiz);

promisse.catch(function(response) {
    console.log(response);
})

function takeAllQuiz(response) {
    const elementAllQuizzes = document.querySelector(".section2 .todosQuizes");
    for (let i = 0; i < response.data.length; i++) {
        elementAllQuizzes.innerHTML +=
            `<div class="quiz quizTodos" >
                <div class="degrade" onclick="clickQuiz(${response.data[i].id})">
                </div>
                <img src="${response.data[i].image}" />
                <div class="tittleQuiz">
                    <h3>${response.data[i].title}</h3>
                </div>
            </div>`
    }
}

function clickQuiz(idQuiz) {
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementPageQuiz = document.querySelector(".pageQuizz");
    elementTelaInicio.classList.add("hidden");
    elementPageQuiz.classList.remove("hidden");

    searchQuizz(idQuiz);
}

// modificacao da DOM pagina 2

let percentual = 0;
let levels = [];
let id = 0;

function searchQuizz(idQuizz) {
    id = idQuizz;
    let quizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/' + idQuizz);
    quizzes.then(openQuizz);
}

function openQuizz(answers) {
    let elementTitle = document.querySelector(".layer h2");
    levels = answers.data.levels;
    let elementOptions = document.querySelector(".answers");
    let elementBackground = document.querySelector(".title");
    let elementQuestions = document.querySelector(".allQuestions");

    elementBackground.style.backgroundImage = `url(${answers.data.image})`;
    elementTitle.innerHTML = answers.data.title;

    elementQuestions.innerHTML = "";

    for (let i = 0; i < answers.data.questions.length; i++) {
        elementQuestions.innerHTML += `<div class="quizzBoxes"> <div class="question">
        <h3>${answers.data.questions[i].title}</h3>
        </div><div class ="answers"></div></div>`;
    }

    let elementBoxes = document.querySelectorAll(".answers");

    for (let i = 0; i < elementBoxes.length; i++) {
        let arrayAnswers = answers.data.questions[i].answers
        arrayAnswers.sort(shuffle);

        for (let x = 0; x < arrayAnswers.length; x++) {

            if (arrayAnswers[x].isCorrectAnswer) {
                elementBoxes[i].innerHTML += `
    <div class="answer${x+1} option true"  onclick="selectAnswer(this)">
        <img src=${arrayAnswers[x].image}>
        <p>${arrayAnswers[x].text}</p>
    </div>`
            } else {
                elementBoxes[i].innerHTML += `
    <div class="answer${x+1} option false"  onclick="selectAnswer(this)">
        <img src=${arrayAnswers[x].image}>
        <p>${arrayAnswers[x].text}</p>
    </div>`
            }
        }
    }
    let elementColor = document.querySelectorAll(".question");

    for (let i = 0; i < answers.data.questions.length; i++) {
        let color = answers.data.questions[i].color;
        elementColor[i].style.background = color;
    }


}

function shuffle() {
    return Math.random() - 0.5;
}

function selectAnswer(option) {
    const numberAnswers = option.parentNode;
    const numbersAll = numberAnswers.querySelectorAll(".option");
    const questions = document.querySelectorAll(".quizzBoxes");
    const showResult = document.querySelector(".result");

    for (let i = 0; i < numbersAll.length; i++) {

        if (numbersAll[i] !== option) {
            numbersAll[i].classList.add("whitish");
        }
        numbersAll[i].classList.add("blocked");
        if (numbersAll[i].classList.contains("true")) {
            numbersAll[i].querySelector("p").classList.add("right");

        } else {
            numbersAll[i].querySelector("p").classList.add("wrong");
        }

    }
    let father = option.parentNode;
    let brother = father.parentNode.nextSibling;

    if (brother !== null) {
        setTimeout(() => { brother.scrollIntoView() }, 2000);
    }

    if (option.classList.contains("true")) {
        percentual++;
    }

    if (brother === null) {
        let result = parseInt((percentual / questions.length) * 100);

        for (i = 0; i < levels.length; i++) {
            if (result => levels.minValue[i] && result <= levels.minValue[i + 1]) {
                showResult.innerHTML = `<div class="resultTitle">
                <h3>${levels[i].title}</h3>
            </div>
            <div class="resultText">
                <img src=${levels[i].image}>
                <p>${levels[i].text}</p>
            </div>`
                showResult.classList.remove("hidden");
                setTimeout(() => { showResult.scrollIntoView() }, 2000);
            }
        }

    }
}

function restartQuizz() {
    const showResult = document.querySelector(".result");
    searchQuizz(id);
    showResult.classList.add("hidden");
    window.scrollTo(0, 0);
    percentual = 0;
}

function returnHome() {
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementPageQuiz = document.querySelector(".pageQuizz");
    elementTelaInicio.classList.remove("hidden");
    elementPageQuiz.classList.add("hidden");

    takeAllQuiz(promise);
    window.scrollTo(0, 0);
}



//criacao do quiz
let quiz = {};

function createQuiz() {
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementCreateQuiz = document.querySelector("#criarQuizzes .section1");
    elementTelaInicio.classList.add("hidden");
    elementCreateQuiz.classList.remove("hidden");
}

function createSection1() {
    const title = document.getElementById('title');
    const image = document.getElementById('imageQuiz')

    quiz = { title: title.value, image: image.value };
    console.log(quiz);
}