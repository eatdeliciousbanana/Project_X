/* 
   タイプミスであれば false を返す
   タイプミスでなければ、代わりの文字列を返す
*/
function checkTypeMiss(key, typed, untyped) {
    switch (key) {
        case 'y':
            if (untyped.charAt(0) === 'h' && ''.includes(typed.charAt(typed.length - 1))) { }
    }
}