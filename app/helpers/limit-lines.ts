export default function limitLines(numberOfLines: number) {
  return (event: KeyboardEvent) => {
    const target = event.target as HTMLTextAreaElement;
    if (event.key === 'Enter') {
      const rows = getNumberOfRows(target);
      if (rows >= numberOfLines) {
        event.preventDefault();
        return false;
      }
    }
  };
}

function getNumberOfRows(textarea: HTMLTextAreaElement) {
  const value = textarea.value;
  return value.split('\n').length;
}
