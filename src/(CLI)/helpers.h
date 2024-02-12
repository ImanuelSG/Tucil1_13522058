#ifndef HELPER_H
#define HELPER_H

#include <iostream>
#include <vector>
#include <fstream>
#include <string>
#include <math.h>
#include <random>
#include <chrono>
#include <thread>

using namespace std;

struct Point
{
    int baris;
    int kolom;

    bool operator==(const Point &rhs) const
    {
        return this->baris == rhs.baris && this->kolom == rhs.kolom;
    }
};

struct Token
{
    string identifier;
    Point position;
};

struct Sequence
{
    vector<Token> tokens;
    int length;
    int prize;
};

struct Matrix
{
    vector<vector<Token>> element;
    int row;
    int col;
};

struct Info
{
    int buffer_size;
    Matrix matrix;
    vector<Sequence> sequences;
};

extern vector<Sequence> prizeSequences;
extern Sequence maxSequence;
extern Matrix evaluateMatrix;
extern vector<Sequence> testSequences;
extern int actualPrizeMax;
extern int currPrizeMax;

/**
 * @brief Prosedur untuk mencetak Matrix token ke layar
 *
 * @param matrix
 */
void printMatrix(Matrix matrix);
/**
 * @brief Prosedur untuk mencetak token ke layar
 *
 * @param token
 */
void printToken(Token token);
/**
 * @brief Prosedur untuk mencetak kumpulan token ke layar
 *
 * @param sequence
 */
void printTokens(vector<Token> tokens);

/**
 * @brief Prosedur untuk mencetak kumpulan Sekuens ke layar
 *
 * @param sequences
 */
void printSequences(vector<Sequence> sequences);
/**
 * @brief prosedur Menuliskan output ke layar
 *
 */
void printResult(int diff);
/**
 * @brief Prosedur untuk membaca file txt dan memasukkannya ke variabel Info
 *
 * @param filename
 * @param info
 */

void readTxt(string filename, Info *info);
/**
 * @brief Prosedur untuk membaca file random dan memasukkannya ke variabel Info
 *
 * @param filename
 * @param info
 */
void readRandom(string filename, Info *info);
/**
 * @brief Membuat sebuah sekuens dari kumpulan tokens dengan panjang length dan prize 0
 *
 * @param length
 * @param tokens
 * @return Sequence
 */
Sequence generateSequence(int length, vector<Token> tokens, int prize);
/**
 * @brief Function untuk menambahkan token ke sequence
 *
 * @param sequence
 * @param token
 * @return Sequence
 */
Sequence appendToken(Sequence sequence, Token token);
/**
 * @brief Function untuk membuat sebuah token
 *
 * @param identifier
 * @param row
 * @param col
 * @return Token
 */

Token generateToken(string identifier, int row, int col);

/**
 * @brief Mendapatkan Token dari matriks pada posisi row,col
 *
 * @param matrix
 * @param row
 * @param col
 * @return Token
 */
Token getToken(Matrix matrix, int row, int col);

/**
 * @brief Function untuk mengevaluasi nilai sebuah sequence bila dibandingkan dengan kumpulan sekuens berhadiah
 *
 * @param sequence Sequence yang ingin dicari nilai prizenya
 * @param sequences Sequence yang digunakan sebagai acuan
 * @return int
 */
int evaluateSequence(Sequence sequence, vector<Sequence> sequences);

/**
 * @brief Function untuk menentukan apakah suatu point sudah pernah dikunjungi atau belum
 *
 * @param visited
 * @param p
 * @return true
 * @return false
 */
bool hasVisited(vector<Point> visited, Point p);
/**
 * @brief Prosedur membuat semua kemungkinan path ke variabel global
 *
 * @param remainingPath
 * @param prevSequence
 * @param Vertical
 * @param current
 * @param visited
 */
void generatePath(int remainingPath, Sequence prevSequence, bool Vertical, Token current, vector<Point> visited);
/**
 * @brief Menyimpan hasil ke file txt (relatif terhadap folder test/output)
 *
 * @param filename
 */
void saveResult(string filename, int duration);
/**
 * @brief Membuat matrix random dengan tokens yang disediakan
 *
 * @param matrix
 * @param row
 * @param col
 * @param tokens
 */
Matrix generateRandomMatrix(int row, int col, vector<string> tokens);
/**
 * @brief Membuat sequence random dengan tokens yang disediakan
 *
 * @param tokens
 * @param maxLength
 * @param num
 * @return vector<Sequence>
 */
vector<Sequence> generateRandomSequence(vector<string> tokens, int maxLength, int num);
/**
 * @brief Melakukan proses loop dengan multithreads
 * 
 * @param info 
 * @param start_col 
 * @param end_col 
 * @param size 
 */
void processLoop(Info &info, int start_col, int end_col, int size);

#endif // HELPER_H
