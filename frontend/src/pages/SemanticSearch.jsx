import { useState } from 'react';
import { VectorSpaceVisualization } from '../components/VectorSpaceVisualization.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { buildSemanticEmbedding, semanticSearchData } from '../utils/algorithmData.js';

export function SemanticSearch() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [customQuery, setCustomQuery] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const handleCustomSearch = (text) => {
    if (!text.trim()) {
      setCustomQuery(null);
      return;
    }

    setCustomQuery({ text, embedding: buildSemanticEmbedding(text) });
  };

  return (
    <div className="page-container">
      <section className="hero">
        <h1>Semantic Search & Vector Embeddings</h1>
        <p>
          Understand how vectors in high-dimensional space power modern search engines
          and recommendation systems. Try searching with custom queries or exploring the database.
        </p>
      </section>

      <section className="concept-section">
        <h2>Definition</h2>
        <p>
          Semantic search is a search method that looks for meaning instead of only
          exact keyword matches. It converts text into vectors that capture concepts
          and relationships, then ranks results by how close their meanings are to
          the query.
        </p>
      </section>

      <section className="concept-section">
        <h2>What are Vector Embeddings?</h2>
        <p>
          A vector embedding is a list of numbers that represents the meaning or
          features of something, such as a word, sentence, image, or product. Items
          with similar meaning get similar number patterns, so they appear close
          together when compared in vector space.
        </p>
        <div className="concept-grid">
          <div className="concept-card">
            <h3>📊 Representation</h3>
            <p>
              Text, images, and other data are converted into vectors (arrays of
              numbers) that capture semantic meaning in N-dimensional space.
            </p>
          </div>
          <div className="concept-card">
            <h3>🔍 Similarity Search</h3>
            <p>
              Vectors close to each other in space represent semantically similar
              content. Distance between vectors indicates relevance.
            </p>
          </div>
          <div className="concept-card">
            <h3>⚡ Efficient Retrieval</h3>
            <p>
              Vector search enables fast similarity matching across millions of
              items, powering search engines and recommendation systems.
            </p>
          </div>
          <div className="concept-card">
            <h3>🧠 Semantic Understanding</h3>
            <p>
              Unlike keyword matching, vectors capture meaning. Similar words or
              concepts cluster together naturally.
            </p>
          </div>
        </div>
      </section>

      {/* Main visualization area with sidebar */}
      <section style={{ marginTop: '48px', marginBottom: '48px' }}>
        <h2 style={{ color: '#14231f', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '28px' }}>
          Interactive Vector Space
        </h2>

        {/* Custom Search Input */}
        <div
          style={{
            background: '#f9faf8',
            border: '1px solid #eef3ed',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'block',
              color: '#24433a',
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            Try Your Own Query:
          </label>
          <input
            type="text"
            placeholder="e.g., 'fast animals', 'healthy food', 'mobile devices'..."
            onChange={(e) => handleCustomSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d8ded2',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          <p style={{ color: '#52615b', fontSize: '12px', margin: '8px 0 0 0' }}>
            Tip: Try mixed traits like friendly living, dangerous wild, edible natural, engineered utility, or fast vehicle
          </p>
        </div>

        {/* Pre-configured Queries */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #d8ded2',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'block',
              color: '#24433a',
              fontWeight: '600',
              marginBottom: '12px',
              fontSize: '14px',
            }}
          >
            Or Select Pre-configured Query:
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
            }}
          >
            {semanticSearchData.queries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryIndex(idx);
                  setCustomQuery(null);
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border:
                    !customQuery && queryIndex === idx
                      ? '2px solid #1f6f58'
                      : '1px solid #d8ded2',
                  background:
                    !customQuery && queryIndex === idx
                      ? '#e8f3ef'
                      : '#ffffff',
                  color: !customQuery && queryIndex === idx ? '#1f6f58' : '#52615b',
                  fontWeight: !customQuery && queryIndex === idx ? '700' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '13px',
                }}
              >
                {query.text}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout with Sidebar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '16px',
          }}
        >
          {/* Sidebar */}
          <Sidebar
            highlightedId={highlightedId}
            onItemClick={setHighlightedId}
            searchFilter={searchFilter}
            onSearchFilterChange={setSearchFilter}
          />

          {/* Visualization */}
          <VectorSpaceVisualization
            queryIndex={queryIndex}
            customQuery={customQuery}
            highlightedId={highlightedId}
          />
        </div>

        <div className="visualization-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ff4444' }}></div>
            <span>Query Vector (red)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffa500' }}></div>
            <span>Top 5 Nearest Neighbors (orange)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffff00' }}></div>
            <span>Highlighted Item (yellow)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4d9eff' }}></div>
            <span>Other Data Points (blue)</span>
          </div>
        </div>
      </section>

      <section className="algorithm-section">
        <h2>How Vector Search Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Embedding</h3>
              <p>
                Convert data (text, images) into vectors using embedding models
                (Word2Vec, BERT, GPT embeddings, etc.). Each dimension captures
                different semantic aspects.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Indexing</h3>
              <p>
                Store vectors in specialized indices (FAISS, Pinecone, Milvus).
                These use spatial data structures for efficient lookup.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Query</h3>
              <p>
                Convert query into same vector space, find K nearest neighbors
                using distance metrics (cosine, Euclidean, Manhattan).
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Result</h3>
              <p>
                Return ranked results based on distance. Closer vectors = more
                semantically similar = more relevant results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="complexity-section">
        <h2>Complexity Analysis</h2>
        <div className="complexity-table">
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Embedding</td>
                <td>O(n × d)</td>
                <td>O(d)</td>
                <td>n = data size, d = embedding dimension</td>
              </tr>
              <tr>
                <td>Brute Force Search</td>
                <td>O(n × d)</td>
                <td>O(n × d)</td>
                <td>Compare with all vectors</td>
              </tr>
              <tr>
                <td>HNSW Search</td>
                <td>O(log n × d)</td>
                <td>O(n × d)</td>
                <td>Hierarchical Navigable Small World</td>
              </tr>
              <tr>
                <td>IVF Search</td>
                <td>O(nprobe × d)</td>
                <td>O(n × d)</td>
                <td>Inverted File Index - nprobe = partitions checked</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="use-cases">
        <h2>Real-World Applications</h2>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <h3>🔎 Search Engines</h3>
            <p>
              Google uses vector embeddings to understand search intent and return
              more relevant results beyond keyword matching.
            </p>
          </div>
          <div className="use-case-card">
            <h3>🛍️ Recommendations</h3>
            <p>
              Netflix, Spotify, and Amazon recommend content by finding similar
              items in embedding space to what you have liked.
            </p>
          </div>
          <div className="use-case-card">
            <h3>💬 RAG & LLMs</h3>
            <p>
              Retrieval-Augmented Generation uses vector search to find relevant
              context before generating responses with large language models.
            </p>
          </div>
          <div className="use-case-card">
            <h3>🐛 Duplicate Detection</h3>
            <p>
              Find duplicate documents, images, or records by comparing vectors.
              Used in spam detection, plagiarism checking.
            </p>
          </div>
          <div className="use-case-card">
            <h3>🎨 Image Search</h3>
            <p>
              Find visually similar images by embedding them in the same space.
              Pinterest and Google Images use this technology.
            </p>
          </div>
          <div className="use-case-card">
            <h3>📈 Clustering</h3>
            <p>
              Group similar items together. Useful for customer segmentation,
              topic modeling, and trend detection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
