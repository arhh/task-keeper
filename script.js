(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    function init() {

        var toDoList = document.querySelector("#to-do-list");
        var doingList = document.querySelector("#doing-list");
        var doneList = document.querySelector("#done-list");

        var toDoListItems = document.querySelectorAll("#to-do-list li");
        var doingListItems = document.querySelectorAll("#doing-list li");
        var doneListItems = document.querySelectorAll("#done-list li");

        toDoList.addEventListener("drop", handleDrop, false);
        toDoList.addEventListener("dragover", handleDragover, false);
        doingList.addEventListener("drop", handleDrop, false);
        doingList.addEventListener("dragover", handleDragover, false);
        doneList.addEventListener("drop", handleDrop, false);
        doneList.addEventListener("dragover", handleDragover, false);

        for (let i = 0; i < toDoListItems.length; i++) {
            // console.log(toDoListItems[i]);
            toDoListItems[i].addEventListener("dragstart", handleDragStart, false);
        }

        for (let i = 0; i < doingListItems.length; i++) {
            // console.log(doingListItems[i]);
            doingListItems[i].addEventListener("dragstart", handleDragStart, false);
        }

        for (let i = 0; i < doneListItems.length; i++) {
            // console.log(doneListItems[i]);
            doneListItems[i].addEventListener("dragstart", handleDragStart, false);
        }
    }

    // Store the id of the item being dragged and set the mouse cursor.
    // Called when item is "lifted" by cursor.
    function handleDragStart(evt) {
        evt.dataTransfer.setData("text/plain", evt.target.id);
    }

    // Get the element that's stored (i.e. the item being dragged) and append
    // to target (i.e. the target list).
    // The item being dragged is automatically removed from the previous parent.
    function handleDrop(evt) {
        evt.preventDefault();

        var draggedElement = evt.dataTransfer.getData("text");
        evt.target.appendChild(document.querySelector("#" + draggedElement));
    }

    // When element/cursor hovers over drop zone, prevent browser intervening.
    function handleDragover(evt) {
        evt.preventDefault();
    }

})();
