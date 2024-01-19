exports.run = function run(fn) {
    fn()
    .then((code = 0) => {
      process.exit(code);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  };