let form_layout = document.getElementById('layout');
let submit_button = document.getElementById('submit');
let deselect_options = document.getElementById('deselect');
let next_question = document.getElementById('next');

let questions_list = new Array(
    {
        'question': 'Q1: qwerty?',
        'a': 'A choice',
        'b': 'B choice',
        'c': 'C choice',
        'd': 'D choice',
        'answer': 'B'
    },
    {
        'question': 'Q2: ñañañañaña?',
        'a': 'choice 1',
        'b': 'choice 2',
        'c': 'choice 3',
        'd': 'choice 4',
        'answer': 'C'
    }
);

var i = 0;
var current_question = questions_list[i];

let question = document.getElementById('question_placeholder');
question.innerText = current_question.question;

let choices = document.querySelectorAll('.answer_placeholder label')
choices[0].innerText = current_question.a;
choices[1].innerText = current_question.b;
choices[2].innerText = current_question.c;
choices[3].innerText = current_question.d;

function submitForm(event) {
    event.preventDefault();

    var choices = document.querySelectorAll('input[name="answer"]');
    let option_checked = document.querySelector('input[name="answer"]:checked') != null ? true : false;

    if(choices != null) {
        for(var choice of choices) {
            if(choice.checked) {
                next_question.disabled = false;
                submit_button.disabled = true;
                document.getElementById('notifications').innerText = choice.value + ' has been chosen';
                if(choice.value == current_question.answer) {
                    document.getElementById('notifications').innerText += '\nAnd it is the right answer';
                    choice.classList.toggle('wright_choice');
                }
                else {
                    document.getElementById('notifications').innerText += '\nAnd it is the wrong answer';
                    choice.classList.toggle('wrong_choice');
                    document.querySelector(`input[value="${current_question.answer}"]`).classList.toggle('wright_choice');
                }
            }
            if(option_checked) {
                choice.disabled = true;
            }
        }
    }
    else {
        document.getElementById('notifications').innerText = 'No option has been chosen';
    }
}

function resetToDefault() {
    var choices = document.querySelectorAll('input[name="answer"]');

    if(choices != null) {
        for(var choice of choices) {
            if(choice.checked) {
                choice.checked = false;
            }
            if(choice.className == 'wright_choice') {
                choice.classList.toggle('wright_choice');
            }
            else if(choice.className == 'wrong_choice') {
                choice.classList.toggle('wrong_choice');
            }
            choice.disabled = false;
        }
    }

    next_question.disabled = true;
    submit_button.disabled = false;
}

function nextQuestion() {
    if(i == questions_list.length - 1) {
        i = -1;
    }
    current_question = questions_list[++i];
    
    question.innerText = current_question.question;

    choices[0].innerText = current_question.a;
    choices[1].innerText = current_question.b;
    choices[2].innerText = current_question.c;
    choices[3].innerText = current_question.d;

    resetToDefault();
}

form_layout.addEventListener('submit', submitForm);
deselect_options.addEventListener('click', resetToDefault);
next_question.addEventListener('click', nextQuestion);
