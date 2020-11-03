import { Calendar } from './Calendar.js';
import { CleaningItem } from './CleaningItem.js';
import { CompletedTask } from './CompletedTask.js';
import { DataHandler } from '../Utility/DataHandler.js';

export class ListOfTasks {
    id = 0;
    userData = [];
    index;
    calendar;
    constructor(index) {
        this.index = index;
        this.userData = DataHandler.checkData();
        if(this.userData[this.index].taskList.length > 0) {
            this.id = this.userData[this.index].taskList.length;
            for(const item of this.userData[this.index].taskList) {
                if(item.active) {
                this.publish(item.task, item.id, item.check);
                }
            }
        }
        if(this.userData[this.index].lastLogin === '') {
            this.userData[this.index].lastLogin = this.getToday();
            localStorage.setItem('userData', JSON.stringify(this.userData));
        }


        this.showDate();
        this.unCheck(this.userData[this.index].lastLogin);
        this.setCompletedTasks();  
        this.countChecks();  
        this.create();
        this.check();
        this.changeUI();
        this.deleteDragAndDrop();
        this.deleteBackspace();
        this.calendar = new Calendar(this.index);
        this.logOut();
    }

    publish = (task, id, check) => {
        let checked = check ? 'mark' : 'unmark';
        const DOMitem = `<li class="item" id="li-${id}" draggable="true" tabindex="0">
                        <button class="check-btn ${checked}" id="${id}"></button>
                        <p class="cleaning-item">${task}</p>
                        </li>`;
        const DOMlist = document.querySelector('ul');
        const position = 'afterbegin';
        DOMlist.insertAdjacentHTML(position, DOMitem);
    }

    create = () => {
        const addBtn = document.getElementById('add-btn');
        let taskInput = document.getElementById('input');
        const createItem = (event) => {
            if(taskInput.value === ""){ return; }
            if(event.keyCode === 13 || event.currentTarget === addBtn) {
                const newItem = new CleaningItem(taskInput.value, this.id);
                this.userData[this.index].taskList.push(newItem);
                this.publish(newItem.task, newItem.id);
                localStorage.setItem('userData', JSON.stringify(this.userData));
                this.id++;
                taskInput.value = "";
            }
        }
        addBtn.addEventListener('click', createItem);
        taskInput.addEventListener('keyup', createItem);
        
    }

    check = () => {
        const DOMlist = document.querySelector('ul');
        DOMlist.addEventListener('click', (event) => {
            if(event.target.nodeName === 'BUTTON'){
                let checkBtn = event.target;
                checkBtn.classList.toggle('mark');
                checkBtn.classList.toggle('unmark');
                this.userData[this.index].taskList[checkBtn.id].check = this.userData[this.index].taskList[checkBtn.id].check ? false : true;
                localStorage.setItem('userData', JSON.stringify(this.userData));
                this.changeUI();
                location.reload();
            }

        })
        
    }

    changeUI = () => {
        let checkedTasks = 0;
        for(const item of this.userData[this.index].taskList) {
            if(item.check && item.active) {
                checkedTasks++;
            }
        }
        if(checkedTasks > 2) {
            document.getElementById('wrapper').classList.add('clean');
            document.querySelector('.spiderweb').classList.add('hidden');
            document.querySelector('.cockroach-container').classList.add('hidden');
            document.querySelector('section').classList.remove('hidden');
        } else {
            document.getElementById('wrapper').classList.remove('clean');
            document.querySelector('.cockroach-container').classList.remove('hidden');
            document.querySelector('section').classList.add('hidden');
        }
    }

