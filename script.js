let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let toast = document.querySelector(".toast");
let closeIcon = document.querySelector(".close");
let progress = document.querySelector(".progress");

let isEditMode = false;
let editIndex = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    
    if (isEditMode) {
      updateTask();
    } else {
      acceptData(); 
    }
    
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [{}];

let acceptData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
  createToastNotification('Успех', 'Задача была добавлена');
};

let createTasks = () => {
    tasks.innerHTML = "";
    data.map((x, y) => {
        return (tasks.innerHTML += `
        <div id=${y}>
            <span class="fw-bold">${x.text}</span>
            <span class="small text-secondary">${x.date}</span>
            <p>${x.description}</p>
            <span class="options">
                <i onClick="editTask(${y})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                <i onClick="deleteTask(this); createTasks()" class="fas fa-trash-alt"></i>
            </span>
        </div>
        `);
    });
    resetForm();  
};

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
  console.log(data);
};

// Функция редактирования задачи
let editTask = (index) => {
  let selectedTask = data[index];

  textInput.value = selectedTask.text;
  dateInput.value = selectedTask.date;
  textarea.value = selectedTask.description;
  
  isEditMode = true;  // Включаем режим редактирования
  editIndex = index;   // Сохраняем индекс редактируемой задачи
};

// Функция обновления задачи
let updateTask = () => {
  data[editIndex] = {
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value
  };

  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
  createToastNotification('Обновлено', 'Задача была изменена');

  isEditMode = false; // Выходим из режима редактирования
  editIndex = null;   // Очищаем индекс
};

function createToastNotification(title, message) {
  let timer1, timer2;
  toast.querySelector(".text-1").innerText = title;  
  toast.querySelector(".text-2").innerText = message; 
  toast.classList.add("active");
  progress.classList.add("active");
  timer1 = setTimeout(() => {
    toast.classList.remove("active");
  }, 5000); //1s = 1000 milliseconds
  timer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 5300);
}

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  console.log(data);
  createTasks();
})();
