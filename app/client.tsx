"use client";
import { useRef, useState } from "react";

import { FieldValues, set, useForm } from "react-hook-form";
import readTxt from "../libs/javascript/txtparser";
import type { Point, Tokens, sequence } from "../app/types/main";
import randomizeInput from "@/libs/javascript/randomizer";
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
  const resultRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      bufferSize: 0,
      matrixRow: 0,
      matrixCol: 0,
      matrixElements: [[{}]],
      sequences: {
        tokens: [""],
        length: "",
        prize: "",
      },
    },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();

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
    const updatedMatrix = [...matrixElements];

    if (!updatedMatrix) return;
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
    )
      return;

    const { matrix, sequence } = randomizeInput(
      sequenceLength,
      sequenceTokens,
      matrixRow,
      matrixCol,
      sequencenum
    );
    console.log(matrix, sequence);
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
      const parsed = readTxt(content);
      setBufferSize(Number(parsed.buffer_size));
      setMatrixCol(parsed.matrix.col);
      setMatrixRow(parsed.matrix.row);
      setMatrixElements(parsed.matrix.element);
      setSequences(parsed.sequences);

      setVerified(true);
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
            RANDOM GENERATOR
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
        <section className="flex flex-col">
          <label htmlFor="directinput" className="text-md duration-150 ">
            DIRECT
          </label>
          <input
            required
            type="radio"
            id="directinput"
            name="method"
            value="directinput"
            onChange={handleMethodChange}
          />
        </section>
      </div>
      <center>
        {method === "txt" ? (
          <>
            <input
              required
              type="file"
              id="file"
              name="file"
              accept=".txt"
              className="mt-10"
              onChange={handleFileChange}
            />
          </>
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
                      className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
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
                      className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
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
                      className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
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
                      className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
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
                      className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
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
                      className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
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
                          className=" text-gray-800 bg-yellow-200 p-2 rounded-md"
                          value={sequenceTokens[index]}
                          onChange={(e) => {
                            const updatedTokens = [...sequenceTokens];
                            updatedTokens[index] = e.target.value;
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
        {matrixElements && verified && (
          <div className="relative font-serif justify-center items-center mb-20">
            <center>
              <h2 className="text-3xl my-10">Your Matrix : </h2>
              <table className="bg-yellow-200 p-10">
                <tbody>
                  {matrixElements.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((token, colIndex) => (
                        <td key={colIndex} className="p-5">
                          <input
                            required
                            type="text"
                            value={token.identifier}
                            className="text-yellow-800 bg-green-200 mx-2 my-2 p-2 rounded-md text-center"
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
              <ul>
                {sequences.map((sequence, sequenceIndex) => (
                  <li key={sequenceIndex}>
                    Sequence {sequenceIndex + 1} : prize {sequence.prize}{" "}
                    <ul>
                      <div className="flex flex-row justify-center">
                        {sequence.tokens.map((token, tokenIndex) => (
                          <input
                            required
                            type="text"
                            value={token.identifier}
                            className="text-yellow-800 bg-green-200 mx-2 my-2 p-2 rounded-md text-center"
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
              >
                {" "}
                Solve Now !
              </button>
            </center>
          </div>
        )}
        {result && method === resultMethod && (
          <>
            <div ref={resultRef} className="font-serif">
              <center>
                <div className="flex flex-row gap-4 justify-center items-center">
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
                <div className="w-full font-serif justify-center items-center">
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
                <table className="bg-yellow-200 p-10">
                  <tbody>
                    {matrixElements?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((token, colIndex) => (
                          <td
                            key={colIndex}
                            className={`p-5 m-5 ${
                              points?.some(
                                (p) =>
                                  p.kolom === colIndex && p.baris === rowIndex
                              )
                                ? "bg-green-400 rounded-full" // Change the background color here
                                : ""
                            }`}
                          >
                            <input
                              required
                              disabled
                              type="text"
                              value={`${token.identifier} ${
                                points?.some(
                                  (p) =>
                                    p.kolom === colIndex && p.baris === rowIndex
                                )
                                  ? `${"      ("}${
                                      (points?.findIndex(
                                        (p) =>
                                          p.kolom === colIndex &&
                                          p.baris === rowIndex
                                      ) || 0) + 1
                                    } ${")"}`
                                  : ""
                              }`}
                              className="text-yellow-800 bg-green-200 mx-2 my-2 p-2 rounded-md text-center"
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
            </div>
          </>
        )}
      </center>
    </div>
  );
}
