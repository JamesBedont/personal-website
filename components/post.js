import Link from 'next/link';
import PropTypes from 'prop-types';

const Post = ({ title, link, date }) => {
  return (
    <div className='post'>
      <Link href={link}>
        <a className='post-link'>
          <h2 className='post-title'>{title}</h2>
        </a>
      </Link>
      <p className='post-date'>{date}</p>
    </div>
  );
};

Post.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default Post;
