import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Maximize2, X, ChevronLeft, LayoutGrid, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setSelectedGame(null)}
          >
            <div className="bg-zinc-900 p-2 rounded-xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Unblocked Arcade</h1>
          </div>

          <div className="relative flex-1 max-w-md mx-8 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-zinc-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              title="View Grid"
            >
              <LayoutGrid className="w-5 h-5 text-zinc-600" />
            </button>
            <button 
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              title="About"
            >
              <Info className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Popular Games</h2>
                <p className="text-zinc-500">Pick a game and start playing instantly.</p>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6 md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-zinc-200">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="bg-white text-zinc-900 px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                          Play Now
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                      <p className="text-zinc-500 text-sm line-clamp-2">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-zinc-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No games found</h3>
                  <p className="text-zinc-500">Try searching for something else.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-[calc(100vh-160px)]"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Arcade
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 hover:bg-zinc-200 rounded-lg transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-200 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                />
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                  <p className="text-zinc-500">{selectedGame.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-semibold hover:bg-zinc-800 transition-colors">
                    Favorite
                  </button>
                  <button className="bg-white border border-zinc-200 px-6 py-2 rounded-xl font-semibold hover:bg-zinc-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-200 py-12 px-6 mt-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-zinc-900 p-1.5 rounded-lg">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">Unblocked Arcade</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your favorite web games, unblocked and ready to play. No downloads, no signups, just fun.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">New Games</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Most Played</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Categories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Report a Bug</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Request a Game</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-100 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Unblocked Arcade. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
