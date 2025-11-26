// Sadhguru Official Daily Quotes Database
// These are authentic quotes from Sadhguru's official teachings

const SADHGURU_QUOTES = [
    {
        quote: "If you choose, you can be joyful every moment of your life. It's time you made your choice.",
        category: "Joy & Choice"
    },
    {
        quote: "Joy is a natural phenomenon. Misery is your creation.",
        category: "Joy & Life"
    },
    {
        quote: "Stress is not caused by your work. It is caused by your inability to manage your body, mind, and emotions.",
        category: "Stress & Management"
    },
    {
        quote: "Your life is what you make it.",
        category: "Life & Creation"
    },
    {
        quote: "When pain, misery, or anger happens, it is time to look within you, not around you.",
        category: "Inner Journey"
    },
    {
        quote: "Life is a process, not a problem. Don't take it too seriously; it is a play.",
        category: "Life & Process"
    },
    {
        quote: "Seeking security is a sure path to disturbance when the change happens.",
        category: "Security & Change"
    },
    {
        quote: "Reactivity is enslavement. Responsibility is freedom.",
        category: "Responsibility & Freedom"
    },
    {
        quote: "Fear is simply because you are not living in the moment.",
        category: "Fear & Presence"
    },
    {
        quote: "Learning to listen is the first step to intelligent living.",
        category: "Listening & Intelligence"
    },
    {
        quote: "Integrity, insight, and inclusiveness are the three qualities of leadership.",
        category: "Leadership & Qualities"
    },
    {
        quote: "Leadership should not be an ambition, it should be a consequence of your competence.",
        category: "Leadership & Competence"
    },
    {
        quote: "Successful people do the right thing, not necessarily just work hard.",
        category: "Success & Action"
    },
    {
        quote: "If you want to engineer situations to your success, the first thing you need to engineer is yourself.",
        category: "Success & Self-Engineering"
    },
    {
        quote: "For a committed person, there is no such thing as failure, only lessons.",
        category: "Commitment & Learning"
    },
    {
        quote: "Spirituality is not about looking for excuses; it is about facing your own shortcomings.",
        category: "Spirituality & Self-Awareness"
    },
    {
        quote: "Meditation means dissolving the barriers that you have built unconsciously.",
        category: "Meditation & Barriers"
    },
    {
        quote: "Awareness is life.",
        category: "Awareness & Life"
    },
    {
        quote: "The moment you admit 'I do not know,' the possibility of knowing begins.",
        category: "Knowledge & Humility"
    }
];

// Filter out quotes with less than 3 words
const SADHGURU_QUOTES_FILTERED = SADHGURU_QUOTES.filter(q => {
    const wordCount = q.quote.trim().split(/\s+/).length;
    return wordCount >= 3;
});
