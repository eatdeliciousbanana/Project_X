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
        case 'h':
            if (typed.slice(-1) === 's' && untyped.charAt(0) === 'i') {
                return 'h' + untyped;
            } else if (typed.slice(-1) === 's' && untyped.charAt(0) === 'y') {
                return 'h' + untyped.slice(1);
            }
            break;
        case 'c':
            if (untyped.slice(0, 2) === 'ti') {
                return 'ch' + untyped.slice(1);
            } else if (untyped.slice(0, 3) === '*ti') {
                return 'ch' + untyped.slice(2);
            } else if (untyped.slice(0, 2) === 'ty') {
                return 'ch' + untyped.slice(2);
            } else if (untyped.slice(0, 3) === '*ty') {
                return 'ch' + untyped.slice(3);
            }
            break;
        case 's':
            if (typed.slice(-1) === 't' && untyped.charAt(0) === 'u') {
                return 's' + untyped;
            }
            break;
        case 'f':
            if (untyped.slice(0, 2) === 'hu') {
                return 'f' + untyped.slice(1);
            } else if (untyped.slice(0, 3) === '*hu') {
                return 'f' + untyped.slice(2);
            }
            break;
        case 'j':
            if (untyped.slice(0, 2) === 'zi') {
                return 'j' + untyped.slice(1);
            } else if (untyped.slice(0, 3) === '*zi') {
                return 'j' + untyped.slice(2);
            }
            break;
        case 'z':
            if (untyped.charAt(0) === 'j') {
                return 'zy' + untyped.slice(1);
            } else if (untyped.slice(0, 2) === '*j') {
                return 'zy' + untyped.slice(2);
            }
            break;
        default:
            break;
    }

    return false;
}