var importanceArray = ['none', 'low', 'normal', 'high' ,'critical'];

loadAllCards();

$('.title-input').focus();
$('.title-input').on('keydown', function(event) {
  if ($('.title-input').val() !== '' && $('.body-input').val() !== '') {
    $('.save-btn').attr('disabled', false);
  }
});

$('.body-input').on('keydown', function(event) {
  if ($('.title-input').val() !== '' && $('.body-input').val() !== '') {
    $('.save-btn').attr('disabled', false);
  }
});

$('.save-btn').attr('disabled', true)
$('.save-btn').on('click',function() {
  event.preventDefault();
  var task = new Task($('.title-input').val(), $('.body-input').val()) 
  createCard(task);
  storeCard(task);
  clearInputs();
  $('.save-btn').attr('disabled', true);
});

$('.search-input').on('keyup', filterTasks);

$('.card-area').on('click', verifyClick);
$('.card-area').on('keyup', editCard);
$('.card-area').on('keydown', function(event) {
  if (event.keyCode === 13) {
    event.target.blur();
  }
});

function createCard(task) {
  var newCard = `<article id="${task.key}" class="card-container">
                  <h2 class="title-of-card" contenteditable="true">${task.title}</h2>
                  <button class="delete-button"></button>
                  <p class="body-of-card" contenteditable="true">${task.body}</p>
                  <div class="buttons-and-quality-rating">
                  <button class="upvote"></button>
                  <button class="downvote"></button>
                  <p class="quality">importance: 
                  <span class="qualityVariable">${importanceArray[task.quality]}</span>
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
  var taskArray = getTaskArray();
  taskArray.forEach(function(task) {
    createCard(task);
  })
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
  $($(event.target).siblings('p.quality').children()[0]).text(importanceArray[retrieveTask.quality]);
};

function downvote(event) {
  var retrieveTask = getTask(event);
  if (event.target.className !== 'downvote' || retrieveTask.quality === 0) {
      return;
  } else {
      retrieveTask.quality--
  }
  storeCard(retrieveTask);
  $($(event.target).siblings('p.quality').children()[0]).text(importanceArray[retrieveTask.quality]);
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

function filterTasks() {
  var taskArray = getTaskArray();
  var filteredArray = taskArray.filter(function(task) {
    return (task.title.includes($('.search-input').val()) || (task.body.includes($('.search-input').val())));
  });
  $('.card-container').remove();
  filteredArray.forEach(function(task) {
    createCard(task);
  });
}

function getTaskArray() {
  var keyArray = Object.keys(localStorage);
  var taskArray = keyArray.map(function(key) {
    return JSON.parse(localStorage.getItem(key));
  })
  return taskArray;
}