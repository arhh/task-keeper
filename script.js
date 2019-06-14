(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    var toDoList;
    var doingList;
    var doneList;

    var lists;

    var toDoListItems;
    var doingListItems;
    var doneListItems;

    function init() {

        toDoList = document.querySelector("#to-do-list");
        doingList = document.querySelector("#doing-list");
        doneList = document.querySelector("#done-list");

        lists = [toDoList, doingList, doneList];

        toDoListItems = document.querySelectorAll("#to-do-list li");
        doingListItems = document.querySelectorAll("#doing-list li");
        doneListItems = document.querySelectorAll("#done-list li");

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

        checkIsEmpty(evt.target);

        var draggedElement = evt.dataTransfer.getData("listItem");
        evt.target.insertBefore(document.querySelector("#" + draggedElement), evt.target.childNodes[0]);
    }

    // When element/cursor hovers over drop zone, prevent browser intervening.
    function handleDragover(evt) {
        evt.preventDefault();
    }

    function monitorLists() {
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            checkIsEmpty(list);
        }
    }

    function checkIsEmpty(l) {
        console.log(l);
        if (l.children.length === 1) {
            l.style.height = "50px";
        }
        else {
            l.style.height = null;
        }
    }

})();
