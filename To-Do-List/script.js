const todoInput = document.querySelector(".user-input");
const addButton = document.querySelector(".add-button");
const todoList = document.querySelector(".todo-list");
const errorDiv = document.querySelector(".error-div")
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
addButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    if(!todoInput.value || todoInput.value ==""||todoInput.value == null){
        todoInput.classList.add('error-form');
        errorDiv.classList.remove('hide');
        errorDiv.classList.add('show');
        event.preventDefault();
        return
    } else {
        errorDiv.classList.remove('show');

        errorDiv.classList.add('hide');
        todoInput.classList.remove('error-form')
        event.preventDefault();
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("todo");
        const newTask = document.createElement("li");
        newTask.innerText = todoInput.value; 
        newTask.classList.add("todo-item");
        taskDiv.appendChild(newTask);
    
        saveLocalTodos(todoInput.value);
        
        const uncheckButton = document.createElement("button");
        uncheckButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        uncheckButton.classList.add("complete-btn");
        taskDiv.appendChild(uncheckButton);
    
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></li>';
        deleteButton.classList.add("trash-btn");
        taskDiv.appendChild(deleteButton);
        
        todoList.appendChild(taskDiv);
        todoInput.value = "";
    }
}

function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("to-do") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("to-do"));
    }
    todos.push(todo);
    localStorage.setItem("to-do", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("to-do") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("to-do"));
    }
    todos.forEach(function(todo) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("todo");
        const newTask = document.createElement("li");
        newTask.innerText = todo;
        newTask.classList.add("todo-item");
        taskDiv.appendChild(newTask);

        const uncheckButton = document.createElement("button");
        uncheckButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        uncheckButton.classList.add("complete-btn");
        taskDiv.appendChild(uncheckButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></li>';
        deleteButton.classList.add("trash-btn");
        taskDiv.appendChild(deleteButton);

        todoList.appendChild(taskDiv);
    });
}

function removeTodos(todo) {
    let todos;
    if(localStorage.getItem("to-do") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("to-do"));
    }

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("to-do", JSON.stringify(todos));
}