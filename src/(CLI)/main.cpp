#include <iostream>
#include "helpers.h"

int main()
{
    srand(time(NULL));
    Info info;
    string filename;
    char firstans;
    cout << "Apkakah anda ingin menggunakan random generator? (y/n) ";
    cin >> firstans;
    while (firstans != 'y' && firstans != 'n')
    {
        cout << "Input anda tidak sesuai, coba lagi!" << endl;
        cout << "Apakah anda ingin menggunakan random generator? (y/n) ";
        cin >> firstans;
    }
    if (firstans == 'y')
    {
        cout << "Masukkan jumlah token : ";
        cin >> info.matrix.row;
    }
    else
    {
        cout << "Masukkan nama file txt untuk dibaca (relatif terhadap folder test) : ";
        cin >> filename;
        filename = "../test/input/" + filename;
        readTxt(filename, &info);
        cout << "Your Matrix : " << endl;
        printMatrix(info.matrix);
    }

    prizeSequences = info.sequences;
    evaluateMatrix = info.matrix;
    for (int i = 0; i < info.sequences.size(); i++)
    {
        actualPrizeMax += info.sequences[i].prize;
    }

    char secans;

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

    printResult(diff.count());
    cout << "Apakah anda ingin menyimpan solusi? (y/n) ";
    cin >> secans;
    while (secans != 'y' && secans != 'n')
    {
        cout << "Input anda tidak sesuai, coba lagi!" << endl;
        cout << "Apakah anda ingin menyimpan solusi? (y/n) ";
        cin >> secans;
    }
    if (secans == 'y')
    {
        string filename;
        cout << "Masukkan nama file untuk menyimpan solusi (akan disimpan di folder test/output) : ";
        cin >> filename;
        filename = "../test/output/" + filename;
        saveResult(filename, diff.count());
    }
    else
    {
        cout << "Terimakasih telah menggunakan program ini!" << endl;
    }
    return 0;
}
