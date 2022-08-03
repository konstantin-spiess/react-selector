export interface Message {
  name: string;
}

export function isMessage(message: Message): message is Message {
  return typeof message.name === 'string';
}

export interface InitMessage extends Message {
  name: 'init';
  tabId: number;
}

export function isInitMessage(message: Message): message is InitMessage {
  return message.name === 'init';
}

export interface ChangeSelectionMessage extends Message {
  tabId: number;
  name: 'updateSelection';
}

export function isChangeSelectionMessage(message: Message): message is ChangeSelectionMessage {
  return message.name === 'updateSelection';
}

export interface LogMessage extends Message {
  name: 'log';
  payload: any;
}

export function isLogMessage(message: Message): message is LogMessage {
  return message.name === 'log';
}
