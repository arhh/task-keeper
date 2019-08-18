# Task Keeper

## What is Task Keeper
Task Keeper is a Kanban-like board for helping you keep track of your work.

There are three "swim lanes":
* **To Do**: Lists tasks that you _will do_.
* **Doing**: Lists tasks that you are _currently doing_.
* **Done**: Lists tasks that you have _completed_.

When you create a task, it is placed in the **To Do** swim lane. You then drag
this task to the **Doing** lane when you have started working on it. When you
have completed the task, drag it to the **Done** lane.

## Features
* Create and Delete tasks.
* Interactive drag and drop from swim lane to swim lane using cursor.

## Technologies Used
* Drag and Drop API.
* Web Storage API.

## Known Issues and Workarounds

### A. Task can become a Child of another Task
Dragging an item _onto_ another item will make the dragged item a _child_ of the other item, essentially sticking the two items together.

#### Workaround
Tasks must be carefully dragged onto the blue zones of a swim lane to be successfully dropped into the lane.

### B. Task Ordering on Reload
Reloading the session discards the ordering of tasks on each swim lane.

## Feature Roadmap
* Editing tasks.
