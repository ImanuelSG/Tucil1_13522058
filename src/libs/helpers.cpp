#include "helpers.hpp"

vector<Sequence> prizeSequences;
Sequence maxSequence = {{}, 0, 0};
Matrix evaluateMatrix;
int actualPrizeMax = 0;
int currPrizeMax = 0;

void printMatrix(Matrix matrix)
{
    for (int i = 0; i < matrix.row; ++i)
    {
        for (int j = 0; j < matrix.col; ++j)
        {
            cout << matrix.element[i][j].identifier << " ";
        }

        cout << endl;
    }
}

void printToken(Token token)
{
    cout << token.identifier << " (" << token.position.baris << "," << token.position.kolom << ")";
}

void printTokens(vector<Token> tokens)
{
    for (int i = 0; i < tokens.size(); ++i)
    {
        printToken(tokens[i]);
        cout << " ";
    }
    cout << endl;
}

void printSequence(Sequence sequence)
{
    for (int j = 0; j < sequence.tokens.size(); ++j)
    {
        cout << sequence.tokens[j].identifier << " ";
    }
    cout << endl;
}

void printSequences(vector<Sequence> sequences)
{
    for (int i = 0; i < sequences.size(); ++i)
    {
        cout << i + 1 << "."
             << " Length : " << sequences[i].length << " Prize : " << sequences[i].prize << " Tokens : " << endl;
        for (int j = 0; j < sequences[i].tokens.size(); ++j)
        {
            cout << sequences[i].tokens[j].identifier << " ";
        }
        cout << endl;
    }
}

void printResult(int diff)
{
    if (currPrizeMax > 0)
    {
        cout << "Maximum reward : " << currPrizeMax << endl;
        cout << "Sequence : ";
        printSequence(maxSequence);
        cout << "Paths : " << endl;
        for (int i = 0; i < maxSequence.length; i++)
        {
            cout << "(" << maxSequence.tokens[i].position.kolom + 1 << "," << maxSequence.tokens[i].position.baris + 1 << ")" << endl;
        }
    }
    else
    {
        cout << "There is no optimal solution for this problem : (" << endl;
    }
    cout << "Time : " << diff << " ms" << endl;
}

void readTxt(string filename, Info *info)
{
    ifstream inputFile(filename);
    string line;
    int buffer_size;
    Matrix matrix;
    vector<Sequence> sequences;

    if (!inputFile.is_open())
    {
        cerr << "Unable to open file " << filename << endl;
        return;
    }

    getline(inputFile, line);
    info->buffer_size = stoi(line);
    getline(inputFile, line);
    info->matrix.row = stoi(line.substr(0, line.find(' ')));
    info->matrix.col = stoi(line.substr(line.find(' ') + 1));
    info->matrix.element = vector<vector<Token>>(info->matrix.row, vector<Token>(info->matrix.col));
    for (int i = 0; i < info->matrix.row; ++i)
    {
        getline(inputFile, line);
        for (int j = 0; j < info->matrix.col; ++j)
        {
            Token token;
            token.identifier = line.substr(j * 3, 2);
            token.position.kolom = j;
            token.position.baris = i;
            info->matrix.element[i][j] = token;
        }
    }

    getline(inputFile, line);
    int num = stoi(line);
    for (int i = 0; i < num; ++i)
    {
        getline(inputFile, line);

        Sequence sequence;
        int length = 0;
        for (int j = 0; j < line.length(); j += 3)
        {
            Token token;
            token.identifier = line.substr(j, 2);
            token.position.kolom = j;
            token.position.baris = i;
            sequence.tokens.push_back(token);
            length++;
        }
        getline(inputFile, line);
        sequence.length = length;
        sequence.prize = stoi(line);
        info->sequences.push_back(sequence);
    }
}

void readRandom(string filename, Info *info)
{
    ifstream inputFile(filename);
    string line;
    int buffer_size;
    Matrix matrix;
    vector<Sequence> sequences;

    if (!inputFile.is_open())
    {
        cerr << "Unable to open file " << filename << endl;
        return;
    }

    getline(inputFile, line);
    getline(inputFile, line);
    vector<string> tokens;
    for (int j = 0; j < line.length(); j += 3)
    {
        string token = line.substr(j, 2);
        tokens.push_back(token);
    }

    getline(inputFile, line);
    buffer_size = stoi(line);
    getline(inputFile, line);
    int row = stoi(line.substr(0, line.find(' ')));
    int col = stoi(line.substr(line.find(' ') + 1));
    getline(inputFile, line);
    int numsequence = stoi(line);
    getline(inputFile, line);
    int lengthsequence = stoi(line);

    info->buffer_size = buffer_size;
    cout << "Row : " << row << " Col : " << col << endl;
    info->matrix = generateRandomMatrix(row, col, tokens);
    info->sequences = generateRandomSequence(tokens, lengthsequence, numsequence);
}

Sequence generateSequence(int length, vector<Token> tokens, int prize)
{
    Sequence sequence;
    sequence.length = length;
    sequence.tokens = tokens;
    sequence.prize = prize;
    return sequence;
}

Sequence appendToken(Sequence sequence, Token token)
{
    sequence.tokens.push_back(token);
    sequence.length++;
    return sequence;
}

Token generateToken(string identifier, int row, int col)
{
    Token token;
    token.identifier = identifier;
    token.position.baris = row;
    token.position.kolom = col;
    return token;
}

Token getToken(Matrix matrix, int row, int col)
{
    return matrix.element[row][col];
}

