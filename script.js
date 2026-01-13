document.addEventListener('DOMContentLoaded', () => {

    // Inline data to avoid CORS issues when opening from file://
    const appData = {
        "datasets": [
            {
                "id": "adult",
                "name": "Adult (Census Income)",
                "description": "Prediction of whether income exceeds $50K/yr based on census data. Also known as 'Census Income' dataset.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 48842, "cols": 15, "train": 32561, "test": 16281, "task": "Binary Classification", "missing_values": "Yes (encoded as ?)", "imbalance": "~24% >50K" },
                "columns_type": { "numerical": 6, "categorical": 9 },
                "usage": ["DiffuTabGen", "TabSYN", "TabDiff", "TabDDPM"],
                "class_imbalance_ratio": "0.31 (Positive: ~24%)",
                "sparsity": "~7% rows have '?' (Missing Values)",
                "difficulty": {
                    "single_constraint": { "level": "Medium", "score": 5, "reason": "Moderate imbalance. Missing values add noise. Many categorical columns make encoding harder." },
                    "double_constraint": { "level": "Hard", "score": 7, "reason": "Correlations between features (e.g., education & income) can conflict with arbitrary double constraints." }
                }
            },
            {
                "id": "default",
                "name": "Loan Default (Default of Credit Card Clients)",
                "description": "Predict default payment of credit card clients in Taiwan.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 30000, "cols": 24, "task": "Binary Classification", "imbalance": "~22% Default" },
                "columns_type": { "numerical": 14, "categorical": 10 },
                "usage": ["DiffuTabGen", "TabSYN", "ResNet"],
                "class_imbalance_ratio": "0.28 (Positive: ~22%)",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Medium", "score": 5, "reason": "Imbalanced target. Financial data has heavy tails and outliers." },
                    "double_constraint": { "level": "Hard", "score": 8, "reason": "Strong inter-column dependencies (payment history, balance). Conflicting constraints are common." }
                }
            },
            {
                "id": "shoppers",
                "name": "Online Shoppers Purchasing Intention",
                "description": "Dataset consists of feature vectors belonging to 12,330 sessions. The dataset was formed so that each session would belong to a different user in a 1-year period.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 12330, "cols": 18, "task": "Binary Classification", "imbalance": "~15.5% Revenue (Positive)" },
                "columns_type": { "numerical": 10, "categorical": 8 },
                "usage": ["DiffuTabGen", "TabSYN"],
                "class_imbalance_ratio": "0.18 (Positive: ~15.5%)",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Hard", "score": 7, "reason": "Highly imbalanced (~15% positive). Generating minority class samples requires tail generation." },
                    "double_constraint": { "level": "Very Hard", "score": 9, "reason": "Severe imbalance + temporal/behavioral features. Double constraints on rare events are extremely difficult." }
                }
            },
            {
                "id": "german",
                "name": "German Credit",
                "description": "Classifies people described by a set of attributes as good or bad credit risks.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 1000, "cols": 21, "task": "Binary Classification", "imbalance": "30% Bad Credit" },
                "columns_type": { "numerical": 7, "categorical": 14 },
                "usage": ["DiffuTabGen", "TabSYN", "TVAE"],
                "class_imbalance_ratio": "0.42 (Positive: 30%)",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Easy", "score": 3, "reason": "Small dataset, moderate imbalance. Easy to learn distribution." },
                    "double_constraint": { "level": "Medium", "score": 5, "reason": "Small sample size limits learning complex joint distributions for multiple constraints." }
                }
            },
            {
                "id": "dropout",
                "name": "Predict Students' Dropout and Academic Success",
                "description": "A dataset from a higher education institution related to students enrolled in different undergraduate degrees.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 4424, "cols": 37, "task": "Classification (Dropout/Enrolled/Graduate)", "imbalance": "Balanced" },
                "columns_type": { "numerical": "Mixed", "categorical": "Mixed" },
                "usage": ["DiffuTabGen", "TabSYN"],
                "class_imbalance_ratio": "1.0 (Balanced)",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Medium", "score": 5, "reason": "Balanced but high-dimensional (37 cols). Many features increase complexity." },
                    "double_constraint": { "level": "Hard", "score": 7, "reason": "Multi-class target. High dimensionality makes joint constraint satisfaction harder." }
                }
            },
            {
                "id": "magic",
                "name": "MAGIC Gamma Telescope",
                "description": "Data are MC generated to simulate registration of high energy gamma particles in a ground-based atmospheric Cherenkov gamma telescope.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 19020, "cols": 11, "task": "Binary Classification", "imbalance": "Imbalanced (~35% Signal)" },
                "columns_type": { "numerical": 10, "categorical": 1 },
                "usage": ["TabSYN"],
                "class_imbalance_ratio": "0.54 (Positive: ~35%)",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Easy", "score": 2, "reason": "Mostly numerical. Low dimensionality. Clean MC-generated data." },
                    "double_constraint": { "level": "Easy", "score": 3, "reason": "Simple structure. Numerical features have smooth distributions. Few conflicts." }
                }
            },
            {
                "id": "cardio",
                "name": "Cardiovascular Disease",
                "description": "Dataset for cardiovascular disease detection.",
                "origin": "Kaggle",
                "stats": { "rows": 70000, "cols": 12, "task": "Binary Classification", "imbalance": "Balanced" },
                "columns_type": { "numerical": "Mixed", "categorical": "Mixed" },
                "usage": ["DiffuTabGen (Plausibility Experiments)"],
                "class_imbalance_ratio": "1.0 (Balanced)",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Very Easy", "score": 1, "reason": "Balanced, large dataset, low dimensionality. Ideal for diffusion models." },
                    "double_constraint": { "level": "Easy", "score": 2, "reason": "Large sample size and balanced classes make joint constraints easier to satisfy." }
                }
            },
            {
                "id": "beijing",
                "name": "Beijing PM2.5",
                "description": "Hourly PM2.5 data from US Embassy in Beijing. Used to predict pollution levels.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 43824, "cols": 13, "task": "Regression", "imbalance": "N/A (Regression)" },
                "columns_type": { "numerical": 9, "categorical": 4 },
                "usage": ["TabSYN"],
                "class_imbalance_ratio": "N/A",
                "sparsity": "~4% Missing Values",
                "difficulty": {
                    "single_constraint": { "level": "Medium", "score": 4, "reason": "Regression target. Time-series dependencies. Some missing values." },
                    "double_constraint": { "level": "Medium", "score": 5, "reason": "Temporal correlations can conflict with arbitrary constraints on weather features." }
                }
            },
            {
                "id": "news",
                "name": "Online News Popularity",
                "description": "Articles published by Mashable. Predicts the number of shares in social networks.",
                "origin": "UCI Machine Learning Repository",
                "stats": { "rows": 39644, "cols": 61, "task": "Regression", "imbalance": "N/A (Regression)" },
                "columns_type": { "numerical": 58, "categorical": 3 },
                "usage": ["TabSYN"],
                "class_imbalance_ratio": "N/A",
                "sparsity": "0% (Dense)",
                "difficulty": {
                    "single_constraint": { "level": "Hard", "score": 6, "reason": "Very high dimensionality (61 cols). Regression target with heavy-tailed distribution (viral articles)." },
                    "double_constraint": { "level": "Very Hard", "score": 9, "reason": "High dimensionality + heavy-tailed target. Extremely difficult to satisfy constraints on popularity metrics." }
                }
            }
        ],
        "insights": {
            "title": "Why Model Performance Varies",
            "content": [
                {
                    "metric": "Class Imbalance",
                    "impact": "Models like GANs tend to suffer from 'mode collapse', ignoring minority classes entirely. Diffusion models (like DiffuTabGen) are more robust but still biased towards the mean. Highly imbalanced datasets (like default/shoppers) make it harder to generate high-fidelity minority samples."
                },
                {
                    "metric": "Sparsity & Cardinality",
                    "impact": "Sparsity (missing values) usually requires imputation which introduces noise. High Cardinality in categorical columns is challenging because 'Analog Bit' encoding imposes an artificial geometry/ordering on categories."
                },
                {
                    "metric": "Distribution Tails",
                    "impact": "When the target mean is at the extreme ends of the distribution, guided diffusion struggles to generate accurate samples. Datasets with heavy tails or outliers (like financial data in Loan Default) are harder to model accurately."
                },
                {
                    "metric": "Single vs. Double Constraints",
                    "impact": "Single constraints only require shifting one marginal distribution. Double constraints require satisfying a joint condition, which can conflict with learned correlations. For example, constraining both 'high education' AND 'low income' on Adult is harder than either alone because they are negatively correlated in the training data."
                }
            ]
        },
        "papers": [
            {
                "id": "diffutabgen",
                "title": "TabDiffuGEN: Guided Diffusion for Synthetic Tabular Data Generation with User-Specified Constraints",
                "authors": "Lakshay Kakkar, N. Rajasekhar Reddy, Srikanta Bedathur",
                "year": 2025,
                "results": [
                    { "dataset": "adult", "metric": "Plausibility Score (NLL)", "value": "6.13" },
                    { "dataset": "loan", "metric": "Plausibility Score (NLL)", "value": "12.87" },
                    { "dataset": "cardio", "metric": "Plausibility Score (NLL)", "value": "15.54" },
                    { "dataset": "loan", "metric": "Constraint Satisfaction (Guided)", "value": "100%" }
                ]
            },
            {
                "id": "tabsyn",
                "title": "TabSYN: Modeling Tabular Data with Diffusion Models",
                "authors": "Zhang et al.",
                "year": 2024,
                "results": [
                    { "dataset": "german", "metric": "Overall Quality Score", "value": "97.57%" },
                    { "dataset": "loan", "metric": "Overall Quality Score", "value": "97.24%" },
                    { "dataset": "dropout", "metric": "Overall Quality Score", "value": "75.9%" }
                ]
            }
        ]
    };

    // Elements
    const views = {
        datasets: document.getElementById('datasets-view'),
        papers: document.getElementById('papers-view'),
        analysis: document.getElementById('analysis-view')
    };
    const navBtns = {
        datasets: document.getElementById('btn-datasets'),
        papers: document.getElementById('btn-papers'),
        analysis: document.getElementById('btn-analysis')
    };
    const grids = {
        datasets: document.getElementById('dataset-grid'),
        papers: document.getElementById('papers-list'),
        analysis: document.getElementById('analysis-content')
    };
    const modal = {
        el: document.getElementById('detail-modal'),
        body: document.getElementById('modal-body'),
        close: document.querySelector('.close-modal')
    };

    // Navigation Logic
    function switchView(viewName) {
        Object.values(views).forEach(el => {
            if (el) {
                el.classList.remove('active-view');
                el.classList.add('hidden-view');
            }
        });
        Object.values(navBtns).forEach(el => {
            if (el) el.classList.remove('active');
        });

        if (views[viewName]) {
            views[viewName].classList.add('active-view');
            views[viewName].classList.remove('hidden-view');
        }
        if (navBtns[viewName]) {
            navBtns[viewName].classList.add('active');
        }
    }

    if (navBtns.datasets) navBtns.datasets.addEventListener('click', () => switchView('datasets'));
    if (navBtns.papers) navBtns.papers.addEventListener('click', () => switchView('papers'));
    if (navBtns.analysis) navBtns.analysis.addEventListener('click', () => switchView('analysis'));

    // Modal Logic
    function openModal(content) {
        if (modal.body) modal.body.innerHTML = content;
        if (modal.el) modal.el.classList.add('visible');
    }

    function closeModal() {
        if (modal.el) modal.el.classList.remove('visible');
    }

    if (modal.close) modal.close.addEventListener('click', closeModal);
    if (modal.el) modal.el.addEventListener('click', (e) => {
        if (e.target === modal.el) closeModal();
    });

    // Helper: Difficulty badge color
    function getDifficultyColor(level) {
        const colors = {
            'Very Easy': '#10b981',
            'Easy': '#22c55e',
            'Medium': '#f59e0b',
            'Hard': '#ef4444',
            'Very Hard': '#dc2626'
        };
        return colors[level] || '#888';
    }

    // Render Logic
    function renderDatasets(datasets) {
        if (!grids.datasets) return;
        grids.datasets.innerHTML = datasets.map(d => {
            const singleDiff = d.difficulty?.single_constraint;
            const doubleDiff = d.difficulty?.double_constraint;
            return `
            <div class="dataset-card" onclick="window.showDatasetDetail('${d.id}')">
                <span class="badge">${d.stats.task}</span>
                <h3>${d.name}</h3>
                <p style="color:var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    ${d.description.substring(0, 80)}...
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
                </div>
                ${singleDiff ? `
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="background: ${getDifficultyColor(singleDiff.level)}22; color: ${getDifficultyColor(singleDiff.level)}; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; border: 1px solid ${getDifficultyColor(singleDiff.level)}44;">
                        1-Constraint: ${singleDiff.level}
                    </span>
                    <span style="background: ${getDifficultyColor(doubleDiff.level)}22; color: ${getDifficultyColor(doubleDiff.level)}; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; border: 1px solid ${getDifficultyColor(doubleDiff.level)}44;">
                        2-Constraint: ${doubleDiff.level}
                    </span>
                </div>
                ` : ''}
            </div>
        `}).join('');
    }

    function renderPapers(papers) {
        if (!grids.papers) return;
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

    function renderAnalysis(insights) {
        if (!grids.analysis || !insights) return;

        // Sort datasets by difficulty for the ranking table
        const sortedSingle = [...appData.datasets].filter(d => d.difficulty).sort((a, b) => a.difficulty.single_constraint.score - b.difficulty.single_constraint.score);
        const sortedDouble = [...appData.datasets].filter(d => d.difficulty).sort((a, b) => a.difficulty.double_constraint.score - b.difficulty.double_constraint.score);

        grids.analysis.innerHTML = `
            <div class="paper-card">
                <h2 style="margin-bottom:1.5rem;">${insights.title}</h2>
                <div style="display:flex; flex-direction:column; gap:2rem;">
                    ${insights.content.map(i => `
                        <div style="border-left: 3px solid var(--accent-secondary); padding-left: 1.5rem;">
                            <h3 style="color:var(--accent-secondary); margin-bottom:0.5rem;">${i.metric}</h3>
                            <p style="color:var(--text-secondary); line-height:1.6;">${i.impact}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="paper-card" style="margin-top: 2rem;">
                <h2 style="margin-bottom:1.5rem;">Dataset Difficulty Rankings</h2>
                <p style="color:var(--text-secondary); margin-bottom: 1.5rem;">
                    Datasets ranked from easiest to hardest for synthetic data generation with constraints.
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">Single Constraint</h3>
                        <table class="results-table">
                            <thead>
                                <tr><th>Rank</th><th>Dataset</th><th>Difficulty</th></tr>
                            </thead>
                            <tbody>
                                ${sortedSingle.map((d, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${d.name}</td>
                                        <td style="color: ${getDifficultyColor(d.difficulty.single_constraint.level)}">${d.difficulty.single_constraint.level}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">Double Constraint</h3>
                        <table class="results-table">
                            <thead>
                                <tr><th>Rank</th><th>Dataset</th><th>Difficulty</th></tr>
                            </thead>
                            <tbody>
                                ${sortedDouble.map((d, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${d.name}</td>
                                        <td style="color: ${getDifficultyColor(d.difficulty.double_constraint.level)}">${d.difficulty.double_constraint.level}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSummaryTable(datasets) {
        const tbody = document.getElementById('summary-table-body');
        if (!tbody) return;

        const priorityOrder = ['adult', 'default', 'shoppers', 'magic', 'beijing', 'news', 'german', 'cardio', 'dropout'];

        const sorted = [...datasets].sort((a, b) => {
            const aIdx = priorityOrder.indexOf(a.id);
            const bIdx = priorityOrder.indexOf(b.id);
            return (aIdx === -1 ? 100 : aIdx) - (bIdx === -1 ? 100 : bIdx);
        });

        tbody.innerHTML = sorted.map(d => {
            const singleDiff = d.difficulty?.single_constraint;
            const doubleDiff = d.difficulty?.double_constraint;
            return `
            <tr>
                <td style="font-weight:bold; color:var(--accent-primary);">${d.name}</td>
                <td>${d.stats.task}</td>
                <td>${d.stats.rows.toLocaleString()}</td>
                <td>${d.stats.cols}</td>
                <td>${d.columns_type ? d.columns_type.numerical : '-'}</td>
                <td>${d.columns_type ? d.columns_type.categorical : '-'}</td>
                <td style="color: ${singleDiff ? getDifficultyColor(singleDiff.level) : '#888'}">${singleDiff ? singleDiff.level : '-'}</td>
                <td style="color: ${doubleDiff ? getDifficultyColor(doubleDiff.level) : '#888'}">${doubleDiff ? doubleDiff.level : '-'}</td>
            </tr>
        `}).join('');
    }

    // Initialize with inline data
    renderDatasets(appData.datasets);
    renderSummaryTable(appData.datasets);
    renderPapers(appData.papers);
    renderAnalysis(appData.insights);

    // Export function for global access (onclick handlers)
    window.showDatasetDetail = function (id) {
        const d = appData.datasets.find(x => x.id === id);
        if (!d) return;

        const singleDiff = d.difficulty?.single_constraint;
        const doubleDiff = d.difficulty?.double_constraint;

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

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
                  <div>
                     <span class="detail-label">Class Ratio</span>
                     <div class="detail-value">${d.class_imbalance_ratio || 'N/A'}</div>
                </div>
                <div>
                     <span class="detail-label">Sparsity</span>
                     <div class="detail-value">${d.sparsity || 'N/A'}</div>
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

            ${singleDiff ? `
            <span class="detail-label" style="margin-top: 2rem;">Generation Difficulty</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
                <div style="background: ${getDifficultyColor(singleDiff.level)}15; padding: 1rem; border-radius: 10px; border: 1px solid ${getDifficultyColor(singleDiff.level)}33;">
                    <div style="font-weight: bold; color: ${getDifficultyColor(singleDiff.level)}; margin-bottom: 0.5rem;">Single Constraint: ${singleDiff.level}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${singleDiff.reason}</div>
                </div>
                <div style="background: ${getDifficultyColor(doubleDiff.level)}15; padding: 1rem; border-radius: 10px; border: 1px solid ${getDifficultyColor(doubleDiff.level)}33;">
                    <div style="font-weight: bold; color: ${getDifficultyColor(doubleDiff.level)}; margin-bottom: 0.5rem;">Double Constraint: ${doubleDiff.level}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${doubleDiff.reason}</div>
                </div>
            </div>
            ` : ''}

            <span class="detail-label">Used In Papers</span>
            <div class="detail-list">
                ${d.usage.map(u => `<span class="tag">${u}</span>`).join('')}
            </div>
        `;
        openModal(html);
    };
});
