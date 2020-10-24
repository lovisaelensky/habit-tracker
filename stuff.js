
class CleaningItem {
    constructor(task, id) {
        this.task = task;
        this.id = id;
        this.check = false;
        this.active = true;
    }
}


class ListOfTasks {
    id = 0;
    userData = [];
    index;
    constructor(index) {
        this.index = index;
        let data = localStorage.getItem('userData');
        let checkTypeOfData = JSON.parse(data);
        if(!Array.isArray(checkTypeOfData)) {
            this.userData.push(checkTypeOfData);
        } else {
            this.userData = checkTypeOfData;
        }
        if(this.userData[this.index].taskList.length > 0) {
            this.id = this.userData[this.index].taskList.length;
            for(const item of this.userData[this.index].taskList) {
                if(item.active) {
                this.publish(item.task, item.id, item.check);
                }
            }
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
    userData = [];
    index;
    constructor(index) {
        this.index = index;
        let data = localStorage.getItem('userData');
        let checkTypeOfData = JSON.parse(data);
        if(!Array.isArray(checkTypeOfData)) {
            this.userData.push(checkTypeOfData);
        } else {
            this.userData = checkTypeOfData;
        }
        if(this.userData[this.index].lastLogin === '') {
            this.userData[this.index].lastLogin = this.getToday();
            localStorage.setItem('userData', JSON.stringify(this.userData));
        }

        this.showDate();
        this.unCheck(this.userData[this.index].lastLogin);
        this.setCompletedTasks();  
        this.countChecks();  

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
            localStorage.setItem('userData', JSON.stringify(this.userData));
        }
    }
}



class UserData {
    userData;
    userName;
    userPassword;
    index;
    constructor(username, userpassword, index) {
        this.userName = username;
        this.index = index;
        let data = localStorage.getItem('userData');
        if(data){
            this.userData = JSON.parse(data);
            const newList = new ListOfTasks(this.index);
            const calendar = new Calendar(this.index);   
        } else {
            this.userPassword = userpassword;
            this.userData = {
                name: this.userName,
                password: this.userPassword,
                loggedIn: true,
                taskList: [],
                lastLogin: '',
                completedTasks: []
            };
            localStorage.setItem('userData', JSON.stringify(this.userData));
            const calendar = new Calendar(this.index); 
            const newList = new ListOfTasks(this.index); 

        }

    }
}


class App {
    static init() {
        let userData = [];
        let index = 0;
        let data = localStorage.getItem('userData');
        if(data){
            let checkTypeOfData = JSON.parse(data);
            if(!Array.isArray(checkTypeOfData)) {
                userData.push(checkTypeOfData);
            } else {
                userData = checkTypeOfData;
            }
            index = userData.findIndex((item) => {
                return item.loggedIn === true;
            });
            if(index > -1) {
                this.startApp(userData[index].name, userData[index].password, index);
            } 
            
            


        } 
        const startBtn = document.getElementById('start-btn');
        let userName = document.getElementById('user-name');
        let userPassword = document.getElementById('user-password');
        const logIn = (event) => {
            if(event.keyCode === 13 || event.currentTarget === startBtn) {
                if(userName.value === '' || userPassword.value === ''){ return; }
                if(data){
                    index = userData.findIndex((item) => {
                        return item.name === `${userName.value}`;
                    });
                    if(userData[index].password === userPassword.value) {
                        this.startApp(userName.value, userPassword.value, index); 
                    } else {
                        document.querySelector('.invalid-user').innerText = 'Wrong password or username.';
                        userName.value = '';
                        userPassword.value = '';
                        return;
                    }
                } else {
                    this.startApp(userName.value, userPassword.value);
                }
            }
            
        }
        startBtn.addEventListener('click', logIn);
        userPassword.addEventListener('keyup', logIn);

        const logOutBtn = document.getElementById('log-out');
        
    }

    
    static startApp = (name, password, index = 0) => {
        const newUser = new UserData(name, password, index = 0);
        document.querySelector('.users-chores').textContent = `${name}'s chores:`;
        document.querySelector('.intro-page').classList.add('hidden');
        document.querySelector('.date').classList.remove('hidden');
        document.querySelector('.input-container').classList.remove('hidden');
        document.querySelector('.list').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
    }


}


App.init();