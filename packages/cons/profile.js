import debug from 'debug';
import { cons, car, cdr, nil } from './lib/index.js';
import crypto from 'crypto';

const log = debug('souplib:cons:profile');

function makeValue(size, index) {
    return size - index; // crypto.randomBytes(128);
}

function makeCell(size) {
    let cell = nil;
    for (let i = 0; i < size; i++) {
        cell = cons(makeValue(i, size), cell);
    }
    return cell;
}

function makeArrayPush(size) {
    let array = new Array(0);
    for (let i = 0; i < size; i++) {
        array.push(makeValue(i, size));
    }
    return array;
}
function makeArraySpread(size) {
    let array = [];
    for (let i = 0; i < size; i++) {
        array = [...array, makeValue(i, size)];
    }
    return array;
}

function time(op) {
    const start = new Date().getTime();
    op();
    const end = new Date().getTime();
    return end - start;
}

function multiply(list, scalar) {
    let sum = 0;
    for (let item of list) {
        sum += item * scalar;
    }
    return sum;
}

function run(test, size) {
    log(
        'run(name: %o, size: %o, result: %o)',
        test.name,
        size,
        time(() => (global.result = test(size)))
    );
}
//makeCell(10000000);
run(makeCell, 1000000);
run(makeArrayPush, 1000000);
run(makeArraySpread, 20000);

//const cell = makeCell(100000);
//const array = makeArray(100000);
//
//run(multiply, cell);
//run(multiply, array);
//
