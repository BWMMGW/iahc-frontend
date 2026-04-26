import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-soft-pink mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_2fr] gap-10">
          {/* Brand section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                  <rect width="24" height="24" rx="4" fill="#000" />
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="1.2"
                    d="M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-text">iahc Network.</span>
                <span className="text-sm text-text-muted">Innovating Tomorrow</span>
              </div>
            </div>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              Creating cutting-edge solutions for the digital age. We transform complex challenges into intuitive experiences.
            </p>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Company */}
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-base text-text relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                Company
              </h3>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                <li><Link href="https:///iahc.ir/" className="text-sm text-text-muted hover:text-primary transition">Home</Link></li>
                <li><Link href="https:///iahc.ir/about" className="text-sm text-text-muted hover:text-primary transition">About Us</Link></li>
                <li><Link href="https:///iahc.ir/partners" className="text-sm text-text-muted hover:text-primary transition">Partners</Link></li>
                <li><Link href="https:///iahc.ir/contact" className="text-sm text-text-muted hover:text-primary transition">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-base text-text relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                Legal
              </h3>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                <li><Link href="https:///iahc.ir/privacy-policy" className="text-sm text-text-muted hover:text-primary transition">Privacy Policy</Link></li>
                <li><Link href="https:///iahc.ir/website-terms" className="text-sm text-text-muted hover:text-primary transition">Terms of Use</Link></li>
              </ul>
            </div>

            {/* Additional group (optional) - kept for spacing */}
            <div className="hidden sm:block" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-soft-pink flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-text-muted text-center sm:text-left">
            Copyright © {currentYear} iahc Network. All rights reserved.
          </div>
          <div className="flex gap-3">
            <a
              href="https://github.com/bwmmgw/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-white border border-soft-pink text-text-muted hover:text-primary hover:bg-soft-pink/20 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
