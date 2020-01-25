import Link from 'next/link';

const Post = () => {
  return (
    <div className='post'>
      <Link href='#'>
        <a className='post-link'>
          <h2 className='post-title'>Post Title</h2>
        </a>
      </Link>
      <p className='post-date'>Month 01, 2020</p>
    </div>
  );
};

export default Post;
