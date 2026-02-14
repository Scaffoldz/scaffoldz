function ThreeDView() {
    return (
        <div className="space-y-8 animate-fade-in p-8 h-full flex flex-col">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Interactive 3D Walkthrough</h1>
                <p className="text-gray-500 mt-1">Explore your project in a high-fidelity 3D environment.</p>
            </div>

            <div className="flex-1 bg-gray-900 rounded-2xl shadow-inner border border-gray-800 relative overflow-hidden group">
                {/* Mock 3D Viewport Controls */}
                <div className="absolute top-6 left-6 z-10 flex gap-2">
                    <button className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/20 transition-all">Orbit</button>
                    <button className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/20 transition-all">Walk</button>
                    <button className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/20 transition-all">Pan</button>
                </div>

                <div className="absolute top-6 right-6 z-10">
                    <button className="bg-primary text-white p-2 rounded-lg shadow-lg hover:bg-primary/90 transition-all">
                        <span className="text-xl">⛶</span>
                    </button>
                </div>

                {/* Mock 3D Model Rendering */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-96 h-64 bg-white/5 border border-white/10 rounded-lg transform rotate-x-[30deg] rotate-y-[-45deg] flex items-center justify-center relative shadow-2xl scale-110">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                        <div className="space-y-4 text-center">
                            <div className="text-white/20 font-bold text-8xl">🏠</div>
                            <div className="text-primary/60 font-mono text-xs animate-pulse uppercase tracking-[0.5em]">Rendering Model...</div>
                        </div>
                        {/* Structural Lines */}
                        <div className="absolute inset-0 border border-white/5 grid grid-cols-8 grid-rows-8 opacity-20"></div>
                    </div>

                    <div className="mt-12 text-center text-white/40 max-w-sm">
                        <p className="text-sm font-medium">BIM Model Version 2.4 (Structure Only)</p>
                        <p className="text-[10px] mt-1">LOD 300 - Generated on Feb 14, 2024</p>
                    </div>
                </div>

                {/* Floor Switcher */}
                <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
                    {['Roof', 'Floor 2', 'Floor 1', 'Basement'].map((f, i) => (
                        <button key={i} className={`w-12 h-12 rounded-lg text-[10px] font-bold border transition-all ${i === 2 ? 'bg-primary border-primary text-white shadow-lg scale-110' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                            }`}>
                            {f.split(' ')[0]}
                        </button>
                    ))}
                </div>

                {/* Layer Controls */}
                <div className="absolute bottom-6 right-6 z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 w-48">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Model Layers</p>
                    <div className="space-y-2">
                        {[
                            { name: 'Structural Steel', active: true },
                            { name: 'Electrical Grid', active: true },
                            { name: 'HVAC Ducting', active: false },
                            { name: 'Plumbing Nodes', active: false },
                        ].map((l, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <span className={l.active ? 'text-white font-medium' : 'text-white/40'}>{l.name}</span>
                                <div className={`w-3 h-3 rounded-full ${l.active ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-white/20'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThreeDView;
