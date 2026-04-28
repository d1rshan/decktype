export function Spinner() {
  return (
    <div
      class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
      aria-label="Loading"
      role="status"
    />
  );
}

export default Spinner;
