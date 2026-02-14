import { useState } from 'react';
import { Package, Plus } from 'lucide-react';

const Materials = () => {
    const [materials] = useState([
        { id: 1, name: 'Cement Bags', quantity: 50, used: 20, unit: 'bags' },
        { id: 2, name: 'Rebar 12mm', quantity: 1000, used: 450, unit: 'kg' },
        { id: 3, name: 'Sand', quantity: 5, used: 2, unit: 'tons' },
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Material Log</h2>
                <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                    <Plus size={16} />
                    Add Entry
                </button>
            </div>

            <div className="space-y-4">
                {materials.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Package size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">Total: {item.quantity} {item.unit}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{item.used}</p>
                            <p className="text-xs text-gray-500">Used ({item.unit})</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Materials;
