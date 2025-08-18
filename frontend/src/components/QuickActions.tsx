import React from 'react';
import { QuickActionsProps } from '../types';

const QuickActions: React.FC<QuickActionsProps> = ({ onClearAll, onReset }) => {
  return (
    <div className="tool-section">
      <h3 className="tool-title">⚡ Quick Actions</h3>
      <button 
        className="btn btn--outline btn--full-width" 
        onClick={onClearAll}
      >
        Clear All Text
      </button>
      <button 
        className="btn btn--secondary btn--full-width" 
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};

export default QuickActions;
