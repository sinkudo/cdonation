# CryptoFollower

cDonation - это продукт, в котором пользователю (подписчику) предоставляется возможность поддержать любимых создателей контента через криптовалюту.

### Целевая аудитория

1. Follower: человек, использующий криптовалюту для поддержки любимых контентмейкеров и покупающий подписки на них через Discord-бота.
2. Content Maker: человек, что предоставляет эксклюзивный контент для площадки. Контент распределён на уровни подписки, имеющие разную стоимость. Подписки покупают подписчики за криптовалюту Ethereum.

### Ключевая ценность продукта

* Интеграция с Discord.
* Возможность для подписчиков поддержать создателей контента из любой точки мира в любой точке мира без риска заморозки и/или потери денег благодаря смарт-контрактам.

## Развертывание и подключение контрактов в тестовой сети HardHat

(на компьютере, где разворачивается проект, по умолчанию уже установлен [Node.js](https://nodejs.org/en) и [Discord](https://discord.com//))

1. Скопируйте себе проект на компьютер в папку.
2. Запустите консоль в папке, где находится проект.
3. В командной строке введите ```npm i ``` для установки недостающих зависимостей.
4. Введите в консоль команду ```npx hardhat node``` для запуска внутренней сети.
5. Введите в консоль команду ```npx hardhat run scripts/deploy.js  --network localhost``` для  развертывания контрактов во внутренней сети.
6. Перейдите в консоли в корень проекта и введите в консоль команду ```npm start``` для запуска бэкенда.
7. Перейдите в консоли в папку discord и введите в консоль команду ```npm start``` для запуска бота.

## Контракты, параметры и функций

### Payments

Контракт для работы с платежами пользователей.

#### Глобальные переменные

```address public owner;```

Владелец, от чьего лица запускается контракт.

```struct Payment {uint timestamp; address from; address to; uint value;}```

Структура платежа:
*uint timestamp* — время транзакции,
*address from* — адрес отправителя,
*address to* — адрес получателя,
*uint value* — сумма платежа.

```Payment[] payments;```

Массив платежей контракта.

#### Функции

```modifier onlyOwner()```

Модификатор, проверяющий, что функция запускается от адреса, запускающего контракт.

```constructor()```

Начальное создание контракта, указывается владелец контракта.

```function getAllPayments() public view returns (Payment[] memory)```

Возвращает все платежи контракта.

```function currentBalance() public view returns (uint256)```

Возвращает баланс контракта.

```function logPayment(uint _timestamp, address _from, address _to, uint _value) private```

Добавляет платёж в список платежей контракта.
*uint _timestamp* — время транзакции,
*address _from* — адрес отправителя,
*address _to* — адрес получателя,
*uint _value* — сумма платежа.

```function makePayment(address payable _to) public payable```

Создание платежа в контракте.
*address  payable _to* — адрес получателя платежа.

```function deposit() public payable```

Добавление денег на счёт контракта.

```function withdraw(address payable _to, uint _value) public payable onlyOwner```

Перевод денег пользователю.
*address payable _to* — адрес получателя,
*uint _value* — сумма перевода.

```function withdrawAll() public payable onlyOwner```

Перевод всех денег контракта владельцу контракта.

### SubscriptionTiers

Контракт, который хранит информацию о уровнях подписки.

#### Глобальные переменные

```address public owner;```

Владелец, от чьего лица запускается контракт.

```struct SubscriptionTier {uint id; uint creatorId; string name; string description; uint price; uint roleId; }```

Структура уровня подписки:
*uint id* — индентификатор уровня подписки,
*uint creatorId* — индентификатор создателя контента,
*string name* — название уровня подписки,
*description* — описание уровня подписки,
*uint price* — стоимость уровня подписки,
*uint roleId* — индентификатор роли в Discord.

#### Функции

```modifier onlyOwner()```

Модификатор, проверяющий, что функция запускается от адреса, запускающего контракт.

```constructor()```

Начальное создание контракта, указывается владелец контракта.

```function createSubscriptionTier(uint _serverId, uint _creatorId, string memory _name, string memory _description, uint _price, uint _roleId) external onlyOwner```

Создание уровня подписки.

```function getCreatorIdByTierId(uint _serverId, uint _tierId) public view returns (uint)```

Получение идентификатора создателя контента по идентификатору уровня подписки.

```function getPriceByTierId(uint _serverId, uint _tierId) public view returns (uint)```

Получение стоимости подписки по идентификатору уровня подписки.

```function updateTier(uint _serverId, uint _tierId, string memory _name, string memory _description, uint _price) public```

Обновлние уровня подписки.

```function getAllSubscriptionTiersByDiscordId(uint serverId) public view returns (SubscriptionTier[] memory)```

Получение всех уровней подписки по идентификатору Discord.

```function getById(uint _serverId, uint _tierId) public view returns (SubscriptionTier memory)```

Получение уровня подписки по индентификатору.

```function getArrayIndexById(uint _serverId, uint _tierId) internal view returns (uint)```

Получение индентификатора уровня подписки.

### Subscriptions

Контракт, который обеспечивает взаимодействие между пользователями и уровнями подписок.

#### Глобальные переменные

```struct Subscription {uint id; uint userId; uint subscriptionTierId; uint startTimestamp; uint endTimestamp; uint serverId; uint price; bool renewal;}```

Структура подписки.

```Subscription[] public subscriptions;```

Массив подписок.

#### Функции

```constructor(address subTiersAddress)```

Начальное создание контракта.

```function createSubscription(uint _serverId, uint _tierId, uint _userId) public returns (uint, uint)```

Создание подписки.

```function renewSubscription(uint _subId) public```

Обновление подписки.

```function cancelSubscription(uint _serverId, uint _userId) public```

Удаление подписки.

```function listSubs() public view returns (Subscription[] memory)```

Получение массива подписок.

### Users

Контракт, который хранит пользователей.

#### Глобальная переменная

```address public owner;```

Владелец, от чьего лица запускается контракт.

#### Функции

```constructor()```

Начальное создание контракта, указывается владелец контракта.

```function createUser(uint discordId, address addr) external onlyOwner```

Создание пользователя.

```function getAddress(uint discordId) external view returns (address)```

Получение адреса пользователя по его Discord идентификатору.