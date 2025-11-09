import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto flex justify-between items-center py-4">
        <div className="text-lg font-bold">My App</div>
        <div className="flex space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/upload-flashcards" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
            Kendi Kartlarım
          </Link>
        </div>
      </nav>
      <nav className="hidden md:flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/upload-flashcards" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
          Kendi Kartlarım
        </Link>
      </nav>
    </header>
  );
}