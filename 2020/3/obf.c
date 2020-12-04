#include <stdio.h>
#include <stdlib.h>

#define F            fopen(d, d + 10);
#define SE           fseek(f, 0L, SEEK_END);
#define SS           fseek(f, 0L, SEEK_SET);
#define T2(x,y)      T(da, w, size / w, x, y)
const   char d[] =   "input.txt\0r\0";

                      ;;                             ;;
                     long                           long
                    T(char                         *data,
                   short w,                       short h,
                  short ddx,                     short ddy)
                 {int r=0;int                   x=0,y=0;for(
                ;y<h;y+=ddy){r                 +=data[x+y*w+y
               ]=='#';x= (x+ddx               )% w;}return r;}
                     void                           main
     (){FILE*f=      F;SE                           ;int
  w=0;int            size                          =ftell
 (f);                SS ;                           char
*da=                malloc                         (size);
fread
(da,
 1,
 size,
  f);while         (da[w]         !='\n'         )++w;
    printf("%d %I64u\n",T2(3,1),T2(1,1)*T2(3,1)*T2(5,1)*T2(7,1)*T2(1,2));}
