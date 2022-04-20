/* 
   タイプミスであれば false を返す
   タイプミスでなければ、代わりとなるuntypedを返す
*/
function checkTypeMiss(key, typed, untyped) {
    if (untyped.charAt(0) === '*' && key === untyped.charAt(1)) {
        return untyped.slice(1);
    }

    switch (key) {
        case 'n':
            if (untyped.charAt(0) === '*') {
                return 'n' + untyped.slice(1);
            }
            break;
        default:
            break;
    }
}