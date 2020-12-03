#include <stdio.h>
#include <string.h>
#define C(N)         memset(r, 0, sizeof(size_t) * N);
#define G            fgetc(f)
#define F            fopen(d, d + 10);
#define P            printf
const   char d[] =   "input.txt\0r\0%d %d\n";

                         ;;
                        void
                       main()
                     {FILE*f=F
    ;size_t r[2020];C(2020);r[0]=6;while(!feof(f))
       {r[1]=G;if(r[1]=='\n'){++r[0];continue;}
          r[r[0]]*=10;r[r[0]]+=r[1]-'0';}for
             (r[1]=6;r[1]<r[0];++r[1]){for
                (r[2]=6;r[2]<r[0];++r[2
                   ]){for(r[3]=6;r[3
                  ]<r[0];++r[3]){if(r
                 [r[1]]+r[r[2]]==2020)
                {r[4]=r[r[1]]*r[r[2]];}
               if(r[r[1]]+  r[r[2]]+r[r
              [3]]==2020      ){r[5]=r[r
             [1]]*r[r            [2]]*r[r
            [3]];}}                }}P(d+2
            +10,r                    [4],r
           [5]                          );}
