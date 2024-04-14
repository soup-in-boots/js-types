function defaultCompare(a, b) {
    if (a < b) return 1;
    else if (a > b) return -1;
    else return 0;
}

const _cache = new WeakMap();
export default function tree(compare = defaultCompare) {
    if (_cache.has(compare)) {
        return _cache.get(compare);
    }

    function makeSelector(key) {
        return function (cell) {
            return cell(key);
        };
    }
    function select(key) {
        const result = this[key];
        return result;
    }
    const NONE = Symbol('NONE');
    const IS_CELL = Symbol('IS_CELL');
    const CELL = Symbol('CELL');
    const VALUE = Symbol('VALUE');
    const DIRECTION = Symbol('DIRECTION');
    const LEFT = Symbol('LEFT');
    const RIGHT = Symbol('RIGHT');
    const HEIGHT = Symbol('HEIGHT');
    const BALANCE = Symbol('BALANCE');
    const empty = select.bind({
        [VALUE]: undefined,
        get [LEFT]() {
            return empty;
        },
        get [RIGHT]() {
            return empty;
        },
        [HEIGHT]: 0,
        [BALANCE]: 0,
    });

    const valueOf = makeSelector(VALUE);
    const leftOf = makeSelector(LEFT);
    const rightOf = makeSelector(RIGHT);
    const heightOf = makeSelector(HEIGHT);
    const balanceOf = makeSelector(BALANCE);

    function cell(value, left = empty, right = empty) {
        const leftHeight = heightOf(left);
        const rightHeight = heightOf(right);
        const height = Math.max(leftHeight, rightHeight) + 1;
        const balance = rightHeight - leftHeight;
        const instance = select.bind({
            [VALUE]: value,
            [LEFT]: left,
            [RIGHT]: right,
            [HEIGHT]: height,
            [BALANCE]: balance,
        });
        instance[IS_CELL] = true;
        return instance;
    }

    function requiresRotation(tree) {
        if (balanceOf(tree) < -1) {
            return RIGHT;
        } else if (balanceOf(tree) > 1) {
            return LEFT;
        } else {
            return NONE;
        }
    }
    function unwind(stack, it) {
        let balanced = false;
        while (stack.length > 0) {
            const entry = stack.pop();
            const side = entry[DIRECTION];
            const parent = entry[CELL];

            if (side === LEFT) {
                it = cell(valueOf(parent), it, rightOf(parent));
            } else {
                it = cell(valueOf(parent), leftOf(parent), it);
            }

            if (!balanced) {
                it = balance(it);
            }

            if (balanceOf(it) === 0) {
                balanced = true;
            }
        }
        return it;
    }
    function balance(it) {
        const rotateDirection = requiresRotation(it);
        if (rotateDirection === LEFT) {
            it = rotateLeftOf(it);
        } else if (rotateDirection === RIGHT) {
            it = rotateRightOf(it);
        }
        return it;
    }
    function seekInsertionPoint(stack, it, check) {
        while (!isEmpty(it)) {
            const comparison = check(it);
            if (comparison < 0) {
                stack.push({ [DIRECTION]: LEFT, [CELL]: it });
                it = leftOf(it);
            } else if (comparison > 0) {
                stack.push({ [DIRECTION]: RIGHT, [CELL]: it });
                it = rightOf(it);
            } else {
                break;
            }
        }
        return it;
    }
    function insert(it, value) {
        if (arguments.length === 1) {
            value = it;
            it = empty;
        }

        const stack = [];
        it = seekInsertionPoint(stack, it, function (cell) {
            const cellValue = valueOf(cell);
            return compare(cellValue, value);
        });

        if (it) {
            it = cell(value, leftOf(it), rightOf(it));
        } else {
            it = cell(value);
        }

        it = unwind(stack, it);

        return it;
    }
    function rotateLeftOf(tree) {
        const left = cell(valueOf(tree), leftOf(tree), leftOf(rightOf(tree)));
        const root = cell(valueOf(rightOf(tree)), left, rightOf(rightOf(tree)));
        return root;
    }
    function rotateRightOf(tree) {
        const right = cell(valueOf(tree), rightOf(leftOf(tree)), rightOf(tree));
        const root = cell(valueOf(leftOf(tree)), leftOf(leftOf(tree)), right);
        return root;
    }
    function sizeOf(tree) {
        const stack = [tree];
        let count = 0;

        while (stack.length > 0) {
            let leaf = stack.shift();
            if (!isEmpty(leaf)) {
                stack.unshift(rightOf(leaf));
                stack.unshift(leftOf(leaf));
                count++;
            }
        }

        return count;
    }
    function isTree(value) {
        return value[IS_CELL];
    }
    function isEmpty(value) {
        return value === empty;
    }

    const definitions = {
        isTree,
        isEmpty,
        empty,
        insert,
        sizeOf,
        valueOf,
        leftOf,
        rightOf,
        heightOf,
        balanceOf,
    };
    _cache.set(compare, definitions);
    return definitions;
}
