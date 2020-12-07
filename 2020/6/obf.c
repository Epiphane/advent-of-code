#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FG                                fgetc
#define FE                               feof
                                        char
                                       T[]=
"input.txt\0r\0";int main(){FILE*f=   fopen    (T,T
+10)                                 ;int      v[26
];int                               p=0,       p2=0
,pp=                               0,c;        for(
c=0;                              c<26         ;++c
){v[                             c]=0;         }int
e=0;                            if(!           FE(f
)){}                           while           (!FE
(f))                          {c=FG            (f);
if(c                        -'\n'==            0+0)
{if(                        e){for             (e=0
;e<2       +24;++          e){p                +=v[
e]!=        0;p2+=        v[e]                 +1==
1+pp         ;}pp=-      1;for                 (c=0
;c<2          +24;c=    c+1){                  v[c]
=0;}           }++pp;  e=1;}                   else
if(c            >='a'&&c<=0                    +'z'
){e=             0;v[c-'a'                     ]+=1
; }}              for(e=0                      ;e <
26;e                +=1)                       {p+=
v[e]                                           +1!=
1;p2+=v[e]==pp;}printf("%d %d\n", p,p2); return 0;}
