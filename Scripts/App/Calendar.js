import { DataHandler } from '../Utility/DataHandler.js';

export class Calendar {
    index;
    userData;
    constructor(index) {
        this.index = index;
        this.userData = DataHandler.checkData();

        for (const item of this.userData[this.index].completedTasks) {
            this.addTracking(item);
        }
    }



    addTracking(item) {
        const newLi = document.createElement('li');
        const ul = document.querySelector('.tracker-list');
        ul.appendChild(newLi);
      
        const newP = document.createElement('p');
        newP.innerText = item.date;
        newLi.appendChild(newP);
      
        for (let i = 0; i < item.completed; i++) {
          const newSpan = document.createElement('span');
          newSpan.innerHTML = '&#9673';
          newSpan.classList.add('color');
          newLi.appendChild(newSpan);
        }
    }
} 

