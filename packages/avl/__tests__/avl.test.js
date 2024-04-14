/* eslint-env jest */

import lib from '../lib/index.js';

describe('@souplib/avl', function () {
    describe('tree factory', function () {
        it('exports a default function', function () {
            expect(lib).toBeInstanceOf(Function);
        });
        it('creates a tree interface', function () {
            expect(lib()).toMatchObject({
                isTree: expect.any(Function),
                insert: expect.any(Function),
                sizeOf: expect.any(Function),
                valueOf: expect.any(Function),
                leftOf: expect.any(Function),
                rightOf: expect.any(Function),
                heightOf: expect.any(Function),
                balanceOf: expect.any(Function),
                isEmpty: expect.any(Function),
            });
        });
    });

    describe('tree interface', function () {
        let avl;
        beforeAll(function () {
            avl = lib();
        });
        describe('size', function () {
            it('counts the elements in the tree', function () {
                const zero = avl.empty;
                const one = avl.insert(zero, 1);
                const two = avl.insert(one, 2);
                const three = avl.insert(two, 3);
                expect(avl.sizeOf(avl.empty)).toBe(0);
                expect(avl.sizeOf(one)).toBe(1);
                expect(avl.sizeOf(two)).toBe(2);
                expect(avl.sizeOf(three)).toBe(3);
            });
        });
        describe('insert', function () {
            describe('with a new key', function () {
                it('returns a new tree', function () {
                    const tree = avl.empty;
                    let next;
                    expect(() => (next = avl.insert(tree, 1))).not.toThrow();
                    expect(avl.isTree(next)).toBe(true);
                    expect(tree).not.toBe(next);
                });
                it('increases the size by one', function () {
                    const tree = avl.empty;
                    expect(avl.sizeOf(tree)).toBe(0);
                    expect(() => avl.insert(tree, 1)).not.toThrow();
                });
                it('stays balanced when adding to the right', function () {
                    const one = avl.insert(1);
                    const two = avl.insert(one, 2);
                    const three = avl.insert(two, 3);
                    const four = avl.insert(three, 4);
                    const five = avl.insert(four, 5);
                    const six = avl.insert(five, 6);
                    const seven = avl.insert(six, 7);

                    expect(avl.balanceOf(one)).toBe(0);
                    expect(avl.balanceOf(two)).toBe(1);
                    expect(avl.balanceOf(three)).toBe(0);
                    expect(avl.balanceOf(four)).toBe(1);
                    expect(avl.balanceOf(five)).toBe(1);
                    expect(avl.balanceOf(six)).toBe(0);
                    expect(avl.balanceOf(seven)).toBe(0);
                });
                it('stays balanced when adding to the left', function () {
                    const one = avl.insert(7);
                    const two = avl.insert(one, 6);
                    const three = avl.insert(two, 5);
                    const four = avl.insert(three, 4);
                    const five = avl.insert(four, 3);
                    const six = avl.insert(five, 2);
                    const seven = avl.insert(six, 1);

                    expect(avl.balanceOf(one)).toBe(0);
                    expect(avl.balanceOf(two)).toBe(-1);
                    expect(avl.balanceOf(three)).toBe(0);
                    expect(avl.balanceOf(four)).toBe(-1);
                    expect(avl.balanceOf(five)).toBe(-1);
                    expect(avl.balanceOf(six)).toBe(0);
                    expect(avl.balanceOf(seven)).toBe(0);
                });
            });
            describe('with an existing key', function () {
                let tree;
                beforeEach(function () {
                    tree = avl.insert(1);
                });
                it('returns a new tree', function () {
                    const oldTree = tree;
                    tree = avl.insert(tree, 1);
                    expect(tree).not.toBe(oldTree);
                });
                it('stays the same size', function () {
                    expect(avl.sizeOf(tree)).toBe(1);
                    tree = avl.insert(tree, 1);
                    expect(avl.sizeOf(tree)).toBe(1);
                });
            });
        });
    });
});
