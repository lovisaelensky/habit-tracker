import { UserData } from './App/UserData.js';
import { DataHandler } from './Utility/DataHandler.js';

class App {
    static init() {
        let userData = DataHandler.checkData();
        let index = 0;
        if(userData) {
            index = userData.findIndex((item) => {
                return item.loggedIn === true;
            });
            if(index > -1) {
                this.startApp(userData[index].name, userData[index].password, index);
            } 
        }
        
        const startBtn = document.getElementById('start-btn');

        let inputPassword = document.getElementById('user-password');

        const logIn = (event) => {
            let userName = document.getElementById('user-name').value.trim();
            let password = inputPassword.value.trim();
            if(event.keyCode === 13 || event.currentTarget === startBtn) {
                if(userName === '' || password === ''){ return; }
                if(userData){
                    index = userData.findIndex((item) => {
                        return item.name === `${userName}`;
                    });
                    if(index > -1) {
                        if(userData[index].password === password) {
                            userData[index].loggedIn = true;
                            localStorage.setItem('userData', JSON.stringify(userData));
                            this.startApp(userName, password, index); 
                        } else {
                            document.querySelector('.invalid-user').innerText = 'Wrong password or username.';
                            userName = '';
                            password = '';
                            return;
                        }
                    } else {
                        this.startApp(userName, password, index);
                    }
                } else {
                    this.startApp(userName, password);
                }
            }
        }

        startBtn.addEventListener('click', logIn);
        inputPassword.addEventListener('keyup', logIn);
        
    }

    
    static startApp(name, password, index = 0) {
        const newUser = new UserData(name, password, index);
        document.querySelector('.users-chores').textContent = `${name}'s chores:`;
        document.querySelector('.intro-page').classList.add('hidden');
        document.querySelector('.date').classList.remove('hidden');
        document.querySelector('.input-container').classList.remove('hidden');
        document.querySelector('.list').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        document.querySelector('.tracker-container').classList.remove('hidden');
    }
}


App.init(); 