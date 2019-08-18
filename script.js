// Don't polute the global variable space with the variables here.
(function () {
    // Only run script once DOM has finished loading.
    window.addEventListener("DOMContentLoaded", init, false);

    // Two variables representing:
    //     a) The main application (i.e. The three swim lanes)
    //     b) The "create task" modal (i.e. The pop-up for creating new tasks)
    var mainAppContent;
    var createTaskModal;

    /**
     * Class representing a Task.
     *
     * A "Task" is something to do (e.g. Hanging out the clothes)
     *
     * @param {string} id A unique identifier for the task.
     * @param {string} name The user-defined name for the task.
     * @param {string} status Whether the task is to-do, being done, or done.
     */
    class Task {
        constructor(name, id, status) {
            this.id = id;
            this.name = name;
            this.status = status;
        }

        /**
         * Generate a HTML element from this Task.
         *
         * The object id is the element id, and the object name is inserted as
         * text within the element.
         * Note: The object's status is *not* captured in the element.
         *
         * @param {string} elementType The type of element to create (e.g. h1).
         * @returns {string} The HTML element representing this object.
         */
        toDOMElement(elementType) {
            var element = document.createElement(elementType);
            element.id = this.id;
            element.innerHTML = this.name;

            return element;
        }

        /**
         * Generate a JavaScript object representation of this Task.
         *
         * @returns {object} The JavaScript object representing this Task.
         */
        toObjectNotation() {
            console.log({id: this.id, name: this.name, status: this.status});
            return {id: this.id, name: this.name, status: this.status};
        }
    }

    /**
     * Function to set up the application environment.
     *
     * This function delegates most of the set up work to other functions.
     * What it doesn't delegate is the creation of JavaScript objects to
     * represent the DOM elements that are dynamically modified.
     */
    function init() {
        // Object containing the DOM elements that are interacted with
        // on the main application view.
        mainAppContent = {
            createTaskButton: document.querySelector("#create-task-button"),
            lists: {
                toDoList: document.querySelector("#to-do"),
                doingList: document.querySelector("#doing"),
                doneList: document.querySelector("#done")
            }
        };

        // Object containing the DOM elements of the "create task" pop-up.
        createTaskModal = {
            modal: document.querySelector("#create-task-modal"),
            close: document.querySelector("#create-task-modal .close-modal"),
            form: document.querySelector("#create-task-form")
        };

        // Call two functions to complete the set up of the application views.
        setUpMainAppContent();
        setUpCreateTaskModal();
    }

    /**
     * Function to set up main application view.
     */
    function setUpMainAppContent() {
        // Add drag and drop functionality to each Task item in the swim lanes.
        makeTasksDraggable();

        // Allow HTML elements to be "dropped" onto the swim lanes.
        enableDropZoneForLists();

        // Check for, and load any tasks that were previously saved to
        // localStorage.
        loadTasksFromDisk();

        // Add an event listener to the "create task" button, which opens the
        // "create task" pop-up dialogue.
        mainAppContent.createTaskButton.addEventListener("click",
                                                         launchTaskCreator,
                                                         false);
    }

    /**
     * Function to set up the "create task" pop-up view.
     *
     * This function adds event listeners to the "submit" and "close" buttons
     * of this dialogue box.
     */
    function setUpCreateTaskModal() {
        createTaskModal.close.addEventListener("click", closeTaskCreator, false);
        createTaskModal.form.addEventListener("submit", closeTaskCreator, false);
    }

    /**
     * Function which adds appropriate "Drag and Drop API" event listeners to
     * the swim lanes so Task items can be "dropped" and attached onto them.
     *
     * The two events that are required in the HTML5 Drag and Drop API are:
     * "drop": When an element is released while over a swim lane.
     * "dragover": When an element is dragged over and hovering above a swim
     *     lane.
     */
    function enableDropZoneForLists() {
        for (var key in mainAppContent.lists) {
            // Ignore any "key" that is part of the mainAppContent superclass.
            if (mainAppContent.lists.hasOwnProperty(key)) {
                var list = mainAppContent.lists[key];
                list.addEventListener("drop", handleDrop, false);
                list.addEventListener("dragover", handleDragover, false);
            }
        }
    }

    /**
     * Function to iterate over each Task and make them "draggable" as defined
     * by the HTML5 Drag and Drop API.
     *
     * This function delegates the actual work of "enabling" drag and drop
     * functionality to another function: makeElementDraggable().
     */
    function makeTasksDraggable() {
        for (var key in mainAppContent.lists) {
            // Ignore any "key" that is part of the mainAppContent superclass.
            if (mainAppContent.lists.hasOwnProperty(key)) {
                // Iterate over each list (aka. swim lane) and make each
                // containing task "draggable".
                var list = mainAppContent.lists[key];
                for (var i = 0; i < list.childElementCount; i++) {
                    makeElementDraggable(list.children[i]);
                }
            }
        }
    }

    /**
     * Function to load Tasks that were stored to the client's localStorage
     * in the last session.
     *
     * HTML5 Web Storage API is used here. The data stored to localStorage
     * takes the following form:
     * localStorage key = "tasks"
     * localStorage value = {
     *                        <id_of_task>: {
     *                                         name: <name_of_task>,
     *                                         status: <task_status>
     *                                      }, ...
     *                      }
     */
    function loadTasksFromDisk() {
        var taskList = localStorage.getItem("tasks");
        // If the user has previously created Tasks with this application.
        if (taskList !== null) {
            taskList = JSON.parse(taskList);
            for (var id in taskList) {
                if (taskList.hasOwnProperty(id)) {
                    var taskObject = createTask(taskList[id].name, id,
                                                taskList[id].status);
                    // Add each Task that was parsed from localStorage to the
                    // view.
                    addTaskToDOM(taskObject);
                }
            }
        }
        // If the client has no Tasks stored, then create a new empty object
        // for storing Tasks later.
        else { localStorage.setItem("tasks", JSON.stringify({})); }
    }

    /**
     * Event handler for when a Task is "lifted" by the mouse cursor.
     *
     * This function stores:
     *     1) the id of the task being dragged to the dataTransfer property.
     *     2) the id of the source swim lane (ie. the list the Task is being
     *        lifted from).
     */
    function handleDragStart(evt) {
        evt.dataTransfer.setData("listTaskId", evt.target.id);
        evt.dataTransfer.setData("sourceListId", evt.target.parentNode.id);
    }

    // Get the element that's stored (i.e. the Task being dragged) and append
    // to target (i.e. the target list).
    // The Task being dragged is automatically removed from the previous parent.
    /**
     * Event handler for when a Task is "dropped" over a swim lane list.
     *
     * This function gets the element being dragged, appends it to the target
     * list and removes it from the source list.
     */
    function handleDrop(evt) {
        evt.preventDefault();

        var sourceListId = evt.dataTransfer.getData("sourceListId");

        var targetList = evt.target;

        // Check if the source list is empty, in which case it is
        // modified so its height doesn't become 0px.
        checkListIsEmpty(document.querySelector("#" + sourceListId));

        var draggedTaskId = evt.dataTransfer.getData("listTaskId");
        // The Task is always added to the top of the target list.
        targetList.insertBefore(document.querySelector("#" + draggedTaskId),
                                evt.target.childNodes[0]);

        // Update the status of the Task, which is always recorded in
        // localStorage.
        updateTaskStatus(draggedTaskId, targetList.id);

        // Since the target list is no longer empty, this function will
        // remove the manual height CSS property.
        checkListIsEmpty(targetList);
    }

    /**
     * Prevent browser from intervening when a Task is "dragged over" a swim
     * lane list.
     */
    function handleDragover(evt) {
        evt.preventDefault();
    }

    /**
     * Apply a manual CSS height to a swim lane if it currently has no Tasks.
     */
    function checkListIsEmpty(l) {
        if (l.children.length <= 1) {
            l.style.height = "50px";
        }
        else {
            l.style.height = null;
        }
    }

    /**
     * Setter for the "status" property of a Task currently sitting in the
     * browser localStorage.
     *
     * @param {string} taskElementId The id of the Task.
     * @param {string} newStatus The status to update the Task with.
     */
    function updateTaskStatus(taskElementId, newStatus) {
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[taskElementId].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    /**
     * Open the "create task" pop-up dialogue.
     */
    function launchTaskCreator(evt) {
        createTaskModal.modal.style.display = "block";
    }

    /**
     * Close the "create task" pop-up when either the close button or submit
     * button is pressed.
     *
     * If the submit button is pressed, then the name of the new Task to create
     * is retrieved from the form and an object representing the new Task is
     * created for displaying on the DOM.
     */
    function closeTaskCreator(evt) {
        evt.preventDefault();

        if (evt.type === "submit") {
            var formData = new FormData(createTaskModal.form);
            var newTaskName = formData.get("task-name");
            var newTaskObject = createTask(newTaskName);
            addTaskToDOM(newTaskObject);
        }
        // Hide the pop-up dialogue.
        createTaskModal.modal.style.display = "none";
    }

    /**
     * Create a Task object
     *
     * @param {string} name The name for the Task.
     * @param {string} id The id for the Task. If left as "null", a new random
     *     id will be generated.
     * @param {string} status The status for the Task. If omitted when calling
     *     this function, it is assumed to be a brand new Task which will sit
     *     in the "To Do" swim lane.
     *
     * @returns {object} An instance of Task class representing the Task.
     */
    function createTask(name, id = null, status = "to-do") {
        if (id === null) {
            // Generate a random id with following format: "X1234".
            id = ("X" + (Math.round(Math.random() * 10000)).toString());
        }
        newTask = new Task(name, id, status);
        return newTask;
    }

    /**
     * Function to add a Task object to the HTML view.
     *
     * Responsibilities of this function:
     *  1) Request a HTML <li> element to be created from the passed Task
     *      object.
     *  2) Make this HTML element "draggable".
     *  3) Set up a "delete" button beside the Task.
     *  4) Append the Task element to the correct swim lane, depending on its
     *      status.
     *
     * @param {object} task Instance of Task class representing the Task to add
     *     to the DOM.
     */
    function addTaskToDOM(task) {
        var newTaskElement = task.toDOMElement('li');
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

    /**
     * Event Handler to remove a Task from the DOM and client's localStorage.
     */
    function deleteTask(evt) {
        // Remove the Task from the DOM.
        var taskToDelete = evt.target.parentNode;
        var parentList = taskToDelete.parentNode;
        parentList.removeChild(taskToDelete);

        // Remove the Task from the client's localStorage.
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        delete tasks[taskToDelete.id];
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    /**
     * Function to allow a HTML element to be "dragged" on the DOM.
     *
     * @param {string} taskElement The HTML element to make draggable.
     */
    function makeElementDraggable(taskElement) {
        taskElement.draggable = true;
        taskElement.addEventListener("dragstart", handleDragStart, false);
    }

    /**
     * Store a Task instance to the client's localStorage.
     *
     * @param {object} task Task instance to store in localStorage.
     */
    function storeTaskToDisk(task) {
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[task.id] = {name: task.name, status: task.status};
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

})();
