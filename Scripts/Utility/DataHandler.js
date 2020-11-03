export class DataHandler {
    static checkData () {
        let userData = [];
        let data = localStorage.getItem('userData');
        if(data){
            userData = JSON.parse(data);
            return userData;
        } else {
            return [];
        }
    }
}