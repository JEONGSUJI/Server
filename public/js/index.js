// console.log('hi');

let todos = [
  {id: 1, content: 'HTML', completed: false },
  {id: 2, content: 'CSS', completed: true },
  {id: 3, content: 'JavaScript', completed: false }
]

// DOMs
const $todos = document.querySelector('.todos');

const render = data => {
  console.log('render');
  todos = data;
  
  let html = '';
  todos.forEach((todo) => {
    html += `
    <li id="${todo.id}" class="todo-item">
      <input class="checkbox" type="checkbox" id="ck-${todo.id}" ${todo.completed ? 'checked' : ''}>
      <label for="ck-${todo.id}"> ${todo.content} </label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>`;
  });
  $todos.innerHTML = html;
};

const get = (url, f) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  // 절대경로 xhr.open('GET', 'http://localhost:3000/todos');
  xhr.send();

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      f(JSON.parse(xhr.response));
    }
    else {
      console.error('Error', xhr.status, xhr.statusText);
    }
  };
};

const getTodos = () => {
  // const xhr = new XMLHttpRequest();
  // xhr.open('GET', '/todos');
  // // 절대경로 xhr.open('GET', 'http://localhost:3000/todos');
  // xhr.send();

  // // onreadystatechange는 이벤트라 비동기함수
  // // 
  // xhr.onreadystatechange = () => {
  //   if (xhr.readyState !== XMLHttpRequest.DONE) return;
  //   if (xhr.status === 200) {
  //     // JSON 
  //     // console.log(xhr.response);
  //     // console.log(JSON.parse(xhr.response));
  //     // console.log(typeof(xhr.response));
  //     todos = JSON.parse(xhr.response);
  //     console.log('[GET]',todos);
  //     render();
  //     // JSON.stringify
  //   }
  //   else {
  //     console.error('Error', xhr.status, xhr.statusText);
  //   }
  // };

  get('/todos', render);
  // render(); 를 쓸 수 없는 이유는 비동기 함수라 순서 보장이 안되기 때문이다.
};

getTodos();