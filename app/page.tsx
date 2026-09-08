<footer className="mt-12 pt-6 border-t border-stone-400/80 flex flex-wrap items-center justify-between gap-4 relative z-10 text-stone-700 text-xs">
              
              {/* Left Side: Stamps */}
              <div className="flex items-center gap-2 select-none">
                <div className="postage-stamp w-8 h-10 flex flex-col items-center justify-center rotate-[-3deg] hover:rotate-0 transition-transform cursor-pointer">
                  <span className="font-bold text-xs font-stamp text-stone-800">git</span>
                </div>
                <span className="text-[10px] text-stone-600 ml-1 italic font-hand hidden sm:inline">Clearance level verified</span>
              </div>
              
              {/* Right Side: IG Signature & Classification Block */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <a 
                  href="https://instagram.com/Noelpm14" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 transition-colors mr-1 cursor-pointer"
                  title="Follow the Creator"
                >
                  <span className="text-[9px] text-stone-500 font-mono uppercase tracking-widest group-hover:text-stone-800">
                    Chief Examiner:
                  </span>
                  <span className="font-hand text-[15px] text-blue-900 -rotate-2 group-hover:underline decoration-blue-900/50">
                    @Noelpm14
                  </span>
                </a>

                <div className="bg-stone-300/80 border border-stone-500 px-3 py-1 font-mono text-[10px] tracking-wider text-stone-800 uppercase shadow-sm">
                  PROPERTY OF THE INSTITUTE // CLASSIFICATION: CODE AUTOPSY
                </div>
              </div>

            </footer>
