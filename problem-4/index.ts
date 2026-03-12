const sum_to_n_a: (n: number) => number = (n: number) => {
  // simple math formula --> complexity: O(1)
  return (n * (n + 1)) / 2;
};

const sum_to_n_b: (n: number) => number = (n: number) => {
  // simple loop --> complexity: O(n)
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

const sum_to_n_c: (n: number) => number = (n: number) => {
  // recursive --> complexity: O(n)
  if (n === 0) return 0;
  if (n === 1) return 1;

  return n + sum_to_n_c(n - 1);
};

const main = () => {
  const number = 4;

  console.log(sum_to_n_a(number));
  console.log(sum_to_n_b(number));
  console.log(sum_to_n_c(number));
};

main();
