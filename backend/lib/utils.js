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

exports.resp = (fn) => {
  if (typeof fn !== 'function') {
    console.log('fn should be function')
    throw new Error('fn should be function');
  }
  fn(req, res)
    .then(response => {
      console.log(response)
      res.status(200).send(res)
    })
    .catch(err => {
      console.log(err.message)
      res.status(400).send(err.message)
    })
}