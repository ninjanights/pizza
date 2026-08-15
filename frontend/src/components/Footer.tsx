export default function Footer() {
  return (
    <footer className="h-16 border-t border-neutral-300/40 bg-transparent">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-center gap-3 text-sm text-neutral-700">
        <img src="/pizza.svg" alt="Pizza" className="h-5 w-5" />

        <span className="text-neutral-500">•</span>

        <a href="https://github.com/ninjanights/pizza" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-700 hover:underline">
          https://github.com/ninjanights/pizza
        </a>
      </div>
    </footer>
  );
}
