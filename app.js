
class CleaningItem {
    constructor(task, id) {
        this.task = task;
        this.id = id;
        this.check = false;
        this.active = true;
    }
}


class ListOfTasks {
    list;
    id = 0;
    constructor() {
        let data = localStorage.getItem('taskList');
        if(data){
            this.list = JSON.parse(data);
            this.id = this.list.length;
            for(const item of this.list) {
                if(item.active) {
                    this.publish(item.task, item.id, item.check);
                }
            }
        } else {
            this.list = [];
        }

        this.create();
        this.check();
        this.changeUI();
        this.deleteDragAndDrop();
        this.deleteBackspace();
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
                this.list.push(newItem);
                this.publish(newItem.task, newItem.id);
                localStorage.setItem('taskList', JSON.stringify(this.list));
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
                this.list[checkBtn.id].check = this.list[checkBtn.id].check ? false : true;
                localStorage.setItem('taskList', JSON.stringify(this.list));
                this.changeUI();
            }

        })
        
    }

    changeUI = () => {
        let checkedTasks = 0;
        for(const item of this.list) {
            if(item.check && item.active) {
                checkedTasks++;
            }
        }
        if(checkedTasks > 2) {
            document.getElementById('wrapper').classList.add('clean');
        } else {
            document.getElementById('wrapper').classList.remove('clean');
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
            this.list[itemId.slice(3)].active = false; 
            localStorage.setItem('taskList', JSON.stringify(this.list));
            this.changeUI();
        });

    }

    deleteBackspace = () => {
        const DOMlist = document.querySelector('ul');
        DOMlist.addEventListener('keyup', (event) => {
            if(event.keyCode === 8) {
                event.target.remove();
                const itemId = event.target.id;
                this.list[itemId.slice(3)].active = false;
                localStorage.setItem('taskList', JSON.stringify(this.list));
                this.changeUI();
            }
        })
    }

    deleteSwipe = () => {

    }


}

class CompletedTask {
    constructor(date, completed) {
        this.date = date;
        this.completed = completed;
    }
}

class Calendar {
    lastLogin;
    completedTasks = [];
    constructor() {
        let data = localStorage.getItem('lastLogin');
        if(data){
            this.lastLogin = JSON.parse(data);
            this.unCheck(this.lastLogin);
            localStorage.setItem('lastLogin', JSON.stringify(this.getToday()));
        } else {
            localStorage.setItem('lastLogin', JSON.stringify(this.getToday()));
        }
        
        this.showDate();
        this.setCompletedTasks();  
        this.countChecks();
    }

    showDate = () => {
        let DOMdate = document.getElementById('today');
        DOMdate.textContent = this.getToday();
    }

    unCheck = (lastLogin) => {
        const today = this.getToday();
        const checkDay = this.daysElapsed(lastLogin, today);
        if(checkDay > 0) {
            const data = localStorage.getItem('taskList');
            const list = JSON.parse(data);
            for(const item of list) {
                item.check = false;
            }
            localStorage.setItem('taskList', JSON.stringify(list));
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
        const data = localStorage.getItem('completedTasks');
        this.completedTasks = JSON.parse(data);
        let currentCounter = this.completedTasks[0].completed;
        console.log(currentCounter);
        const DOMlist = document.querySelector('ul');
        DOMlist.addEventListener('click', (event) => {
            if(event.target.nodeName === 'BUTTON'){
                let checkBtn = event.target;
                if(checkBtn.classList.contains('unmark')){ 
                    currentCounter++;
                    this.completedTasks[0].completed = currentCounter;
                    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
                } else if(checkBtn.classList.contains('mark')){
                    currentCounter--;
                    this.completedTasks[0].completed = currentCounter;
                    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
                }
            }
        })
    }

    setCompletedTasks = (counter = 0) => {
        const data = localStorage.getItem('completedTasks');
        const today = this.getToday();
        const daysSinceLogin = this.daysElapsed(this.lastLogin, today); 
        if(!data || daysSinceLogin === 1) {
            const newCompletedTask = new CompletedTask(today, counter);
            this.completedTasks.unshift(newCompletedTask);
            localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
        } else if(daysSinceLogin > 1){
            this.completedTasks = JSON.parse(data);
            for(let i = daysSinceLogin; i > 0; i--) {
                let day = this.getToday(i);
                let listItem = new CompletedTask(day, counter);
                this.completedTasks.unshift(listItem);
            }
            localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
        }


        //if there is no data in localstorage or if daysSincelogin > 0- create a new completedtask, push it to array and set localstorage
        // else check days elapsed
        //      if days elapsed is O 
        //          then the number of checks should be updated
        //      else go through the days since lastlogin and create new tasks with completed: 0
        //          and create one for today with checked tasks
    }
}




class UserInfo {
    constructor() {
        let userId = localStorage.getItem('userId');
    }
}


const calendar = new Calendar();
const newList = new ListOfTasks();



     
