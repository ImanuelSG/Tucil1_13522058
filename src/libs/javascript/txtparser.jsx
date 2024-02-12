export default function readTxt(content) {
  const lines = content.split("\n");

  // Validate input content
  if (lines.length < 5) {
    throw new Error("Invalid input format. Not enough lines.");
  }

  // Parse buffer size
  const bufferSize = parseInt(lines[0]);
  if (isNaN(bufferSize)) {
    throw new Error("Invalid buffer size.");
  }

  // Parse matrix size
  const matrixSize = lines[1].split(" ");
  if (matrixSize.length !== 2) {
    throw new Error("Invalid matrix size format.");
  }
  const matrixCols = parseInt(matrixSize[0]);
  const matrixRows = parseInt(matrixSize[1]);
  if (isNaN(matrixRows) || isNaN(matrixCols)) {
    throw new Error("Invalid matrix size.");
  }

  // Parse matrix elements
  const matrixElements = [];
  for (let i = 0; i < matrixRows; i++) {
    const rowLine = lines[2 + i];
    const rowTokens = [];
    const elements = rowLine.split(" ").filter((token) => token.trim());
    const lastTokenIndex = elements.length - 1;
    elements[lastTokenIndex] = elements[lastTokenIndex].replace(/\r/g, "");
    for (let j = 0; j < matrixCols; j++) {
      const token = elements[j];
      if (!/^[a-zA-Z0-9]{2}$/.test(token)) {
        throw new Error("Invalid token format in matrix.");
      }
      rowTokens.push({
        identifier: token,
        position: { baris: i, kolom: j },
      });
    }
    matrixElements.push(rowTokens);
  }

  // Parse sequences
  const sequences = [];
  let index = 2 + matrixRows;
  const numSequences = parseInt(lines[index]);
  if (isNaN(numSequences)) {
    throw new Error("Invalid number of sequences.");
  }
  for (let i = 0; i < numSequences; i++) {
    index++;
    const sequenceLine = lines[index];
    if (sequenceLine.length % 3 !== 0) {
      throw new Error("Invalid sequence format.");
    }
    const sequenceTokens = sequenceLine
      .split(" ")
      .filter((token) => token.trim());
    const lastTokenIndex = sequenceTokens.length - 1;
    sequenceTokens[lastTokenIndex] = sequenceTokens[lastTokenIndex].replace(
      /\r/g,
      ""
    );

    const tokens = sequenceTokens.map((token) => {
      if (!/^[a-zA-Z0-9]{2}$/.test(token)) {
        throw new Error("Invalid token format in sequence.");
      }
      return {
        identifier: token,
        position: { baris: 0, kolom: 0 },
      };
    });
    const prizeLine = lines[index + 1];
    const prize = parseInt(prizeLine);
    if (isNaN(prize)) {
      throw new Error("Invalid prize value.");
    }
    sequences.push({
      tokens: tokens,
      length: tokens.length,
      prize: prize,
    });
    index++;
  }

  return {
    buffer_size: bufferSize,
    matrix: {
      element: matrixElements,
      row: matrixRows,
      col: matrixCols,
    },
    sequences: sequences,
  };
}
