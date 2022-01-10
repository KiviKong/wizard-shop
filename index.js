const items = require('./items.json');

var consoleLog = require('./utils/consoleLog.js');

let userMoney = 500;
let discountBuyPercentage = 0.1;
const userItems = [];

const internationalNumberFormat = new Intl.NumberFormat('es-MX');
const actions = ['Buy something', 'Sell your stuff to me', 'Know your finances', 'Have a nice conversation'];

const input = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function userInput(question) {
  return new Promise((resolve, reject) => {
    input.question(question, response => {
      resolve(response);
    })
  });
}

const getInventary = () => {
  if (userItems.length === 0) {
    consoleLog('Your inventory is empty!', 'red', 'bright');
  } else {
    consoleLog('         Your inventory:', 'yellow', 'bright');
    for (let i = 0; i < userItems.length; i++) {
      consoleLog(`             ${i + 1}- ${userItems[i].name}: ${userItems[i].onStock} pzas.`, '', 'bright');
    }
    consoleLog(`\n\n             0- Go back`, '', 'bright');
  }
};

const getMainMenu = () => {
  consoleLog('\n');
  for (let i = 0; i < actions.length; i++) {
    consoleLog(`        ${i + 1}- ${actions[i]}`);
  }
  consoleLog(`\n\n        0- Exit`, 'white', 'bright');
  return '';
};

async function init() {
  let stayInside = true;

  while (stayInside) {
    let selectedOption;
    let itemToBuy;
    let itemToSell;

    console.clear();
    consoleLog('Welcome to my store, How can I help you?', 'yellow', 'bright');

    selectedOption = Number(await userInput(getMainMenu()));

    const selectItemToBuy = async (itemIndex) => {
      const selectedItem = items[itemIndex - 1];

      console.clear();
      consoleLog(`Your money: $${internationalNumberFormat.format(userMoney)}\n`, 'green', 'bright');
      consoleLog(`${selectedItem.name.toUpperCase()} \n`, 'white', 'bright');
      consoleLog(`* ${selectedItem.description} * \n`);
      consoleLog('The unit price is ');
      consoleLog(`    $${internationalNumberFormat.format(selectedItem.unitPrice)} \n`, 'cyan', 'bright');
      consoleLog('On stock ');
      consoleLog(`    ${selectedItem.onStock} pzas. \n`, 'cyan', 'bright');

      const quantity = Number(await userInput('Want some? tell my how many do you want: \n'));

      if (!quantity || quantity === 0) {
        consoleLog('Don\'t waste my time', 'red', 'bright');
      } else if (quantity > selectedItem.onStock) {
        consoleLog('Sorry, I don\'t have enough of this', 'red', 'bright');
      } else if ((quantity * selectedItem.unitPrice) > userMoney) {
        consoleLog(`\nNo cash, strange (You need $${internationalNumberFormat.format(quantity * selectedItem.unitPrice)})\n`, 'red', 'bright');
      } else {
        consoleLog(`\nYou buy ${quantity} pieces. you are welcome. (Spend: $${internationalNumberFormat.format(quantity * selectedItem.unitPrice)})\n`, 'green', 'bright');
        consoleLog(`____________________________________________________________________________________________________________________\n`, 'white', 'bright');

        selectedItem.onStock -= quantity;
        userMoney -= (quantity * selectedItem.unitPrice);

        const some = userItems.some((userItem) => userItem.name === selectedItem.name);

        if (some) {
          for (let i = 0; i < userItems.length; i++) {
            if (userItems[i].name === selectedItem.name) {
              userItems[i].onStock += quantity;
            }
          }
        } else {
          userItems.push({ ...selectedItem, onStock: quantity });
        }
      }
    };

    const buyItem = async () => {
      consoleLog(`\nYour money: $${internationalNumberFormat.format(userMoney)}\n`, 'green', 'bright');
      consoleLog('          Ok this is what I have:', 'yellow', 'bright');
      for (let i = 0; i < items.length; i++) {
        consoleLog(`             ${i + 1}- ${items[i].name}`, '', 'bright');
      }
      consoleLog(`\n\n             0- Go back`, '', 'bright');
      consoleLog(`Do you wanna something? \n`, 'yellow', 'bright');

      itemToBuy = '';
      itemToBuy = Number(await userInput(''));

      if (itemToBuy === 0) {
        return;
      } else if (itemToBuy && itemToBuy <= items.length && itemToBuy >= 0) {
        console.clear();
        await selectItemToBuy(itemToBuy);
        await buyItem();
      } else {
        consoleLog('I can\`t do this!, select a valid option\n', 'red', 'bright');
        await buyItem();
      }
    };

    const selectItemToSell = async (itemIndex) => {
      const selectedItem = userItems[itemIndex - 1];

      console.clear();
      consoleLog(`I will pay $${internationalNumberFormat.format(selectedItem.unitPrice - (selectedItem.unitPrice * discountBuyPercentage))} for each one.\n`, 'yellow', 'bright');
      consoleLog(`How many will you sell to me? \n`, 'yellow', 'bright');

      const quantity = Number(await userInput(''));

      if (!quantity || quantity === 0) {
        consoleLog('Don\'t waste my time', 'red', 'bright');
      } else if (quantity > selectedItem.onStock) {
        consoleLog(`Sorry, you don't have enough of ${selectedItem.name}.\n`, 'red', 'bright');
        consoleLog(`____________________________________________________________________________________________________________________\n`, 'white', 'bright');
      } else {
        consoleLog(`You sell to me ${quantity} pieces. you are welcome. (You got $${internationalNumberFormat.format(quantity * (selectedItem.unitPrice - (selectedItem.unitPrice * discountBuyPercentage)))})\n`, 'green', 'bright');
        consoleLog(`____________________________________________________________________________________________________________________\n`, 'white', 'bright');

        selectedItem.onStock -= quantity;
        userMoney += (quantity * (selectedItem.unitPrice - (selectedItem.unitPrice * discountBuyPercentage)));

        for (let i = 0; i < items.length; i++) {
          if (items[i].name === selectedItem.name) {
            items[i].onStock += quantity;
          }
        }

        for (let i = 0; i < userItems.length; i++) {
          if (userItems[i].name === selectedItem.name) {
            userItems[i] = selectedItem;
          }
        }
      }
    };

    const sellItem = async () => {

      if (userItems.length === 0) {
        consoleLog(`Do you sell something? \n`, 'yellow', 'bright');
        itemToSell = '';
        itemToSell = Number(await userInput(''));

        if (itemToSell === 0) {
          return;
        } else if (itemToSell && itemToSell <= userItems.length && itemToSell >= 0) {
          console.clear();
          await selectItemToSell(itemToSell);
          await sellItem();
        } else {
          consoleLog('I can\`t do this!, select a valid option\n', 'red', 'bright');
          await sellItem();
        }
      } else {
        return;
      }
    };

    const getUserInformation = () => {
      console.clear();
      consoleLog(`\nYou have: $${internationalNumberFormat.format(userMoney)}\n`, 'green', 'bright');
      getInventary();
    };

    const options = {
      0: () => stayInside = false,
      1: buyItem,
      2: sellItem,
      3: getUserInformation,
      4: () => consoleLog('I don\'t have time for that shit, let\'s make business or you can go the hell out of here.', 'red', 'bright')
    }

    if (selectedOption <= 4 && selectedOption >= 0) {
      await options[selectedOption]();
    } else {
      consoleLog('I can\`t do this!, select a valid option\n', 'red', 'bright');
    }

    if (!stayInside) {
      consoleLog('Thanks for nothing', 'yellow', 'bright');
      process.exit();
    }
  }
}

init();
