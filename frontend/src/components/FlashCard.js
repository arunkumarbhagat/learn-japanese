import React, { useState } from 'react';
import './FlashCard.css';

export default function FlashCard({ front, back, frontSub, backSub }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <div className="flashcard-char japanese">{front}</div>
                    {frontSub && <div className="flashcard-sub">{frontSub}</div>}
                    <div className="flashcard-hint">Click to flip</div>
                </div>
                <div className="flashcard-back">
                    <div className="flashcard-answer">{back}</div>
                    {backSub && <div className="flashcard-sub">{backSub}</div>}
                </div>
            </div>
        </div>
    );
}
