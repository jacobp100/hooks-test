import React, { useEffect, useImperativeMethods } from "react";
import { DragSource, DropTarget } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { flow } from "lodash/fp";
import { TYPE_ITEM } from "../../dnd";

export const useDnd = (
  props,
  imperativeMethods,
  { nodeAtPosition, onNodeMoved }
) => {
  useEffect(() => {
    props.connectDragPreview(getEmptyImage());
  }, []);

  useImperativeMethods(imperativeMethods, () => ({
    nodeAtPosition,
    onNodeMoved
  }));

  return children =>
    props.connectDragSource(props.connectDropTarget(<div>{children}</div>), {
      dropEffect: "copy"
    });
};

const WrapAsClass = BaseComponent =>
  class WrapAsClass extends React.Component {
    decoratedInstance = React.createRef();

    getDecoratedComponentInstance() {
      return this.decoratedInstance.current;
    }

    render() {
      return <BaseComponent ref={this.decoratedInstance} {...this.props} />;
    }
  };

export const connectDnd = flow(
  // It breaks without this :(
  WrapAsClass,
  DragSource(
    TYPE_ITEM,
    {
      beginDrag(props, monitor, component) {
        const node = component
          .getDecoratedComponentInstance()
          .nodeAtPosition(monitor.getClientOffset());
        return { node };
      }
    },
    connect => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview()
    })
  ),
  DropTarget(
    [TYPE_ITEM],
    {
      hover(props, monitor, component) {
        const node = component
          .getDecoratedComponentInstance()
          .getDecoratedComponentInstance()
          .nodeAtPosition(monitor.getClientOffset());
        monitor.getItem().__canvasNode = node;
      },
      canDrop(props, monitor) {
        // Ugh this is shitty.
        // We need access to the component, which we don't have
        return monitor.getItem().__canvasNode != null;
      },
      drop(props, monitor, component) {
        const { node: from, __canvasNode: to } = monitor.getItem();
        component
          .getDecoratedComponentInstance()
          .getDecoratedComponentInstance()
          .onNodeMoved({ from, to });
      }
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget()
    })
  )
);
