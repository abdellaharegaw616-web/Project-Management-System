import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export default function ThreeDotMenu({ items = [], align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button onClick={() => setOpen(o => !o)} className="p-1 rounded hover:bg-gray-100">
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'} bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-md z-50 w-44`}> 
          <div className="py-1">
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => { setOpen(false); it.onClick && it.onClick(); }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-slate-200"
              >
                {it.icon && <span className="inline-block mr-2 align-middle">{it.icon}</span>}
                <span className="align-middle">{it.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
