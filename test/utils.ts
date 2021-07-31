import * as fs from 'fs';
import * as path from 'path';

export default function loadTextFixture(name: string): string {
    return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');
}
