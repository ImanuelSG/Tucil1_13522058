import type { matrix, sequence, Tokens } from "../../app/types/main";
type Result = {
  sequence: sequence[];
  matrix: matrix;
};
export default function randomizeInput(
  lengthsequence: number,
  sequence: string[],
  row: number,
  col: number,
  numsequence: number
): Result {
  const randomMatrix = generateRandomMatrix(row, col, sequence);
  const randomSequences = generateRandomSequence(
    sequence,
    lengthsequence,
    numsequence
  );
  return {
    sequence: randomSequences,
    matrix: randomMatrix,
  };
}

function generateRandomMatrix(
  row: number,
  col: number,
  tokens: string[]
): matrix {
  const matrix: matrix = {
    row,
    col,
    element: [],
  };

  for (let i = 0; i < row; ++i) {
    matrix.element[i] = [];
    for (let j = 0; j < col; ++j) {
      const index = Math.floor(Math.random() * tokens.length);
      matrix.element[i][j] = generateToken(tokens[index], i, j);
    }
  }

  return matrix;
}

function generateToken(
  identifier: string,
  baris: number,
  kolom: number
): Tokens {
  return {
    identifier: identifier,
    position: {
      baris: baris,
      kolom: kolom,
    },
  };
}
function generateSequence(
  randomLength: number,
  randomTokens: Tokens[],
  randomPrize: number
): sequence {
  return {
    tokens: randomTokens,
    length: randomLength,
    prize: randomPrize,
  };
}

function generateRandomSequence(
  tokens: string[],
  maxLength: number,
  num: number
): sequence[] {
  const sequences: sequence[] = [];
  for (let i = 0; i < num; i++) {
    const randomLength = Math.floor(Math.random() * (maxLength - 1)) + 2;

    const randomTokens: Tokens[] = [];
    for (let j = 0; j < randomLength; j++) {
      const randomIndex = Math.floor(Math.random() * tokens.length);
      randomTokens.push(generateToken(tokens[randomIndex], 0, 0));
    }

    const randomPrize = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    sequences.push(generateSequence(randomLength, randomTokens, randomPrize));
  }
  return sequences;
}
