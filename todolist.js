/* This code is written by Adeladan OluwaSeun Francis to create an advanced javascript todo list
Project inspired by Web dev simplified roadmap project */
/* Declaration of html elements goes here */
const headingListElement = document.getElementById("listSectionList");
const headingListButton = document.getElementById("addList");
const headingListInput = document.getElementById("listInput");
const taskListElement = document.getElementById("taskEntry");
const taskListButton = document.getElementById("addTask");
const taskListInput = document.getElementById("taskInput");
const taskName = document.getElementById("taskName");
const remainingItems = document.getElementById("remainingItems");
const deleteSelection = document.getElementById("deleteSelection");
const completedTaskClear = document.getElementById("completed-task-clear");

/* Declaration of other javascript variable goes here */
const LOCAL_STORAGE_KEY = "todo.task";
let selectedEntry;
let headingList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

/* Functions declaration goes here */
function render() {
  headingListElement.innerHTML = null;
  headingList.forEach((list) => {
    const newTaskElement = document.createElement("li");
    newTaskElement.classList.add("listSectionListItem");

    newTaskElement.dataset.id = list.id;
    if (
      selectedEntry &&
      newTaskElement.dataset.id === selectedEntry.dataset.id
    ) {
      newTaskElement.classList.add("selected");
    }
    newTaskElement.innerText = list.name;
    headingListElement.appendChild(newTaskElement);
  });
}
function save() {
  //saves headingList to local storage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(headingList));
}
function saveAndRender() {
  save();
  render();
}
function loadSubTask(i) {
  let taskHeading = headingList.find((item) => item.id === i.dataset.id);
  taskListElement.innerHTML = null;
  if (taskHeading) {
    let task = taskHeading.task;
    task.forEach((item) => {
      let newTask = document.createElement("li");
      newTask.classList.add("subListItem");
      newTask.innerText = item.name;
      if (item.completedTask === "true") {
        newTask.classList.add("strikeItem");
      } else {
        newTask.classList.remove("strikeItem");
      }
      /* newTask.dataset.completed = "false"; */
      taskListElement.appendChild(newTask);
    });
  } else {
    //populate nothing
  }
  let itemsRemainingArray = taskHeading.task.filter(
    (item) => item.completedTask === "false"
  );
  remainingItems.innerText =
    itemsRemainingArray.length < 2
      ? `${itemsRemainingArray.length} item remaining`
      : `${itemsRemainingArray.length} items remaining`;
  taskName.innerText = selectedEntry.innerText.toUpperCase();
}

/* Event listeners goes here */
headingListElement.addEventListener("click", (e) => {
  const item = headingListElement.childNodes;
  item.forEach((i) => {
    if (i == e.target) {
      selectedEntry = i;
      i.classList.add("selected");
      //show task here
    } else {
      i.classList.remove("selected");
    }
  });
  loadSubTask(selectedEntry);
});
headingListButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!headingListInput.value) return; // to prevent empty item from being passed into the element
  headingList.push({
    id: new Date().toString(),
    name: headingListInput.value,
    task: [],
    /* selected: false, */ //Didn't use this in logic implementation but should have
  });
  headingListInput.value = null;
  saveAndRender();
});
taskListButton.addEventListener("click", (e) => {
  e.preventDefault();
  let entry = headingList.find((item) => item.id === selectedEntry.dataset.id);
  if (!taskListInput.value) return; //to make sure empty list is not passed in
  entry.task.push({
    id: new Date().toString(),
    name: taskListInput.value,
    completedTask: "false",
  });
  taskListInput.value = null;
  loadSubTask(selectedEntry);
  save();
});
taskListElement.addEventListener("click", (e) => {
  let taskEntry = headingList.find(
    (item) => item.id === selectedEntry.dataset.id
  );
  let selectedTaskEntry = taskEntry.task.find(
    (item) => item.name.toLowerCase() === e.target.innerText.toLowerCase()
  );
  selectedTaskEntry.completedTask =
    selectedTaskEntry.completedTask === "true" ? "false" : "true";
  loadSubTask(selectedEntry); //reloads subtask to make sure line-through attribute is implemented
  save();
});
deleteSelection.addEventListener("click", (e) => {
  headingList = headingList.filter(
    (item) => item.id !== selectedEntry.dataset.id
  );
  taskListElement.innerHTML = null;
  taskName.innerText = "No Entry Selected";
  remainingItems.innerText = "0 items remaining"
  saveAndRender();
});
completedTaskClear.addEventListener("click", (e) => {
  let entry = headingList.find((item) => item.id === selectedEntry.dataset.id);
  entry.task = entry.task.filter((item) => item.completedTask === "false"); //only task to live on remain
  save();
  loadSubTask(selectedEntry);
});
/* Initialize the main entry */
render();
