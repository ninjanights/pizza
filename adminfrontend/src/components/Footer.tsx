export default function Footer() {
  return (
    <footer className="w-full py-4">
      <div className="mx-auto max-w-screen-lg flex items-center justify-center gap-3 text-sm text-neutral-700">
        <img src="/pizza.svg" alt="Pizza" className="h-5 w-5" />

        <span className="text-neutral-500">•</span>

        <a href="https://github.com/ninjanights/pizza" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-700 hover:underline">
          https://github.com/ninjanights/pizza
        </a>
      </div>
    </footer>
  );
}
