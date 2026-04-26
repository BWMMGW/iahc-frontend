import Link from 'next/link';
import Head from 'next/head';
import type { NextPage } from 'next';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <div className="max-w-[480px] w-full bg-white rounded-[32px] shadow-[0_20px_35px_-8px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="pt-10 px-8 pb-8 text-center">
          <h1 className="!text-6xl !font-bold !text-primary !mb-2 !bg-none">
            404
          </h1>
          <h2 className="!text-2xl !font-semibold !text-primary-light !mb-4">
            Page Not Found
          </h2>
          <p className="!text-base !leading-relaxed !mb-8 !text-text">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold no-underline hover:bg-primary-dark transition-all duration-200"
          >
            Go back home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
