
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export type Id = string;
  export type DraggableId = Id;
  export type DroppableId = Id;
  export type TypeId = Id;
  export type ZIndex = React.CSSProperties['zIndex'];
  export type DropReason = 'DROP' | 'CANCEL';
  export type Announce = (message: string) => void;

  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }

  export interface DraggableRubric {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
  }

  export interface Combine {
    draggableId: DraggableId;
    droppableId: DroppableId;
  }

  export interface DropResult {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
    destination: DraggableLocation | null;
    reason: DropReason;
    combine: Combine | null;
  }

  export interface ResponderProvided {
    announce: Announce;
  }

  export type OnBeforeCaptureResponder = (before: BeforeCapture) => void;
  export type OnBeforeDragStartResponder = (start: DragStart) => void;
  export type OnDragStartResponder = (
    start: DragStart,
    provided: ResponderProvided,
  ) => void;
  export type OnDragUpdateResponder = (
    update: DragUpdate,
    provided: ResponderProvided,
  ) => void;
  export type OnDragEndResponder = (
    result: DropResult,
    provided: ResponderProvided,
  ) => void;

  export type DraggableChildrenFn = (
    dragProvided: DraggableProvided,
    dragSnapshot: DraggableStateSnapshot,
    dragRubric: DraggableRubric,
  ) => React.ReactNode;

  export type DroppableChildrenFn = (
    droppableProvided: DroppableProvided,
    droppableSnapshot: DroppableStateSnapshot,
  ) => React.ReactNode;

  export interface DraggableProvided {
    draggableProps: DraggableProps;
    dragHandleProps: DragHandleProps | null;
    innerRef: (element: HTMLElement | null) => void;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    droppableProps: DroppableProps;
    placeholder: React.ReactNode | null;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    draggingOver: DroppableId | null;
    dropAnimation: DropAnimation | null;
    combineWith: DraggableId | null;
    combineTargetFor: DraggableId | null;
    mode: MovementMode | null;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
    draggingFromThisWith: DraggableId | null;
    isUsingPlaceholder: boolean;
  }

  export interface BeforeCapture {
    draggableId: DraggableId;
    mode: MovementMode;
  }

  export interface DragStart extends DraggableRubric {
    mode: MovementMode;
  }

  export interface DragUpdate extends DragStart {
    destination: DraggableLocation | null;
    combine: Combine | null;
  }

  export interface DropAnimation {
    duration: number;
    curve: string;
    moveTo: Position;
    opacity: number | null;
    scale: number | null;
  }

  export interface Position {
    x: number;
    y: number;
  }

  export interface DraggableProps {
    style?: React.CSSProperties;
    'data-rbd-draggable-context-id': string;
    'data-rbd-draggable-id': string;
    onTransitionEnd?: React.TransitionEventHandler<any>;
  }

  export interface DragHandleProps {
    'data-rbd-drag-handle-draggable-id': string;
    'data-rbd-drag-handle-context-id': string;
    'aria-describedby': string;
    role: string;
    tabIndex: number;
    draggable: boolean;
    onDragStart: React.DragEventHandler<any>;
  }

  export interface DroppableProps {
    'data-rbd-droppable-context-id': string;
    'data-rbd-droppable-id': string;
  }

  export type MovementMode = 'FLUID' | 'SNAP';

  export interface DraggableProps {
    draggableId: DraggableId;
    index: number;
    children: DraggableChildrenFn;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    type?: TypeId;
  }

  export interface DroppableProps {
    droppableId: DroppableId;
    type?: TypeId;
    mode?: DroppableMode;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    children: DroppableChildrenFn;
    renderClone?: DraggableChildrenFn;
    ignoreContainerClipping?: boolean;
    direction?: Direction;
    getContainerForClone?: () => HTMLElement;
  }

  export interface DragDropContextProps {
    children: React.ReactNode;
    onBeforeCapture?: OnBeforeCaptureResponder;
    onBeforeDragStart?: OnBeforeDragStartResponder;
    onDragStart?: OnDragStartResponder;
    onDragUpdate?: OnDragUpdateResponder;
    onDragEnd: OnDragEndResponder;
    sensors?: Sensor[];
    enableDefaultSensors?: boolean;
    nonce?: string;
  }

  export type DroppableMode = 'standard' | 'virtual';
  export type Direction = 'horizontal' | 'vertical';

  export interface Sensor {
    sensor: () => void;
    options?: Record<string, unknown>;
  }

  export const DragDropContext: React.FC<DragDropContextProps>;
  export const Draggable: React.FC<DraggableProps>;
  export const Droppable: React.FC<DroppableProps>;
}
