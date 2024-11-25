export function isEnterKeyEvent(event: any): boolean {
  return event?.key === 'Enter';
}

export function isEscapeKeyEvent(event: any): boolean {
  return event?.key === 'Escape';
}

export function isArrowUpKeyEvent(event: any): boolean {
  return event?.key === 'ArrowUp';
}

export function isArrowDownKeyEvent(event: any): boolean {
  return event?.key === 'ArrowDown';
}
