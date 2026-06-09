const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Vehicle maintenance scheduler listening on port ${port}`);
});
