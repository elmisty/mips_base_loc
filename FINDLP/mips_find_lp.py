"""
    - Rule 1 : The string address in the same literal pool, it exists within
    64KB
    - Rule 2 :

    function FINDLP(start, filesize, wndsize)
        pos <- start
        end <- start + filesize
        while start <= pos < end do
            if match(Rule1) && match(Rule2) then
                head <- pos
                poolSize <- wndsize
                MoveWindow()
                while match(Rule1) && match(Rule2) do
                    poolSize++
                    MoveWindow()
                end while
                if match(Rule3) then
                    Output : head, poolSize
                end if
                pos += poolSize
            end if
            pos++
        end while
    end function
"""

class 
