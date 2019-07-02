# Task Keeper

## What is Task Keeper
Task Keeper is a Kanban board for helping you keep track of your work.

There are three "swim lanes":
* **To Do**: Lists tasks that you _will do_.
* **Doing**: Lists tasks that you are _currently doing_.
* **Done**: Lists tasks that you have _completed_.

When you create a task, it is placed in the **To Do** swim lane. You then drag
this task to the **Doing** lane when you have started working on it. When you
have completed the task, drag it to the **Done** lane.

## Technologies Used
* HTML5 Drag and Drop API.

## Current Limitations
* Tasks must be carefully dragged onto the blue zones of a swim lane to be successfully dropped into the lane.

## Known Issues
* Dragging an item _onto_ another item will make the dragged item a _child_ of the other item, essentially sticking the two items together.

## Roadmap
* Editing tasks.
* Maintenance of tasks over multiple browser sessions.
