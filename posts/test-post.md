---
title: 'test post'
date: 01/01/2020
---

### example

this is a paragraph `emphasis` another thing

```javascript
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['haml']);

// The code snippet you want to highlight, as a string
const code = `= ['hi', 'there', 'reader!'].join " "`;

// Returns a highlighted HTML string
const html = Prism.highlight(code, Prism.languages.haml, 'haml');
```

```jsx
const HomePage = ({ posts }) => {
  const postElements = posts.map((post, idx) => <Post key={idx} {...post} />);
  return <Fragment>{postElements}</Fragment>;
};
```

```shell
ls -al
```

```json
{
  "key": "value"
}
```

```sql
SELECT * FROM users WHERE id = 1;
```
