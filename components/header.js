const Header = () => {
  return (
    <header>
      <div id='title-wrapper'>
        <img src='/headshot.jpeg' id='headshot' />
        <div id='title-text'>
          <h1 id='name'>James Bedont</h1>
          <h2 id='title'>Software Engineer</h2>
        </div>
      </div>
      <nav>
        <ul>
          <li>Writing</li>
          <li>Projects</li>
          <li>About</li>
        </ul>
        <div className='strike-through'></div>
      </nav>
    </header>
  );
};

export default Header;
