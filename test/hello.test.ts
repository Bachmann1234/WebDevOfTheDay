import { add } from '../src/hello';

test('Can Add two Numbers', () => {
    expect(add(1, 2)).toBe(3);
});
