document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "backend/tasks.php";
    const COMMENTS_API_URL = "backend/comments.php";
    let isEditMode = false;
    let edittingId;
    let tasks = [];
    
    // inicializar una vez
    let taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    let commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
    let isEditingComment = false;

    async function loadTasks() {
        try {
            const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
            if (response.ok) {
                tasks = await response.json();
                renderTasks(tasks);
            } else {
                if (response.status === 401) {
                    window.location.href = "index.html";
                }
                console.error("Error al obtener tareas");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            let commentsList = '';
            if (task.comments && task.comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                task.comments.forEach(comment => {
                    commentsList += `
                    <li class="list-group-item">
                        ${comment.comment}
                        <button type="button" class="btn btn-sm btn-link edit-comment" data-commentid="${comment.id}">Editar</button>
                        <button type="button" class="btn btn-sm btn-link remove-comment" data-commentid="${comment.id}">Eliminar</button>
                    </li>`;
                });
                commentsList += '</ul>';
            }

            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                    ${commentsList}
                    <button type="button" class="btn btn-sm btn-link add-comment" data-taskid="${task.id}">Agregar Comentario</button>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Eliminar</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(function (button) {
            button.addEventListener('click', handleAddComment);
        });

        document.querySelectorAll('.edit-comment').forEach(function (button) {
            button.addEventListener('click', handleEditComment);
        });

        document.querySelectorAll('.remove-comment').forEach(function (button) {
            button.addEventListener('click', handleDeleteComment);
        });
    }

    function handleEditTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('due-date').value = task.due_date;

        isEditMode = true;
        edittingId = taskId;
        taskModal.show();
    }

    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        try {
            const response = await fetch(`${API_URL}?id=${id}`, { credentials: 'include', method: 'DELETE' });
            if (response.ok) {
                loadTasks();
            } else {
                console.error("Problema al eliminar la tarea");
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    function handleAddComment(event) {
        const taskId = parseInt(event.target.dataset.taskid);
        isEditingComment = false;

        document.getElementById('commentModalLabel').textContent = "Agregar Comentario";
        document.getElementById('comment-id').value = "";
        document.getElementById('comment-task-id').value = taskId;
        document.getElementById('comment-text').value = "";

        commentModal.show();
    }

    function handleEditComment(event) {
        const commentId = parseInt(event.target.dataset.commentid);
        const commentLi = event.target.closest('li');
        const oldComment = commentLi.childNodes[0].textContent.trim();

        isEditingComment = true;

        document.getElementById('commentModalLabel').textContent = "Editar Comentario";
        document.getElementById('comment-id').value = commentId;
        document.getElementById('comment-text').value = oldComment;
        document.getElementById('comment-task-id').value = "";

        commentModal.show();
    }

    document.getElementById('comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const comment = document.getElementById('comment-text').value.trim();
        const taskId = document.getElementById('comment-task-id').value;
        const commentId = document.getElementById('comment-id').value;

        try {
            let response;
            if (isEditingComment) {
                response = await fetch(`${COMMENTS_API_URL}?id=${commentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment }),
                    credentials: 'include'
                });
            } else {
                response = await fetch(COMMENTS_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment, task_id: taskId }),
                    credentials: 'include'
                });
            }

            if (response.ok) {
                commentModal.hide();
                loadTasks();
            } else {
                console.error("Error guardando el comentario");
            }
        } catch (err) {
            console.error("Error al enviar el comentario", err);
        }
    });

    async function handleDeleteComment(event) {
        const commentId = parseInt(event.target.dataset.commentid);

        try {
            const response = await fetch(`${COMMENTS_API_URL}?id=${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                loadTasks();
            } else {
                console.error("Error al eliminar el comentario");
            }
        } catch (err) {
            console.error("Error en la solicitud al eliminar el comentario", err);
        }
    }

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-desc').value.trim();
        const due_date = document.getElementById('due-date').value.trim();

        const taskData = { title, description, due_date };

        try {
            let response;
            if (isEditMode) {
                response = await fetch(`${API_URL}?id=${edittingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                    credentials: 'include'
                });
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                    credentials: 'include'
                });
            }

            if (response.ok) {
                loadTasks();
                taskModal.hide();
                document.getElementById('task-form').reset();
                isEditMode = false;
                edittingId = null;
            } else {
                console.error("Error al guardar la tarea");
            }
        } catch (err) {
            console.error("Error al enviar la tarea", err);
        }
    });

    loadTasks();
});
