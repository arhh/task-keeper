(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    var mainAppContent;
    var createTaskModal;

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

        // Must retrieve locally stored items here before continuing

        setUpMainAppContent();
        setUpCreateTaskModal();
    }

    function setUpMainAppContent() {
        makeItemsDraggable();
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

    function makeItemsDraggable() {
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
        createTaskModal.modal.style.display = "block";
    }

    function deleteItem(evt) {
        var deleteCandidate = evt.target.parentNode;
        var parentList = deleteCandidate.parentNode;
        parentList.removeChild(deleteCandidate);
    }

    function closeTaskCreator(evt) {
        evt.preventDefault();
        if (evt.type === "submit") {
            var formData = new FormData(createTaskModal.form);
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
            mainAppContent.lists.toDoList.appendChild(newToDoItem);
        }
        createTaskModal.modal.style.display = "none";
    }

})();
