document.addEventListener('DOMContentLoaded', function(){
  let input = document.querySelector('.input__form');
  let btn = document.querySelector('.input__form-btn');
  let cardsContainer = document.querySelector('.cards__container');
  let btnPlayAgain = document.querySelector('.btn__play-again');

  let areaElements = document.createElement('ul'); // контейнер для карточек
  let equalCards = 0; // счётчик одинаковых карт
  let firstCard = {}; //объекты для сравнения первой и второй карточки
  let secondCard = {};
  let amount; //количество карт

  // функция создания карточек (расчет ширины, добавление классов и т.д.)
  function createAreaElements(value) {
    let element = document.createElement('li');
    let elementHiden = document.createElement('li');

    const containerWidth = cardsContainer.offsetWidth; // ширина главного контейнера
    const cardWidth = ((containerWidth * 0.85) / amount); // расчет ширины и высоты карточек

    areaElements.append(element); // заполняем контейнер areaElements карточками
    element.textContent = value; // присваиваем значения карточкам
    element.classList.add('element');
    element.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth}px;`);

    elementHiden.classList.add('hiden');
    element.append(elementHiden);
    elementHiden.addEventListener('click', () =>{
      tapCard(elementHiden, element.textContent, element);
    })

    return element;
  }

  // функция создания игрового поля с карточками
  function createArea(amount) {
    cardsContainer.append(areaElements); // Создаем контейнер для карточек
    areaElements.classList.add('cards__list');

    // создаем массив элементов для заполнения значения карточек
    let valueArray = [];
    let lengthValueArray = (Math.pow(amount,2) / 2);
    for (let val = 1; val < lengthValueArray + 1; val++) {
      valueArray.push(val); // конечно, это костыль, но работает)
      valueArray.push(val);
    }
    shuffle(valueArray);

    //вызываем функцию создания карточек amount раз в квадрате
    for (let i = 0; i < Math.pow(amount,2); i++) {
      createAreaElements(valueArray[i]);
    }
  }

  //функция, которая перемешивает массив со значения для карточек
  function shuffle(array) { // Перемешиваем значения в массиве по методу Фишера-Йетса (Fisher-Yates)
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
      let t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }

  // функция проверки количества карточек
  function currentNumber (number){
    if (number > 1 && number < 11){
      if (number % 2 === 0)
      return true //введено правильное число
    }
    else return false //введено неправильное число
  };

  // функция открытия карточек, а также проверки на совпадение и концовка игры
  function tapCard (elementHidenCard, cardValue, elementCard){
    if (!Object.keys(firstCard).length) {
      firstCard = {
        card: elementHidenCard,
        value: cardValue,
        mainCardHTML: elementCard,
      };
      firstCard.card.classList.remove('hiden');
    }
    else if (!Object.keys(secondCard).length) {
      secondCard = {
        card: elementHidenCard,
        value: cardValue,
        mainCardHTML: elementCard,
      };
      secondCard.card.classList.remove('hiden');
    }

    if (Object.keys(secondCard).length) {
      if (firstCard.value === secondCard.value) {
        firstCard.mainCardHTML.classList.add('success');
        secondCard.mainCardHTML.classList.add('success');
        firstCard = {}; // если карточки одинаковые обнуляю объекты firstCard и secondCard для новых значений
        secondCard = {};
        equalCards+=1;

        if (equalCards*2 === Math.pow(Number(amount),2)) {
          btnPlayAgain.classList.add('btn__play-again-visible');
          btnPlayAgain.addEventListener('click', playAgain); // при нажатии перезагружается страница и начинается игра занаво
        }
      }
      else {
        secondCard.card.classList.remove('hiden');

        let openFirst = firstCard.card;
        let openSecond = secondCard.card;

        setTimeout(() => {
          openFirst.classList.add('hiden');
          openSecond.classList.add('hiden');
        }, 600);

        firstCard = {};
        secondCard = {};
      }
    }
  };

  // функия перезагрузки для начала новой игры
  function playAgain (){
    window.location.reload();
  };

  // кнопка "Начать игру". После нажатия на кнопку начинается игра и устанавливается таймер в 1 минуту
  btn.addEventListener('click', function(){
    amount=input.value;
    if (currentNumber(amount)) {
      createArea(amount);
      btn.setAttribute('disabled', 'true');
      setTimeout(() => {
        alert('Время игры закончилось');
        window.location.reload();
      }, 60000);
    }
    else {
      input.value = '4';
    }
  })
})
