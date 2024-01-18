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

  exports.PAPA_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  exports.PAPA_PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"