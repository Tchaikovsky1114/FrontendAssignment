export enum ToastType {
  NOTICE = 'notice',
  UNDO = 'undo',
}

export interface ToastMessage {
  message: string;
  type: ToastType;
  messageKey: string;
}
