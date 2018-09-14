var importanceArray = ['none', 'low', 'normal', 'high',   'critical'];

loadAllCards();

$('.title-input').focus();
$('.title-input').on('keydown', function() {
  if ($('.title-input').val() !== '' && $('.body-input').val() !== '') {
    $('.save-btn').attr('disabled', false);
  }
});

$('.body-input').on('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('.save-btn').click();
  }

  if ($('.title-input').val() !== '' && $('.body-input').val() !== '') {
    $('.save-btn').attr('disabled', false);
  }
});

$('.save-btn').attr('disabled', true)
$('.save-btn').on('click',function() {
  event.preventDefault();
  var task = new Task($('.title-input').val(), $('.body-input').val());

  createCard(task);
  storeCard(task);
  clearInputs();
  $('.save-btn').attr('disabled', true);
});

$('.search-input').on('keyup', filterTasks);

$('.completed-tasks-btn').on('click', toggleCompletedTasks);

$('.card-area').on('click', verifyClick);
$('.card-area').on('keyup', editCard);
$('.card-area').on('keydown', function(event) {
  if (event.keyCode === 13) {
    event.target.blur();
  }
});

function createCard(task) {
  // var completeValue;

  // if (task.complete === true) {
  //   completeValue = 'complete';
  // } else {
  //   completeValue = '';
  // }

  var newCard = `<article data-id="${task.id}" data-complete="${task.complete}" class="card-container">
                  <h2 class="title-of-card" contenteditable="true">${task.title}</h2>
                  <button class="delete-button"></button>
                  <p class="body-of-card" contenteditable="true">${task.body}</p>
                  <div class="buttons-and-importance-rating">
                  <button class="upvote"></button>
                  <button class="downvote"></button>
                  <p class="importance">importance: 
                  <span class="importance-value">${importanceArray[task.importance]}</span>
                  </p>
                  </div>
                  <div class="complete-button-style"
                  <button class="complete-button">complete</button>
                  </div>
                  <hr>
                  </article>`;

  $('.card-area').prepend(newCard);
}

function Task(title, body) {
  this.title = title,
  this.body = body,
  this.importance = 0;
  this.id = Date.now();
  this.complete = false;
}

function loadAllCards() {
  var taskArray = getTaskArray();
  var incompleteTaskArray = taskArray.filter(function(task) {
    return task.complete === false;
  });

  incompleteTaskArray.forEach(function(task) {
    createCard(task);
  })
}

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('.title-input').focus();
}

function verifyClick(event) {
  var cardClasses = ['delete-button', 'upvote', 'downvote', 'complete-button', 'complete-button-style'];

  for (var i = 0; i < cardClasses.length; i++) {
    if (event.target.className === cardClasses[i]) {
      deleteCard(event);
      upvote(event);
      downvote(event);
      completeTask(event);
    }
  }
}

function storeCard(task) {
  var cardString = JSON.stringify(task);
  
  localStorage.setItem(task.id, cardString);
}

function getTask(event) {
  var card = event.target.parentNode
  var cardId = card.dataset.id
  var retrievedTask = JSON.parse(localStorage.getItem(cardId));
  
  return retrievedTask;
}

function getTaskArray() {
  var keyArray = Object.keys(localStorage);
  var taskArray = [];
  
  keyArray.forEach(function(key) {
    taskArray.push(JSON.parse(localStorage.getItem(key)));
  });
  return taskArray;
}

function deleteCard(event) {
  if (event.target.className === 'delete-button') {
    var cardHTML = $(event.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].id;
    
    localStorage.removeItem(cardHTMLId);
    cardHTML.remove();
  } 
}

function upvote(event) {
  var retrievedTask = getTask(event);
  
  if (event.target.className !== 'upvote' || retrievedTask.importance === 4) {
    return;
  } else {
    retrievedTask.importance++
  }
  storeCard(retrievedTask);
  $($(event.target).siblings('p.importance').children()[0]).text(importanceArray[retrievedTask.importance]);
}

function downvote(event) {
  var retrievedTask = getTask(event);
  
  if (event.target.className !== 'downvote' || retrievedTask.importance === 0) {
    return;
  } else {
    retrievedTask.importance--
  }
  storeCard(retrievedTask);
  $($(event.target).siblings('p.importance').children()[0]).text(importanceArray[retrievedTask.importance]);
}

function editCard (event) {
  var retrievedTask = getTask(event);
  var elementToChange;
  
  if (event.target.className === 'title-of-card') {
    elementToChange = 'title';
  } else if (event.target.className === 'body-of-card') {
    elementToChange = 'body';
  }
  retrievedTask[elementToChange] = $(event.target).text();
  storeCard(retrievedTask);
}

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

function completeTask(event) {
  // debugger
  if (event.target.className === 'complete-button' || event.target.className === 'complete-button-style') {
    var retrievedTask = getTask(event);

    retrievedTask.complete = !retrievedTask.complete;
    storeCard(retrievedTask); 
    // $(event.target).parent().toggleClass('complete');
    $('.card-container').remove();
    showCompletedTasks();
  }
}

function showCompletedTasks() {
  var allTasksArray = getTaskArray();

  $('.card-container').remove();
  allTasksArray.forEach(function(task) {
    createCard(task)
  })
}

function toggleCompletedTasks(event) {
  if (event.target.className === 'completed-tasks-btn clicked') {
    $('.card-container').remove();
    loadAllCards();
  } else {
    showCompletedTasks();
  }
  $(event.target).toggleClass('clicked')
}