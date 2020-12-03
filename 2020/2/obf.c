#include <stdio.h>
#include <string.h>

#define C(N)         memset(r, 0, sizeof(size_t) * N);
#define G            fgetc(f)
#define F            fopen(d, d + 10);
const   char d[] =   "input.txt\0r\0"

                 ;
                ;;;
               ;void
              main(){
             size_t r[
            10]; C(10);
           FILE  *f = F;
          while(!feof(f))
         {r[8] = G;if(r[5]
        <2){r[8]-='0';if(r[
       8]<=10){r[r[5]]*=10;r
      [r[5]]+=r[8];}else ++r[
     5];}else if(r[5]==2){r[9]
    =r[8];r[5]++;G&G;}else{if(r
   [8]=='\n'){if(r[2]>=r[0]&&r[2
  ]<=r[1]){++r[6];}r[7]+=r[3]==1?
 1:0;C(6);}else{++r[4];if(r[8]==r[
9]){++r[2];if(r[4]==r[0]||r[4]==r[1
               ]){++
               r[3];
               }}}}}
  printf("%d %d\n", r[6], r[7]);}
