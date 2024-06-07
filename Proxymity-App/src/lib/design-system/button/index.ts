type ButtonEvent<T extends Event = Event> = T & {
   currentTarget: EventTarget & HTMLButtonElement;
};

export type ButtonEvents = {
   click: ButtonEvent<MouseEvent>;
   focus: ButtonEvent<FocusEvent>;
};
