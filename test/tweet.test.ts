import { conceptToTweet } from '../src/tweet';

test('Can turn a concept into a tweet', () => {
    expect(
        conceptToTweet(
            { name: 'test', description: 'One cool tweet', link: 'example.com/twentythree' },
            '#Cool #Tweet',
        ),
    ).toStrictEqual('test - One cool tweet example.com/twentythree #Cool #Tweet');
});

test('Can turn a long concept into a tweet', () => {
    expect(
        conceptToTweet(
            {
                name: 'test',
                description:
                    'One cool tweet that uses too many words to express its concept so we need to truncate it down so it fits into a tweet. You know, because twitter.com does not let us just write as much as we want into tweets because thats the whole point. Wow it really takes a lot to get us to where we need to get to eh?',
                link: 'example.com/twentythree',
            },
            '#Cool #Tweet',
        ),
    ).toStrictEqual(
        'test - One cool tweet that uses too many words to express its concept so we need to truncate it down so it fits into a tweet. You know, because twitter.com does not let us just write as much as we want into tweets because thats the whole po... example.com/twentythree #Cool #Tweet',
    );
});
