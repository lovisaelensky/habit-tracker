//Hämta data från localStorage (datum + tasks)
//Tasks behöver ID för att få färger
//Math.radom för att ge färger
//Mockup data i local storage

const completedTasks = [{ '20-10-21': [3, 2, 1], '20-10-22': [4, 5, 6] }];
const easyArray = [1, 4, 7];

function addTracking() {
  const newLi = document.createElement('li');
  const ul = document.querySelector('.tracker-list');
  newLi.innerText = 'datum';
  ul.appendChild(newLi);

  for (let i = 0; i < easyArray.length; i++) {
    const newSpan = document.createElement('span');
    newSpan.innerHTML = '&#9673';
    newSpan.classList.add('color');
    newLi.appendChild(newSpan);
  }
}

addTracking();
