//tarefas inicais
document.addEventListener('DOMContentLoaded', function () {
    const tasks = [
        { id: 1, title: "Completar Relatorio", description: "Finalizar e enviar o relatorio ate sexta-feira.", due_date: "2025-08-25" },
        { id: 2, title: "Reuniao de Equipe", description: "Marcar uma reuniao para planejar o proximo sprint.", due_date: "2025-08-26" },
        { id: 3, title: "Revisao de Codigo", description: "Revisar o codigo e aceitar PRs pendentes.", due_date: "2025-08-27" }
    ]; 

    let currentTaskId = null;

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
    
        tasks.forEach(function(task) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text text-muted">${task.due_date}</p>
                    <div class="comments-section mt-3" style="display: none;">
                        <ul class="list-group comments-list" id="comments-list-${task.id}"></ul>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary btn-sm" onclick="showCommentsModal(${task.id})">Ver Comentarios</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });
    }

    loadTasks();
});

function showCommentsModal(taskId) {
    //mostrar os comentarios de cada tarefa
    currentTaskId = taskId;
    const commentsList = document.getElementById(`comments-list-${taskId}`);
    const modalCommentsList = document.getElementById('modal-comments-list');
    modalCommentsList.innerHTML = commentsList.innerHTML;
    new bootstrap.Modal(document.getElementById('commentsModal')).show();
}

document.getElementById('modal-add-comment-btn').addEventListener('click', function() {
    //adiciona um novo comentario
    const commentInput = document.getElementById('modal-comment-input');
    const commentText = commentInput.value;
    if (commentText.trim() !== "") {
        const commentsList = document.getElementById(`comments-list-${currentTaskId}`);
        const newComment = document.createElement("li");
        newComment.className = "list-group-item d-flex justify-content-between align-items-center";
        newComment.innerHTML = `${commentText} <button class="btn btn-danger btn-sm" onclick="deleteComment(this)">Delete</button>`;
        commentsList.appendChild(newComment);

        const modalCommentsList = document.getElementById('modal-comments-list');
        const modalNewComment = newComment.cloneNode(true);
        modalNewComment.querySelector('button').addEventListener('click', function() {
            deleteComment(modalNewComment);
        });
        modalCommentsList.appendChild(modalNewComment);

        commentInput.value = "";
    }
});

function deleteComment(button) {
    //remove o comentario
    const commentItem = button.parentElement;
    const commentsList = commentItem.parentElement;
    
    const taskId = currentTaskId;
    const originalCommentsList = document.getElementById(`comments-list-${taskId}`);

    const commentText = commentItem.textContent.trim();
    [...originalCommentsList.children].forEach(comment => {
        if (comment.textContent.trim() === commentText) {
            comment.remove();
        }
    });

    commentItem.remove();
}