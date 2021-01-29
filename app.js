let firebaseConfig = {
  apiKey: "AIzaSyD-m1FUQyNj0-DcSFwogwkoJ9kh3S0YCJM",
  authDomain: "todo-e3f1e.firebaseapp.com",
  databaseURL: "https://todo-e3f1e-default-rtdb.firebaseio.com",
  projectId: "todo-e3f1e",
  storageBucket: "todo-e3f1e.appspot.com",
  messagingSenderId: "465087191347",
  appId: "1:465087191347:web:1e64f5b0ed508428ca0646",
  measurementId: "G-C2HZFVNEK0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.collection('tasks').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    setTask(doc.data().name, doc.id);
  })
})



let numOfTasks = 0
let reallyClear = false;
loadEvents();




// load every event in the page
function loadEvents() {
  document.querySelector('form').addEventListener('submit', submit);
  document.getElementById('clear').addEventListener('click', clearList);
  document.querySelector('ul').addEventListener('click', deleteOrTick);
}
// subit data function
function submit(e) {
  e.preventDefault();
  let input = document.querySelector('input');
  if (input.value != '')
    addTask(input.value);
  input.value = '';
}

// add tasks
function setTask(task, id) {
  if (numOfTasks == 9) return
  let ul = document.querySelector('ul');
  let li = document.createElement('li');

  li.setAttribute('data-id', id);
  console.log(id)
  li.innerHTML = `<label class="labels">${task}</label><span class="delete">x</span>`;
  ul.appendChild(li);
  document.querySelector('.tasksBoard').style.display = 'block';
  numOfTasks++;
  const clear = document.getElementById('clear');
  clear.style.color = "#b45252"
  reallyClear = false;

}


// add tasks
function addTask(task) {

  if (numOfTasks == 9) return
  let ul = document.querySelector('ul');
  let li = document.createElement('li');


  li.innerHTML = `<label class="labels">${task}</label><span class="delete">x</span>`;
  ul.appendChild(li);
  document.querySelector('.tasksBoard').style.display = 'block';
  numOfTasks++;
  const clear = document.getElementById('clear');
  clear.style.color = "#b45252"
  reallyClear = false;
  db.collection('tasks').add({
    name: task
  }).then(element => {
    li.setAttribute('data-id', element.if.path.segments[1])
  })
}




// clear the LIST
function clearList() {
  if (reallyClear) {
    let ul = document.querySelector('ul');
    ul.innerHTML = '';
    document.querySelector('.tasksBoard').style.display = 'none';
    numOfTasks = 0;
    reallyClear = false;
    const clear = document.getElementById('clear');
    clear.style.color = "#b45252";
    db.collection('tasks').get().then(element => {
      element.forEach(doc => {
        db.collection('tasks').doc(doc.if.path.segments[6]).delete();
      });
    })
  } else {
    reallyClear = true;
    const clear = document.getElementById('clear');
    clear.style.color = "#ff0000";
  }
}

// deleteTick
function deleteOrTick(e) {
  if (e.target.className == 'delete') {
    deleteTask(e);
    numOfTasks--;
  }
  if (numOfTasks == 0) {
    let ul = document.querySelector('ul');
    ul.innerHTML = '';
    document.querySelector('.tasksBoard').style.display = 'none';
    numOfTasks = 0;
  }

  const clear = document.getElementById('clear');
  clear.style.color = "#b45252"
  reallyClear = false;
}

// delete task
function deleteTask(e) {
  let remove = e.target.parentNode;
  let parentNode = remove.parentNode;
  parentNode.removeChild(remove);
  let id = e.target.parentElement.getAttribute('data-id');
  db.collection('tasks').doc(id).delete();
}



