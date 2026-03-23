# GREEN API autotests

Небольшой набор автотестов для GREEN API на `TypeScript + Jest`.
В проекте есть API-проверки для основных методов, небольшой набор unit-тестов на клиент и опциональный UI smoke-тест для страницы документации `SendMessage`.

## Что есть в проекте

- проверка `getStateInstance`
- проверки `sendMessage` на успешный сценарий и обязательные поля
- проверки `getChatHistory`
- unit-тесты для `GreenApiClient`
- UI smoke на страницу документации `SendMessage`
- запуск через `.env`
- простой CI workflow

## Стек

- TypeScript
- Jest
- Selenium WebDriver

## Быстрый старт

1. Установить зависимости:

```bash
npm ci
```

2. Создать `.env` на основе `.env.example`.

3. Заполнить минимальный набор переменных:

- `GREEN_API_URL`
- `GREEN_API_INSTANCE_ID`
- `GREEN_API_TOKEN`
- `GREEN_API_CHAT_ID`

## Команды

```bash
npm run typecheck
npm test
npm run test:api
npm run test:ui
npm run test:ci
```

## Переменные окружения

```env
GREEN_API_URL=https://7105.api.greenapi.com
GREEN_API_INSTANCE_ID=1101000001
GREEN_API_TOKEN=your_api_token
GREEN_API_CHAT_ID=79990000000@c.us
GREEN_API_EXPECTED_STATE=authorized
GREEN_API_REQUEST_TIMEOUT_MS=15000

RUN_UI_TESTS=false
SELENIUM_BROWSER=chrome
SELENIUM_HEADLESS=true
SEND_MESSAGE_DOCS_URL=https://green-api.com/docs/api/sending/SendMessage/
```

## Как устроены проверки

### API

- `getStateInstance`: проверка `200` и ожидаемого статуса инстанса
- `sendMessage`: проверка успешной отправки и ответов `400`, если не переданы обязательные поля
- `getChatHistory`: проверка успешного ответа, структуры массива и валидации обязательных данных

### UI

UI-тест запускается только при `RUN_UI_TESTS=true`.
Он проверяет, что страница `SendMessage` открывается, у нее есть корректный заголовок и на странице видны поля `chatId` и `message`.

### Unit

Unit-тесты покрывают базовое поведение `GreenApiClient`: формирование URL, выбор HTTP-метода, сериализацию payload и обработку не-JSON ответов.

## Пара замечаний

- Если `.env` не заполнен, API-тесты будут пропущены, а unit-тесты и типизация все равно выполнятся.
- По документации GREEN API история сообщений может появляться с задержкой, поэтому `getChatHistory` в этом проекте проверяется на корректность ответа и структуры данных.
- Для UI-теста нужен установленный браузер и рабочий WebDriver. По умолчанию используется `chrome`.

## Полезные ссылки

- [SendMessage](https://green-api.com/docs/api/sending/SendMessage/)
- [GetChatHistory](https://green-api.com/docs/api/journals/GetChatHistory/)
- [GetStateInstance](https://green-api.com/docs/api/account/GetStateInstance/)
