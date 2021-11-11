export const MAX_NUMBER_BOARD = 75;

export const BOARD_PARAMS = {
  B: { value: 16, min: 1, max: 15, key: "B", index: 0 },
  I: { value: 31, min: 16, max: 30, key: "I", index: 1 },
  N: { value: 46, min: 31, max: 45, key: "N", index: 2 },
  G: { value: 61, min: 46, max: 60, key: "G", index: 3 },
  O: { value: 75, min: 61, max: 75, key: "O", index: 4 },
};

export const ANIMATION = {
  min: 4,
  max: 10,
  default: 6,
};

export const SPEED = {
  min: 5,
  max: 20,
  default: 10,
};

const transpose = (matrix) => {
  return Object.keys(matrix[0]).map(function (c) {
    return matrix.map((r) => {
      return r[c];
    });
  });
};

export const getBingoCard = () => {
  let arr = [
    [], // b (1-15)
    [], // i (16-30)
    [], // n (31-45)
    [], // g (46-60)
    [], // o (51-75)
  ];

  for (let i = 0; i < arr.length; i++) {
    let min = i * 15 + 1;
    let max = min + 15;

    while (arr[i].length < 5) {
      let num = Math.floor(Math.random() * (max - min)) + min;

      if (!arr[i].includes(num)) {
        arr[i].push(num);
      }
    }

    arr[i].sort((a, b) => a - b);
  }

  return transpose(arr);
};

export const createBoard = () =>
  Array.from({ length: MAX_NUMBER_BOARD }, (_, i) => i + 1).reduce(
    (board, number) => ({ ...board, [number]: false }),
    {}
  );

export const generateMatrix = (value = null) => Array.from(Array(5), () => new Array(5).fill(value));

export const getNumberBoard = (board) =>
  Object.keys(board).reduce((sum, key) => (board[key] ? [...sum, +key] : sum), []);

export const getHead = (number) => {
  if (number >= BOARD_PARAMS.B.min && number <= BOARD_PARAMS.B.max) return BOARD_PARAMS.B;

  if (number >= BOARD_PARAMS.I.min && number <= BOARD_PARAMS.I.max) return BOARD_PARAMS.I;

  if (number >= BOARD_PARAMS.N.min && number <= BOARD_PARAMS.N.max) return BOARD_PARAMS.N;

  if (number >= BOARD_PARAMS.G.min && number <= BOARD_PARAMS.G.max) return BOARD_PARAMS.G;

  if (number >= BOARD_PARAMS.O.min && number <= BOARD_PARAMS.O.max) return BOARD_PARAMS.O;
};
