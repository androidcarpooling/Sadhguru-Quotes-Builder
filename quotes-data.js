// Sadhguru Official Daily Quotes Database - 100 Official Quotes
// These are authentic quotes from Sadhguru's official teachings
// Source: https://isha.sadhguru.org/en/wisdom/type/quotes

const SADHGURU_QUOTES = [
    {
        quote: "How deeply you touch another life is how rich your life is.",
        category: "Life & Relationships"
    },
    {
        quote: "You cannot exist without the universe. You are not a separate existence.",
        category: "Existence & Unity"
    },
    {
        quote: "Learning is not about earning, but a way of flowering.",
        category: "Learning & Growth"
    },
    {
        quote: "Without experiencing the joy of life, you cannot seek the source of life.",
        category: "Joy & Life"
    },
    {
        quote: "Don't hold back your love, your joy, and your exuberance. Only what you give becomes your quality, not what you hold back.",
        category: "Love & Giving"
    },
    {
        quote: "Love is not something that you do. Love is something that you are.",
        category: "Love & Being"
    },
    {
        quote: "If you use your mind as a memory bank, the past will repeat itself in cycles. If your mind becomes pure attention, you will know everything that is worth knowing.",
        category: "Mind & Awareness"
    },
    {
        quote: "Without being in constant exchange with the rest of the cosmos, you cannot exist. The idea of individuality is an illusion.",
        category: "Unity & Existence"
    },
    {
        quote: "It is not the amount of action but the depth of experience that makes life rich and fulfilling.",
        category: "Life & Experience"
    },
    {
        quote: "If all your energies are focused in one direction, enlightenment is not far away. After all, what you are seeking is already within you.",
        category: "Enlightenment & Focus"
    },
    {
        quote: "Nothing in life is a problem – everything is a possibility.",
        category: "Life & Perspective"
    },
    {
        quote: "What your consciousness is intensely focused on is what will manifest in your life and in the world around you.",
        category: "Consciousness & Manifestation"
    },
    {
        quote: "Unleash your desire; limit it not to the limited. In the boundlessness of the desire is your ultimate nature.",
        category: "Desire & Nature"
    },
    {
        quote: "Once your mind becomes absolutely still, your intelligence transcends human limitations.",
        category: "Mind & Intelligence"
    },
    {
        quote: "Every particle in your body works hand in hand with the universe.",
        category: "Body & Universe"
    },
    {
        quote: "Only when you are absolutely devoted to what you do, you can produce something significant in the world.",
        category: "Devotion & Action"
    },
    {
        quote: "If you are in a state of all-inclusive passion, we call this yoga.",
        category: "Yoga & Passion"
    },
    {
        quote: "Neither health nor joy can be created from outside. There may be external stimuli, but essentially, both come from within.",
        category: "Health & Joy"
    },
    {
        quote: "The mind is madness. Only when you go beyond the mind, will there be Meditation.",
        category: "Mind & Meditation"
    },
    {
        quote: "Meditation means dissolving the invisible walls that unawareness has built.",
        category: "Meditation & Awareness"
    },
    {
        quote: "The most incredible thing is that you can know everything you wish to know with your eyes closed.",
        category: "Knowledge & Inner Vision"
    },
    {
        quote: "Do you want to look good or feel good? How wonderful you feel within yourself is most important.",
        category: "Wellbeing & Inner State"
    },
    {
        quote: "If you do what you like with 100% involvement, what you don't like, you must do with 200% involvement. That's breaking limitations.",
        category: "Action & Limitations"
    },
    {
        quote: "Our lives become beautiful not because we are perfect. Our lives become beautiful because we put our heart into whatever we do.",
        category: "Life & Heart"
    },
    {
        quote: "The nature of life is such that if you allow it to flow, life is a beautiful experience. If you hold back, it becomes misery.",
        category: "Life & Flow"
    },
    {
        quote: "Do not do what you like – do what the world needs. Doing what you like is not freedom. Likes and dislikes are compulsive.",
        category: "Action & Freedom"
    },
    {
        quote: "If we are in tune with the fundamental laws of nature, we will enjoy the process of life. Otherwise, suffering is inevitable.",
        category: "Nature & Life"
    },
    {
        quote: "Do not settle for a limited experience of life. Where there is a limitation, there is a possibility of breaking it.",
        category: "Life & Limitations"
    },
    {
        quote: "Life is just a certain amount of time and energy. Putting this time and energy to maximum use for everyone's wellbeing is all that matters.",
        category: "Life & Purpose"
    },
    {
        quote: "If human beings were experiencing life beyond the physical, violence would go down dramatically.",
        category: "Life & Peace"
    },
    {
        quote: "You do not have to pursue something intensely; you as a being should become very intense.",
        category: "Being & Intensity"
    },
    {
        quote: "Every moment of your life, you perform an action – physically, mentally, emotionally, and energy-wise. Each action creates a certain memory. That is Karma.",
        category: "Karma & Action"
    },
    {
        quote: "Nature gave you this intelligence to seek and access the Infinite, not to calculate in limited numbers.",
        category: "Intelligence & Infinite"
    },
    {
        quote: "There is too much talk about divine love, divine bliss, and divine peace. Love, bliss, and peace are all human qualities. Why export them to heaven?",
        category: "Human Qualities"
    },
    {
        quote: "Putting the well-being of others above your own creates a different kind of strength, a strength that will carry you through life and beyond.",
        category: "Compassion & Strength"
    },
    {
        quote: "It is a lack of human consciousness that has rendered Mother Earth, the very basis of our existence, into a commodity with an expiry date. Let our time on Earth be the best time; we must act now.",
        category: "Consciousness & Earth"
    },
    {
        quote: "Yoga is not just exercise system. Yoga is the Science of obliterating the boundaries of individuality to know the universality of one's existence.",
        category: "Yoga & Science"
    },
    {
        quote: "If you want your body and brain to work well, the first thing is to become joyful by your own nature.",
        category: "Joy & Health"
    },
    {
        quote: "The very way you breathe, sit, stand, eat, walk, work – everything can become yoga. You can use any process of life to transcend your limitations.",
        category: "Yoga & Life"
    },
    {
        quote: "If you resist change, you resist life.",
        category: "Change & Life"
    },
    {
        quote: "I am not talking about you being a spectator, I am talking about involvement. I am talking about involving yourself into life in such a way that you dissolve into it.",
        category: "Involvement & Life"
    },
    {
        quote: "To rise above the modifications of your mind, when you cease your mind, when you cease to be a part of your mind, that is yoga.",
        category: "Yoga & Mind"
    },
    {
        quote: "If you handle your entire life with logic alone, you will end up a mess.",
        category: "Logic & Life"
    },
    {
        quote: "May your life happen out of your own clarity and ability, not by chance or out of the compassion and kindness or others.",
        category: "Life & Clarity"
    },
    {
        quote: "Passion is focused on one thing – therefore it burns out at some point. Compassion includes everything – it has so much fuel to burn that it does not die out.",
        category: "Passion & Compassion"
    },
    {
        quote: "If you allow the source of creation within you to find expression, joyful is the only way you can be. May you know the fulfillment of making all that you touch joyful.",
        category: "Joy & Creation"
    },
    {
        quote: "Everything comes from the same source. You can be at absolute ease only if you experience yourself as a part of existence, not as a separate individual.",
        category: "Existence & Unity"
    },
    {
        quote: "Awareness is life. Life is awareness. There is no other way to be.",
        category: "Awareness & Life"
    },
    {
        quote: "You need to know when to use logic and when not. All the beautiful things in life look stupid if you logically analyze them.",
        category: "Logic & Beauty"
    },
    {
        quote: "A human is not a being, he is a becoming, he is an ongoing process, nothing is fixed. You can be whichever way you want to be.",
        category: "Human & Becoming"
    },
    {
        quote: "Whatever happens to you, you can either see it as a curse and suffer it, or you can see it as a blessing and make use of it.",
        category: "Perspective & Life"
    },
    {
        quote: "Don't go searching for a Guru. When the pain of ignorance within you becomes a scream, a Guru will come in search of you.",
        category: "Guru & Seeking"
    },
    {
        quote: "Peace cannot be enforced from outside. It is a consequence of how we are within ourselves.",
        category: "Peace & Inner State"
    },
    {
        quote: "The sign of intelligence is that you are constantly wondering. Idiots are always dead sure about every damn thing they are doing in their life.",
        category: "Intelligence & Wonder"
    },
    {
        quote: "Confidence and stupidity are a very dangerous combination, but they generally go together.",
        category: "Wisdom & Humility"
    },
    {
        quote: "An intellectual understanding that is not backed by experiential knowledge can lead to mind games and deceptive states.",
        category: "Knowledge & Experience"
    },
    {
        quote: "Reactivity is enslavement. Responsibility is freedom.",
        category: "Responsibility & Freedom"
    },
    {
        quote: "Life is a process, not a problem. The question is only, have you prepared yourself for the process or not.",
        category: "Life & Process"
    },
    {
        quote: "Ecological sustenance and the Inclusive nature of spiritual process are inseparable.",
        category: "Ecology & Spirituality"
    },
    {
        quote: "There is no such thing as work-life balance; balance has to be within you.",
        category: "Balance & Life"
    },
    {
        quote: "Most of your desires are not really about yourself. You just picked them up from your social surroundings.",
        category: "Desire & Self"
    },
    {
        quote: "If you are very happy, you will do many more things than if you are unhappy.",
        category: "Happiness & Action"
    },
    {
        quote: "Once you are clear about what you are doing and why, other people's opinions will not matter.",
        category: "Clarity & Independence"
    },
    {
        quote: "When you are all-inclusive, your experience of your existence becomes beautiful, and that is why you are joyful.",
        category: "Inclusivity & Joy"
    },
    {
        quote: "Some think it's in the wine, and other think it's in the divine, but pleasantness is what everyone's seeking.",
        category: "Seeking & Pleasantness"
    },
    {
        quote: "The way people are living today, I would say, never do unto others what you do unto yourself.",
        category: "Life & Relationships"
    },
    {
        quote: "Even if I am with a million people, I am always alone. I do not see people as people. I see them as myself.",
        category: "Unity & Perception"
    },
    {
        quote: "You cannot live here without trusting existence. If you trust consciously, lovingly, that's devotion.",
        category: "Trust & Devotion"
    },
    {
        quote: "Do not talk about the soul, heaven, or God. Talking about something that is not yet a reality for you amounts to falsehood.",
        category: "Truth & Reality"
    },
    {
        quote: "If you do not do what you cannot do, that's no problem. But if you do not what you can do, you are a tragedy.",
        category: "Action & Potential"
    },
    {
        quote: "Love and hate are two sides of the same coin. Any moment, it can flip the other way. One can become the other.",
        category: "Love & Hate"
    },
    {
        quote: "Every human being is capable of living absolutely blissfully within himself.",
        category: "Bliss & Human Nature"
    },
    {
        quote: "It is time we choose quality over quantity in our lives, in every sense. Only then we can save the planet.",
        category: "Quality & Planet"
    },
    {
        quote: "It does not take much for a human being to live well. Only when you are trying to imitate someone else, it takes a lot.",
        category: "Life & Authenticity"
    },
    {
        quote: "Being a creature on the planet means the hand of the Creator has touched you. There is no better blessing.",
        category: "Life & Blessing"
    },
    {
        quote: "External circumstances can only cause you physical pain. Suffering is created in your mind.",
        category: "Suffering & Mind"
    },
    {
        quote: "The most precious thing in life is life itself. Are you getting it now or only on your deathbed?",
        category: "Life & Preciousness"
    },
    {
        quote: "I want you to know the power, the liberation of another kind of science – the inner science, the yogic science – through which you can become the master of your destiny.",
        category: "Yoga & Destiny"
    },
    {
        quote: "If you knew the true nature of your existence, you could play the drama of life whichever way you want, to whatever extent you want.",
        category: "Existence & Freedom"
    },
    {
        quote: "If you face situations that you do not know how to deal with, there are many possibilities. That's when you can really explore life.",
        category: "Life & Exploration"
    },
    {
        quote: "Life is very simple for me. What I know, I know perfectly well. What I do not know, I just do not know – I don't do any guesswork.",
        category: "Life & Clarity"
    },
    {
        quote: "Everyone must have at least a simple spiritual process in their lives. Without this stabilizing factor, economic development will not mean the better life.",
        category: "Spirituality & Life"
    },
    {
        quote: "A child is someone who is fresh from the Divine works. Try not to teach but imbibe the ways of the Divine.",
        category: "Children & Divine"
    },
    {
        quote: "You don't have to do anything, you don't have to think anything, you don't have to feel anything to be complete. You are complete by yourself.",
        category: "Completeness & Being"
    },
    {
        quote: "Spiritual process is not for the dead or the dying. It is for the living who want to become fully alive in all dimensions of life.",
        category: "Spirituality & Life"
    },
    {
        quote: "If you want to know whether you are moving forward in life, just see if you are a little more joyful today than you were yesterday.",
        category: "Life & Progress"
    },
    {
        quote: "Looking at everything through your phone is only numbing your perception – it does not really enhance your experience of life in any way.",
        category: "Technology & Perception"
    },
    {
        quote: "Only if the younger generation does things that the parents never imagined possible; can a society evolve?",
        category: "Evolution & Society"
    },
    {
        quote: "Wherever you may be, whatever you may be, if you are willing to strive, you can evolve yourself beyond the limitations of nature.",
        category: "Evolution & Striving"
    },
    {
        quote: "Whatever is your highest, you just contemplate upon that. Your inner and outer purity will happen naturally.",
        category: "Contemplation & Purity"
    },
    {
        quote: "Being together is the beginning. Working together in the middle. Dissolving together is the ultimate. My idea of together is seven billion people.",
        category: "Unity & Togetherness"
    },
    {
        quote: "The physical body has its own memory. Intimacy without commitment leads to disorganization of the human being, and in turn to disorganization of society.",
        category: "Body & Intimacy"
    },
    {
        quote: "Mysticism is not a technology for enlightenment. Mysticism is pure science – an exploration of existence.",
        category: "Mysticism & Science"
    },
    {
        quote: "My work is to bring clarity. Once you clearly see that the whole universe is one, everything about you and your relationship with existence will change.",
        category: "Clarity & Unity"
    },
    {
        quote: "Do not settle for a limited experience of life. Where there is a limitation, there is a possibility of breaking it.",
        category: "Life & Limitations"
    },
    {
        quote: "My only intention is that you blossom into a full-fledged life because that's all life is about.",
        category: "Life & Blossoming"
    },
    {
        quote: "The earth is the basis of life. Spending some time touching soil, plants, or trees will harmonize your system.",
        category: "Earth & Life"
    },
    {
        quote: "Whatever is most needed right now, that's what we should do in the world.",
        category: "Action & Need"
    },
    {
        quote: "This is not about being superhuman – this is about realizing that being human is super.",
        category: "Human & Super"
    },
    {
        quote: "Believing gives you comfort, solace, and a sense of belonging, but there will be no courage and commitment to seek what is true.",
        category: "Belief & Truth"
    }
];

// Use all quotes (no filtering by length)
const SADHGURU_QUOTES_FILTERED = SADHGURU_QUOTES;
