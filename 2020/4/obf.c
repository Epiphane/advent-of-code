#include <stdio.h>
#include <stdlib.h>

#define F            fopen(d, d + 10);
#define SE           fseek(f, 0L, SEEK_END);
#define SS           fseek(f, 0L, SEEK_SET);
#define T2(x,y)      T(da, w, size / w, x, y)
const   char d[] =   "input.txt\0r\0";

int num(FILE *f, char* c)
{
    int result = 0;
    *c = '0';
    do {
        result *= 10;
        result += *c - '0';
        *c = fgetc(f);
    } while (*c >= '0' && *c <= '9');
    return result;
}

int yr(FILE *f, char* c, int lo, int hi)
{
    int valid = 0x1;
    int n = num(f, c);
    if (n >= lo && n <= hi)
    {
        valid |= 0x10000;
    }
    return valid;
}

void main()
{
    FILE *f = F;

    int i = 0;
    char c;
    int valid = 0x00000000;
    int pass = 0;
    int p1 = 0, p2 = 0;
    while (!feof(f))
    {
        c = fgetc(f);
        if (c == 'b' && fgetc(f) == 'y' && fgetc(f) == 'r')
        {
            fgetc(f); // :
            valid |= yr(f, &c, 1920, 2002);
        }
        else if (c == 'i' && fgetc(f) == 'y' && fgetc(f) == 'r')
        {
            fgetc(f); // :
            valid |= yr(f, &c, 2010, 2020) << 1;
        }
        else if (c == 'e')
        {
            c = fgetc(f);
            if (c == 'y')
            {
                if (fgetc(f) == 'r')
                {
                    fgetc(f); // :
                    valid |= yr(f, &c, 2020, 2030) << 2;
                }
            }
            else if (c == 'c')
            {
                if (fgetc(f) == 'l')
                {
                    valid |= 1 << 3;
                    fgetc(f); // :
                    c = fgetc(f);
                    if (c == 'a' && fgetc(f) == 'm' && fgetc(f) == 'b') { valid |= 0x1000 << 3; }
                    else if (c == 'h' && fgetc(f) == 'z' && fgetc(f) == 'l') { valid |= 0x1000 << 3; }
                    else if (c == 'o' && fgetc(f) == 't' && fgetc(f) == 'h') { valid |= 0x1000 << 3; }
                    else if (c == 'b')
                    {
                        c = fgetc(f);
                        if (c == 'l' && fgetc(f) == 'u') { valid |= 0x1000 << 3; }
                        else if (c == 'r' && fgetc(f) == 'n') { valid |= 0x1000 << 3; }
                    }
                    else if (c == 'g' && fgetc(f) == 'r')
                    {
                        c = fgetc(f);
                        if (c == 'n' || c == 'y') { valid |= 0x1000 << 3; }
                    }
                }
            }
        }
        else if (c == 'h')
        {
            c = fgetc(f);
            if (c == 'g' && fgetc(f) == 't')
            {
                valid |= 1 << 4;
                fgetc(f); // :
                int hgt = num(f, &c);
                if (c == 'c' && fgetc(f) == 'm' && hgt >= 150 && hgt <= 193) { valid |= 0x1000 << 4; }
                if (c == 'i' && fgetc(f) == 'n' && hgt >= 59 && hgt <= 76) { valid |= 0x1000 << 4; }
            }
            else if (c == 'c' && fgetc(f) == 'l')
            {
                valid |= 1 << 5;
                fgetc(f); // :
                if (fgetc(f) == '#')
                {
                    for (i = 0; i < 6; ++i)
                    {
                        c = fgetc(f);
                        if (!(c >= '0' && c <= '9') && !(c >= 'a' && c <= 'f'))
                        {
                            break;
                        }
                    }
                    if (i == 6 && (c = fgetc(f)) == ' ') { valid |= 0x1000 << 5; }
                }
            }
        }
        else if (c == 'p' && fgetc(f) == 'i' && fgetc(f) == 'd')
        {
            valid |= 1 << 6;
            fgetc(f); // :
            for (i = 0; i < 9; ++i)
            {
                c = fgetc(f);
                if (c < '0' || c > '9')
                {
                    break;
                }
            }
            if (i == 9 && (c = fgetc(f)) == ' ') { valid |= 0x1000 << 6; }
        }

        if (valid & 0x3f)
        {
            printf("%d has fields\n", pass);
            p1++;
        }
        if (valid & 0x3f << 4)
        {
            printf("%d is valid\n", pass);
            p2++;
        }

        pass++;

        while (c != ' ' && c != '\n')
        {
            c = fgetc(f);
        }
    }

    printf("%d %d\n", p1, p2);
}
