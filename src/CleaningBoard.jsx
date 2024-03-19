import React, { useState } from "react";
import { employees } from "./data";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid ,
  margin: `0 0 ${grid}px 0`,
  borderRadius:'5px',
  background: isDragging ? "lightgreen" : "rgb(255 255 255)",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "rgb(223 223 226)",
  padding: grid,
  width: 250,
});
function CleaningBoard() {
  const [items, setItems] = useState(employees);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }
    if (source.droppableId !== destination.droppableId) {
      const task = items
        .find((item) => item.id === +source.droppableId.split("-")[1])
        .tasks.find((task) => task.title === +draggableId.split("-")[1]);
      setItems((oldVal) =>
        oldVal.map((item) => {
          if (item.id === +source.droppableId.split("-")[1]) {
            return {
              ...item,
              tasks: item.tasks.filter(
                (task) => task.title !== +draggableId.split("-")[1]
              ),
            };
          }
          const sortedTasks = [...item.tasks, task].sort((a, b) => {
            return a.title - b.title;
          });
          if (item.id === +destination.droppableId.split("-")[1]) {
            return {
              ...item,
              tasks: sortedTasks,
            };
          }

          return item;
        })
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="main-div">
        {items.map((item) => (
          <Droppable
            droppableId={`droppable-${item.id}`}
            key={`droppable-${item.id}`}
          >
            {(provided, snapshot) => (
              <div
                className="column"
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                <div className="column-title">{item.name}</div>
                {item.tasks.map((task, index) => (
                  <Draggable
                    key={`draggable-${task.title}`}
                    draggableId={`draggable-${task.title}`}
                    index={index}
                    className="item"
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        className="column-subTitle"
                      >
                        <p>title: {task.title}</p>
                        <p>duration: {task.duration} min</p>
                        <p>apartment: {task.apartment}</p>
                        <p>deadline: {task.deadline}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default CleaningBoard;
