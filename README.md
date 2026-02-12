# WeaveMeAlone
A web application for reverse-engineering the tablet weaving sequence from a given final pattern

A list of online resources:
WEBSITES, COMMUNITY HUBS
- https://handweaving.net/
- https://www2.cs.arizona.edu/patterns/weaving/CAP/index.html
- https://www.handweaving.net/weaving-software
- http://www.tabletweavingintheoryandpractice.co.uk/
- https://www.tabletweavers.org/
- https://stringcrafter.com/2021/05/15/fleur-de-lis-and-swords/

PATTERNS
- https://twistedthreads.org/
- https://mimbles.com/tablet-weaving/pattern-library/
- https://veleslava.cz/gallery-tablet-woven-patterns/ (just images)

TUTORIALS, GUIDES, PDFs
- https://www2.cs.arizona.edu/patterns/weaving/webdocs/gre_fa.pdf
- https://www2.cs.arizona.edu/patterns/weaving/webdocs/mo/D/FabricAnalysis.pdf
- http://ladyelewys.carpevinumpdx.com/2020/08/27/tablet-weaving-for-the-absolute-beginner-birka-6/ - best place to start, birka pattern with zero twist

PAID WEBSITES
- https://e-weave-online.thinkific.com/
    - links to http://www.fiberworks-pcw.com/download.htm, which is free

DRAFT DESIGNER
- https://jamespbarrett.github.io/tabletweave/


Note: I will try to create the algorithm myself and vibecode all the infrastructure around it. I already tried Lovable, will probably try Cursor for this.

Note: Perplexity said that there isn't any such app/website yet, just the ones in the "forward" direction: select number of tablets, colors of warp threads, tune the algorithm (turn backwards/forwards, flip tablet,...) and get the final pattern as an output.
After some research, I found that you can make all kinds of letters and shapes from two colors - just select the warping for all tablets as black, black, white, white, and then in each step for each tablet you can decide to either stay on the same color or change it. 
So that is probably one major reason for the absence of "reverse engineering algorithm". Still, it's surprising, because a lot of IT/engineering people do this hobby so this shouldn't be an original idea at this point. I think if I'll keep searching, I'll probably find some obscure site that does just that.
Also if I actually make this, I should emphasize that it's just a tool and not a panacea, it doesn't make creating your own patterns obsolete and especially not less fun.

Note: Actually useful idea - combine the previous app with computer vision (edge detection) to get the threading and algorithm from a photo. I think some people would actually be happy to use that.