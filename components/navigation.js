import Link from 'next/link';
import PropTypes from 'prop-types';

const NavLink = ({ currentPath, path, label, matcher, customClasses }) => {
  return (
    <Link href={path}>
      <a
        className={`${customClasses ? customClasses : ''} ${
          matcher.test(currentPath) ? 'underline' : 'no-underline'
        } px-4 bg-white text-lg dark:bg-ghBlack dark:text-gray-300`}
      >
        {label}
      </a>
    </Link>
  );
};

const Navigation = ({ currentPath }) => {
  return (
    <nav
      className='
        flex justify-center relative z-0
        before:border-b before:border-gray-300  dark:before:border-ghGreyBorder before:-z-1 before:absolute
        before:top-1/2 before:w-full
      '
    >
      <NavLink
        currentPath={currentPath}
        path='/'
        label='Writing'
        matcher={/\/\[slug\]|^\/$/}
      />
      <NavLink
        currentPath={currentPath}
        path='/projects'
        label='Projects'
        matcher={/\/projects/}
        customClasses={'mx-8 md:mx-10'}
      />
      <NavLink
        currentPath={currentPath}
        path='/about'
        label='About'
        matcher={/\/about/}
      />
    </nav>
  );
};

Navigation.propTypes = {
  currentPath: PropTypes.string.isRequired,
};

export default Navigation;
