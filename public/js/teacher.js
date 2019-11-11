let todos = [];
// DOMs
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');
const render = data => {
  todos = data;
  console.log('[render]', todos);
  let html = '';
  todos.forEach(({ id, content, completed }) => {
    html += `
      <li id="${id}" class="todo-item">
        <input class="checkbox" type="checkbox" id="ck-${id}" ${completed ? 'checked' : ''}>
        <label for="ck-${id}">${content}</label>
        <button class="remove-todo">X</button>
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
const getTodos = () => {
  ajax.get('/todos', render);
};
const generateId = () => {
  return todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
};
window.onload = getTodos;

$input.onkeyup = ({ target, keyCode }) => {
  const content = target.value.trim();
  if (!content || keyCode !== 13) return;
  target.value = '';
  ajax.post('/todos', { id: generateId(), content, completed: false }, render);
};

$todos.onchange = ({ target }) => {
  const id = target.parentNode.id;
  const completed = !todos.find(todo => todo.id === + id).completed;
  ajax.patch(`/todos/${id}`, { completed }, render);
};

$todos.onclick = ({ target }) => {
  if (!target.classList.contains('remove-todo')) return;
  const id = target.parentNode.id;
  ajax.delete(`/todos/${id}`, render);
};