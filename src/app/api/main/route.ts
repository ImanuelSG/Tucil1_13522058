import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export const POST = async (req: NextRequest) => {
  const data = JSON.stringify(await req.json()); // Convert data to JSON string
  return new Promise((resolve, reject) => {
    const cppProcess = spawn("src/app/api/main/tes.exe", [data]);
    let output = "";
    let error = "";

    cppProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    cppProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    cppProcess.on("close", (code) => {
      if (code !== 0) {
        output = error;
      }

      const response = NextResponse.json({ output }, { status: 200 });
      resolve(response);
    });

    cppProcess.on("error", (err) => {
      reject(err); // Reject the promise if there's an error with the child process
    });
  });
};
