import { ListOfTasks } from './ListOfTasks.js';
import { DataHandler } from '../Utility/DataHandler.js';

export class UserData {
    userData;
    userName;
    userPassword;
    index;
    constructor(username, userpassword, index) {
        this.userName = username;
        this.index = index;
        this.userData = DataHandler.checkData();
        if(this.userData && this.index > -1){
            const newList = new ListOfTasks(this.index);
        } else {
            this.userPassword = userpassword;
            const newUser = {
                name: this.userName,
                password: this.userPassword,
                loggedIn: true,
                taskList: [],
                lastLogin: '',
                completedTasks: []
            };
            this.userData.push(newUser);
            this.index = this.userData.length -1;
            localStorage.setItem('userData', JSON.stringify(this.userData));
            const newList = new ListOfTasks(this.index); 
        }

    }
}