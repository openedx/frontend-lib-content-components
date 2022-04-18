console.log(process.argv);

// xblock name is is the third argument after node and fedx-scripts
const xblockName = process.argv[2];



// I. Files
const fs = require('fs');

const filepath = `src/editors/containers/${xblockName}Editor/index.jsx`;
const contents = 'Learn Node FS module';



fs.mkdir(`src/editors/containers/${xblockName}Editor/`, { recursive: true }, (err) => {
  if (err) { throw err; }
});

fs.writeFile(filepath, contents, (err) => {
  if (err) { throw err; } else {
    console.log(`Editor is created successfully at ${filepath}`);
  }
});



// II. Constants

// Add blockname and title to editors/data/constants/app.js
