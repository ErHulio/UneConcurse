const form_layout = document.getElementById('layout');
const submit_button = document.getElementById('submit');
const deselect_options = document.getElementById('deselect');
const next_question = document.getElementById('next');

const question = document.getElementById('question_placeholder');
const choices = document.querySelectorAll('.answer_placeholder label');

var i = 0;
var questions_list;
var current_question

/**
 * Revieves a question with a special format and adapts it to a more confortable one
 * so it is easier to work with. The question with the new format is returned.
 * @param {JSON} recieved_question JSON recieved from the endpoint
 * where the questions are located
 * @returns {JSON} question formatted like the following example:
 * {
 *      'question': 'qwerty?',
 *      'a': 'choice 1',
 *      'b': 'choice 2',
 *      'c': 'choice 3',
 *      'd': 'choice 4',
 *      'answer': 'A'
 * }
 */
function adaptQuestionFormat(recieved_question) {
    recieved_question['incorrect_answers'].push(recieved_question['correct_answer']);
    recieved_question['incorrect_answers'].sort(() => (Math.random() > 0.5) ? 1 : -1);
    var answer;
    switch(recieved_question['incorrect_answers'].indexOf(recieved_question['correct_answer'])) {
        case 0:
            answer = 'A';
            break;
        case 1:
            answer = 'B';
            break;
        case 2:
            answer = 'C';
            break;
        case 3:
            answer = 'D';
            break;
    }

    var adapted_question = {
        'question': recieved_question['question'],
        'a': recieved_question['incorrect_answers'][0],
        'b': recieved_question['incorrect_answers'][1],
        'c': recieved_question['incorrect_answers'][2],
        'd': recieved_question['incorrect_answers'][3],
        'answer': answer
    };

    return adapted_question;
}

/**
 * Handler made for 'submit' Events. It disables the sending of the formulary and
 * verifies if the selected answer is the correct one.
 * 
 * If there are not selected answers, it does nothing.
 * @param {Event} event 
 */
function submitForm(event) {
    event.preventDefault();

    var choices = document.querySelectorAll('input[name="answer"]');
    var option_checked = document.querySelector('input[name="answer"]:checked') != null ? true : false;

    if(choices != null) {
        for(var choice of choices) {
            if(choice.checked) {
                next_question.disabled = false;
                submit_button.disabled = true;
                document.getElementById('notifications').textContent = choice.value + ' has been chosen';
                if(choice.value == current_question.answer) {
                    document.getElementById('notifications').textContent += '\nAnd it is the right answer';
                    choice.classList.toggle('wright_choice');
                }
                else {
                    document.getElementById('notifications').textContent += '\nAnd it is the wrong answer';
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
        document.getElementById('notifications').textContent = 'No option has been chosen';
    }
}

/**
 * Event handler made for resetting the layout. It restores the initial state of the layout.
 */
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

/**
 * Event handler made for updating the layout with a new question. It iterates to the
 * next question and displays it in the layout.
 */
function nextQuestion() {
    if(i == questions_list.length - 1) {
        i = -1;
    }
    current_question = questions_list[++i];
    
    question.innerHTML = `Q${i+1}: ${current_question.question}`;

    choices[0].innerHTML = `A: ${current_question.a}`;
    choices[1].innerHTML = `B: ${current_question.b}`;
    choices[2].innerHTML = `C: ${current_question.c}`;
    choices[3].innerHTML = `D: ${current_question.d}`;

    resetToDefault();
}

/* ### Main ###*/
/*
 * Adding the event handlers to thei respective actions.
 */
form_layout.addEventListener('submit', submitForm);
deselect_options.addEventListener('click', resetToDefault);
next_question.addEventListener('click', nextQuestion);

/*
 * Retrieves a list of questions, adapts the given format to a more suitable
 * one and updates the layout.
 */
fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then(response => {
            return response.ok ? response.json() : null
        }
    )
    .then(
        body => {
            if(body != null) {
                questions_list = body['results'].map(adaptQuestionFormat);
                current_question = questions_list[i];

                question.innerHTML = `Q${i+1}: ${current_question.question}`;

                choices[0].innerHTML = `A: ${current_question.a}`;
                choices[1].innerHTML = `B: ${current_question.b}`;
                choices[2].innerHTML = `C: ${current_question.c}`;
                choices[3].innerHTML = `D: ${current_question.d}`;
            }
        }
    )
    .catch((e) => console.error(`Connection error: ${e.message}`));
