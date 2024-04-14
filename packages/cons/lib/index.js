const is_cons = Symbol('is_cons');
const inspect_custom = Symbol.for('nodejs.util.inspect.custom');
export function nil(select) {
    return select(nil, nil);
}
const HEAD = Symbol('head');
const TAIL = Symbol('tail');
function select(key) {
    return this[key];
}
export function cons(head, tail) {
    const obj = { [HEAD]: head, [TAIL]: tail };
    const cell = select.bind(obj);
    cell[is_cons] = true;
    //cell[Symbol.iterator] = iterate;
    //cell[inspect_custom] = inspect;
    return cell;
}

function* iterate() {
    let node = this;
    let count = 0;
    while (isCell(node) && !isNil(node)) {
        count++;
        yield car(node);
        node = cdr(node);
    }
    return count;
}

function inspect(depth, { drewPrefix, ...options }, inspect) {
    if (depth < 0) {
        return options.stylize('[cons]', 'special');
    }

    if (typeof inspect !== 'function') {
        inspect = require('util').inspect;
    }

    const newOptions = {
        ...options,
        drewPrefix: false,
        depth: options.depth === null ? null : options.depth - 1,
    };

    const prefix = '[';
    const postfix = ' ]';

    let result = '';

    result += prefix;

    let node = this;
    let firstDone = false;
    let count = 0;
    while (isCell(node) && !isNil(node) && count++ < options.maxArrayLength) {
        if (firstDone) {
            result += ',';
        }
        result += ` ${inspect(car(node), newOptions)}`;
        node = cdr(node);
        firstDone = true;
    }

    if (isCell(node) && !isNil(node)) {
        result += ` ... ${node.length()} more items`;
    } else if (!isNil(node)) {
        result += ` | ${inspect(node, newOptions)}`;
    }

    result += postfix;

    return result;
}

export function car(cell) {
    const result = cell(HEAD);
    return result;
}

export function cdr(cell) {
    const result = cell(TAIL);
    return result;
}

export function reverse(cells) {
    let node = nil;
    for (let cell of cells) {
        node = cons(cell, node);
    }
    return node;
}

export function isCell(value) {
    return !!value[is_cons];
}

export function isNil(value) {
    return value === nil;
}
