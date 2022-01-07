const items = require('./items.json')

const userData = {
  money: 220,
  inventory: [],
  discountPercentage: 0.1
}

const input = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

function userInput(question) {
  return new Promise((resolve, reject) => {
    input.question(question, response => {
      resolve(response)
    })
  })
}

async function userSelectsItem(items, inputMessage) {
  const itemsOptions = []

  for (let i = 0 ; i < items.length ; i++) {
    itemsOptions.push({
      id: items[i].id,
      index: i + 1,
      name: items[i].name
    })

    console.log(`\t${i + 1}. ${items[i].name} \t\tStock:[${items[i].stock}]`)
  }

  itemsOptions.push({
    id: 0,
    index: 0,
    name: 'Go Back'
  })

  console.log('')
  console.log('\t0. Go Back')
  console.log('')

  const option = await userInput(inputMessage)

  const userItemIndex = itemsOptions.findIndex((item) => item.index === Number(option))

  return  userItemIndex >= 0 ? itemsOptions[userItemIndex].id : null
}

async function buyItem(itemID) {
  const sellerItem = items.find((item) => item.id === itemID)

  console.log(sellerItem.description)
  console.log('The unit price is ', sellerItem.price)
  console.log('')

  const answer = await userInput('Want some? Tell my how many do you want: ')
  const itemQuantity = Number(answer)

  if (itemQuantity > sellerItem.stock) {
    console.log("Sorry, I don't have enough of this.")
  } else if ((itemQuantity * sellerItem.price) > userData.money) {
    console.log('Are you a little bit confused? You don\'t have enough money \n')
  } else {
    sellerItem.stock -= itemQuantity

    userData.money -= (itemQuantity * sellerItem.price)

    const userItem = userData.inventory.find((item) => item.id === itemID)

    if (userItem) {
      userItem.stock += itemQuantity
    } else {
      userData.inventory.push({...sellerItem, stock: itemQuantity })
    }

    console.log(`You bought ${itemQuantity} pieces. You are welcome. \n`)
  }
}

async function sellItem(itemID) {
  const sellerItem = items.find((item) => item.id === itemID)
  const userItem = userData.inventory.find((a) => a.id === itemID)

  const itemPrice = userItem.price - (userItem.price * userData.discountPercentage)

  console.log(`I will pay ${itemPrice} for each one.`)
  console.log('')

  const answerUser = await userInput('How many will you sell to me?: ')

  const itemQuantity = Number(answerUser)

  if (itemQuantity > userItem.stock) {
    console.log(`Sorry, you don't have enough ${userItem.name}.`)
  } else {
    userItem.stock -= itemQuantity
    userData.money += (itemPrice * itemQuantity)

    sellerItem.stock += itemQuantity

    console.log(`You sold to me ${itemQuantity} pieces. You are welcome. \n`)
  }
}

async function init() {
  let loop = true

  console.log('Welcome to my store, How can I help you?')

  while (loop) {
    console.log('Options:')
    console.log('1. Buy something.')
    console.log('2. Sell your stuff to me.')
    console.log('3. Know your finances.')
    console.log('4. Have a nice conversation.')
    console.log('')
    console.log('0. Exit.')
    console.log('')

    const option = await userInput('')

    console.log('')

    let itemID = null

    switch (Number(option)) {
      case 0:
        loop = false
        break
      case 1:
        console.clear()
        console.log('Ok this is what I have:')
        itemID =  await userSelectsItem(items, 'Do you need anything?: ')
        if (itemID) await buyItem(itemID)
        break
      case 2:
        console.clear()
        console.log('Ok I accept this items:')
        itemID = await userSelectsItem(userData.inventory, 'Do you wanna sell something?: ')
        if (itemID) await sellItem(itemID)
        break;
      case 3:
        console.clear()
        console.log(`Really?! Don't know how to count? You have $${userData.money}`)
        console.log('And your ITEMS are:')

        userData.inventory.forEach(item => {
          console.log(`\t---${item.name}---`)
          console.log(`\t\tStock: ${item.stock}`)
          console.log(`\t\tPrice: ${item.price}`)
          console.log(`\t\tDescription: ${item.description}`)
          console.log('\n')
        })

        break
      case 4:
        console.clear()
        console.log('I don\'t have time for that shit, let\'s make business or you can go the hell out of here. \n')
        break
      default:
        break
    }
  }

  console.log('Thanks for nothing')
  process.exit()
}

init()
