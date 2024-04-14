import * as lib from '../lib/index.js';

describe('@souplib/cons', function () {
    it('exports a cons function', function () {
        expect(lib.cons).toBeInstanceOf(Function);
    });
    describe('cons', function () {
        it('creates a cell', function () {
            expect(lib.isCell(lib.cons())).toBe(true);
        });
        it('accepts a pair of values', function () {
            expect(lib.cons.length).toBe(2);
            expect(() => lib.cons(1, 1)).not.toThrow();
        });
        describe('cells', function () {
            it('accept a selector', function () {
                const cell = lib.cons(1, 1);
                expect(() => cell((a, b) => a)).not.toThrow();
            });
            it('pass the pair to the selector', function () {
                const a = Math.random();
                const b = Math.random();
                const cell = lib.cons(a, b);
                cell((head, tail) => {
                    expect(head).toBe(a);
                    expect(tail).toBe(b);
                });
            });
            it('can be chained', function () {
                const a = Math.random();
                const ba = Math.random();
                const bb = Math.random();
                const b = lib.cons(ba, bb);
                const cell = lib.cons(a, b);
                cell((head, tail) => {
                    expect(head).toBe(a);
                    expect(tail).toBe(b);
                    tail((head, tail) => {
                        expect(head).toBe(ba);
                        expect(tail).toBe(bb);
                    });
                });
            });
            it('accepts all types', function () {
                const a = {};
                const ba = Math.random();
                const bb = Math.random().toString();
                const b = lib.cons(ba, bb);
                const cell = lib.cons(a, b);
                cell((head, tail) => {
                    expect(head).toBe(a);
                    expect(tail).toBe(b);
                    tail((head, tail) => {
                        expect(head).toBe(ba);
                        expect(tail).toBe(bb);
                    });
                });
            });
            it('can be iterated', function () {
                const cells = lib.cons(1, lib.cons(2, lib.cons(3, lib.cons(4, lib.nil))));
                expect(function () {
                    for (let cell of cells) {
                        expect(lib.isCell(cell)).toBe(false);
                    }
                }).not.toThrow();
            });
            describe('iteration', function () {
                it('returns cells in order', function () {
                    const cells = lib.cons(1, lib.cons(2, lib.cons(3, lib.cons(4, lib.nil))));
                    const values = [1, 2, 3, 4];
                    let index = 0;
                    for (let cell of cells) {
                        const value = values[index++];
                        expect(cell).toBe(value);
                    }
                });
            });
        });
    });
    describe('car', function () {
        it('is a function', function () {
            expect(lib.car).toBeInstanceOf(Function);
        });
        it('accepts a cell', function () {
            const a = Math.random();
            const b = Math.random();
            const cell = lib.cons(a, b);
            expect(() => lib.car(false)).toThrow();
            expect(() => lib.car(cell)).not.toThrow();
        });
        it('returns the first pair from the cell', function () {
            const a = {};
            const b = {};
            const cell = lib.cons(a, b);
            expect(lib.car(cell)).toBe(a);
        });
    });
    describe('cdr', function () {
        it('is a function', function () {
            expect(lib.cdr).toBeInstanceOf(Function);
        });
        it('accepts a cell', function () {
            const a = Math.random();
            const b = Math.random();
            const cell = lib.cons(a, b);
            expect(() => lib.cdr(false)).toThrow();
            expect(() => lib.cdr(cell)).not.toThrow();
        });
        it('returns the first pair from the cell', function () {
            const a = {};
            const b = {};
            const cell = lib.cons(a, b);
            expect(lib.cdr(cell)).toBe(b);
        });
    });
    describe('reverse', function () {
        it('is a function', () => expect(lib.reverse).toBeInstanceOf(Function));
        it('reverses the items in a list', function () {
            const cells = lib.reverse(lib.cons(1, lib.cons(2, lib.cons(3, lib.cons(4, lib.nil)))));
            const values = [4, 3, 2, 1];
            let index = 0;
            for (let cell of cells) {
                expect(cell).toBe(values[index++]);
            }
        });
    });
});
