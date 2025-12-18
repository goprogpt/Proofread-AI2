import React from 'react';
import { Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import { FindReplaceRule } from '../types';

interface FindReplaceProps {
  rules: FindReplaceRule[];
  setRules: React.Dispatch<React.SetStateAction<FindReplaceRule[]>>;
}

const FindReplace: React.FC<FindReplaceProps> = ({ rules, setRules }) => {
  const addRule = () => {
    setRules([...rules, { id: crypto.randomUUID(), find: '', replace: '' }]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, field: 'find' | 'replace', value: string) => {
    setRules(
      rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    );
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" />
          Find & Replace Rules
        </h3>
        <button
          onClick={addRule}
          className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-indigo-900/30"
        >
          <Plus className="w-3 h-3" />
          Add Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <p className="text-xs text-slate-500 italic text-center py-2">
          No active replacement rules.
        </p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-2 group">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={rule.find}
                  onChange={(e) => updateRule(rule.id, 'find', e.target.value)}
                  placeholder="Find..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={rule.replace}
                  onChange={(e) => updateRule(rule.id, 'replace', e.target.value)}
                  placeholder="Replace with..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                />
              </div>
              <button
                onClick={() => removeRule(rule.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindReplace;