// Sadhguru Quotes Database
// Filtered to remove quotes with less than 3 words

const SADHGURU_QUOTES = [
    // On Karma
    {
        quote: "Karma means you are the maker of your life.",
        category: "Karma"
    },
    {
        quote: "What is happening within you and how you experience your life is entirely your making – your karma.",
        category: "Karma"
    },
    {
        quote: "Karma is neither good nor bad. It is the glue that makes you stick to this body.",
        category: "Karma"
    },
    {
        quote: "Whatever you do willingly, you enjoy. Whatever you do unwillingly, you suffer.",
        category: "Karma"
    },
    {
        quote: "Conscious action does not produce karma – reaction does.",
        category: "Karma"
    },
    {
        quote: "Nothing is accidental here. The whole physical existence is happening between cause and consequence.",
        category: "Karma"
    },
    {
        quote: "If you live every moment of your life totally, you dissolve an enormous volume of karma.",
        category: "Karma"
    },
    {
        quote: "No matter what kind of karma you gathered in the past, this moment's karma is always in your hands.",
        category: "Karma"
    },
    {
        quote: "Destiny is what you create. Fate is what you fail to create.",
        category: "Karma"
    },
    {
        quote: "If you handle it right, karma can be your liberation.",
        category: "Karma"
    },
    {
        quote: "Every moment of your life, you perform an action... Each action creates a certain memory. That is Karma.",
        category: "Karma"
    },
    {
        quote: "Unless you do the right things, the right things will not happen to you.",
        category: "Karma"
    },
    {
        quote: "Hesitation is the worst of all crimes.",
        category: "Karma"
    },
    {
        quote: "Your life is your making.",
        category: "Karma"
    },
    {
        quote: "You are the one who determines the nature of your experience in this life and beyond.",
        category: "Karma"
    },
    
    // On Mind, Consciousness & Spirituality
    {
        quote: "The mind is a powerful instrument. Every thought, every emotion that you create changes the very chemistry of your body.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Meditation is the journey from sound to silence, from movement to stillness.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Enlightenment is not an achievement, it's a homecoming.",
        category: "Mind & Consciousness"
    },
    {
        quote: "The mind is madness. Only when you go beyond the mind, will there be Meditation.",
        category: "Mind & Consciousness"
    },
    {
        quote: "A guru is not someone who holds a torch for you. He is the torch.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Spirituality is not about becoming special – it is about becoming one with everything.",
        category: "Mind & Consciousness"
    },
    {
        quote: "If you are aware, life is spectacular. If you are not aware, it is all the same.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Your inner nature is boundless, but you must experience this, not just believe it.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Only if something is beyond logic can it be infinite.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Being spiritual essentially means breaking the boundaries you set for yourself.",
        category: "Mind & Consciousness"
    },
    {
        quote: "A mind at rest is the temple of creation.",
        category: "Mind & Consciousness"
    },
    {
        quote: "The only solution to the puzzle of existence is dissolution.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Your thoughts and emotions are the drama that you create in your mind.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Meditation means dissolving the invisible walls that unawareness has built.",
        category: "Mind & Consciousness"
    },
    {
        quote: "If you define yourself by your thoughts, you are limiting yourself to your past.",
        category: "Mind & Consciousness"
    },
    {
        quote: "What your consciousness is intensely focused on is what will manifest in your life.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Once your mind becomes absolutely still, your intelligence transcends human limitations.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Spiritual process is not about chanting a mantra or closing your eyes, spiritual process is essentially about enhancing your perception.",
        category: "Mind & Consciousness"
    },
    {
        quote: "Don't think spirituality means having a nice, quiet life – it means being on fire.",
        category: "Mind & Consciousness"
    },
    {
        quote: "The source of your trouble and the source of your wellbeing are within you.",
        category: "Mind & Consciousness"
    },
    
    // On Nature & Existence
    {
        quote: "Before we go to another planet, we must learn to take care of this planet.",
        category: "Nature & Existence"
    },
    {
        quote: "You cannot exist without the universe. You are not a separate existence.",
        category: "Nature & Existence"
    },
    {
        quote: "A river is a life much larger than we are.",
        category: "Nature & Existence"
    },
    {
        quote: "Every particle in your body works hand in hand with the universe.",
        category: "Nature & Existence"
    },
    {
        quote: "Learning to treat nature sensibly and gently is not just for the wellbeing of nature – it is for our own wellbeing.",
        category: "Nature & Existence"
    },
    {
        quote: "We are behaving as if we are the last generation on this planet.",
        category: "Nature & Existence"
    },
    {
        quote: "Life is in the details. Just look at a flower or an ant, how intricately every piece of creation is engineered!",
        category: "Nature & Existence"
    },
    {
        quote: "Sustainability is not a concept – it is the way nature is constructed.",
        category: "Nature & Existence"
    },
    {
        quote: "Soil is not dirt. It is the source of life.",
        category: "Nature & Existence"
    },
    {
        quote: "If we are in tune with the fundamental laws of nature, we will enjoy the process of life.",
        category: "Nature & Existence"
    },
    {
        quote: "The cosmos is a grand, chaotic symphony – and you are part of this beautiful harmony.",
        category: "Nature & Existence"
    },
    {
        quote: "If you can access the source of creation within you, you will for sure live a magical life.",
        category: "Nature & Existence"
    },
    {
        quote: "Everything is spiritual if you are aware. Everything is material if you are not aware.",
        category: "Nature & Existence"
    },
    {
        quote: "Without being in constant exchange with the rest of the cosmos, you cannot exist.",
        category: "Nature & Existence"
    },
    {
        quote: "The most precious thing in life is life itself.",
        category: "Nature & Existence"
    }
];

// Filter quotes to remove those with less than 3 words
const SADHGURU_QUOTES_FILTERED = SADHGURU_QUOTES.filter(quoteObj => {
    const wordCount = quoteObj.quote.trim().split(/\s+/).length;
    return wordCount >= 3;
});

console.log(`Loaded ${SADHGURU_QUOTES_FILTERED.length} Sadhguru quotes`);
