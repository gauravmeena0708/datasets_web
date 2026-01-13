document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const views = {
        datasets: document.getElementById('datasets-view'),
        papers: document.getElementById('papers-view')
    };
    const navBtns = {
        datasets: document.getElementById('btn-datasets'),
        papers: document.getElementById('btn-papers')
    };
    const grids = {
        datasets: document.getElementById('dataset-grid'),
        papers: document.getElementById('papers-list')
    };
    const modal = {
        el: document.getElementById('detail-modal'),
        body: document.getElementById('modal-body'),
        close: document.querySelector('.close-modal')
    };

    let appData = null;

    // Navigation Logic
    function switchView(viewName) {
        Object.values(views).forEach(el => {
            el.classList.remove('active-view');
            el.classList.add('hidden-view');
        });
        Object.values(navBtns).forEach(el => el.classList.remove('active'));

        views[viewName].classList.add('active-view');
        views[viewName].classList.remove('hidden-view');
        navBtns[viewName].classList.add('active');
    }

    navBtns.datasets.addEventListener('click', () => switchView('datasets'));
    navBtns.papers.addEventListener('click', () => switchView('papers'));

    // Modal Logic
    function openModal(content) {
        modal.body.innerHTML = content;
        modal.el.classList.add('visible');
    }

    function closeModal() {
        modal.el.classList.remove('visible');
    }

    modal.close.addEventListener('click', closeModal);
    modal.el.addEventListener('click', (e) => {
        if (e.target === modal.el) closeModal();
    });

    // Render Logic
    function renderDatasets(datasets) {
        grids.datasets.innerHTML = datasets.map(d => `
            <div class="dataset-card" onclick="window.showDatasetDetail('${d.id}')">
                <span class="badge">${d.stats.task}</span>
                <h3>${d.name}</h3>
                <p style="color:var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    ${d.description.substring(0, 100)}...
                </p>
                <div class="stat-row">
                    <div class="stat-item">
                        <span>${d.stats.rows.toLocaleString()}</span>
                        Rows
                    </div>
                    <div class="stat-item">
                        <span>${d.stats.cols}</span>
                        Cols
                    </div>
                     <div class="stat-item">
                        <span>${d.columns_type ? d.columns_type.numerical : '?'}</span>
                        Num
                    </div>
                     <div class="stat-item">
                        <span>${d.columns_type ? d.columns_type.categorical : '?'}</span>
                        Cat
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderPapers(papers) {
        grids.papers.innerHTML = papers.map(p => `
            <div class="paper-card">
                <div class="paper-title">${p.title}</div>
                <div class="paper-meta">${p.authors} (${p.year})</div>
                <p style="margin-bottom: 0.5rem; color: var(--accent-secondary);">Key Results:</p>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Dataset</th>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${p.results.map(r => `
                            <tr>
                                <td>${r.dataset.toUpperCase()}</td>
                                <td>${r.metric}</td>
                                <td>${r.value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');
    }

    // Initialize
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            appData = data;
            renderDatasets(data.datasets);
            renderPapers(data.papers);
        })
        .catch(err => {
            console.error(err);
            grids.datasets.innerHTML = '<p class="error">Failed to load data.</p>';
        });

    // Export function for global access (onclick handlers)
    window.showDatasetDetail = function (id) {
        const d = appData.datasets.find(x => x.id === id);
        if (!d) return;

        const html = `
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">${d.name}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${d.origin}</p>
            
            <span class="detail-label">Description</span>
            <div class="detail-value">${d.description}</div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                <div>
                     <span class="detail-label">Task</span>
                     <div class="detail-value">${d.stats.task}</div>
                </div>
                 <div>
                     <span class="detail-label">Imbalance</span>
                     <div class="detail-value">${d.stats.imbalance}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 2rem;">
                 <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:10px; text-align:center;">
                    <div style="font-size:1.5rem; font-weight:bold;">${d.stats.rows.toLocaleString()}</div>
                    <div style="font-size:0.8rem; opacity:0.7;">Rows</div>
                </div>
                 <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:10px; text-align:center;">
                    <div style="font-size:1.5rem; font-weight:bold;">${d.stats.cols}</div>
                    <div style="font-size:0.8rem; opacity:0.7;">Columns</div>
                </div>
                  <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:10px; text-align:center;">
                    <div style="font-size:1.5rem; font-weight:bold;">${d.columns_type ? d.columns_type.categorical : 'N/A'}</div>
                    <div style="font-size:0.8rem; opacity:0.7;">Cat. Feats</div>
                </div>
            </div>

            <span class="detail-label">Used In Papers</span>
            <div class="detail-list">
                ${d.usage.map(u => `<span class="tag">${u}</span>`).join('')}
            </div>
        `;
        openModal(html);
    };
});
