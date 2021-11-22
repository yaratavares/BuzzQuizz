//modificacao da DOM pagina 1

const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');

promisse.then(takeAllQuiz);

promisse.catch(function (response){
    console.log(response);
})

function takeAllQuiz (response){
    const elementAllQuizzes = document.querySelector(".section2 .todosQuizes");
    for(let i=0; i< response.data.length ; i++){
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

function clickQuiz (idQuiz){
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementPageQuiz = document.querySelector(".pageQuizz");
    elementTelaInicio.classList.add("hidden");
    elementPageQuiz.classList.remove("hidden");

    searchQuizz(idQuiz);
}

// modificacao da DOM pagina 2
function searchQuizz(idQuizz) {
    let quizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/' + idQuizz);
    quizzes.then(openQuizz);
}

function openQuizz(answers) {
    let elementTitle = document.querySelector(".layer h2");

    let elementOptions = document.querySelector(".answers");
    let elementBackground = document.querySelector(".title");
    let elementQuestions = document.querySelector(".allQuestions");

    elementBackground.style.backgroundImage = `url(${answers.data.image})`;
    elementTitle.innerHTML = answers.data.title;


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
}


//criacao do quiz
// let quiz = {title: "Título do quizz", image: "https://http.cat/411.jpg",};
let quiz = {};
let qtdP;
let qtdN;
let questions = [];
let conter = 1;

function createQuiz (){
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementCreateQuiz = document.querySelector("#criarQuizzes .section1");
    elementTelaInicio.classList.add("hidden");
    elementCreateQuiz.classList.remove("hidden");
}

function saveSection1 (){
    const title = (document.getElementById('title')).value;
    const image = (document.getElementById('imageQuiz')).value;
    qtdP = (document.getElementById('qtdP')).value;
    qtdN = (document.getElementById('qtdN')).value;
    
    const imageURL = checkURL(image);
    
    if( title.length < 20 || title.length > 65 || qtdP < 3 || qtdN < 2 || !imageURL){
        alert('Preenchar os dados corretamente');
      } else {
          quiz = {title  , image};
          console.log(quiz);
      }

    const elementSection1 = document.querySelector("#criarQuizzes .section1");
    const elementSection2 = document.querySelector("#criarQuizzes .section2");
    elementSection1.classList.add("hidden");
    elementSection2.classList.remove("hidden");

    displaySection2()
}

function displaySection2 (){
    const secao = document.querySelector("#criarQuizzes .section2 .containerQuestions");
    for (let i=1; i<= qtdP; i++){
        secao.innerHTML +=
        `<div class="outrasPerguntasNiveis">
            <p class="question${i}">Pergunta ${i}</p>
            <ion-icon name="create-outline" onclick="openQuestion(this)"></ion-icon>
        </div>`
    }
}

function displayQuestions (secao) {
        secao.innerHTML += 
            `<ion-icon name="create-outline" onclick="openQuestion(this)"></ion-icon>
            <input type="text" id="question${conter}" placeholder="Texto da pergunta" />
            <input type="text" id="color${conter}" placeholder="Cor de fundo da pergunta" />
            <p>Resposta correta</p>
            <input type="text" id="answerCorrect${conter}" placeholder="Resposta correta" />
            <input type="text" id="urlCorrect${conter}" placeholder="URL da imagem" />
            <p>Respostas incorretas</p>
            <input type="text" id="answerWrong1_${conter}" placeholder="Resposta incorreta 1" />
            <input type="text" id="urlWrong1${conter}" placeholder="URL da imagem 1" />
            <br>
            <input type="text" id="answerWrong2_${conter}" placeholder="Resposta incorreta 2" />
            <input type="text" id="urlWrong2${conter}" placeholder="URL da imagem 2" />
            <br>
            <input type="text" id="answerWrong3_${conter}" placeholder="Resposta incorreta 3" />
            <input type="text" id="urlWrong3${conter}" placeholder="URL da imagem 3" />`;
}

function openQuestion (icon){
    const div = icon.parentNode;
    if (conter === 1){
        div.classList.remove("outrasPerguntasNiveis");
        div.classList.add('containerInput');
        displayQuestions(div);
    } else {
        let valid = saveSection2();
        if (valid){
            div.classList.remove("outrasPerguntasNiveis");
            div.classList.add('containerInput');
            displayQuestions(div);
        } else {
            return;
        }
    }
    conter++;
}

 function saveSection2 (){
    let i = conter - 1;
    let question = (document.getElementById(`${'question' + i}`)).value;
    let color = (document.getElementById(`${'color' + i}`)).value;
    let answerCorrect = (document.getElementById(`${'answerCorrect' + i}`)).value;
    let urlCorrect = (document.getElementById(`${'urlCorrect' + i}`)).value;
    let answerWrong1 = (document.getElementById(`${'answerWrong1_' + i}`)).value;
    let urlWrong1 = (document.getElementById(`${'urlWrong1' + i}`)).value;
    let answerWrong2 = (document.getElementById(`${'answerWrong2_' + i}`)).value;
    let urlWrong2 = (document.getElementById(`${'urlWrong2' + i}`)).value;
    let answerWrong3 = (document.getElementById(`${'answerWrong3_' + i}`)).value;
    let urlWrong3 = (document.getElementById(`${'urlWrong3' + i}`)).value;
    let answer = [];

    let valid1 = checkURL(urlCorrect);  
    let valid2 = checkURL(urlWrong1);
    console.log(urlWrong1);
    if (question.length < 20 || !(color.includes('#')) || !(color.length === 7) || answerCorrect === null || answerWrong1 === null || !valid1 || !valid2) {
        alert('Preenchar os dados corretamente: pergunta');
    } else {
        questions.push([{tittle: question, color}]);
        answer.push ([{text: answerCorrect, image: urlCorrect, isCorrectAnswer: true}]);
        answer.push ([{text: answerWrong1, image: urlWrong1, isCorrectAnswer: false}]);
        
        if (answerWrong2 !== null && checkURL(urlWrong2)){
            answer.push ([{text: answerWrong2, image: urlWrong2, isCorrectAnswer: false}]);
            if (answerWrong3 !== null && checkURL(urlWrong3)){
                answer.push ([{text: answerWrong3, image: urlWrong3, isCorrectAnswer: false}]);
            }
        }  
            questions.answer = answer;
            quiz.questions = questions;
            console.log(quiz)
            return true;
        
    }
 
    if (i === qtdP){
        displaySection3();
    }
}


function displaySection3 (){
    console.log('cheguei na tela 3')
}


function checkURL(url) {
    if(url.includes('.jpeg')){
        return true;
    } else if (url.includes('.jpg')){
        return true;
    } else if (url.includes('gif')){
        return true;
    } else if (url.includes('png')){
        return true
    } else {
        return false;
    }
}