"use client";
import { useRef, useState } from "react";
import readTxt from "../libs/javascript/txtparser";
import type { Point, Tokens, sequence } from "../app/types/main";
import randomizeInput from "../libs/javascript/randomizer";
import toast from "react-hot-toast";
export default function InputForm() {
  const [method, setMethod] = useState("txtfile");
  const [bufferSize, setBufferSize] = useState<number>();
  const [matrixCol, setMatrixCol] = useState<number>();
  const [matrixRow, setMatrixRow] = useState<number>();
  const [matrixElements, setMatrixElements] = useState<Tokens[][]>();
  const [sequences, setSequences] = useState<sequence[]>([]);
  const [result, setResult] = useState<boolean>(false);
  const [verified, setVerified] = useState(false);
  const [reward, setreward] = useState<number>();
  const [sequence, setsequence] = useState<string>();
  const [time, settime] = useState<number>();
  const [points, setpoint] = useState<Point[]>();
  const [resultMethod, setResultMethod] = useState<string>();
  const [sequenceLength, setSequenceLength] = useState<number>();
  const [sequencenum, setSequencenum] = useState<number>();
  const [sequenceTokens, setSequenceTokens] = useState<string[]>([]);
  const [uniqueLength, setuniqueLength] = useState<number>();
  const [filename, setFilename] = useState<string>();
  const [loading, setLoading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  function saveToFile(data: string, filename: string) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleSave = (filename: string) => {
    if (!filename) {
      toast.error("Please input filename first");
      return;
    }
    let matrix = "Your Matrix : \n\n";
    if (matrixCol)
      matrixElements?.forEach((row) => {
        row.forEach((token) => {
          token.position.kolom == matrixCol - 1
            ? (matrix += token.identifier + "\n")
            : (matrix += token.identifier + " ");
        });
      });
    let seqprint = "\nYour Sequences : \n\n";
    sequences?.forEach((sequence) => {
      sequence.tokens.forEach((token) => {
        sequence.tokens.indexOf(token) == sequence.tokens.length - 1
          ? (seqprint +=
              token.identifier + "\n" + "Prize: " + sequence.prize + "\n")
          : (seqprint += token.identifier + " ");
      });
    });
    matrix += seqprint;
    let dataToSave = `\nMaximum Reward: ${reward}\nWinning Sequence: ${sequence}\n`;
    let paths = "Path:  ";
    points?.forEach((point) => {
      paths += `\n(${point.kolom + 1}, ${point.baris + 1})`;
    });
    let timeElapsed = `\nTime Elapsed: ${time}\n`;
    dataToSave += paths;
    dataToSave += timeElapsed;
    matrix += dataToSave;
    saveToFile(matrix, filename);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!bufferSize || !matrixElements || !sequences) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Solving the problem...");

    // Serialize the input data into a JSON-like string
    const jsonString = JSON.stringify({
      buffer_size: bufferSize,
      matrix: {
        element: matrixElements,
        row: matrixRow,
        col: matrixCol,
      },
      sequences: sequences,
    });

    const response = await fetch("/api/main", {
      method: "POST",
      body: jsonString,
    });

    // Handle the response as needed
    const data = await response.json();
    const json = JSON.parse(data.output);
    if (json) {
      setResult(true);
      settime(json.time);
      setpoint(json.paths);
      setreward(json.maximum_reward);
      setsequence(json.sequence);
      setResultMethod(method);
      setLoading(false);
      toast.success("Problem solved!", { id: toastId });
    } else {
      setLoading(false);
      toast.error("Error while solving the problem", { id: toastId });
    }

    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const handleSequenceChange = (index: number, key: number, value: string) => {
    const updatedSequences = [...sequences];
    updatedSequences[index].tokens[key].identifier = value;
    setSequences(updatedSequences);
  };

  const handleMatrixChange = (row: number, col: number, value: string) => {
    if (!matrixElements) return;
    const updatedMatrix = [...matrixElements];

    if (!updatedMatrix) return;
    if (/^[A-Za-z0-9]{2}$/.test(value)) {
      toast.error("Invalid token");
      return;
    }
    updatedMatrix[row][col].identifier = value;
    setMatrixElements(updatedMatrix);
  };

  const handleMethodChange = (e: any) => {
    setMethod(e.target.value);
    resultMethod ?? setVerified(method == resultMethod);
  };

  const handleRandom = () => {
    if (
      !sequenceLength ||
      !matrixRow ||
      !matrixCol ||
      !sequencenum ||
      !uniqueLength
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const updatedTokens = [...sequenceTokens];
    let condition = false;
    updatedTokens.forEach((token, index) => {
      if (!/^[a-zA-Z0-9]{2}$/.test(token)) {
        updatedTokens[index] = "";
        setSequenceTokens(updatedTokens);
        condition = true;
      }
    });
    if (condition) {
      toast.error("Invalid token");
      return;
    }
    const { matrix, sequence } = randomizeInput(
      sequenceLength,
      sequenceTokens,
      matrixRow,
      matrixCol,
      sequencenum
    );
    setResultMethod(undefined);
    setMatrixElements(matrix.element);
    setSequences(sequence);
    setResult(false);
    setVerified(true);
  };
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      try {
        const parsed = readTxt(content);
        setBufferSize(Number(parsed.buffer_size));
        setMatrixCol(parsed.matrix.col);
        setMatrixRow(parsed.matrix.row);
        setMatrixElements(parsed.matrix.element);
        setSequences(parsed.sequences);
      } catch (error: any) {
        toast.error("Invalid file format :" + error.message);
        return;
      }
      setVerified(true);
      setResult(false);
      setResultMethod(undefined);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full relative justify-center items-center">
      <h1 className="text-center font-cyberpunk mt-10 text-yellow-100">
        {" "}
        Please Choose Your Method :
      </h1>
      <div className="w-full flex flex-row space-x-10 mt-10 items-center justify-center">
        <section className="flex flex-col ">
          <label htmlFor="txtfile" className="text-md duration-150 ">
            TXT FILE
          </label>
          <input
            required
            type="radio"
            id="txtfile"
            name="method"
            value="txt"
            onChange={handleMethodChange}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="RANDOM" className="text-md duration-150 ">
            RANDOM
          </label>
          <input
            required
            type="radio"
            id="RANDOM"
            name="method"
            value="RANDOM"
            onChange={handleMethodChange}
          />
        </section>
      </div>
      <center>
        {method === "txt" ? (
          <div className="items-center justify-center relative">
            <input
              required
              type="file"
              id="file"
              name="file"
              accept=".txt"
              className="mt-10 pl-20"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          method === "RANDOM" && (
            <>
              <form>
                <div className="flex flex-row justify-center font-mono mt-10 items-center">
                  <section className="flex flex-row items-center ">
                    <label className="text-white-800 mx-10">
                      Buffer Size :
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Buffer Size"
                      className=" text-black bg-slate-400 p-2 rounded-md"
                      value={bufferSize}
                      onChange={(e) => setBufferSize(Number(e.target.value))}
                    />
                  </section>
                  <section className="flex flex-row items-center ">
                    <label className="text-white-800 mx-10">Matrix Row :</label>
                    <input
                      required
                      type="number"
                      placeholder="Matrix Row"
                      className=" text-black bg-slate-400 p-2 rounded-md"
                      value={matrixRow}
                      onChange={(e) => setMatrixRow(Number(e.target.value))}
                    />
                  </section>

                  <section className="flex flex-row items-center ">
                    <label className="text-white-800 mx-10">
                      Matrix Column :
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Matrix Column"
                      className=" text-black bg-slate-400 p-2 rounded-md"
                      value={matrixCol}
                      onChange={(e) => setMatrixCol(Number(e.target.value))}
                    />
                  </section>

                  <section className="flex flex-row items-center ">
                    <label className="text-white-800 mx-10">
                      Sequence Max Length :
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Sequences Max Length"
                      className=" text-black bg-slate-400 p-2 rounded-md"
                      value={sequenceLength}
                      onChange={(e) =>
                        setSequenceLength(Number(e.target.value))
                      }
                    />
                  </section>
                </div>
                <div className="flex flex-row justify-center font-mono mt-10 items-center">
                  <section className="flex flex-row items-center ">
                    <label className="text-white-800 mx-10">
                      Number of Sequences :
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Number of Sequence"
                      className=" text-black bg-slate-400 p-2 rounded-md"
                      value={sequencenum}
                      onChange={(e) => setSequencenum(Number(e.target.value))}
                    />
                  </section>
                  <section className="flex flex-row items-center ">
                    <label className="text-white-800 mx-10">
                      Number of Unique Tokens :
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Number Unique Tokens"
                      className=" text-black bg-slate-400 p-2 rounded-md"
                      value={uniqueLength}
                      onChange={(e) => setuniqueLength(Number(e.target.value))}
                    />
                  </section>
                </div>
                {uniqueLength && uniqueLength > 0 && (
                  <div className="flex flex-row justify-center font-mono mt-10 items-center">
                    {Array.from({ length: uniqueLength }).map((_, index) => (
                      <section className="flex flex-row items-center ">
                        <label className="text-white-800 mx-10">
                          Token {index + 1} :
                        </label>
                        <input
                          required
                          type="text"
                          placeholder={`Token ${index + 1}`}
                          className=" text-black bg-slate-400 p-2 rounded-md"
                          value={sequenceTokens[index]}
                          onChange={(e) => {
                            const updatedTokens = [...sequenceTokens];
                            const token = e.target.value;

                            updatedTokens[index] = token;
                            setSequenceTokens(updatedTokens);
                          }}
                        />
                      </section>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="bg-green-200 p-3 rounded-md mt-10 text-black"
                  onClick={handleRandom}
                >
                  Randomize
                </button>
              </form>
            </>
          )
        )}
        {matrixElements &&
          verified &&
          (!resultMethod || resultMethod === method) && (
            <div className="relative  justify-center items-center mb-20">
              <center>
                <h2 className="text-3xl my-10">Your Matrix : </h2>
                <table className="bg-[#24ad54] p-10">
                  <tbody>
                    {matrixElements.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((token, colIndex) => (
                          <td key={colIndex} className="p-5">
                            <input
                              disabled
                              required
                              type="text"
                              value={token.identifier}
                              style={{
                                width: "70px",
                                height: "70px",
                                padding: "5px",
                              }}
                              className="font-mono text-yellow-800 bg-green-200 mx-2 my-2 p-2 rounded-md text-center"
                              onChange={(e) =>
                                handleMatrixChange(
                                  rowIndex,
                                  colIndex,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </center>
              <center>
                <h2 className="text-3xl my-10">Your Sequences :</h2>
                <ul className="font-mono">
                  {sequences.map((sequence, sequenceIndex) => (
                    <li key={sequenceIndex}>
                      Sequence {sequenceIndex + 1} : prize {sequence.prize}{" "}
                      <ul>
                        <div className="flex flex-row justify-center">
                          {sequence.tokens.map((token, tokenIndex) => (
                            <input
                              disabled
                              required
                              type="text"
                              value={token.identifier}
                              style={{
                                width: "70px",
                                height: "70px",
                                padding: "5px",
                              }}
                              className="font-mono text-yellow-800 bg-green-200 mx-2 my-2 p-2 rounded-md text-center"
                              onChange={(e) =>
                                handleSequenceChange(
                                  sequenceIndex,
                                  tokenIndex,
                                  e.target.value
                                )
                              }
                            />
                          ))}
                        </div>
                      </ul>
                    </li>
                  ))}
                </ul>
                <button
                  className="bg-green-400 p-3 rounded-md mt-10 text-black"
                  onClick={onSubmit}
                  disabled={loading}
                >
                  {" "}
                  Solve Now !
                </button>
              </center>
            </div>
          )}
        {result && method === resultMethod && (
          <>
            {/*@ts-ignore*/}
            {reward > 0 ? (
              <div ref={resultRef} className="font-mono">
                <center>
                  <div className="flex flex-row gap-4 justify-center items-center font-mono">
                    <h2 className="text-xl my-10">Maximum Reward : {reward}</h2>
                    <div className="border-l border-gray-400 h-20"></div>{" "}
                    <h2 className="text-xl my-10">
                      Winning Sequence : {sequence}
                    </h2>
                    <div className="border-l border-gray-400 h-20"></div>{" "}
                    {/* Grey fence */}
                    {/* Grey fence */}
                    <h2 className="text-xl my-10">Time Elapsed : {time}</h2>
                  </div>
                  <div className="w-full  justify-center items-center">
                    <h2 className="text-3xl my-10">Your Path :</h2>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      {points?.map((point, index) => (
                        <li key={index} style={{ marginRight: "10px" }}>
                          ({point.kolom + 1}, {point.baris + 1}){" "}
                          {`${index + 1}` === `${points.length}` ? "" : " -> "}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <table className=" p-10">
                    <tbody>
                      {matrixElements?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((token, colIndex) => (
                            <td key={colIndex} className={`p-1 m-1`}>
                              <input
                                required
                                disabled
                                type="text"
                                value={`${token.identifier}${
                                  points?.some(
                                    (p) =>
                                      p.kolom === colIndex &&
                                      p.baris === rowIndex
                                  )
                                    ? `${"("}${
                                        (points?.findIndex(
                                          (p) =>
                                            p.kolom === colIndex &&
                                            p.baris === rowIndex
                                        ) || 0) + 1
                                      }${")"}`
                                    : ""
                                }`}
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  padding: "5px",
                                }}
                                className={`text-yellow-800 ${
                                  points?.some(
                                    (p) =>
                                      p.kolom === colIndex &&
                                      p.baris === rowIndex
                                  )
                                    ? "bg-green-200"
                                    : "bg-yellow-300"
                                } mx-2 my-2 p-2 rounded-md text-center`}
                                onChange={(e) =>
                                  handleMatrixChange(
                                    rowIndex,
                                    colIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex flex-col">
                    <h2 className="text-3xl my-20">Save Your Result?</h2>
                    <section className="flex flex-row gap-4 justify-center items-center mb-20">
                      <input
                        required
                        type="text"
                        placeholder="Filename"
                        className="bg-slate-400 p-2 rounded-md text-black"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                      />
                      <button
                        type="button"
                        disabled={!filename}
                        className="bg-green-200 p-3 rounded-md  text-black disabled:opacity-70"
                        //@ts-ignore
                        onClick={() => handleSave(filename)}
                      >
                        {`${
                          filename
                            ? "Save to File"
                            : "Please input filename first"
                        }`}
                      </button>
                    </section>
                  </div>
                </center>
              </div>
            ) : (
              <div ref={resultRef}>
                <h1 className="text-6xl text-red-800">
                  No Winning Sequence Found !
                </h1>
                <div className="flex flex-col">
                  <h2 className="text-3xl my-20 ">Save Your Result?</h2>
                  <section className="flex flex-row gap-4 justify-center items-center mb-20">
                    <input
                      required
                      type="text"
                      placeholder="Filename"
                      className="bg-slate-400 p-2 rounded-md text-black"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={!filename}
                      className="bg-green-200 p-3 rounded-md  text-black disabled:opacity-70"
                      //@ts-ignore
                      onClick={() => handleSave(filename)}
                    >
                      {`${
                        filename
                          ? "Save to File"
                          : "Please input filename first"
                      }`}
                    </button>
                  </section>
                </div>
              </div>
            )}
          </>
        )}
      </center>
    </div>
  );
}
