import makeAVL from './lib/index.js';
import * as crypto from 'crypto';

const avl = makeAVL();
function time(op) {
    const start = new Date().getTime();
    op();
    const end = new Date().getTime();
    return end - start;
}

function makeTree(size) {
    let tree = avl.empty;
    for (let index = 0; index < size; index++) {
        const value = crypto.randomBytes(128).toString('base64');
        tree = avl.insert(tree, value);
    }
    return tree;
}
function makeLateSortedArrayPush(size) {
    let array = [];
    for (let index = 0; index < size; index++) {
        const value = crypto.randomBytes(128).toString('base64');
        array.push(value);
    }
    return array.sort();
}
function makeInsertSortedArrayPush(size) {
    let array = [];
    for (let index = 0; index < size; index++) {
        const value = crypto.randomBytes(128).toString('base64');
        array.push(value);
        array = array.sort();
    }
    return array;
}
function makeArraySpread(size) {
    let array = [];
    for (let index = 0; index < size; index++) {
        const value = crypto.randomBytes(128).toString('base64');
        array = [...array, value];
    }
    return array.sort();
}

function run(test, size) {
    console.log(
        'run(name: %o, size: %o, time: %o)',
        test.name,
        size,
        time(() => test(size))
    );
}

run(makeTree, 100000);
run(makeLateSortedArrayPush, 100000);
run(makeInsertSortedArrayPush, 20000);
//run(makeArraySpread, 20000);
