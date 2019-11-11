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

const getTodos = async () => {
  // 반드시 Promise를 return하는 함수에 async를 붙여줘야함
  todos = await axios.get('/todos').then(res => todos = res.data);
  // 또다른 방법
  // const res = await axios.get('/todos');
  // todos = res.data;
  render();
};

const generateId = () => {
  return todos.length ? Math.max(...todos.map(todo=>todo.id)) + 1 : 1;
};

window.onload = getTodos;

const addTodo = async (content) => {
  const res = await axios.post('/todos', {id: generateId(), content, completed: false});
  todos = res.data;
  render();
}

$input.onkeyup = ({target,keyCode}) =>{
  const content = target.value.trim();
  if( !content || keyCode !== 13) return;
  target.value = '';
  addTodo(content);
}

const changeTodo = async (id, completed) => {
  const res = await axios.patch(`/todos/${id}`, {completed});
  todos = res.data;
  render();
};

$todos.onchange = ({target}) => {
  const id = +target.parentNode.id;
  console.log(todos.find(todo => todo.id === id));
  const completed = !todos.find(todo => todo.id === id).completed;
  changeTodo(id, completed);
};

const removeTodo = async (id) => {
  const res = await axios.delete(`/todos/${id}`).then(res => todos = res.data).then(render);
};

$todos.onclick = ({target}) => {
  if(!target.classList.contains('remove-todo')) return;
  const id = target.parentNode.id;
  removeTodo(id);
};