    deleteDragAndDrop = () => {
        document.querySelector('ul').addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.dataTransfer.effectAllowed = 'move';
        });

        const DOMlist = document.querySelector('ul');
        const trashCan = document.getElementById('trash-can');
        trashCan.addEventListener('dragover', (event) => {
            if(event.dataTransfer.types[0] === 'text/plain'){
                event.preventDefault();
            }
        });
        trashCan.addEventListener('drop', (event) => {
            const itemId = event.dataTransfer.getData('text/plain');
            const DOMitem = document.getElementById(`${itemId}`);
            DOMlist.removeChild(DOMitem);
            this.userData[this.index].taskList[itemId.slice(3)].active = false; 
            localStorage.setItem('userData', JSON.stringify(this.userData));
            this.changeUI();
        });

    }

    deleteBackspace = () => {
        const DOMlist = document.querySelector('ul');
        DOMlist.addEventListener('keyup', (event) => {
            if(event.keyCode === 8) {
                event.target.remove();
                const itemId = event.target.id;
                this.userData[this.index].taskList[itemId.slice(3)].active = false;
                localStorage.setItem('userData', JSON.stringify(this.userData));
                this.changeUI();
            }
        })
    }

    showDate = () => {
        let DOMdate = document.getElementById('today');
        DOMdate.textContent = this.getToday();
        DOMdate.classList.remove('hidden');
    }

    unCheck = (lastLogin) => {
        const today = this.getToday();
        const checkDay = this.daysElapsed(lastLogin, today);
        if(checkDay > 0) {
            for(const item of this.userData[this.index].taskList) {
                item.check = false;
            }
            localStorage.setItem('userData', JSON.stringify(this.userData));
        }
    }

    getToday = (offset = 0) => {
        const today = new Date();
        const day = new Date(today);
        day.setDate(today.getDate() + offset);
        return day.toISOString().slice(2, 10);
    }
    
    daysElapsed = (lastLogin, today) => {
        let counter = 0;
        while(lastLogin !== today) {
            today = this.getToday(- counter - 1);
            counter++;
        }
        return counter;
    } 


    countChecks = () => {
        let currentCounter = this.userData[this.index].completedTasks[0].completed;
        const DOMlist = document.querySelector('ul');
        DOMlist.addEventListener('click', (event) => {
            if(event.target.nodeName === 'BUTTON'){
                let checkBtn = event.target;
                if(checkBtn.classList.contains('unmark')){ 
                    currentCounter++;
                    this.userData[this.index].completedTasks[0].completed = currentCounter;
                    localStorage.setItem('userData', JSON.stringify(this.userData));
                } else if(checkBtn.classList.contains('mark')){
                    currentCounter--;
                    this.userData[this.index].completedTasks[0].completed = currentCounter;
                    localStorage.setItem('userData', JSON.stringify(this.userData));
                }
            }
        })
    }

    setCompletedTasks = (counter = 0) => {
        const today = this.getToday();
        const daysSinceLogin = this.daysElapsed(this.userData[this.index].lastLogin, today); 
        if(this.userData[this.index].completedTasks.length === 0) {
            const newCompletedTask = new CompletedTask(today, counter);
            this.userData[this.index].completedTasks.unshift(newCompletedTask);
            localStorage.setItem('userData', JSON.stringify(this.userData));
        } else if(daysSinceLogin >= 1){
            for(let i = daysSinceLogin -1; i >= 0; i--) {
                let day = this.getToday(-i);
                let listItem = new CompletedTask(day, counter);
                this.userData[this.index].completedTasks.unshift(listItem);
            }
            this.userData[this.index].lastLogin = this.getToday();
            localStorage.setItem('userData', JSON.stringify(this.userData));
        }
    }

    logOut = () => {
        const logOutBtn = document.getElementById('log-out');
        logOutBtn.addEventListener('click', () => {
            this.userData[this.index].loggedIn = false;
            localStorage.setItem('userData', JSON.stringify(this.userData));
            document.querySelector('.intro-page').classList.remove('hidden');
            document.querySelector('.date').classList.add('hidden');
            document.querySelector('.input-container').classList.add('hidden');
            document.querySelector('.list').classList.add('hidden');
            document.querySelector('footer').classList.add('hidden');
            document.querySelector('.tracker-container').classList.add('hidden');
            location.reload();
        });
    }

}