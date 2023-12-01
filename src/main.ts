type Todo = {
    id: string
    name: string
    completed: boolean
}

const form = document.querySelector<HTMLFormElement>('#new-todo-form')!;
const formInput = document.querySelector<HTMLInputElement>('#todo-input')!;
const todoTemplate = document.querySelector<HTMLTemplateElement>('#new-todo-item-template')!;
const list = document.querySelector<HTMLUListElement>('#list')!;

const LOCAL_STORAGE_PREFIX = "TODO";
const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}_LIST_ITEMS`;

let todos: Todo[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");

const saveTodos = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

const deleteTodo = (id: string) => {
    todos = todos.filter(t => t.id !== id);
}

const renderTodos = () => {
    list.innerHTML = "";

    todos.forEach(t => {
        const listItem = makeListItemFromTodo(t);
        list.appendChild(listItem);
    })
}

const makeListItemFromTodo = (todo: Todo): HTMLElement => {
    const templateClone = todoTemplate.content.cloneNode(true) as DocumentFragment;
    const listItem = templateClone.querySelector<HTMLLIElement>('.list-item')!;
    const listItemText = templateClone?.querySelector<HTMLSpanElement>('.label-text')!;
    const listItemCheckbox = templateClone?.querySelector<HTMLInputElement>('.label-input')!;

    listItem.id = todo.id;
    listItemCheckbox.checked = todo.completed;
    listItemText.textContent = todo.name;

    return listItem!;
}

const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if(formInput.value === "") {
        return;
    }

    const newTodoObj: Todo = {
        id: crypto.randomUUID(),
        name: formInput.value,
        completed: false
    }
    
    todos.push(newTodoObj);
    saveTodos();
    renderTodos();

    formInput.value = "";
}

const handleDelete = (e: MouseEvent) => {
    const listButton = e.target as HTMLElement;
    if(!listButton.classList.contains('delete-btn')) {
        return;
    }

    const listItem = listButton.closest('.list-item')!;
    deleteTodo(listItem.id);
    saveTodos();
    renderTodos();
}

const handleChecked = (e: MouseEvent) => {
    const listCheckbox = e.target as HTMLInputElement;
    if(!listCheckbox.classList.contains('label-input')) {
        return;
    }

    const listItem = listCheckbox.closest('.list-item')!;
    const isChecked = listCheckbox.checked;
    const todoId = listItem.id;

    const newTodos = todos.map(t => {
        if(t.id !== todoId) {
            return t;
        }
        return { ...t, completed: isChecked }
    })
    todos = newTodos;
    
    saveTodos();
    renderTodos();
}

renderTodos();
document.addEventListener('click', handleDelete);
document.addEventListener('click', handleChecked);
form.addEventListener("submit", handleSubmit);