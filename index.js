// Подключение библиотек
const app = require('express')(); // приложение app работает на базе Express
const bodyParser = require('body-parser');
const axios = require('axios');

// Входящие HTTP-запросы обрабатываются библиотекой body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Порт, на котором работает наше приложение
const port = 3001;

// Данные для отправки SMS
const url = 'https://api.exolve.ru/messaging/v1/SendSMS';
const exolveNumber = '79990557296';
const apiKey =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRV05sMENiTXY1SHZSV29CVUpkWjVNQURXSFVDS0NWODRlNGMzbEQtVHA0In0.eyJleHAiOjE5OTEzMDcxMTcsImlhdCI6MTY3NTk0NzExNywianRpIjoiOWEyYThkNzktZWMwNC00YzE0LWI0YzItNTA4NWQxMGVjNTM1IiwiaXNzIjoiaHR0cHM6Ly9zc28uZXhvbHZlLnJ1L3JlYWxtcy9FeG9sdmUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODVhMTYwOWYtYzViZC00MzY3LTg4ZDEtMjVkN2Q1MmIyNTEyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiMTc4ZWMxNDUtNjg5OC00YjA2LWE5MmEtNzVmNjNjYjU3MDQ2Iiwic2Vzc2lvbl9zdGF0ZSI6Ijg4Mjc0Yjc0LWU0NjgtNDYzNi04ZjJhLTYwZDFlYjliYjkzNSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1leG9sdmUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJleG9sdmVfYXBwIHByb2ZpbGUgZW1haWwiLCJzaWQiOiI4ODI3NGI3NC1lNDY4LTQ2MzYtOGYyYS02MGQxZWI5YmI5MzUiLCJ1c2VyX3V1aWQiOiJjN2FhOTU5ZS03YTdiLTQ0YzYtYTAyYi1hNzZhODA2YTM2MTMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIxNzIuMjAuMi4yMSIsImNsaWVudElkIjoiMTc4ZWMxNDUtNjg5OC00YjA2LWE5MmEtNzVmNjNjYjU3MDQ2IiwiYXBpX2tleSI6dHJ1ZSwiYXBpZm9uaWNhX3NpZCI6IjE3OGVjMTQ1LTY4OTgtNGIwNi1hOTJhLTc1ZjYzY2I1NzA0NiIsImJpbGxpbmdfbnVtYmVyIjoiMTE5MDg1MCIsImFwaWZvbmljYV90b2tlbiI6ImF1dDU1MDAyOGNmLWUwY2ItNDJhYi1iYmM1LWFmMTM1OGRiZWRhMyIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC0xNzhlYzE0NS02ODk4LTRiMDYtYTkyYS03NWY2M2NiNTcwNDYiLCJjdXN0b21lcl9pZCI6IjI1NTEzIiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4yMC4yLjIxIn0.CpMAgMOpAbPqDsZA-GpnO0OKhQorrWbMZlatlupebwMcmwVGw-3ulg6YfpJrjgGlKSNh4FFlNXHEYkrrtq9kGB9DmQ90Il26uQXkzH3bC3KXRNB7TC6xPqewGJJIDxhl3JuR3CxemLLXvw3ZFPYigsnZXmwD3FSHIY0EZFTp7AA2BTYeFozNUqAV-ykA6693IjdSdoZ-qdBwpM2Z3rRhWhL_cxdQazMqu01-RN-jVhWv-vNVpe2L6FDSvIxoyUNaawwNt_B5b8Es9Z5lBwr-HwhJOFWm52zy9ysBlcDb4S70sIkodvuACmysqgIufrKJRwB1CFzEd5rGpn1zOwWzgQ';

// Получатели рассылки
receivers = ['79241236518'];
// Согласившиеся пройти опрос и их ответы
respondents = [];

welcomeSMS =
  'Вы хотели бы принять участие в опросе? Ответьте ДА, чтобы начать.';
surveyQuestions = ['Как вас зовут?', 'Какой ваш любимый цвет?'];
thanksSMS = 'Спасибо за участие в опросе!';

// Функция отправки SMS-сообщения

function sendSMS(number, message) {
  axios({
    method: 'post',
    url: url,
    headers: { Authorization: 'Bearer ' + apiKey },
    data: {
      number: exolveNumber,
      destination: number,
      text: message,
    },
  }).then((response) => {
    console.log(response.data); // выводим ID отправленного сообщения
  });
}

// Рассылка SMS сообщений с предложением пройти опрос
receivers.forEach((number) => {
  sendSMS(number, welcomeSMS);
});

// Обработка вебхука о входящем SMS

app.post('/', async (req, res) => {
  res.status(200).end();
  // Фильтруем вебхуки (входящее сообщение в статусе "оплачено")
  if (
    req.body.direction === 'DIRECTION_INCOMING' &&
    req.body.billing_status === 'BILLING_STATUS_BILLED'
  ) {
    // Получаем номер отправителя и текст сообщения
    const number = req.body.sender;
    const message = req.body.text;

    // Проверяем, если ли отправитель в массиве responders (получали ли мы от него SMS)
    respondentIndex = respondents.findIndex((el) => el.number == number);

    // Если нет и его первое сообщение "Да" (согласие на опрос)
    if (respondentIndex == -1 && message.toLowerCase() === 'да') {
      // Создаем объект с данными отправителя
      const respondent = {
        number: number,
        answers: [],
        surveyStep: 0, // получено ответов на вопросы опроса
      };
      respondents.push(respondent); // добавляем его в массив
      sendSMS(number, surveyQuestions[respondent.surveyStep]); // отправляем SMS с первым вопросом
    }

    // Если отправитель есть в массиве (значит согласился на опрос и мы ему отправили первый вопрос)
    else if (respondentIndex !== -1) {
      respondents[respondentIndex].answers.push(message); // добавляем его ответ
      respondents[respondentIndex].surveyStep += 1; // переход к следующему вопросу
      console.log(respondents); // выводим данные о респондентах для проверки
      // Если вопросы еще остались
      if (respondents[respondentIndex].surveyStep < surveyQuestions.length) {
        sendSMS(
          number,
          surveyQuestions[respondents[respondentIndex].surveyStep] // отправляем SMS со следующим вопросом
        );
        // Если вопросов больше нет
      } else {
        sendSMS(number, thanksSMS); // отправляем SMS с благодарностью
      }
    }
  }
});

// Приложение будет слушать запросы на указанном выше порте
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
