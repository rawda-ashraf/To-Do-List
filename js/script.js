let tasks = [];

// --------------------------- Save to LocalStorage ---------------------------

function saveToLocalStorage() {
  localStorage.setItem("to-do-tasks", JSON.stringify(tasks));
}

// -------------------------- Load from LocalStorage ------------------------------------------------------

function loadFromLocalStorage() {
  const stored = localStorage.getItem("to-do-tasks");

  if (stored) {
    tasks = JSON.parse(stored);
  } else {
    tasks = [];
  }
}

// --------------------------- Variable ------------------------------------------------------

let taskInput = document.querySelector("#task-input");
let addBtn = document.querySelector("#addBtn");
let divContainer = document.querySelector(".content-sec");

let totalTasks = document.querySelector("#stat-total");
let doneTasks = document.querySelector("#stat-done");
let leftTasks = document.querySelector("#stat-left");

let allBtn = document.querySelector("#all-btn");
let starredBtn = document.querySelector("#starred-btn");
let completedBtn = document.querySelector("#completed-btn");
let leftBtn = document.querySelector("#left-btn");

const clearBtn = document.querySelector(".clear-btn");

// ------------------------------------------------------------------------------------------------------------

let currentFilter = "all";

window.onload = function () {
  loadFromLocalStorage();
  renderTasks();
  taskInput.focus();
};

// ---------------------------  Add new task  ------------------------------------------------------

addBtn.onclick = function () {
  if (taskInput.value.trim() === "") {
    alert("Input cannot be empty");
    taskInput.focus();
  } else {
    const newId = Date.now();

    const newTask = {
      id: newId,
      text: taskInput.value.trim(),
      completed: false,
      starred: false,
    };

    tasks.push(newTask);

    saveToLocalStorage();

    taskInput.value = "";

    renderTasks();
  }
};

// --------------------------- Render Tasks ------------------------------------------------------

function renderTasks() {
  divContainer.innerHTML = "";

  // ------------------------- Filter ------------------------------------------------------

  let filteredTasks = tasks;

  if (currentFilter === "starred") {
    filteredTasks = tasks.filter((t) => t.starred);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (currentFilter === "left") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  if (filteredTasks.length === 0) {
    document.querySelector("#empty-msg").style.display = "block";
  } else {
    document.querySelector("#empty-msg").style.display = "none";
  }

  // ------------------------- Render Filtered Tasks ------------------------------------------------------

  filteredTasks.forEach((t) => {
    divContainer.innerHTML += `
      <div class="col-12 content-task py-3 rounded-4" data-id="${t.id}">
        <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div class="text-div d-flex align-items-center flex-wrap">
            <button class="btn star-btn me-2">
              <i class="fa-regular fa-star ${t.starred ? "text-warning" : "text-light"} fs-4"></i>
            </button>
            
            <h5 class="pt-3 flex-wrap task-c-text ${t.completed ? "text-decoration-line-through text-secondary" : ""}">
              ${t.text}
            </h5>
          </div>
          
          <div class="d-flex flex-wrap gap-3 align-items-center">
            <button class="btn check-div"><i class="fa-solid fa-circle-check text-success fs-4"></i></button>
            <button class="btn trash-div"><i class="fa-solid fa-trash text-danger fs-5"></i></button>
          </div>
        </div>
      </div>
    `;
  });

  updateStatistics();

  // -------- Clear Completed Button

  const clearBtn = document.querySelector(".clear-sec");

  const completedTasksExist = tasks.some((t) => t.completed);

  if (completedTasksExist) {
    clearBtn.style.display = "block";
  } else {
    clearBtn.style.display = "none";
  }
}

// --------------------------- Statistics ------------------------------------------------------

function updateStatistics() {
  totalTasks.textContent = tasks.length;

  const finish = tasks.filter((t) => t.completed).length;

  doneTasks.textContent = finish;

  leftTasks.textContent = tasks.length - finish;
}

// --------------------------- Filters ------------------------------------------------------

allBtn.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});
starredBtn.addEventListener("click", () => {
  currentFilter = "starred";
  renderTasks();
});
completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});
leftBtn.addEventListener("click", () => {
  currentFilter = "left";
  renderTasks();
});

// --------------------------- Events ------------------------------------------------------

divContainer.addEventListener("click", function (e) {
  const taskDiv = e.target.closest(".content-task");
  if (!taskDiv) return;

  const taskId = +taskDiv.dataset.id;
  const task = tasks.find((t) => t.id === taskId);

  //   Delete

  if (e.target.closest(".trash-div")) {
    tasks = tasks.filter((t) => t.id !== taskId);
    saveToLocalStorage();
    renderTasks();
  }

  //   Complete

  if (e.target.closest(".check-div")) {
    task.completed = !task.completed;
    saveToLocalStorage();
    renderTasks();
  }

  //   Star

  if (e.target.closest(".star-btn")) {
    task.starred = !task.starred;
    saveToLocalStorage();
    renderTasks();
  }
});

//  Clear Completed btn

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter((t) => !t.completed);
  saveToLocalStorage();
  renderTasks();
});

// --------------------------- Enter Key ------------------------------------------------------

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addBtn.click();
});
