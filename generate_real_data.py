#!/usr/bin/env python3
"""
Enhanced version: Load real datasets where available, use simulated for others
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import sys

# Dataset paths - real data
DATASET_PATHS = {
    'adult': '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/TabDiff/data/adult/train.csv',
    'default': '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/TabDiff/data/default/train.csv',
    'shoppers': '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/TabDiff/data/shoppers/train.csv',
    'magic': '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/TabDiff/data/magic/train.csv',
    'beijing': '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/TabDiff/data/beijing/train.csv',
    'news': '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/TabDiff/data/news/train.csv',
}

# Try to find additional datasets
ADDITIONAL_SEARCHES = {
    'german': [
        '/mnt/c/Users/gaura/Documents/GitHub/Project/DiffuTabGen/datasets/german',
        '/mnt/c/Users/gaura/Documents/GitHub/Project/sd_framework/sub/cuts/tabular_datasets/german',
    ],
    'dropout': [
        '/mnt/c/Users/gaura/Documents/GitHub/Project/DiffuTabGen/datasets/dropout',
    ],
    'cardio': [
        '/mnt/c/Users/gaura/Documents/GitHub/Project/DiffuTabGen/datasets/cardio',
    ],
}

# Sample size for web display
SAMPLE_SIZE = 1000

def find_csv_in_dirs(dirs):
    """Find first CSV file in list of directories."""
    for dir_path in dirs:
        path = Path(dir_path)
        if path.exists():
            csv_files = list(path.glob('*.csv'))
            if csv_files:
                # Prefer train.csv or files without 'test' in name
                for f in csv_files:
                    if 'train' in f.name.lower():
                        return str(f)
                for f in csv_files:
                    if 'test' not in f.name.lower():
                        return str(f)
                return str(csv_files[0])
    return None

def load_and_sample_dataset(path, sample_size=SAMPLE_SIZE):
    """Load dataset and return a sample."""
    try:
        df = pd.read_csv(path)
        print(f"  Loaded {len(df)} rows, {len(df.columns)} columns")
        if len(df) > sample_size:
            df = df.sample(n=sample_size, random_state=42)
            print(f"  Sampled to {sample_size} rows")
        return df
    except Exception as e:
        print(f"  Error loading {path}: {e}")
        return None

def identify_column_types(df):
    """Identify numerical and categorical columns."""
    numerical = []
    categorical = []
    
    for col in df.columns:
        # Skip columns that are likely IDs
        if col.lower() in ['id', 'index', 'unnamed: 0']:
            continue
            
        if df[col].dtype in ['int64', 'float64']:
            # Check if it's actually categorical (few unique values)
            unique_ratio = df[col].nunique() / len(df)
            if unique_ratio < 0.05 and df[col].dtype == 'int64':
                categorical.append(col)
            else:
                numerical.append(col)
        else:
            categorical.append(col)
    
    return numerical, categorical

def calculate_correlation_matrix(df, numerical_cols):
    """Calculate correlation matrix for numerical columns."""
    if len(numerical_cols) < 2:
        return [], []
    
    # Limit to first 5 numerical columns for visualization
    cols_to_use = numerical_cols[:5]
    try:
        corr_matrix = df[cols_to_use].corr().values.tolist()
        return corr_matrix, cols_to_use
    except:
        return [], []

def generate_dataset_sample(df, dataset_name):
    """Generate JavaScript-compatible data structure from DataFrame."""
    numerical_cols, categorical_cols = identify_column_types(df)
    
    print(f"  Found {len(numerical_cols)} numerical, {len(categorical_cols)} categorical columns")
    
    # Limit columns for web display
    numerical_cols = numerical_cols[:5]
    categorical_cols = categorical_cols[:5]
    
    # Generate numerical data
    numerical_data = {}
    for col in numerical_cols:
        data = df[col].dropna().tolist()
        numerical_data[col.replace(' ', '_').replace('-', '_')] = {
            'data': data,
            'name': col.replace('_', ' ').title()
        }
    
    # Generate categorical data
    categorical_data = {}
    for col in categorical_cols:
        value_counts = df[col].value_counts()
        # Limit to top 10 categories
        value_counts = value_counts.head(10)
        
        # Convert to strings to avoid JSON issues
        categories = [str(x) for x in value_counts.index.tolist()]
        frequencies = [int(x) for x in value_counts.values.tolist()]
        
        categorical_data[col.replace(' ', '_').replace('-', '_')] = {
            'categories': categories,
            'frequencies': frequencies,
            'name': col.replace('_', ' ').title()
        }
    
    # Calculate correlations
    corr_matrix, corr_labels = calculate_correlation_matrix(df, numerical_cols)
    
    return {
        'numerical': numerical_data,
        'categorical': categorical_data,
        'correlations': corr_matrix,
        'correlationLabels': [col.replace('_', ' ').title() for col in corr_labels]
    }

def generate_javascript_file(output_path):
    """Generate JavaScript file with real data."""
    
    js_content = """/**
 * Real Dataset Samples
 * Generated from actual CSV files
 * Sample size: 1000 rows per dataset (where available)
 */

const RealDataGenerator = {
    generateDatasetSample(datasetId) {
        const samples = {
"""
    
    datasets_processed = []
    
    # Load and process each dataset
    for dataset_id, path in DATASET_PATHS.items():
        print(f"\nProcessing {dataset_id}...")
        print(f"  Path: {path}")
        df = load_and_sample_dataset(path)
        
        if df is not None:
            sample_data = generate_dataset_sample(df, dataset_id)
            
            # Convert to JavaScript
            js_content += f"            {dataset_id}: {json.dumps(sample_data, indent=16)},\n"
            datasets_processed.append(dataset_id)
    
    # Try to find additional datasets
    for dataset_id, search_dirs in ADDITIONAL_SEARCHES.items():
        print(f"\nSearching for {dataset_id}...")
        csv_path = find_csv_in_dirs(search_dirs)
        
        if csv_path:
            print(f"  Found: {csv_path}")
            df = load_and_sample_dataset(csv_path)
            
            if df is not None:
                sample_data = generate_dataset_sample(df, dataset_id)
                js_content += f"            {dataset_id}: {json.dumps(sample_data, indent=16)},\n"
                datasets_processed.append(dataset_id)
        else:
            print(f"  Not found in search directories")
    
    js_content += """        };
        return samples[datasetId] || null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealDataGenerator;
}
"""
    
    # Write to file
    with open(output_path, 'w') as f:
        f.write(js_content)
    
    print(f"\n✅ Generated {output_path}")
    print(f"📊 Datasets processed: {', '.join(datasets_processed)}")
    
    return datasets_processed

def main():
    output_path = '/mnt/c/Users/gaura/Documents/GitHub/Project/datasets_web/sample_data_real.js'
    datasets = generate_javascript_file(output_path)
    
    print(f"\n✅ Real data generation complete!")
    print(f"📁 Output: {output_path}")
    print(f"\n📊 {len(datasets)} datasets with real data")
    print("\n📝 Datasets still using simulated data (if any):")
    all_datasets = ['adult', 'default', 'shoppers', 'magic', 'beijing', 'news', 'german', 'dropout', 'cardio']
    missing = [d for d in all_datasets if d not in datasets]
    if missing:
        print(f"   {', '.join(missing)}")
    else:
        print("   None - all datasets have real data!")

if __name__ == '__main__':
    main()
