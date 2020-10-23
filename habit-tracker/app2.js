//Hämta data från localStorage (datum + tasks)
//Tasks behöver ID för att få färger
//Math.radom för att ge färger
//Mockup data i local storage

const completedTasks = [{ '20-10-21': [3, 2, 1], '20-10-22': [4, 5, 6] }];
const easyArray = [
  { date: '20-10-22', completed: 5 },
  { date: '20-10-21', completed: 0 },
  { date: '20-10-20', completed: 7 },
];

function addTracking(item) {
  const newLi = document.createElement('li');
  const ul = document.querySelector('.tracker-list');
  //newLi.innerText = item.date;
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

for (const item of easyArray) {
  addTracking(item);
}
