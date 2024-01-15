var token = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
function updateTodo(id) {
    const bool = document.querySelector(`#todo-checkbox-${id}`).checked;
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
    fetch(`/todos/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            completed: bool,
            "_csrf": token
        })
    })
        .then((res) => {
            if (res.ok) {
                window.location.reload();
            }
        })
        .catch((err) => console.error(err));
}
function deleteTodo(id) {
    console.log(id)
    fetch(`/todos/${id}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "_csrf": token
        })
    })
        .then((res) => {
            if (res.ok) {
                window.location.reload();
            }
        })
        .catch((err) => console.error(err));
}
