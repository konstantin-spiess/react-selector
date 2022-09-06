import { Selector } from './selector';

export interface Message {
  name: string;
}

export function isMessage(message: any): message is Message {
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
  name: 'updateSelection';
  tabId: number;
  selectionId: string;
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

export interface SelectorMessage extends Message {
  name: 'selector';
  selectors: Selector[];
}

export function isSelectorMessage(message: Message): message is SelectorMessage {
  return message.name === 'selector';
}
