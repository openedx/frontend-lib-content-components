import React from 'react';
import PropTypes from 'prop-types';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const DraggableList = ({
  itemList,
  setState,
  updateOrder,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log('active: ', active);
    console.log('over: ', over);
    console.log(itemList);
    if (active.id !== over.id) {
      let updatedArray;
      setState(() => {
        const [activeElement] = itemList.filter(item => item.id === active.id);
        const [overElement] = itemList.filter(item => item.id === over.id);
        const oldIndex = itemList.indexOf(activeElement);
        const newIndex = itemList.indexOf(overElement);
        updatedArray = arrayMove(itemList, oldIndex, newIndex);
        console.log(updatedArray);
        console.log('old: ', oldIndex);
        console.log('new: ', newIndex);
        return updatedArray;
      });
      updateOrder(updatedArray);
      // updateOrder changed from origin
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemList}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};

DraggableList.propTypes = {
  itemList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  setState: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default DraggableList;