bool isSubsetOf(Sequence prize, Sequence actual)
{
    if (prize.length > actual.length)
    {
        return false;
    }
    else
    {
        int deficit = actual.length - prize.length;
        for (int i = 0; i <= deficit; i++)
        {
            int k = 0;
            for (int j = i; j < prize.length + i; j++)
            {
                if (actual.tokens[j].identifier != prize.tokens[k].identifier)
                {
                    break;
                }
                if (k == prize.length - 1)
                {
                    return true;
                }
                k++;
            }
        }
        return false;
    }
}

int evaluateSequence(Sequence sequence, vector<Sequence> sequences)
{
    int prize = 0;
    for (int i = 0; i < sequences.size(); i++)
    {
        if (isSubsetOf(sequences[i], sequence))
        {
            prize += sequences[i].prize;
        }
    }
    return prize;
}

bool hasVisited(vector<Point> visited, Point p)
{
    for (int i = 0; i < visited.size(); i++)
    {
        if (visited[i] == p)
        {
            return true;
        }
    }
    return false;
}

void generatePath(int remainingPath, Sequence prevSequence, bool Vertical, Token current, vector<Point> visited)
{

    if (remainingPath == 0)
    {
        int prize = evaluateSequence(prevSequence, prizeSequences);
        if (prize > currPrizeMax)
        {
            currPrizeMax = prize;
            maxSequence = prevSequence;
        }
    }
    else
    {
        for (int i = Vertical ? current.position.baris + 1 : current.position.kolom + 1; Vertical ? i < evaluateMatrix.row : i < evaluateMatrix.col; i++)
        {
            Token nextToken = Vertical ? getToken(evaluateMatrix, i, current.position.kolom) : getToken(evaluateMatrix, current.position.baris, i);
            if (!hasVisited(visited, nextToken.position))
            {
                visited.push_back(nextToken.position);
                generatePath(remainingPath - 1, appendToken(prevSequence, nextToken), !Vertical, nextToken, visited);
            }
        }
        for (int i = Vertical ? current.position.baris - 1 : current.position.kolom - 1; Vertical ? i >= 0 : i >= 0; i--)
        {
            Token nextToken = Vertical ? getToken(evaluateMatrix, i, current.position.kolom) : getToken(evaluateMatrix, current.position.baris, i);
            if (!hasVisited(visited, nextToken.position))
            {
                visited.push_back(nextToken.position);
                generatePath(remainingPath - 1, appendToken(prevSequence, nextToken), !Vertical, nextToken, visited);
            }
        }
    }
}

void saveResult(string filename, int duration)
{
    ofstream outputFile(filename);
    if (!outputFile.is_open())
    {
        cerr << "Unable to open file " << filename << endl;
        return;
    }
    outputFile << currPrizeMax << endl;
    for (int i = 0; i < maxSequence.tokens.size(); i++)
    {
        outputFile << maxSequence.tokens[i].identifier << " ";
    }
    outputFile << endl;
    for (int i = 0; i < maxSequence.length; i++)
    {
        outputFile << "(" << maxSequence.tokens[i].position.kolom + 1 << "," << maxSequence.tokens[i].position.baris + 1 << ")" << endl;
    }
    outputFile << duration << " ms";
    outputFile.close();
}

Matrix generateRandomMatrix(int row, int col, vector<string> tokens)
{
    Matrix matrix;
    matrix.row = row;
    matrix.col = col;
    matrix.element = vector<vector<Token>>(row, vector<Token>(col));
    for (int i = 0; i < row; ++i)
    {
        for (int j = 0; j < col; ++j)
        {
            Token token;
            int index = rand() % tokens.size();
            token = generateToken(tokens[index], i, j);
            matrix.element[i][j] = token;
        }
    }

    return matrix;
}

vector<Sequence> generateRandomSequence(vector<string> tokens, int maxLength, int num)
{
    vector<Sequence> sequences;
    for (int i = 0; i < num; i++)
    {
        int randomLength = rand() % (maxLength - 1) + 2;

        vector<Token> randomTokens;
        for (int j = 0; j < randomLength; j++)
        {
            int randomIndex = rand() % tokens.size();

            randomTokens.push_back(generateToken(tokens[randomIndex], 0, 0));
        }
        int randomPrize = rand() % (50 - 10 + 1) + 10;
        sequences.push_back(generateSequence(randomLength, randomTokens, randomPrize));
    }
    return sequences;
}

Info ParseJSON(const json &jsonData)
{
    Info info;
    info.buffer_size = jsonData["buffer_size"];
    info.matrix.row = jsonData["matrix"]["row"];
    info.matrix.col = jsonData["matrix"]["col"];
    // Parse matrix element
    for (const auto &row : jsonData["matrix"]["element"])
    {
        std::vector<Token> tokensRow;
        for (const auto &token : row)
        {
            Token t;
            t.identifier = token["identifier"];
            t.position.baris = token["position"]["baris"];
            t.position.kolom = token["position"]["kolom"];
            tokensRow.push_back(t);
        }
        info.matrix.element.push_back(tokensRow);
    }

    // Parse sequences
    for (const auto &seq : jsonData["sequences"])
    {
        Sequence s;
        s.length = seq["length"];
        s.prize = seq["prize"];
        for (const auto &token : seq["tokens"])
        {
            Token t;
            t.identifier = token["identifier"];
            t.position.baris = token["position"]["baris"];
            t.position.kolom = token["position"]["kolom"];
            s.tokens.push_back(t);
        }
        info.sequences.push_back(s);
    }

    return info;
}