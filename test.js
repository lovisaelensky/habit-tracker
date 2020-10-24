
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