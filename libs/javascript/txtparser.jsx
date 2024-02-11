export default function readTxt(content) {
  const data = content.split("\n");
  let info = {
    buffer_size: parseInt(data[0]),
    matrix: {
      element: [],
      row: 0,
      col: 0,
    },
    sequences: [],
  };
  const matrixSize = data[1].split(" ");
  info.matrix.row = parseInt(matrixSize[0]);
  info.matrix.col = parseInt(matrixSize[1]);
  for (let i = 0; i < info.matrix.row; i++) {
    const row = data[2 + i];
    const rowTokens = [];
    for (let j = 0; j < info.matrix.col; j++) {
      const token = {
        identifier: row.substr(j * 3, 2),
        position: { baris: i, kolom: j },
      };
      rowTokens.push(token);
    }
    info.matrix.element.push(rowTokens);
  }

  // Parse sequences
  let index = 2 + info.matrix.row;
  const numSequences = parseInt(data[index]);
  for (let i = 0; i < numSequences; i++) {
    index++;
    const sequenceTokens = data[index].match(/.{1,3}/g);
    const tokens = sequenceTokens.map((token) => ({
      identifier: token.substring(0, 2),
      position: {
        baris: 0,
        kolom: 0,
      },
    }));
    const sequence = {
      tokens: tokens,
      length: tokens.length,
      prize: parseInt(data[index + 1]),
    };
    info.sequences.push(sequence);
    index++;
  }

  return info;
}
