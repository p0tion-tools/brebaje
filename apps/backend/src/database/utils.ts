export function pluralize(name: string): string {
  if (name.endsWith('y')) {
    return name.slice(0, -1) + 'ies';
  }
  return name + 's';
}

export function singularize(name: string): string {
  if (name.endsWith('ies')) {
    return name.slice(0, -3) + 'y';
  }
  if (name.endsWith('s')) {
    return name.slice(0, -1);
  }
  return name;
}
