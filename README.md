# npm-pipe-string
Process a stdin string in node, because bash expansions is making me crazy

# Help

Write a function with `d` as stdin or `l` as line array and:

`npx pipestr --help` 

# This vs That

1. Digit (no `\d`)
    *  ❌ `echo Aa1234 | sed 's/\d/X/g' | cat` 
    *  ✅ `echo Aa1234 | npx pipestr 'd.replace(/\d/g,"X")' | cat`

2. Bracket (please explain, made me insane)
    *  ❌ `echo "[profile x] x=y" | sed 's/\[.+\]\s+//g' | cat` 
    *  ✅ `echo "[profile x] x=y" | npx pipestr 'd.replace(/\[.+\]\s+/g,"")' | cat`

3. New line fun (need some sed flags)
    *  ❌ `echo -e "Aa\r\n1234" | sed 's/\s/X/g' | cat` 
    *  ✅ `echo -e "Aa\r\n1234" | npx pipestr 'd.replace(/\s/g,"X")' | cat`
    *  ✅ `echo -e "Aa\r\n1234" | npx pipestr -k 'l.join("\n").replace(/\s/g,"X")' | cat`
