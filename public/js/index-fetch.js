let todos = [];

// DOMs
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');

const render = () => {
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

const getTodos = () => {
  fetch('/todos')
    .then(res => res.json())
    .then(_todos => todos = _todos)
    .then(render)
    .catch(err => console.error(err));
};

const generateId = () => {
  return todos.length ? Math.max(...todos.map(todo=>todo.id)) + 1 : 1;
};

window.onload = getTodos;

$input.onkeyup = ({target,keyCode}) =>{
  const content = target.value.trim();
  if( !content || keyCode !== 13) return;
  target.value = '';

  fetch('/todos', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({id: generateId(), content, completed: false})
  })
    .then(res => res.json())
    .then(_todos => {todos = _todos})
    .then(render)
    .catch(err => console.error(err));
}

$todos.onchange = ({target}) => {
  const id = target.parentNode.id;
  const completed = !todos.find(todo => todo.id === + id).completed;
  // ajax.patch(`/todos/${id}`, render, {completed});
  fetch(`/todos/${id}`, {
    method: 'PATCH',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({completed})
  })
    .then(res => res.json())
    .then(_todos => {todos = _todos})
    .then(render)
    .catch(err => console.error(err));
};

$todos.onclick = ({target}) => {
  if(!target.classList.contains('remove-todo')) return;
  const id = target.parentNode.id;
  // ajax.delete(`/todos/${id}`, render);
  fetch(`/todos/${id}`, {method: 'DELETE'})
    .then(res => res.json())
    .then(_todos => {todos = _todos})
    .then(render)
    .catch(err => console.error(err));
};