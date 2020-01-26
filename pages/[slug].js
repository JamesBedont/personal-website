import { useRouter } from 'next/router';

const PostPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return <p>Post: {slug}</p>;
};

export default PostPage;
