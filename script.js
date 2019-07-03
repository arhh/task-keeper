(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    var toDoList;
    var doingList;
    var doneList;

    // var toDoListItems;
    // var doingListItems;
    // var doneListItems;

    var createTaskButton;
    var createTaskModalCloseButton;

    var createTaskForm;

    var createTaskModal;

    function init() {

        toDoList = document.querySelector("#to-do-list");
        doingList = document.querySelector("#doing-list");
        doneList = document.querySelector("#done-list");

        createTaskButton = document.querySelector("#create-task-button");
        createTaskModalCloseButton = document.querySelector("#create-task-modal .close-modal");

        // toDoListItems = document.querySelectorAll("#to-do-list li");
        // doingListItems = document.querySelectorAll("#doing-list li");
        // doneListItems = document.querySelectorAll("#done-list li");

        createTaskForm = document.querySelector("#create-task-form");

        createTaskModal = document.querySelector("#create-task-modal");

        toDoList.addEventListener("drop", handleDrop, false);
        toDoList.addEventListener("dragover", handleDragover, false);
        doingList.addEventListener("drop", handleDrop, false);
        doingList.addEventListener("dragover", handleDragover, false);
        doneList.addEventListener("drop", handleDrop, false);
        doneList.addEventListener("dragover", handleDragover, false);

        createTaskButton.addEventListener("click", launchTaskCreator, false);
        createTaskModalCloseButton.addEventListener("click", closeTaskCreator, false);
        createTaskForm.addEventListener("submit", closeTaskCreator, false);

        for (let i = 0; i < toDoList.childElementCount; i++) {
            // console.log(toDoListItems[i]);
            toDoList.children[i].addEventListener("dragstart", handleDragStart, false);
        }

        for (let i = 0; i < doingList.childElementCount; i++) {
            console.log(doingList.children[i]);
            doingList.children[i].addEventListener("dragstart", handleDragStart, false);
        }

        for (let i = 0; i < doneList.childElementCount; i++) {
            // console.log(doneListItems[i]);
            doneList.children[i].addEventListener("dragstart", handleDragStart, false);
        }
    }

    // Store the id of the item being dragged and set the mouse cursor.
    // Called when item is "lifted" by cursor.
    function handleDragStart(evt) {
        evt.dataTransfer.setData("listItem", evt.target.id);
        evt.dataTransfer.setData("previousList", evt.target.parentNode.id);
    }

    // Get the element that's stored (i.e. the item being dragged) and append
    // to target (i.e. the target list).
    // The item being dragged is automatically removed from the previous parent.
    function handleDrop(evt) {
        evt.preventDefault();

        var previousList = evt.dataTransfer.getData("previousList");
        checkIsEmpty(document.querySelector("#" + previousList));

        var draggedElement = evt.dataTransfer.getData("listItem");
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
        createTaskModal.style.display = "block";
    }

    function deleteItem(evt) {
        var deleteCandidate = evt.target.parentNode;
        var parentList = deleteCandidate.parentNode;
        parentList.removeChild(deleteCandidate);
    }

    function closeTaskCreator(evt) {
        evt.preventDefault();
        if (evt.type === "submit") {
            var formData = new FormData(createTaskForm);
            var newToDoItem = document.createElement("li");
            var randomId = Math.round(Math.random() * 1000);
            newToDoItem.id = "x" + randomId.toString();
            newToDoItem.draggable = true;
            newToDoItem.innerHTML = formData.get("task-name");
            newToDoItem.addEventListener("dragstart", handleDragStart, false);
            var deleteButton = document.createElement("a");
            deleteButton.className = "delete-item";
            deleteButton.innerHTML = "&times;";
            deleteButton.addEventListener("click", deleteItem, false);
            newToDoItem.appendChild(deleteButton);
            toDoList.appendChild(newToDoItem);
        }
        createTaskModal.style.display = "none";
    }

})();
