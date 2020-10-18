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
    }

    publish = (task, id, check) => {
        let checked = check ? 'mark' : 'unmark';
        const DOMitem = `<li class="item" id="li-${id}" draggable="true">
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
                console.log(this.list[checkBtn.id].check);
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
            console.log(event.target.id);
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
            console.log(this.list[itemId.slice(3)].active);
            localStorage.setItem('taskList', JSON.stringify(this.list));
        });

    }

    deleteSwipe = () => {

    }

    deleteBackspace = () => {

    }
}

const newList = new ListOfTasks();



        
