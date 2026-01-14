# Dataset Explorer with Enhanced EDA Features

A comprehensive web-based dataset explorer with detailed Exploratory Data Analysis (EDA) capabilities for synthetic data generation research.

## Features

### 📊 Interactive Dataset Cards
- Browse through 9+ benchmark datasets used in tabular synthetic data generation research
- Quick overview of dataset statistics (rows, columns, task type)
- Difficulty ratings for constraint-based generation

### 🔍 Detailed EDA Modal
Click on any dataset card to open an interactive EDA dashboard with four tabs:

#### 1. **Overview Tab**
- Dataset description and origin
- Task type and class imbalance information
- Row/column counts and feature types
- Generation difficulty analysis
- Papers using this dataset

#### 2. **Numerical Analysis Tab**
- **Column Selector**: Choose any numerical column to analyze
- **Summary Statistics**: Count, mean, std dev, min, Q1, median, Q3, max
- **Histogram**: Distribution visualization with customizable bins
- **Box Plot**: Quartile visualization with outlier detection
- **Quantile Diagram**: Percentile plot (0th, 10th, 25th, 50th, 75th, 90th, 100th)

#### 3. **Categorical Analysis Tab**
- **Column Selector**: Choose any categorical column to analyze
- **Summary Statistics**: Unique values, most frequent category, mode frequency
- **Frequency Table**: Complete breakdown with counts, percentages, and visual support bars
- **Bar Chart**: Visual distribution of category frequencies

#### 4. **Correlations Tab**
- **Correlation Heatmap**: Visual matrix showing relationships between numerical features
- Color-coded correlations (purple for positive, red for negative)
- Hover tooltips showing exact correlation values

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with glassmorphism effects
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Powerful charting library for visualizations
- **Responsive Design**: Works on desktop, tablet, and mobile

## File Structure

```
datasets_web/
├── index.html          # Main page with dataset cards
├── data.html           # Alternative dashboard view
├── data.json           # Dataset metadata
├── script.js           # Main application logic
├── eda.js              # EDA visualization engine
├── sample_data.js      # Representative data generator
└── style.css           # Styling and animations
```

## Usage

### Local Development
Simply open `index.html` in a modern web browser:
```bash
# Option 1: Direct file open
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux

# Option 2: Local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

### GitHub Pages Deployment
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch (usually `main` or `master`)
4. Select folder (usually `/` or `/docs`)
5. Save and wait for deployment
6. Access at `https://yourusername.github.io/repository-name/datasets_web/`

## Datasets Included

1. **Adult (Census Income)** - Binary classification, 48K rows, 15 columns
2. **Loan Default** - Credit card default prediction, 30K rows, 24 columns
3. **Online Shoppers** - Purchase intention, 12K rows, 18 columns
4. **German Credit** - Credit risk assessment, 1K rows, 21 columns
5. **Student Dropout** - Academic success prediction, 4K rows, 37 columns
6. **MAGIC Gamma Telescope** - Particle classification, 19K rows, 11 columns
7. **Cardiovascular Disease** - Medical diagnosis, 70K rows, 12 columns
8. **Beijing PM2.5** - Pollution prediction, 44K rows, 13 columns
9. **Online News Popularity** - Social shares prediction, 40K rows, 61 columns

## Data Source

The visualizations use **real data** from actual CSV files for most datasets:

### Datasets with Real Data (1000-row samples)
- ✅ **Adult (Census Income)** - From TabDiff/data
- ✅ **Loan Default** - From TabDiff/data  
- ✅ **Online Shoppers** - From TabDiff/data
- ✅ **MAGIC Gamma Telescope** - From TabDiff/data
- ✅ **Beijing PM2.5** - From TabDiff/data
- ✅ **Online News Popularity** - From TabDiff/data

### Datasets with Simulated Data (fallback)
- ⚠️ **German Credit** - Representative simulated data
- ⚠️ **Student Dropout** - Representative simulated data
- ⚠️ **Cardiovascular Disease** - Representative simulated data

The real data is loaded from your project's dataset directories and sampled to 1000 rows for optimal web performance. Simulated data is used as a fallback for datasets where CSV files weren't found.

### Regenerating Real Data

To update with the latest real data or add missing datasets:

```bash
cd datasets_web
python3 generate_real_data.py
```

This script:
1. Loads CSV files from project directories
2. Samples 1000 rows per dataset
3. Identifies numerical and categorical columns automatically
4. Calculates correlation matrices
5. Generates `sample_data_real.js` with the data

### Using Your Own Datasets

To add custom datasets:
1. Place your CSV file in one of the search directories
2. Update `DATASET_PATHS` or `ADDITIONAL_SEARCHES` in `generate_real_data.py`
3. Run the generation script
4. The data will automatically appear in the web interface

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (limited support, use modern browser)

## Contributing

To add a new dataset:
1. Add metadata to `data.json`
2. Create sample data generator in `sample_data.js`
3. Update the dataset list in `script.js`

## License

This project is open source and available for research and educational purposes.

## Acknowledgments

Built for synthetic tabular data generation research, supporting papers including:
- TabDiffuGEN
- TabSYN
- TabDDPM
- GReaT
- CuTS
- And more...
