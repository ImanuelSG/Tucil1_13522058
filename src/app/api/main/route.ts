import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export const POST = async (req: NextRequest): Promise<void | Response> => {
  const data = JSON.stringify(await req.json()); // Convert data to JSON string
  return new Promise((resolve, reject) => {
    let path: string;

    if (process.env.NODE_ENV === "production") {
      path = process.cwd() + "/src/app/api/main/tes.out";
    } else {
      path = process.cwd() + "/src/app/api/main/tes.exe";
    }
    console.log("Executing binary at path:", path); // Log the path to the binary

    const cppProcess = spawn(path, [data]);
    let output = "";
    let error = "";

    cppProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    cppProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    cppProcess.on("close", (code) => {
      console.log("Binary process exited with code:", code); // Log the exit code
      if (code !== 0) {
        console.error("Error output:", error); // Log any errors encountered
        output = error;
      }

      const response = NextResponse.json({ output }, { status: 200 });
      resolve(response);
    });

    cppProcess.on("error", (err) => {
      console.error("Error executing binary:", err); // Log any errors with spawning the process
      reject(NextResponse.json({ data }, { status: 500 })); // Reject the promise if there's an error with the child process
    });
  });
};
