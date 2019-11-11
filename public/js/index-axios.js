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
  axios.get('/todos')
    .then(res => todos = res.data)
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

  axios.post('/todos', {id: generateId(), content, completed: false})
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
}

$todos.onchange = ({target}) => {
  const id = target.parentNode.id;
  const completed = !todos.find(todo => todo.id === + id).completed;
  axios.patch(`/todos/${id}`, {completed})
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

$todos.onclick = ({target}) => {
  if(!target.classList.contains('remove-todo')) return;
  const id = target.parentNode.id;
  axios.delete(`/todos/${id}`)
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};