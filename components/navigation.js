import Link from 'next/link';
import PropTypes from 'prop-types';

const links = [
  {
    path: '/',
    label: 'Writing'
  },
  {
    path: '/projects',
    label: 'Projects'
  },
  {
    path: '/about',
    label: 'About'
  }
];

const Navigation = ({ currentPath }) => {
  const navItems = links.map((link, idx) => {
    const isActivePage = currentPath === link.path;

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
  currentPath: PropTypes.string
};

export default Navigation;
