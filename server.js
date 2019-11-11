// server program이 들어갈 js 파일

const express = require('express');
const app = express();


let todos = [
  {id: 1, content: 'HTML', completed: false },
  {id: 2, content: 'CSS', completed: true },
  {id: 3, content: 'JavaScript', completed: false }
]

// static으로 제공하는 root 폴더의 이름을 public이라고 할거야라는 의미
// use가 더 일반적인 기능이라 우선한다. 그래서 hello index가 출력된다.
// 미들웨어
app.use(express.static('public'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 2. (req, res)는 express가 준다.

app.get('/todos', (req, res) => {
  // 여기서 response를 안하면 클라이언트는 계속 대기하다가 timeout된다.
  res.send(todos);
  // client에게 문자열을 보낸다.
});

app.post('/todos', (req, res) => {
  console.log(req.body);
  todos = [req.body, ...todos];
  res.send(todos);
});

app.patch('/todos/:id', (req, res) => {
  const id =req.params.id;
  const completed = req.body.completed;
  todos = todos.map(todo => todo.id === +id ? {...todo, completed} : todo);
  res.send(todos);
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  todos = todos.filter(todo => todo.id !== +id);
  res.send(todos);
});

// 1. listen은 request를 대기하고 있는 것이다. 처음 서버 기동 시 한번만 실행한다.
// node.js는 100% 비동기고 콜백함수다.

app.listen(3000, () => {
  console.log('Server listening on port 3000');  
});