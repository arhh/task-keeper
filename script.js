(function () {
    window.addEventListener("DOMContentLoaded", init, false);

    function init() {
        console.log("script init'd");

        var toDoListItems = document.querySelectorAll("#to-do-list li");
        var doingListItems = document.querySelectorAll("#doing-list li");
        var doneListItems = document.querySelectorAll("#done-list li");

        for (let i = 0; i < toDoListItems.length; i++) {
            console.log(toDoListItems[i]);
            toDoListItems[i].addEventListener("dragstart", handleDragStart, false);
            toDoListItems[i].addEventListener("dragend", handleDragEnd, false);
        }

        for (let i = 0; i < doingListItems.length; i++) {
            console.log(doingListItems[i]);
            doingListItems[i].addEventListener("dragstart", handleDragStart, false);
            doingListItems[i].addEventListener("dragend", handleDragEnd, false);
        }

        for (let i = 0; i < doneListItems.length; i++) {
            console.log(doneListItems[i]);
            doneListItems[i].addEventListener("dragstart", handleDragStart, false);
            doneListItems[i].addEventListener("dragend", handleDragEnd, false);
        }

        return false;
    }

    function handleDragStart(event) {
        console.log(event.target);
        return false;
    }

    function handleDragEnd(event) {
        console.log(event.target);
        return false;
    }
})();
