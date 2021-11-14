const Footer = () => {
  return (
    <footer className='flex justify-center mt-4 flex-shrink-0 p-5'>
      <a
        className='underline text-lg dark:text-gray-300'
        href='https://github.com/JamesBedont'
        rel='noopener'
      >
        Github
      </a>
      <span className='mx-3 text-lg dark:text-gray-300'>•</span>
      <a
        className='underline text-lg dark:text-gray-300'
        href='https://www.linkedin.com/in/jamesbedont/'
        rel='noopener'
      >
        Linkedin
      </a>
      <span className='mx-3 text-lg dark:text-gray-300'>•</span>
      <a
        className='underline text-lg dark:text-gray-300'
        href='https://twitter.com/JamesBedont'
        rel='noopener'
      >
        Twitter
      </a>
      <span className='mx-3 text-lg dark:text-gray-300'>•</span>
      <a
        className='underline text-lg dark:text-gray-300'
        href='/feed'
        rel='noopener'
      >
        RSS
      </a>
    </footer>
  );
};

export default Footer;
