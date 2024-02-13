#include <iostream>
#include "helpers.hpp"

void printJSON(int maximumReward, const std::string &sequence, const std::vector<Point> &paths, const std::string &time)
{
    std::cout << "{\n";
    std::cout << "  \"maximum_reward\": " << maximumReward << ",\n";
    std::cout << "  \"sequence\": \"" << sequence << "\",\n";
    std::cout << "  \"paths\": [\n";
    for (size_t i = 0; i < paths.size(); ++i)
    {
        const auto &path = paths[i];
        std::cout << "    { \"baris\": " << path.baris << ", \"kolom\": " << path.kolom << " }";
        if (i != paths.size() - 1)
        {
            std::cout << ",";
        }
        std::cout << "\n";
    }
    std::cout << "  ],\n";
    std::cout << "  \"time\": \"" << time << "\"\n";
    std::cout << "}\n";
}
void processLoop(Info &info, int start_col, int end_col, int size)
{
    while (start_col < end_col && currPrizeMax != actualPrizeMax)
    {
        Sequence Start = generateSequence(1, vector<Token>{info.matrix.element[0][start_col]}, 0);
        generatePath(size, Start, true, Start.tokens[0], {info.matrix.element[0][start_col].position});
        start_col++;
    }
}

int main(int argc, char const *argv[])
{
    srand(time(NULL));
    Info info;
    string JSONString = string(argv[1]);
    json j = json::parse(JSONString);

    info = ParseJSON(j);

    prizeSequences = info.sequences;
    evaluateMatrix = info.matrix;
    for (int i = 0; i < info.sequences.size(); i++)
    {

        actualPrizeMax += info.sequences[i].prize;
    }

    const int num_threads = thread::hardware_concurrency() > evaluateMatrix.col ? evaluateMatrix.col : thread::hardware_concurrency();

    int cols_per_thread = evaluateMatrix.col / num_threads;

    vector<thread> threads;
    // Start threads
    auto start = chrono::high_resolution_clock::now();
    for (int j = 1; j < info.buffer_size; j++)
    {
        for (int i = 0; i < num_threads; ++i)
        {
            int start_col = i * cols_per_thread;
            int end_col = (i == num_threads - 1) ? evaluateMatrix.col : start_col + cols_per_thread;
            threads.push_back(thread(processLoop, ref(info), start_col, end_col, j));
        }
    }
    for (auto &t : threads)
    {
        t.join();
    }
    auto end = chrono::high_resolution_clock::now();
    auto diff = chrono::duration_cast<std::chrono::milliseconds>(end - start);
    string sequence = "";
    for (int i = 0; i < maxSequence.tokens.size(); i++)
    {
        sequence += maxSequence.tokens[i].identifier + " ";
    }
    vector<Point> paths;
    for (int i = 0; i < maxSequence.tokens.size(); i++)
    {
        paths.push_back(maxSequence.tokens[i].position);
    }

    printJSON(currPrizeMax, sequence, paths, to_string(diff.count()) + " ms");

    return 0;
}
