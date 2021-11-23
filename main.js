//modificacao da DOM pagina 1

const promisse = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');

let idUsersQuizzes = []
promisse.then(takeAllQuiz);

promisse.catch(function(response) {
    console.log(response);
})

function takeAllQuiz(response) {
    const elementAllQuizzes = document.querySelector(".section2 .todosQuizes");
    const elementSeusQuizzes = document.querySelector(".section1 .seusQuizes");

    if (idUsersQuizzes.length !== 0 ){
        const elementDivisor = document.querySelector(".section1 .divisor");
        const elementCriarQuiz = document.querySelector(".section1 .criarQuiz");
        elementDivisor.classList.remove('semQuiz');
        elementSeusQuizzes.classList.remove('semQuiz');
        elementCriarQuiz.classList.add('comQuiz');
    }

    for (let i = 0; i < response.data.length; i++) {

        if (idUsersQuizzes.includes(response.data[i].id)){
            elementSeusQuizzes.innerHTML +=
            `<div class="quiz quizSeus" >
                <div class="degrade" onclick="clickQuiz(${response.data[i].id})">
                </div>
                <img src="${response.data[i].image}" />
                <div class="tittleQuiz">
                    <h3>${response.data[i].title}</h3>
                </div>
            </div>`
        } else {
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
let ids = 0;

//procura o quizz
function searchQuizz(idQuizz) {
    ids = idQuizz;
    let quizzes = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/' + idQuizz);
    quizzes.then(openQuizz);
}

//abre o quizz
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

//função para ao selecionar as respostas revelar a corretar 

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
                <h3>${result}% de acerto: ${levels[i].title}</h3>
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

//função para reiniciar o quizz na pagina 2

function restartQuizz() {
    const showResult = document.querySelector(".result");
    searchQuizz(ids);
    showResult.classList.add("hidden");
    window.scrollTo(0, 0);
    percentual = 0;
}

//função para retornar home da pagina 2

function returnHome() {
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementPageQuiz = document.querySelector(".pageQuizz");
    elementTelaInicio.classList.remove("hidden");
    elementPageQuiz.classList.add("hidden");

    takeAllQuiz(promise);
    window.scrollTo(0, 0);
}



//criacao do quiz
// variaveis globais para as funçoes a seguir:
let quiz = {};
let qtdP;
let qtdN = 2;
let questions = [];
let niveis = [];
let conter = 1;


function createQuiz() {
    const elementTelaInicio = document.getElementById("telaInicio");
    const elementCreateQuiz = document.querySelector("#criarQuizzes .section1");
    elementTelaInicio.classList.add("hidden");
    elementCreateQuiz.classList.remove("hidden");
}

function saveSection1() {
    const title = (document.getElementById('title')).value;
    const image = (document.getElementById('imageQuiz')).value;
    qtdP = (document.getElementById('qtdP')).value;
    qtdN = (document.getElementById('qtdN')).value;
    const imageURL = checkURL(image);

    if (title.length < 20 || title.length > 65 || qtdP < 3 || qtdN < 2 || !imageURL) {
        alert('Preenchar os dados corretamente');
        return;
    } else {
        quiz = { title, image };

        const elementSection1 = document.querySelector("#criarQuizzes .section1");
        const elementSection2 = document.querySelector("#criarQuizzes .section2");
        elementSection1.classList.add("hidden");
        elementSection2.classList.remove("hidden");

        displaySection2()
    }
}

function displaySection2() {
    const secao = document.querySelector("#criarQuizzes .section2 .containerQuestions");
    for (let i = 1; i <= qtdP; i++) {
        secao.innerHTML +=
            `<div class="outrasPerguntasNiveis">
            <p class="question${i}">Pergunta ${i}</p>
            <ion-icon name="create-outline" onclick="openQuestion(this)"></ion-icon>
        </div>`
    }
}

function displayQuestions(secao) {
    secao.innerHTML +=
        `<ion-icon name="create-outline" onclick="openQuestion(this)"></ion-icon>
            <input type="text" id="question${conter}" placeholder="Texto da pergunta" />
            <input type="text" id="color${conter}" placeholder="Cor de fundo da pergunta" />
            <p>response correta</p>
            <input type="text" id="answerCorrect${conter}" placeholder="response correta" />
            <input type="text" id="urlCorrect${conter}" placeholder="URL da imagem" />
            <p>responses incorretas</p>
            <input type="text" id="answerWrong1_${conter}" placeholder="response incorreta 1" />
            <input type="text" id="urlWrong1${conter}" placeholder="URL da imagem 1" />
            <br>
            <input type="text" id="answerWrong2_${conter}" placeholder="response incorreta 2" />
            <input type="text" id="urlWrong2${conter}" placeholder="URL da imagem 2" />
            <br>
            <input type="text" id="answerWrong3_${conter}" placeholder="response incorreta 3" />
            <input type="text" id="urlWrong3${conter}" placeholder="URL da imagem 3" />`;
}

function openQuestion(icon) {
    const div = icon.parentNode;
    if (conter === 1) {
        div.classList.remove("outrasPerguntasNiveis");
        div.classList.add('containerInput');
        displayQuestions(div);
    } else {
        let valid = saveSection2();
        if (valid) {
            div.classList.remove("outrasPerguntasNiveis");
            div.classList.add('containerInput');
            displayQuestions(div);
        } else {
            return;
        }
    }
    conter++;
}

function saveSection2() {
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

    if (question.length < 20 || !(color.includes('#')) || !(color.length === 7) || answerCorrect === null || answerWrong1 === null || !valid1 || !valid2) {
        alert('Preenchar os dados corretamente');
    } else {
        questions.push({ title: question, color });
        answer.push({ text: answerCorrect, image: urlCorrect, isCorrectAnswer: true });
        answer.push({ text: answerWrong1, image: urlWrong1, isCorrectAnswer: false });

        if (answerWrong2 !== null && checkURL(urlWrong2)) {
            answer.push({ text: answerWrong2, image: urlWrong2, isCorrectAnswer: false });
            if (answerWrong3 !== null && checkURL(urlWrong3)) {
                answer.push({ text: answerWrong3, image: urlWrong3, isCorrectAnswer: false });
            }
        }

        quiz.questions = questions;
        quiz.questions[i - 1].answers = answer;

        if (`${i}` === qtdP) {
            conter = 1;
            const elementSection2 = document.querySelector("#criarQuizzes .section2");
            const elementSection3 = document.querySelector("#criarQuizzes .section3");
            elementSection2.classList.add("hidden");
            elementSection3.classList.remove("hidden");

            displaySection3();
        } else {
            return true;
        }
    }
}

function displaySection3() {
    const secao = document.querySelector("#criarQuizzes .section3 .containerNiveis");

    for (let i = 1; i <= qtdN; i++) {
        secao.innerHTML +=
            `<div class="outrasPerguntasNiveis">
            <p class="nivel${i}">Nível ${i}</p>
            <ion-icon name="create-outline" onclick="openNivel(this)"></ion-icon>
        </div>`
    }
}

function openNivel(icon) {
    const div = icon.parentNode;
  
    if (conter === 1) {
        div.classList.remove("outrasPerguntasNiveis");
        div.classList.add('containerInput');
        displayNivel(div);
    } else {
        let valid = saveSection3();
        if (valid) {
            div.classList.remove("outrasPerguntasNiveis");
            div.classList.add('containerInput');
            displayNivel(div);
        } else {
            return;
        }
    }
    conter++;
}

function displayNivel(secao) {
    secao.innerHTML +=
        `<input type="text" id="titleNivel${conter}" placeholder="Título do nível" />
    <input type="text" id="hit${conter}" placeholder="% de acerto mínima" />
    <input type="text" id="imageNivel${conter}" placeholder="URL da imagem do nível" />
    <input type="text" id="description${conter}" placeholder="Descrição do nível" />`
}

// não mexi nessa função mas será necessário por o sendquizz() aqui, fiquei receosa de por no local errado
// testei usando console.log essa function e acredito que está dando erro por isso não consegui testar o post mas espero estar certo, amanhã acordo cedo para vermos isso

function saveSection3() {
    let i = conter - 1;
    const title = (document.getElementById(`${'titleNivel' + i}`)).value;
    const minValue = (document.getElementById(`${'hit' + i}`)).value;
    const image = (document.getElementById(`${'imageNivel' + i}`)).value;
    const text = (document.getElementById(`${'description' + i}`)).value;

    const valid = checkURL(image);

    if (!valid || title.length < 10 || minValue > 100 || minValue < 0 || text.length < 30) {
        alert('Preenchar os dados corretamente');
    } else {
        niveis.push({ title, image, text, minValue });

        quiz.levels = niveis;

        if (`${i}` === qtdN) {
            conter = 1;
            const elementSection3 = document.querySelector("#criarQuizzes .section3");
            const elementSection4 = document.querySelector("#criarQuizzes .section4");
            elementSection3.classList.add("hidden");
            elementSection4.classList.remove("hidden");

            sendQuizz();
        } else {
            return true;
        }
    }

}

function sendQuizz() {

    const quizzToServer = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quiz);
    quizzToServer.then(successQuizz);
    quizzToServer.catch(function(erro){
        console.log(erro);
    })
}

function checkURL(url) {
    if (url.includes('.jpeg')) {
        return true;
    } else if (url.includes('.jpg')) {
        return true;
    } else if (url.includes('gif')) {
        return true;
    } else if (url.includes('png')) {
        return true
    } else {
        return false;
    }
}

//Essa função vai começar fazendo o localStorage que armazena os ids do site, depois ela puxa o servidor com esse id para abrir a pagina de "sucesso" com a imagem e titulo do teste, mantive a pagina que você criou mesmo


//criação do quizz parte Carol
function successQuizz(response) {
    // const elementCreateQuiz = document.querySelector("#criarQuizzes .section4");
    // const elementSuccess = document.querySelector(".screenSuccess");
    // elementSuccess.classList.remove("hidden");
    // elementCreateQuiz.classList.add("hidden");
    let id = response.data.id;
    idUsersQuizzes.push(id);
    const idString = localStorage.getItem("id");
    if (idString === null) {
        id = JSON.stringify(idUsersQuizzes);
        localStorage.setItem("id", id)
    } else {
        idUsersQuizzes = JSON.parse(idString)
        idUsersQuizzes.push(id);
        let idSerial = JSON.stringify(idUsersQuizzes);
        localStorage.setItem("id", idSerial);
    }
    ids = response.data.id;

    let quizzCreated = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/' + response.data.id);
    const endCreation = document.querySelector("#criarQuizzes .section4");

    quizzCreated.then(function (quizzCreated){
        endCreation.innerHTML = 
        `<div class="titulo">
        <p>Seu quizz está pronto!</p>
        </div>
        <div class="quizPronto">
            <div class="quiz">
                <div class="degrade">
                </div>
                <img src= ${quizzCreated.data.image}/>
                <div class="tittleQuiz">
                    <h3>${quizzCreated.data.title}</h3>
                </div>
            </div>
        </div>
        <div class="button">
            <button onclick="openMyQuizz(${quizzCreated.data.id})">
                Acessar Quizz
            </button>
        </div>
        <div class="buttonHome" onclick="reload()">
            <button>
                Voltar pra home
            </button>
        </div>`
    })

    quizzCreated.catch(function(erro){
        console.log(erro);
    })

}

//ativada ao clicar no botão "acessar quizz" da pagina 3 após ele ser criado

function openMyQuizz(ids) {
    searchQuizz(ids);
}

//reinicia e atualiza o servidor para voltar com a pagina 1 ja com o quiz recem feito

function reload() {
    const elementCreateQuiz = document.querySelector("#criarQuizzes .section4");
    const elementTelaInicio = document.getElementById("telaInicio");
    elementCreateQuiz.classList.add("hidden");
    elementTelaInicio.classList.remove("hidden");

    setTimeout(function(){
        document.location.reload(true);
    }, 1000);
}

console.log(idUsersQuizzes)