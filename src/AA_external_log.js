/**
 * send log to ip with web server
 * 
 * @param {string} message - data for console external server
 */
export function eLog (message) {
    let body = {'log': message};
    let request = {} // объект, представляющий http-запрос
    request.url = "http://147.78.65.236:3001/log" // адрес на который отправляется запрос, обязательная строка; может быть абсолютным и относительным, если адрес относительный, то запрос отправляется на текущий инстанс (инстанс на котором сработал сценарий автоматизации)
    request.method = "POST" // http-метод запроса, обязательная строка ("GET", "POST", "PUT" и др.)
    request.headers = {'Content-Type': 'application/json'} // объект, содержащий заголовки запроса, необязательный
    request.body = JSON.stringify(body) // тело запроса, необязательная строка (сериализованные в строку данные)
    console.log(JSON.stringify(message))
    var response = fetch(request) // синхронно отправляет запрос request и возвращает ответ response
}