let todos = [];

// DOMs
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');

const render = data => {
  todos = data;

  console.log('[RENDER]', todos);
  
  let html = '';
  todos.forEach((todo) => {
    html += `
    <li id="${todo.id}" class="todo-item">
      <input class="checkbox" type="checkbox" id="ck-${todo.id}" ${todo.completed ? 'checked' : ''}>
      <label for="ck-${todo.id}"> ${todo.content} </label>
      <button class="remove-todo far fa-times-circle">x</button>
    </li>`;
  });
  $todos.innerHTML = html;
};

const ajax = (() => {
  const req = (method, url, f, payload) => {
    const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.send(JSON.stringify(payload));
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
          f(JSON.parse(xhr.response));
          return JSON.parse(xhr.response);
        } else {
          throw new Error(xhr.status);
        }
      };
    };
    return {
      get(url, f) {
        req('GET', url, f);
      },
      post(url, payload, f) {
        req('POST', url, f, payload);
      },
      patch(url, payload, f) {
        req('PATCH', url, f, payload);
      },
      delete(url, f) {
        req('DELETE', url, f);
      }
    };
})();
  

// const method = (method, url, f, payload) =>{
//   const xhr = new XMLHttpRequest();
//   xhr.open(method, url);
  
//   console.log('method:', method,'url:', url, 'payload',payload);
//   console.log(method === 'GET');

//   if(method !== 'GET'){
//     xhr.send('Content-type', 'application/json');
//     xhr.send(JSON.stringify(payload));
//   }else{
//     xhr.send();
//   }

//   xhr.onreadystatechange = () => {
//     if(xhr.readyState !== XMLHttpRequest.DONE) return;

//     if(xhr.status === 200){
//       f(JSON.parse(xhr.response));
//     } else {
//       throw new Error(xhr.status);
//     }
//   };
// }

// const get = (url, f) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', url);
//   xhr.send();
//   xhr.onreadystatechange = () => {
//     if(xhr.readyState !== XMLHttpRequest.DONE) return;

//     if(xhr.status === 200){
//       f(JSON.parse(xhr.response));
//       // return JSON.parse(xhr.response);
//     } else {
//       throw new Error(xhr.status);
//     }
//   };
// };

// const post = (url, payload, f) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', url);
//   xhr.setRequestHeader('Content-type', 'application/json');
//   xhr.send(JSON.stringify(payload));
//   xhr.onreadystatechange = () => {
//     if(xhr.readyState !== XMLHttpRequest.DONE) return;
    
//     if(xhr.status === 200){
//       // POST 때는 201번으로 넘어올 수도 있다.
//       f(JSON.parse(xhr.response));
//       // return JSON.parse(xhr.response);
//     } else {
//       throw new Error(xhr.status);
//     }
//   };
// };

// const patch = (url, payload, f) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('PATCH', url);
//   xhr.setRequestHeader('Content-type', 'application/json');
//   xhr.send(JSON.stringify(payload));
//   xhr.onreadystatechange = () => {
//     if(xhr.readyState !== XMLHttpRequest.DONE) return;
    
//     if(xhr.status === 200){
//       // POST 때는 201번으로 넘어올 수도 있다.
//       f(JSON.parse(xhr.response));
//       // return JSON.parse(xhr.response);
//     } else {
//       throw new Error(xhr.status);
//     }
//   };
// };

// const del = (url, f) => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('DELETE', url);
//   xhr.send();

//   xhr.onreadystatechange = () => {
//     if(xhr.readyState !== XMLHttpRequest.DONE) return;
    
//     if(xhr.status === 200){
//       f(JSON.parse(xhr.response));
//     } else {
//       throw new Error(xhr.status);
//     }
//   };
// };

const getTodos = () => {
  // get('/todos', render);
  ajax.get('/todos', render);
  // todos = get('/todos');
  // render();
};

const generateId = () => {
  return todos.length ? Math.max(...todos.map(todo=>todo.id)) + 1 : 1;
};

window.onload = getTodos;

$input.onkeyup = ({target,keyCode}) =>{
  const content = target.value.trim();
  if( !content || keyCode !== 13) return;
  target.value = '';
  // post('/todos', { id: generateId(), content, completed: false}, render);
  ajax.post('/todos', render, { id: generateId(), content, completed: false});
}

$todos.onchange = ({target}) => {
  // id와 completed 값이 필요함
  const id = target.parentNode.id;
  // todo.id === + id 하는 요소를 반환함, 배열을 반환하는게 아님 여러개면 첫번째만 반환
  const completed = !todos.find(todo => todo.id === + id).completed;
  // patch(`/todos/${id}`, {completed}, render);
  ajax.patch(`/todos/${id}`, render, {completed});
};

$todos.onclick = ({target}) => {
  if(!target.classList.contains('remove-todo')) return;
  const id = target.parentNode.id;
  // del(`/todos/${id}`, render);
  ajax.delete(`/todos/${id}`, render);
};