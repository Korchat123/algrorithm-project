import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { semanticSearchData } from '../utils/algorithmData.js';

const categories = {
  'Animals': [1, 2, 3, 4, 5, 6, 7, 8],
  'Food': [9, 10, 11, 12, 13, 14, 15],
  'Technology': [16, 17, 18, 19, 20, 21, 22, 23],
  'Transportation': [24, 25, 26, 27, 28, 29, 30],
};

const categoryColors = {
  'Animals': '#6b7280',
  'Food': '#f59e0b',
  'Technology': '#3b82f6',
  'Transportation': '#ef4444',
};

export function Sidebar({ highlightedId, onItemClick, searchFilter, onSearchFilterChange }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Animals', 'Food']));

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryItems = (categoryName) => {
    const ids = categories[categoryName];
    return semanticSearchData.data.filter(item => ids.includes(item.id));
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #d8ded2',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid #d8ded2' }}>
        <h3 style={{ color: '#14231f', margin: '0 0 12px 0', fontSize: '16px' }}>
          Database
        </h3>
        <input
          type="text"
          placeholder="Search items..."
          value={searchFilter}
          onChange={(event) => onSearchFilterChange(event.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d8ded2',
            borderRadius: '6px',
            fontSize: '13px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {Object.keys(categories).map((categoryName) => {
          const isExpanded = expandedCategories.has(categoryName);
          const items = getCategoryItems(categoryName);
          const filteredItems = searchFilter
            ? items.filter(item => item.text.toLowerCase().includes(searchFilter.toLowerCase()))
            : items;

          return (
            <div key={categoryName} style={{ borderBottom: '1px solid #eef3ed' }}>
              <button
                onClick={() => toggleCategory(categoryName)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: '#f9faf8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#f0f2ef')}
                onMouseLeave={(e) => (e.target.style.background = '#f9faf8')}
              >
                <ChevronDown
                  size={16}
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    color: categoryColors[categoryName],
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    backgroundColor: categoryColors[categoryName],
                  }}
                />
                <span
                  style={{
                    color: '#14231f',
                    fontSize: '13px',
                    fontWeight: '600',
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  {categoryName}
                </span>
                <span style={{ fontSize: '12px', color: '#52615b' }}>
                  {filteredItems.length}
                </span>
              </button>

              {isExpanded && (
                <div style={{ background: '#fafbf9', padding: '8px' }}>
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onItemClick(item.id)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        marginBottom: '4px',
                        border:
                          highlightedId === item.id
                            ? '2px solid #1f6f58'
                            : '1px solid #eef3ed',
                        background:
                          highlightedId === item.id
                            ? '#e8f3ef'
                            : '#ffffff',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: highlightedId === item.id ? '#1f6f58' : '#52615b',
                        fontWeight: highlightedId === item.id ? '600' : '400',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (highlightedId !== item.id) {
                          e.target.style.background = '#f5f7f2';
                          e.target.style.borderColor = '#cbd6cd';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (highlightedId !== item.id) {
                          e.target.style.background = '#ffffff';
                          e.target.style.borderColor = '#eef3ed';
                        }
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
