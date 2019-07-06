(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    var mainAppContent;
    var createTaskModal;

    class Task {
        constructor(name) {
            this.id = ('X' + (Math.round(Math.random() * 10000)).toString());
            this.name = name;
        }
    }

    function init() {

        mainAppContent = {
            createTaskButton: document.querySelector("#create-task-button"),
            lists: {
                toDoList: document.querySelector("#to-do-list"),
                doingList: document.querySelector("#doing-list"),
                doneList: document.querySelector("#done-list")
            }
        };

        createTaskModal = {
            modal: document.querySelector("#create-task-modal"),
            close: document.querySelector("#create-task-modal .close-modal"),
            form: document.querySelector("#create-task-form")
        };

        setUpMainAppContent();
        setUpCreateTaskModal();
    }

    function setUpMainAppContent() {

        // Must retrieve locally stored tasks here before continuing

        makeTasksDraggable();
        enableDropZoneForLists();

        mainAppContent.createTaskButton.addEventListener("click", launchTaskCreator, false);
    }

    function setUpCreateTaskModal() {
        createTaskModal.close.addEventListener("click", closeTaskCreator, false);
        createTaskModal.form.addEventListener("submit", closeTaskCreator, false);
    }

    function enableDropZoneForLists() {
        for (var key in mainAppContent.lists) {
            if (mainAppContent.lists.hasOwnProperty(key)) {
                var list = mainAppContent.lists[key];
                // console.log(list);
                list.addEventListener("drop", handleDrop, false);
                list.addEventListener("dragover", handleDragover, false);
            }
        }
    }

    function makeTasksDraggable() {
        for (var key in mainAppContent.lists) {
            if (mainAppContent.lists.hasOwnProperty(key)) {
                var list = mainAppContent.lists[key];
                // console.log(list);
                for (var i = 0; i < list.childElementCount; i++) {
                    // console.log(list.children[i]);
                    list.children[i].addEventListener("dragstart", handleDragStart, false);
                }
            }
        }
    }

    // Store the id of the Task being dragged and set the mouse cursor.
    // Called when Task is "lifted" by cursor.
    function handleDragStart(evt) {
        evt.dataTransfer.setData("listTask", evt.target.id);
        evt.dataTransfer.setData("previousList", evt.target.parentNode.id);
    }

    // Get the element that's stored (i.e. the Task being dragged) and append
    // to target (i.e. the target list).
    // The Task being dragged is automatically removed from the previous parent.
    function handleDrop(evt) {
        evt.preventDefault();

        var previousList = evt.dataTransfer.getData("previousList");
        checkIsEmpty(document.querySelector("#" + previousList));

        var draggedElement = evt.dataTransfer.getData("listTask");
        evt.target.insertBefore(document.querySelector("#" + draggedElement), evt.target.childNodes[0]);

        checkIsEmpty(evt.target);
    }

    // When element/cursor hovers over drop zone, prevent browser intervening.
    function handleDragover(evt) {
        evt.preventDefault();
    }

    function checkIsEmpty(l) {
        console.log(l);
        if (l.children.length <= 1) {
            l.style.height = "50px";
        }
        else {
            l.style.height = null;
        }
    }

    function launchTaskCreator(evt) {
        createTaskModal.modal.style.display = "block";
    }

    function closeTaskCreator(evt) {
        evt.preventDefault();

        if (evt.type === "submit") {
            var formData = new FormData(createTaskModal.form);
            var taskName = formData.get("task-name");
            createTask(taskName);
        }
        createTaskModal.modal.style.display = "none";
    }

    function createTask(taskName) {
        var newTask = new Task(taskName);

        var newElement = document.createElement("li");
        newElement.id = newTask.id;
        newElement.draggable = true;
        newElement.innerHTML = newTask.name;
        newElement.addEventListener("dragstart", handleDragStart, false);

        var deleteButton = document.createElement("a");
        deleteButton.className = "delete-task";
        deleteButton.innerHTML = "&times;";
        deleteButton.addEventListener("click", deleteTask, false);

        newElement.appendChild(deleteButton);

        mainAppContent.lists.toDoList.appendChild(newElement);
    }

    function deleteTask(evt) {
        var taskToDelete = evt.target.parentNode;
        var parentList = taskToDelete.parentNode;
        parentList.removeChild(taskToDelete);
    }

})();
