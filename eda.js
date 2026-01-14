/**
 * EDA (Exploratory Data Analysis) Module
 * Provides visualization and analysis functions for dataset exploration
 */

const EDA = {
    /**
     * Generate a histogram for numerical column data
     */
    createHistogram(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const { label = 'Distribution', color = '#6c5ce7', bins = 20 } = options;

        // Calculate histogram bins
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / bins;
        const histogram = new Array(bins).fill(0);

        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            histogram[binIndex]++;
        });

        const labels = Array.from({ length: bins }, (_, i) => {
            const start = min + i * binWidth;
            return start.toFixed(2);
        });

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: histogram,
                    backgroundColor: color + 'aa',
                    borderColor: color,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `Distribution of ${label}`,
                        color: '#ffffff'
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Value Range', color: '#a0a0c0' },
                        ticks: { color: '#a0a0c0', maxRotation: 45, minRotation: 45 },
                        grid: { color: '#ffffff11' }
                    },
                    y: {
                        title: { display: true, text: 'Frequency', color: '#a0a0c0' },
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    }
                }
            }
        });
    },

    /**
     * Create a box plot visualization
     */
    createBoxPlot(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const { label = 'Box Plot', color = '#00cec9' } = options;

        // Calculate quartiles
        const sorted = [...data].sort((a, b) => a - b);
        const q1 = this.percentile(sorted, 25);
        const median = this.percentile(sorted, 50);
        const q3 = this.percentile(sorted, 75);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const iqr = q3 - q1;

        // Outlier detection
        const lowerFence = q1 - 1.5 * iqr;
        const upperFence = q3 + 1.5 * iqr;
        const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Q1-Q3', 'Median', 'Min-Max'],
                datasets: [{
                    label: 'Range',
                    data: [q3 - q1, 0, max - min],
                    backgroundColor: [color + '66', color + 'aa', color + '33'],
                    borderColor: color,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `Box Plot: ${label}`,
                        color: '#ffffff'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const labels = [
                                    `IQR: ${(q3 - q1).toFixed(2)} (Q1: ${q1.toFixed(2)}, Q3: ${q3.toFixed(2)})`,
                                    `Median: ${median.toFixed(2)}`,
                                    `Range: ${(max - min).toFixed(2)} (Min: ${min.toFixed(2)}, Max: ${max.toFixed(2)})`
                                ];
                                return labels[context.dataIndex];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    },
                    y: {
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    }
                }
            }
        });
    },

    /**
     * Create quantile diagram (Q-Q plot approximation)
     */
    createQuantileDiagram(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const { label = 'Quantiles', color = '#6c5ce7' } = options;

        const sorted = [...data].sort((a, b) => a - b);
        const quantiles = [0, 10, 25, 50, 75, 90, 100];
        const values = quantiles.map(q => ({
            x: q,
            y: this.percentile(sorted, q)
        }));

        return new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: label,
                    data: values,
                    borderColor: color,
                    backgroundColor: color + '33',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `Quantile Plot: ${label}`,
                        color: '#ffffff'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.parsed.x}th percentile: ${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Percentile', color: '#a0a0c0' },
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    },
                    y: {
                        title: { display: true, text: 'Value', color: '#a0a0c0' },
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    }
                }
            }
        });
    },

    /**
     * Create categorical frequency bar chart
     */
    createCategoricalChart(canvasId, categories, frequencies, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const { label = 'Categories', color = '#00cec9', showPercentages = true } = options;

        const total = frequencies.reduce((sum, f) => sum + f, 0);
        const percentages = frequencies.map(f => ((f / total) * 100).toFixed(1));

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Frequency',
                    data: frequencies,
                    backgroundColor: color + 'aa',
                    borderColor: color,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `Distribution of ${label}`,
                        color: '#ffffff'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const freq = context.parsed.y;
                                const pct = percentages[context.dataIndex];
                                return `Count: ${freq} (${pct}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#a0a0c0', maxRotation: 45, minRotation: 45 },
                        grid: { color: '#ffffff11' }
                    },
                    y: {
                        title: { display: true, text: 'Count', color: '#a0a0c0' },
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    }
                }
            }
        });
    },

    /**
     * Create correlation heatmap
     */
    createCorrelationHeatmap(canvasId, correlationMatrix, columnNames, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Convert correlation matrix to heatmap data
        const data = [];
        for (let i = 0; i < correlationMatrix.length; i++) {
            for (let j = 0; j < correlationMatrix[i].length; j++) {
                data.push({
                    x: columnNames[j],
                    y: columnNames[i],
                    v: correlationMatrix[i][j]
                });
            }
        }

        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Correlation',
                    data: data,
                    backgroundColor: (context) => {
                        const value = context.raw.v;
                        const intensity = Math.abs(value);
                        const color = value >= 0 ? '108, 92, 231' : '239, 68, 68'; // Purple for positive, red for negative
                        return `rgba(${color}, ${intensity})`;
                    },
                    borderColor: '#ffffff22',
                    borderWidth: 1,
                    pointRadius: 15,
                    pointHoverRadius: 18
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Correlation Matrix',
                        color: '#ffffff'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const d = context.raw;
                                return `${d.y} ↔ ${d.x}: ${d.v.toFixed(3)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        ticks: { color: '#a0a0c0', maxRotation: 90, minRotation: 90 },
                        grid: { color: '#ffffff11' }
                    },
                    y: {
                        type: 'category',
                        ticks: { color: '#a0a0c0' },
                        grid: { color: '#ffffff11' }
                    }
                }
            }
        });
    },

    /**
     * Calculate summary statistics
     */
    getSummaryStats(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const n = sorted.length;
        const mean = data.reduce((sum, v) => sum + v, 0) / n;
        const variance = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
        const std = Math.sqrt(variance);

        return {
            count: n,
            mean: mean,
            std: std,
            min: sorted[0],
            q1: this.percentile(sorted, 25),
            median: this.percentile(sorted, 50),
            q3: this.percentile(sorted, 75),
            max: sorted[n - 1],
            skewness: this.calculateSkewness(data, mean, std),
            kurtosis: this.calculateKurtosis(data, mean, std)
        };
    },

    /**
     * Calculate percentile
     */
    percentile(sortedData, p) {
        const index = (p / 100) * (sortedData.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
    },

    /**
     * Calculate skewness
     */
    calculateSkewness(data, mean, std) {
        const n = data.length;
        const m3 = data.reduce((sum, v) => sum + Math.pow((v - mean) / std, 3), 0) / n;
        return m3;
    },

    /**
     * Calculate kurtosis
     */
    calculateKurtosis(data, mean, std) {
        const n = data.length;
        const m4 = data.reduce((sum, v) => sum + Math.pow((v - mean) / std, 4), 0) / n;
        return m4 - 3; // Excess kurtosis
    },

    /**
     * Format statistics for display
     */
    formatStats(stats) {
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Count</div>
                    <div class="stat-value">${stats.count}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Mean</div>
                    <div class="stat-value">${stats.mean.toFixed(3)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Std Dev</div>
                    <div class="stat-value">${stats.std.toFixed(3)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Min</div>
                    <div class="stat-value">${stats.min.toFixed(3)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Q1 (25%)</div>
                    <div class="stat-value">${stats.q1.toFixed(3)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Median</div>
                    <div class="stat-value">${stats.median.toFixed(3)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Q3 (75%)</div>
                    <div class="stat-value">${stats.q3.toFixed(3)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Max</div>
                    <div class="stat-value">${stats.max.toFixed(3)}</div>
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EDA;
}
