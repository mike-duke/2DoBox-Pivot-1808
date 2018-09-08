
var numCards = 0;
var taskArray = ['none', 'low', 'normal', 'high' ,'critical'];

$('.save-btn').on('click',function() {
    var task = new Task($('#title-input').val(), $('#body-input').val()) 
    createCard(task);
});

$('.card-area').on('click', function(event) {
    deleteCard(event);
    upvote(event);
    downvote(event);
});

function createCard(task) {
    var newCard = `<article id="${task.key}" class="card-container">
                    <h2 class="title-of-card" contenteditable="true">${task.title}</h2>
                    <button class="delete-button"></button>
                    <p class="body-of-card" contenteditable="true">${task.body}</p>
                    <button class="upvote"></button>
                    <button class="downvote"></button>
                    <p class="quality">quality: 
                    <span class="qualityVariable">${taskArray[task.quality]}</span>
                    </p>
                    <hr>
                    </article>`;
    $('.card-area').prepend(newCard);
    localStoreCard(task);
};

function Task(title, body) {
    this.title = title,
    this.body = body,
    this.quality = 0;
    this.key = Date.now();
};

var keyArray = Object.keys(localStorage);
console.log(keyArray)

keyArray.forEach(function(key) {
    var cardData = JSON.parse(localStorage.getItem(key));
    numCards++;
    createCard(cardData);
});

function localStoreCard(task) {
    var cardString = JSON.stringify(task);
    localStorage.setItem(task.key, cardString);
};

function getTask(event) {
    var cardHTML = $(event.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].id;
    var retrieveTask = JSON.parse(localStorage.getItem(cardHTMLId));
    return retrieveTask;
};

// $(".card-area").on('click', function(event){
//     var currentQuality = $($(event.target).siblings('p.quality').children()[0]).text().trim();
//     var qualityVariable;

//     if (event.target.className === "upvote" || event.target.className === "downvote"){

//         if (event.target.className === "upvote" && currentQuality === "plausible"){
//             qualityVariable = "genius";
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);
               
//         } else if (event.target.className === "upvote" && currentQuality === "swill") {
//             qualityVariable = "plausible";
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);
               
//         } else if (event.target.className === "downvote" && currentQuality === "plausible") {
//             qualityVariable = "swill"
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "genius") {
//             qualityVariable = "plausible"
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "swill") {
//             qualityVariable = "swill";
        
//         } else if (event.target.className === "upvote" && currentQuality === "genius") {
//             qualityVariable = "genius";
//         }

//     var cardHTML = $(event.target).closest('.card-container');
//     var cardHTMLId = cardHTML[0].id;
//     var cardObjectInJSON = localStorage.getItem(cardHTMLId);
//     var cardObjectInJS = JSON.parse(cardObjectInJSON);

//     cardObjectInJS.quality = qualityVariable;

//     var newCardJSON = JSON.stringify(cardObjectInJS);
//     localStorage.setItem(cardHTMLId, newCardJSON);
//     }
   
// });

      
function deleteCard(event) {
if (event.target.className === "delete-button") {
    var cardHTML = $(event.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].id;
    localStorage.removeItem(cardHTMLId);
    cardHTML.remove();
    } 
};


function upvote(event) {
    var retrieveTask = getTask(event);
    if (event.target.className !== 'upvote') {
        return;
    } else if (retrieveTask.quality === 4) {
        return;
    } else {
        retrieveTask.quality++
    }
    localStoreCard(retrieveTask);
    $($(event.target).siblings('p.quality').children()[0]).text(taskArray[retrieveTask.quality]);
};

function downvote(event) {
    var retrieveTask = getTask(event);
    if (event.target.className !== 'downvote') {
        return;
    } else if (retrieveTask.quality === 0) {
        return;
    } else {
        retrieveTask.quality--
    }
    localStoreCard(retrieveTask);
    $($(event.target).siblings('p.quality').children()[0]).text(taskArray[retrieveTask.quality]);
};











