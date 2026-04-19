module.exports = [
    {
        title: 'JLPT N5 Practice Test 1',
        level: 'N5',
        timeLimit: 105,
        sections: {
            vocabulary: [
                {
                    type: 'vocabulary',
                    question: 'What is the meaning of 食べる?',
                    options: ['to eat', 'to drink', 'to sleep', 'to walk'],
                    correctAnswer: 'to eat',
                    explanation: '食べる (taberu) means "to eat".'
                },
                {
                    type: 'vocabulary',
                    question: 'What is the reading of 学校?',
                    options: ['がっこう', 'がくこう', 'がっこ', 'がくしょ'],
                    correctAnswer: 'がっこう',
                    explanation: '学校 is read as がっこう (gakkou).'
                },
                {
                    type: 'vocabulary',
                    question: 'Which word means "friend"?',
                    options: ['友達', '家族', '先生', '学生'],
                    correctAnswer: '友達',
                    explanation: '友達 (tomodachi) means "friend".'
                },
                {
                    type: 'vocabulary',
                    question: 'What does 大きい mean?',
                    options: ['big', 'small', 'new', 'old'],
                    correctAnswer: 'big',
                    explanation: '大きい (ookii) means "big".'
                }
            ],
            grammar: [
                {
                    type: 'grammar',
                    question: 'Which sentence is correct for "I am a student"?',
                    options: ['私は学生です。', '私が学生は。', '私を学生です。', '私に学生です。'],
                    correctAnswer: '私は学生です。',
                    explanation: 'は is the topic marker. 私は学生です is the correct polite form.'
                },
                {
                    type: 'grammar',
                    question: 'How do you say "Please eat" politely?',
                    options: ['食べてください。', '食べますください。', '食べるください。', '食べてます。'],
                    correctAnswer: '食べてください。',
                    explanation: 'て-form + ください is used for polite requests.'
                },
                {
                    type: 'grammar',
                    question: 'Which is the correct negative form of 行きます?',
                    options: ['行きません', '行かない', '行きないです', '行かません'],
                    correctAnswer: '行きません',
                    explanation: '行きません is the polite negative form of 行きます.'
                }
            ],
            reading: [
                {
                    type: 'reading',
                    passage: 'たなかさんは まいにち がっこうに いきます。がっこうで にほんごを べんきょうします。たなかさんは にほんごが すきです。',
                    question: 'What does Tanaka-san study at school?',
                    options: ['Japanese', 'English', 'Math', 'Science'],
                    correctAnswer: 'Japanese',
                    explanation: 'The passage says にほんごを べんきょうします (studies Japanese).'
                },
                {
                    type: 'reading',
                    passage: 'たなかさんは まいにち がっこうに いきます。がっこうで にほんごを べんきょうします。たなかさんは にほんごが すきです。',
                    question: 'Does Tanaka-san like Japanese?',
                    options: ['Yes', 'No', 'Not mentioned', 'Sometimes'],
                    correctAnswer: 'Yes',
                    explanation: 'にほんごが すきです means "likes Japanese".'
                }
            ],
            listening: [
                {
                    type: 'listening',
                    question: 'Listen and choose the correct answer: What day is mentioned?',
                    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                    correctAnswer: 'Monday',
                    audioUrl: '',
                    explanation: 'The audio mentions 月曜日 (Monday).'
                }
            ]
        }
    },
    {
        title: 'JLPT N4 Practice Test 1',
        level: 'N4',
        timeLimit: 105,
        sections: {
            vocabulary: [
                {
                    type: 'vocabulary',
                    question: 'What is the meaning of 経験?',
                    options: ['experience', 'practice', 'preparation', 'explanation'],
                    correctAnswer: 'experience',
                    explanation: '経験 (keiken) means "experience".'
                },
                {
                    type: 'vocabulary',
                    question: 'What does 練習 mean?',
                    options: ['practice', 'experience', 'contact', 'explanation'],
                    correctAnswer: 'practice',
                    explanation: '練習 (renshuu) means "practice".'
                },
                {
                    type: 'vocabulary',
                    question: 'What is the reading of 連絡?',
                    options: ['れんらく', 'れんかく', 'れいらく', 'れんろく'],
                    correctAnswer: 'れんらく',
                    explanation: '連絡 is read as れんらく (renraku).'
                }
            ],
            grammar: [
                {
                    type: 'grammar',
                    question: 'Which sentence correctly uses ～ている?',
                    options: ['今、本を読んでいる。', '今、本を読みている。', '今、本を読むている。', '今、本を読んでます。'],
                    correctAnswer: '今、本を読んでいる。',
                    explanation: 'て-form + いる expresses ongoing action.'
                },
                {
                    type: 'grammar',
                    question: 'How do you express "I have been to Japan"?',
                    options: ['日本に行ったことがある。', '日本に行くことがある。', '日本に行ってことがある。', '日本に行きことがある。'],
                    correctAnswer: '日本に行ったことがある。',
                    explanation: 'た-form + ことがある expresses past experience.'
                }
            ],
            reading: [
                {
                    type: 'reading',
                    passage: 'やまださんは まいあさ ６じに おきます。そして、シャワーを あびて、あさごはんを たべます。それから、しごとに いきます。やまださんの しごとは ８じから はじまります。',
                    question: 'What time does Yamada-san wake up?',
                    options: ['6 AM', '7 AM', '8 AM', '9 AM'],
                    correctAnswer: '6 AM',
                    explanation: 'まいあさ ６じに おきます means "wakes up at 6 AM every morning".'
                }
            ],
            listening: [
                {
                    type: 'listening',
                    question: 'Listen and choose: What is the person buying?',
                    options: ['A book', 'A pen', 'A bag', 'A shirt'],
                    correctAnswer: 'A book',
                    audioUrl: '',
                    explanation: 'The audio mentions 本を買う (buying a book).'
                }
            ]
        }
    }
];
