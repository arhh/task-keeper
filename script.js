(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    var mainAppContent;
    var createTaskModal;

    class Task {
        constructor(name, id, status) {
            this.id = id;
            this.name = name;
            this.status = status;
        }

        toDOMElement(elementType) {
            var element = document.createElement(elementType);
            element.id = this.id;
            element.innerHTML = this.name;

            return element;
        }

        toObjectNotation() {
            console.log({id: this.id, name: this.name, status: this.status});
            return {id: this.id, name: this.name, status: this.status};
        }
    }

    function init() {
        mainAppContent = {
            createTaskButton: document.querySelector("#create-task-button"),
            lists: {
                toDoList: document.querySelector("#to-do"),
                doingList: document.querySelector("#doing"),
                doneList: document.querySelector("#done")
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

        loadTasksFromDisk();

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
                    makeElementDraggable(list.children[i]);
                }
            }
        }
    }

// {x524: {name: 'hi', status: 'done'}, x2: {name: 'hid', status: 'done'}}

    function loadTasksFromDisk() {
        var taskList = localStorage.getItem("tasks");
        if (taskList !== null) {
            taskList = JSON.parse(taskList);
            for (var id in taskList) {
                if (taskList.hasOwnProperty(id)) {
                    var taskObject = createTask(taskList[id].name, id, taskList[id].status);
                    addTaskToDOM(taskObject);
                }
            }
        }
        else { localStorage.setItem("tasks", JSON.stringify({})); }
    }

    // Store the id of the Task being dragged and set the mouse cursor.
    // Called when Task is "lifted" by cursor.
    function handleDragStart(evt) {
        evt.dataTransfer.setData("listTaskId", evt.target.id);
        evt.dataTransfer.setData("sourceListId", evt.target.parentNode.id);
    }

    // Get the element that's stored (i.e. the Task being dragged) and append
    // to target (i.e. the target list).
    // The Task being dragged is automatically removed from the previous parent.
    function handleDrop(evt) {
        evt.preventDefault();

        var sourceListId = evt.dataTransfer.getData("sourceListId");
        var targetList = evt.target;
        checkListIsEmpty(document.querySelector("#" + sourceListId));

        var draggedTaskId = evt.dataTransfer.getData("listTaskId");
        targetList.insertBefore(document.querySelector("#" + draggedTaskId), evt.target.childNodes[0]);

        updateTaskStatus(draggedTaskId, targetList.id);

        checkListIsEmpty(targetList);
    }

    // When element/cursor hovers over drop zone, prevent browser intervening.
    function handleDragover(evt) {
        evt.preventDefault();
    }

    function checkListIsEmpty(l) {
        console.log(l);
        if (l.children.length <= 1) {
            l.style.height = "50px";
        }
        else {
            l.style.height = null;
        }
    }

    function updateTaskStatus(taskElementId, newStatus) {
        console.log(typeof(taskElementId));
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        console.log(tasks);
        tasks[taskElementId].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function launchTaskCreator(evt) {
        createTaskModal.modal.style.display = "block";
    }

    function closeTaskCreator(evt) {
        evt.preventDefault();

        if (evt.type === "submit") {
            var formData = new FormData(createTaskModal.form);
            var newTaskName = formData.get("task-name");
            var newTaskObject = createTask(newTaskName);
            addTaskToDOM(newTaskObject);
        }
        createTaskModal.modal.style.display = "none";
    }

    function createTask(name, id = null, status = "to-do") {
        if (id === null) {
            id = ("X" + (Math.round(Math.random() * 10000)).toString());
        }
        newTask = new Task(name, id, status);
        return newTask;
    }

    function addTaskToDOM(task) {
        var newTaskElement = task.toDOMElement('li');
        // console.log(newTaskElement);
        makeElementDraggable(newTaskElement);

        // Create the "X" button for deleting
        var deleteButton = document.createElement("a");
        deleteButton.className = "delete-task";
        deleteButton.innerHTML = "&times;";
        deleteButton.addEventListener("click", deleteTask, false);

        newTaskElement.appendChild(deleteButton);

        var taskStatus = task.status;

        switch (taskStatus) {
            case "to-do":
                mainAppContent.lists.toDoList.appendChild(newTaskElement);
                storeTaskToDisk(newTask);
                break;
            case "doing":
                mainAppContent.lists.doingList.appendChild(newTaskElement);
                storeTaskToDisk(newTask);
                break;
            case "done":
                mainAppContent.lists.doneList.appendChild(newTaskElement);
                storeTaskToDisk(newTask);
                break;
            default:
                console.error("No matching swim lane for task status");
                console.error(`Task Status: ${taskStatus}`);
        }
    }

    function deleteTask(evt) {
        var taskToDelete = evt.target.parentNode;
        var parentList = taskToDelete.parentNode;

        parentList.removeChild(taskToDelete);

        var tasks = JSON.parse(localStorage.getItem("tasks"));
        delete tasks[taskToDelete.id];

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function makeElementDraggable(taskElement) {
        taskElement.draggable = true;
        taskElement.addEventListener("dragstart", handleDragStart, false);
    }

    function storeTaskToDisk(task) {
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[task.id] = {name: task.name, status: task.status};
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

})();
