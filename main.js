const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;
let alarm = new Audio('alarm.mp3');

const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');
const btnStopAlarm = document.querySelector('#btnAlarm');

renderTime();
renderTasks();

form.addEventListener('submit', e => {
	e.preventDefault();
	if (itTask.value !== ''){
		createTask(itTask.value);
		itTask.value = '';
		renderTasks();
	}
});

function createTask(value){

	const newTask = {
		id: (Math.random() * 100).toString(36).slice(3),
		title: value,
		completed: false
	}

	tasks.unshift(newTask);
}

function renderTasks(){
	const html = tasks.map(task => {
		return `
		<div class="item-task"> 
			<div class="title">${task.completed ? `<del>${task.title}</del>` : `${task.title}`}</div>
				<div class="completed">
					${task.completed ? `<span class="done"><i class="fas fa-check"></i></span>` :`<button class="start-button" data-id="${task.id}">Start</button>`}
				</div>
			</div> 
		</div>
		 `;
	});

	const tasksContainer = document.querySelector("#tasks");
	tasksContainer.innerHTML = html.join("");

	const startButtons = document.querySelectorAll(".start-button");

	startButtons.forEach(button => {
		button.addEventListener('click', e => {
			if(!timer){
				const id = button.getAttribute('data-id');
				startButtonHandler(id);
				button.textContent = 'In progress...';
			}
		});
	});

}

function startButtonsDisabled() {
	const buttonStart = document.querySelectorAll(".start-button");
	buttonStart.forEach(function(buttonStartDisabled) {
	buttonStartDisabled.setAttribute("disabled", "");
	});
}

function startButtonHandler(id){
	time = 5;
	current = id;
	const taskIndex = tasks.findIndex(task => task.id === id);
	taskName.textContent = tasks[taskIndex].title;
	renderTime();
	timer = setInterval(() => {
		timerHandler(id);
	}, 1000);

	startButtonsDisabled();
}

function timerHandler(id){
	time--;
	renderTime();

	if (time === 0) {
		clearInterval(timer);
		markCompleted(id);
		timer = null;
		renderTasks();
		startBreak();
		alertTime();
	}
}

function startBreak() {
	time = 10;
	taskName.textContent = 'Break';
	renderTime();
	timerBreak = setInterval(() => {
		timerBreakHandler();
	}, 1000);

	startButtonsDisabled();
}

function timerBreakHandler() {
	time--;
	renderTime();

	if (time === 0) {
		clearInterval(timerBreak);
		current = null;
		timerBreak = null;
		taskName.textContent = '';
		renderTasks();
		alertTime();
	}
}

function renderTime(){
	const timeDiv = document.querySelector("#time #value");
	const minutes = parseInt(time / 60);
	const seconds = parseInt(time % 60);

	timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id) {
	const taskIndex = tasks.findIndex(task => task.id === id);
	tasks[taskIndex].completed = true;
}

function alertTime() {
	btnAlarm.classList.remove('none');
	alarm.play();
	stopAlertTime();
}

function stopAlertTime() {
	btnStopAlarm.addEventListener('click', ()=> {
		alarm.pause();
		//alarm.currentTime(0);
		btnAlarm.classList.add("none");
	});
}
