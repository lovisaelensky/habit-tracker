
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
        loggedIn: false,
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

let findIndex = userData.findIndex((item) => {
    return item.name === 'Lina';
});


let findingIndex = getIndexOf(userData);
console.log(findIndex);