import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import SwipeCard from './components/SwipeCard';
import ResultDashboard from './components/ResultDashboard';
import { questions } from './data/questions';

export default function App() {
    const [screen, setScreen] = useState('welcome'); // welcome, voting, result
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [cumulativeCounts, setCumulativeCounts] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setIsAdmin(searchParams.get('admin') === 'kappa');
    }, []);

    const handleStart = () => {
        setScreen('voting');
        setCurrentIndex(0);
        setResults([]);
    };

    const updateCumulativeStats = (currentResults) => {
        const savedStats = JSON.parse(localStorage.getItem('machida_election_stats_v2') || '{}');

        currentResults.forEach(result => {
            const id = result.id;
            if (!savedStats[id]) {
                savedStats[id] = { yes: 0, no: 0 };
            }
            if (result.vote) {
                savedStats[id].yes += 1;
            } else {
                savedStats[id].no += 1;
            }
        });

        localStorage.setItem('machida_election_stats_v2', JSON.stringify(savedStats));
        setCumulativeCounts(savedStats);
    };

    const handleClearStats = () => {
        if (window.confirm('本当にすべての集計データを削除しますか？\nこの操作は取り消せません。')) {
            localStorage.removeItem('machida_election_stats_v2');
            setCumulativeCounts({});
            setResults([]);
            alert('データをリセットしました。');
        }
    };

    const handleSwipe = (vote) => {
        setDirection(vote ? 1 : -1);
        const newResult = { ...questions[currentIndex], vote };
        const updatedResults = [...results, newResult];
        setResults(updatedResults);

        if (currentIndex < questions.length - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
        } else {
            updateCumulativeStats(updatedResults);
            setTimeout(() => setScreen('result'), 200);
        }
    };

    const handleRestart = () => {
        setScreen('welcome');
        setResults([]);
        setCurrentIndex(0);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (screen !== 'voting') return;

            if (e.key === 'ArrowLeft') {
                handleSwipe(false);
            } else if (e.key === 'ArrowRight') {
                handleSwipe(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [screen, currentIndex, results]); // Re-bind when state changes to ensure fresh closures

    return (
        <div className="bg-brand-bg min-h-screen overflow-hidden relative">
            <AnimatePresence mode="wait">
                {screen === 'welcome' && (
                    <WelcomeScreen key="welcome" onStart={handleStart} />
                )}

                {screen === 'voting' && (
                    <div key="voting" className="fixed inset-0 flex flex-col items-center justify-center">
                        <div className="absolute top-8 text-gray-400 font-medium tracking-widest">
                            残り {questions.length - currentIndex} 枚
                        </div>

                        <div className="relative w-full max-w-sm h-[500px]">
                            <AnimatePresence initial={false} custom={direction}>
                                {questions.slice(currentIndex).reverse().map((q, index) => (
                                    <SwipeCard
                                        key={q.id}
                                        data={q}
                                        onSwipe={index === questions.slice(currentIndex).length - 1 ? handleSwipe : () => { }}
                                        custom={direction}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="absolute bottom-12 flex gap-8">
                            <button
                                onClick={() => handleSwipe(false)}
                                className="px-8 py-4 bg-white rounded-full shadow-lg flex items-center justify-center text-lg font-bold text-gray-500 hover:bg-gray-50 hover:scale-105 transition-all"
                            >
                                望まない
                            </button>
                            <button
                                onClick={() => handleSwipe(true)}
                                className="px-8 py-4 bg-brand-orange rounded-full shadow-lg flex items-center justify-center text-lg font-bold text-white hover:opacity-90 hover:scale-105 transition-all"
                            >
                                望む
                            </button>
                        </div>
                    </div>
                )}

                {screen === 'result' && (
                    <ResultDashboard
                        key="result"
                        results={results}
                        cumulativeCounts={cumulativeCounts}
                        onRestart={handleRestart}
                        onClearStats={handleClearStats}
                        isAdmin={isAdmin}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
