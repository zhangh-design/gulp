const fast = () => {
  const b = "hello gulp";
  console.info("===========fast==========" + b);
  function timeout(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms, 'done');
    });
  }

  timeout(1000).then((value) => {
    console.log(value);
  });
};

export default fast;
