import Link from 'next/link';
import PropTypes from 'prop-types';

const Post = ({ title, slug, date }) => {
  return (
    <div className='py-8'>
      <Link href='/[slug]' as={`/${slug}`}>
        <a>
          <h2 className='text-2xl font-medium'>{title}</h2>
        </a>
      </Link>
      <p className='text-gray-500 text-lg'>{date}</p>
    </div>
  );
};

Post.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Post;
