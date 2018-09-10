var taskArray = ['none', 'low', 'normal', 'high' ,'critical'];

loadAllCards();

$('.title-input').focus();

$('.save-btn').on('click',function() {
  event.preventDefault();
  var task = new Task($('.title-input').val(), $('.body-input').val()) 
  createCard(task);
  storeCard(task);
  clearInputs();
});

$('.card-area').on('click', verifyClick);

$('.card-area').on('keydown', function(event) {
  if (event.keyCode === 13) {
    event.target.blur();
  }
})

$('.card-area').on('keyup', editCard);

$('.search-input').on('keyup', filterTasks);

function createCard(task) {
  var newCard = `<article id="${task.key}" class="card-container">
                  <h2 class="title-of-card" contenteditable="true">${task.title}</h2>
                  <button class="delete-button"></button>
                  <p class="body-of-card" contenteditable="true">${task.body}</p>
                  <div class="buttons-and-quality-rating">
                  <button class="upvote"></button>
                  <button class="downvote"></button>
                  <p class="quality">importance: 
                  <span class="qualityVariable">${taskArray[task.quality]}</span>
                  </p>
                  </div>
                  <hr>
                  </article>`;
  $('.card-area').prepend(newCard);
};

function Task(title, body) {
  this.title = title,
  this.body = body,
  this.quality = 0;
  this.key = Date.now();
};

function loadAllCards() {
var keyArray = Object.keys(localStorage);
keyArray.forEach(function(key) {
  var cardData = JSON.parse(localStorage.getItem(key));
  createCard(cardData);
  });
}

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('.title-input').focus();
}

function verifyClick(event) {
  var cardClasses = ['delete-button', 'upvote', 'downvote'];
  for (i = 0; i < cardClasses.length; i++) {
    if (event.target.className === cardClasses[i]) {
      deleteCard(event);
      upvote(event);
      downvote(event);
    }
  }
}

function storeCard(task) {
  var cardString = JSON.stringify(task);
  localStorage.setItem(task.key, cardString);
};


function getTask(event) {
  var cardHTML = $(event.target).closest('.card-container');
  var cardHTMLId = cardHTML[0].id;
  var retrieveTask = JSON.parse(localStorage.getItem(cardHTMLId));
  return retrieveTask;
};

function deleteCard(event) {
if (event.target.className === 'delete-button') {
  var cardHTML = $(event.target).closest('.card-container');
  var cardHTMLId = cardHTML[0].id;
  localStorage.removeItem(cardHTMLId);
  cardHTML.remove();
  } 
};

function upvote(event) {
  var retrieveTask = getTask(event);
  if (event.target.className !== 'upvote' || retrieveTask.quality === 4) {
      return;
  } else {
      retrieveTask.quality++
  }
  storeCard(retrieveTask);
  $($(event.target).siblings('p.quality').children()[0]).text(taskArray[retrieveTask.quality]);
};

function downvote(event) {
  var retrieveTask = getTask(event);
  if (event.target.className !== 'downvote' || retrieveTask.quality === 0) {
      return;
  } else {
      retrieveTask.quality--
  }
  storeCard(retrieveTask);
  $($(event.target).siblings('p.quality').children()[0]).text(taskArray[retrieveTask.quality]);
};

function editCard (event) {
  var retrieveTask = getTask(event);
  var elementToChange;
  if (event.target.className === 'title-of-card') {
      elementToChange = 'title';
  } else if (event.target.className === 'body-of-card') {
      elementToChange = 'body';
  }
  retrieveTask[elementToChange] = $(event.target).text();
  storeCard(retrieveTask);
};

function filterTasks(event) {
  $('.card-container').map(function() {
    var trueTitle = $(this).children('.title-of-card').text().includes($('.search-input').val());
    var trueBody = $(this).children('.body-of-card').text().includes($('.search-input').val()); 
    $(this).toggle(trueTitle || trueBody);
  })
}