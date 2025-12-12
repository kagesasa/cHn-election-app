import React from 'react';
import { motion } from 'framer-motion';

import { RefreshCw } from 'lucide-react';
import mascotSmile from '../assets/mascot_smile.png';
import { questions } from '../data/questions';

export default function ResultDashboard({ results, cumulativeCounts, onRestart, onClearStats, isAdmin }) {
    // Helper to get stats for a question
    const getStats = (id) => {
        if (cumulativeCounts && cumulativeCounts[id]) {
            return cumulativeCounts[id];
        }
        return { yes: 0, no: 0 };
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-6 bg-brand-bg overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
            >
                <div className="bg-brand-orange p-6 text-center text-white">
                    <h2 className="text-xl font-bold mb-2">みんなの希望集計（累計）</h2>
                    <p className="text-sm opacity-90">あなたの声が未来を作ります</p>
                </div>

                <div className="p-6">
                    <div className="flex justify-center mb-6">
                        <img src={mascotSmile} alt="Mascot Smile" className="w-32 h-32 object-contain" />
                    </div>

                    <div className="mb-6 space-y-6">
                        {questions.map((q) => {
                            const stats = getStats(q.id);
                            const total = stats.yes + stats.no;
                            const yesPercent = total > 0 ? Math.round((stats.yes / total) * 100) : 0;

                            // Check if user voted "Want" for this item in current session
                            const userVotedYes = results.find(r => r.id === q.id)?.vote === true;
                            const userVotedNo = results.find(r => r.id === q.id)?.vote === false;

                            return (
                                <div key={q.id} className="border-b pb-4 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-bold text-gray-800 flex-1">{q.question}</h3>
                                        {userVotedYes && <span className="ml-2 text-xs bg-brand-orange text-white px-2 py-1 rounded-full">あなたが選択</span>}
                                        {userVotedNo && <span className="ml-2 text-xs bg-gray-400 text-white px-2 py-1 rounded-full">あなたが選択</span>}
                                    </div>

                                    <div className="flex items-center gap-4 text-xl font-extrabold text-gray-800 mb-2">
                                        <span className="text-brand-orange">望む: {stats.yes}</span>
                                        <span className="text-gray-400">/</span>
                                        <span className="text-gray-500">望まない: {stats.no}</span>
                                    </div>

                                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-brand-orange transition-all duration-500"
                                            style={{ width: `${yesPercent}%` }}
                                        />
                                    </div>
                                    <div className="text-right text-xs text-brand-orange font-bold mt-1">
                                        望む率: {yesPercent}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onRestart}
                            className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <RefreshCw size={20} />
                            もう一度やる
                        </button>

                        {isAdmin && (
                            <button
                                onClick={onClearStats}
                                className="w-full text-xs text-gray-400 hover:text-red-500 py-2 border-t border-gray-100 mt-4 transition-colors"
                            >
                                累計データをリセット (開発用)
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
