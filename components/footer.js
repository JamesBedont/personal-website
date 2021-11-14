const Footer = () => {
  return (
    <footer className='flex justify-center mt-4 flex-shrink-0 p-5'>
      <a
        className='underline text-lg'
        href='https://github.com/JamesBedont'
        rel='noopener'
      >
        Github
      </a>
      <span className='mx-3 text-lg'>•</span>
      <a
        className='underline text-lg'
        href='https://www.linkedin.com/in/jamesbedont/'
        rel='noopener'
      >
        Linkedin
      </a>
      <span className='mx-3 text-lg'>•</span>
      <a
        className='underline text-lg'
        href='https://twitter.com/JamesBedont'
        rel='noopener'
      >
        Twitter
      </a>
      <span className='mx-3 text-lg'>•</span>
      <a className='underline text-lg' href='/feed' rel='noopener'>
        RSS
      </a>
    </footer>
  );
};

export default Footer;
