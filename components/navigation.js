import Link from 'next/link';
import PropTypes from 'prop-types';

const links = [
  {
    path: '/',
    pathMatcher: /\/\[slug\]|^\/$/,
    label: 'Writing'
  },
  {
    path: '/projects',
    pathMatcher: /\/projects/,
    label: 'Projects'
  },
  {
    path: '/about',
    pathMatcher: /\/about/,
    label: 'About'
  }
];

const Navigation = ({ currentPath }) => {
  const navItems = links.map((link, idx) => {
    const isActivePage = link.pathMatcher.test(currentPath);

    const linkElement = isActivePage ? (
      <a className='active'>{link.label}</a>
    ) : (
      <a>{link.label}</a>
    );

    return (
      <li key={idx}>
        <Link href={link.path}>{linkElement}</Link>
      </li>
    );
  });

  return (
    <nav>
      <ul>{navItems}</ul>
      <div className='strike-through'></div>
    </nav>
  );
};

Navigation.propTypes = {
  currentPath: PropTypes.string.isRequired
};

export default Navigation;
