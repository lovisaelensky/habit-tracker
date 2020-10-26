
const userData = [
    {
        name:'Anna',
        loggedIn: false,
        password: 'hej',
        taskList: [],
        lastLogin: '',
        completedTasks: []
    },
    {
        name:'Maria',
        loggedIn: true,
        password: 'hej',
        taskList: [],
        lastLogin: '',
        completedTasks: []
    },
    {
        name:'Lina',
        loggedIn: false,
        password: 'hej',
        taskList: [],
        lastLogin: '',
        completedTasks: []
    }
];




getIndexOf = (array) => {
    let index;
    for(const item of array) {
        if(item.loggedIn === true){
            index = array.indexOf(item);
        }
    }
    return index;
} 

let index = userData.findIndex((item) => {
    return item.loggedIn === true;
});

let findIndex = userData.findIndex((item) => {
    return item.name === 'Lina';
});



console.log(index);

if(userData.length > 1) {
    index = userData.findIndex((item) => {
        return item.loggedIn === true;
    });
    if(index > -1) {
        this.startApp(userData[index].name, userData[index].password, index);
    } 
} else {
    if(userData[0].loggedIn === true) {
        console.log('got here');
        this.startApp(userData.name, userData.password);
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
                if(checkBtn.classList.contains('mark')){ 
                    currentCounter++;
                    this.userData[this.index].completedTasks[0].completed = currentCounter;
                    localStorage.setItem('userData', JSON.stringify(this.userData));
                } else if(checkBtn.classList.contains('unmark')){
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