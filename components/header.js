import { useRouter } from 'next/router';
import Navigation from '../components/navigation';
import Link from 'next/link';
import { Fragment } from 'react';

const Header = () => {
  const { pathname } = useRouter();

  return (
    <Fragment>
      <header className='flex flex-col items-center'>
        <div className='flex items-center mb-3 mt-3'>
          <Link href='/'>
            <img
              className='rounded-full w-24'
              src='/headshot.webp'
              id='headshot'
              alt='headshot of james bedont'
            />
          </Link>
          <div className='ml-3'>
            <h1 className='text-4xl font-medium'>James Bedont</h1>
            <h2 className='text-base'>Software Engineer</h2>
          </div>
        </div>
      </header>
      <Navigation currentPath={pathname} />
    </Fragment>
  );
};

export default Header;
