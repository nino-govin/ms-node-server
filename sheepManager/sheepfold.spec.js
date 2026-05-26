import chai from 'chai';
const expect = chai.expect;
import { spawn, pop, get } from './sheepfold.js';

describe('sheepfold', function() {
    beforeEach(function() {
        // Reset counter before each test
        pop();
        pop();
        pop();
        pop();
        pop();
        while (get() > 0) {
            pop();
        }
        while (get() < 0) {
            spawn();
        }
    });

    describe('spawn', function() {
        it('should increment sheep counter', function() {
            const initial = get();
            spawn();
            expect(get()).to.equal(initial + 1);
        });

        it('should increment multiple times', function() {
            spawn();
            spawn();
            spawn();
            expect(get()).to.equal(3);
        });

        it('should handle many spawns', function() {
            for (let i = 0; i < 100; i++) {
                spawn();
            }
            expect(get()).to.equal(100);
        });
    });

    describe('pop', function() {
        it('should decrement sheep counter', function() {
            spawn();
            spawn();
            const initial = get();
            pop();
            expect(get()).to.equal(initial - 1);
        });

        it('should decrement multiple times', function() {
            spawn();
            spawn();
            spawn();
            pop();
            pop();
            expect(get()).to.equal(1);
        });

        it('should handle negative count', function() {
            pop();
            pop();
            expect(get()).to.equal(-2);
        });
    });

    describe('get', function() {
        it('should return 0 initially', function() {
            expect(get()).to.equal(0);
        });

        it('should return correct count after spawn', function() {
            spawn();
            spawn();
            spawn();
            expect(get()).to.equal(3);
        });

        it('should return correct count after pop', function() {
            spawn();
            spawn();
            spawn();
            pop();
            expect(get()).to.equal(2);
        });

        it('should return same value on consecutive calls', function() {
            spawn();
            spawn();
            const first = get();
            const second = get();
            expect(first).to.equal(second);
        });
    });

    describe('state persistence', function() {
        it('should maintain state across multiple operations', function() {
            spawn();
            spawn();
            expect(get()).to.equal(2);
            spawn();
            expect(get()).to.equal(3);
            pop();
            expect(get()).to.equal(2);
        });

        it('should track spawn and pop sequences', function() {
            spawn();
            spawn();
            spawn();
            pop();
            spawn();
            pop();
            pop();
            expect(get()).to.equal(1);
        });
    });
});
