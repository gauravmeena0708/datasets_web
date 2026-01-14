/**
 * Sample Data Generator
 * Generates representative sample data for EDA visualizations
 * Based on known dataset characteristics
 */

const SampleDataGenerator = {
    /**
     * Generate normal distribution
     */
    generateNormal(n, mean, std) {
        const data = [];
        for (let i = 0; i < n; i++) {
            // Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            data.push(mean + z * std);
        }
        return data;
    },

    /**
     * Generate skewed distribution
     */
    generateSkewed(n, min, max, skew = 2) {
        const data = [];
        for (let i = 0; i < n; i++) {
            let value = Math.pow(Math.random(), skew);
            value = min + value * (max - min);
            data.push(value);
        }
        return data;
    },

    /**
     * Generate categorical data with specified frequencies
     */
    generateCategorical(categories, frequencies) {
        const data = [];
        categories.forEach((cat, i) => {
            for (let j = 0; j < frequencies[i]; j++) {
                data.push(cat);
            }
        });
        return data;
    },

    /**
     * Generate complete dataset sample
     */
    generateDatasetSample(datasetId) {
        const samples = {
            adult: this.generateAdultSample(),
            default: this.generateDefaultSample(),
            shoppers: this.generateShoppersSample(),
            german: this.generateGermanSample(),
            dropout: this.generateDropoutSample(),
            magic: this.generateMagicSample(),
            cardio: this.generateCardioSample(),
            beijing: this.generateBeijingSample(),
            news: this.generateNewsSample()
        };
        return samples[datasetId] || null;
    },

    generateAdultSample() {
        return {
            numerical: {
                age: {
                    data: this.generateSkewed(1000, 17, 90, 1.5),
                    name: 'Age'
                },
                education_num: {
                    data: this.generateNormal(1000, 10, 2.5).map(v => Math.max(1, Math.min(16, Math.round(v)))),
                    name: 'Education Years'
                },
                hours_per_week: {
                    data: this.generateNormal(1000, 40, 12).map(v => Math.max(1, Math.round(v))),
                    name: 'Hours per Week'
                },
                capital_gain: {
                    data: this.generateSkewed(1000, 0, 100000, 5),
                    name: 'Capital Gain'
                }
            },
            categorical: {
                workclass: {
                    categories: ['Private', 'Self-emp', 'Local-gov', 'State-gov', 'Federal-gov', 'Without-pay'],
                    frequencies: [700, 150, 60, 40, 30, 20],
                    name: 'Work Class'
                },
                education: {
                    categories: ['HS-grad', 'Some-college', 'Bachelors', 'Masters', 'Doctorate', 'Prof-school'],
                    frequencies: [320, 220, 280, 120, 40, 20],
                    name: 'Education'
                },
                marital_status: {
                    categories: ['Married', 'Never-married', 'Divorced', 'Separated', 'Widowed'],
                    frequencies: [460, 330, 140, 40, 30],
                    name: 'Marital Status'
                },
                income: {
                    categories: ['<=50K', '>50K'],
                    frequencies: [760, 240],
                    name: 'Income'
                }
            },
            correlations: [
                [1.00, 0.45, 0.23, 0.08],
                [0.45, 1.00, 0.15, 0.31],
                [0.23, 0.15, 1.00, 0.12],
                [0.08, 0.31, 0.12, 1.00]
            ],
            correlationLabels: ['Age', 'Education', 'Hours/Week', 'Capital Gain']
        };
    },

    generateDefaultSample() {
        return {
            numerical: {
                limit_bal: {
                    data: this.generateSkewed(1000, 10000, 800000, 2),
                    name: 'Credit Limit'
                },
                age: {
                    data: this.generateNormal(1000, 35, 9).map(v => Math.max(21, Math.round(v))),
                    name: 'Age'
                },
                bill_amt1: {
                    data: this.generateSkewed(1000, -50000, 500000, 3),
                    name: 'Bill Amount (Month 1)'
                },
                pay_amt1: {
                    data: this.generateSkewed(1000, 0, 100000, 4),
                    name: 'Payment Amount (Month 1)'
                }
            },
            categorical: {
                sex: {
                    categories: ['Male', 'Female'],
                    frequencies: [400, 600],
                    name: 'Sex'
                },
                education: {
                    categories: ['Graduate', 'University', 'High School', 'Others'],
                    frequencies: [280, 470, 180, 70],
                    name: 'Education'
                },
                marriage: {
                    categories: ['Married', 'Single', 'Others'],
                    frequencies: [530, 420, 50],
                    name: 'Marital Status'
                },
                default: {
                    categories: ['No', 'Yes'],
                    frequencies: [780, 220],
                    name: 'Default Payment'
                }
            },
            correlations: [
                [1.00, -0.12, 0.32, -0.08],
                [-0.12, 1.00, -0.05, 0.02],
                [0.32, -0.05, 1.00, -0.23],
                [-0.08, 0.02, -0.23, 1.00]
            ],
            correlationLabels: ['Limit', 'Age', 'Bill Amt', 'Pay Amt']
        };
    },

    generateShoppersSample() {
        return {
            numerical: {
                administrative_duration: {
                    data: this.generateSkewed(1000, 0, 3000, 3),
                    name: 'Administrative Duration'
                },
                informational_duration: {
                    data: this.generateSkewed(1000, 0, 2000, 4),
                    name: 'Informational Duration'
                },
                product_related_duration: {
                    data: this.generateSkewed(1000, 0, 10000, 2.5),
                    name: 'Product Related Duration'
                },
                bounce_rates: {
                    data: this.generateNormal(1000, 0.02, 0.04).map(v => Math.max(0, Math.min(0.2, v))),
                    name: 'Bounce Rate'
                }
            },
            categorical: {
                month: {
                    categories: ['Jan', 'Feb', 'Mar', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    frequencies: [60, 80, 120, 100, 90, 70, 80, 110, 130, 100, 60],
                    name: 'Month'
                },
                visitor_type: {
                    categories: ['Returning', 'New', 'Other'],
                    frequencies: [850, 130, 20],
                    name: 'Visitor Type'
                },
                weekend: {
                    categories: ['Weekday', 'Weekend'],
                    frequencies: [770, 230],
                    name: 'Weekend'
                },
                revenue: {
                    categories: ['No', 'Yes'],
                    frequencies: [845, 155],
                    name: 'Revenue'
                }
            },
            correlations: [
                [1.00, 0.62, 0.58, -0.18],
                [0.62, 1.00, 0.45, -0.12],
                [0.58, 0.45, 1.00, -0.25],
                [-0.18, -0.12, -0.25, 1.00]
            ],
            correlationLabels: ['Admin Dur', 'Info Dur', 'Prod Dur', 'Bounce Rate']
        };
    },

    generateGermanSample() {
        return {
            numerical: {
                duration: {
                    data: this.generateSkewed(1000, 4, 72, 2),
                    name: 'Duration (months)'
                },
                credit_amount: {
                    data: this.generateSkewed(1000, 250, 18424, 2.5),
                    name: 'Credit Amount'
                },
                age: {
                    data: this.generateNormal(1000, 35, 11).map(v => Math.max(19, Math.round(v))),
                    name: 'Age'
                }
            },
            categorical: {
                credit_history: {
                    categories: ['Critical', 'Poor', 'Good', 'Very Good', 'Perfect'],
                    frequencies: [50, 90, 530, 250, 80],
                    name: 'Credit History'
                },
                purpose: {
                    categories: ['Car', 'Furniture', 'Radio/TV', 'Education', 'Business', 'Other'],
                    frequencies: [280, 180, 280, 50, 100, 110],
                    name: 'Purpose'
                },
                credit_risk: {
                    categories: ['Good', 'Bad'],
                    frequencies: [700, 300],
                    name: 'Credit Risk'
                }
            },
            correlations: [
                [1.00, 0.62, 0.03],
                [0.62, 1.00, 0.03],
                [0.03, 0.03, 1.00]
            ],
            correlationLabels: ['Duration', 'Amount', 'Age']
        };
    },

    generateDropoutSample() {
        return {
            numerical: {
                admission_grade: {
                    data: this.generateNormal(1000, 127, 18).map(v => Math.max(95, Math.min(190, v))),
                    name: 'Admission Grade'
                },
                age_at_enrollment: {
                    data: this.generateSkewed(1000, 17, 60, 2.5),
                    name: 'Age at Enrollment'
                },
                curricular_units_1st_sem_approved: {
                    data: this.generateNormal(1000, 4.5, 1.8).map(v => Math.max(0, Math.min(7, Math.round(v)))),
                    name: 'Units Approved (1st Sem)'
                }
            },
            categorical: {
                marital_status: {
                    categories: ['Single', 'Married', 'Divorced', 'Widowed'],
                    frequencies: [850, 120, 25, 5],
                    name: 'Marital Status'
                },
                course: {
                    categories: ['Engineering', 'Management', 'Nursing', 'Education', 'Social Service'],
                    frequencies: [280, 220, 180, 200, 120],
                    name: 'Course'
                },
                status: {
                    categories: ['Graduate', 'Dropout', 'Enrolled'],
                    frequencies: [400, 320, 280],
                    name: 'Status'
                }
            },
            correlations: [
                [1.00, -0.18, 0.42],
                [-0.18, 1.00, -0.28],
                [0.42, -0.28, 1.00]
            ],
            correlationLabels: ['Admission Grade', 'Age', 'Units Approved']
        };
    },

    generateMagicSample() {
        return {
            numerical: {
                fLength: {
                    data: this.generateNormal(1000, 50, 20).map(v => Math.max(0, v)),
                    name: 'fLength'
                },
                fWidth: {
                    data: this.generateNormal(1000, 30, 12).map(v => Math.max(0, v)),
                    name: 'fWidth'
                },
                fSize: {
                    data: this.generateSkewed(1000, 2, 5, 1.5),
                    name: 'fSize'
                },
                fConc: {
                    data: this.generateNormal(1000, 0.4, 0.15).map(v => Math.max(0, Math.min(1, v))),
                    name: 'fConc'
                }
            },
            categorical: {
                class: {
                    categories: ['gamma', 'hadron'],
                    frequencies: [350, 650],
                    name: 'Class'
                }
            },
            correlations: [
                [1.00, 0.58, 0.23, -0.12],
                [0.58, 1.00, 0.18, -0.08],
                [0.23, 0.18, 1.00, 0.65],
                [-0.12, -0.08, 0.65, 1.00]
            ],
            correlationLabels: ['fLength', 'fWidth', 'fSize', 'fConc']
        };
    },

    generateCardioSample() {
        return {
            numerical: {
                age: {
                    data: this.generateNormal(1000, 55, 7).map(v => Math.max(30, Math.round(v))),
                    name: 'Age'
                },
                height: {
                    data: this.generateNormal(1000, 165, 8),
                    name: 'Height (cm)'
                },
                weight: {
                    data: this.generateNormal(1000, 74, 14),
                    name: 'Weight (kg)'
                },
                ap_hi: {
                    data: this.generateNormal(1000, 128, 18).map(v => Math.max(90, Math.round(v))),
                    name: 'Systolic BP'
                },
                ap_lo: {
                    data: this.generateNormal(1000, 82, 11).map(v => Math.max(60, Math.round(v))),
                    name: 'Diastolic BP'
                }
            },
            categorical: {
                cholesterol: {
                    categories: ['Normal', 'Above Normal', 'Well Above Normal'],
                    frequencies: [520, 330, 150],
                    name: 'Cholesterol'
                },
                gluc: {
                    categories: ['Normal', 'Above Normal', 'Well Above Normal'],
                    frequencies: [590, 280, 130],
                    name: 'Glucose'
                },
                smoke: {
                    categories: ['No', 'Yes'],
                    frequencies: [910, 90],
                    name: 'Smoking'
                },
                cardio: {
                    categories: ['No', 'Yes'],
                    frequencies: [500, 500],
                    name: 'Cardiovascular Disease'
                }
            },
            correlations: [
                [1.00, 0.08, 0.42, 0.68, 0.58],
                [0.08, 1.00, 0.28, 0.02, 0.01],
                [0.42, 0.28, 1.00, 0.25, 0.18],
                [0.68, 0.02, 0.25, 1.00, 0.72],
                [0.58, 0.01, 0.18, 0.72, 1.00]
            ],
            correlationLabels: ['Age', 'Height', 'Weight', 'Sys BP', 'Dia BP']
        };
    },

    generateBeijingSample() {
        return {
            numerical: {
                pm25: {
                    data: this.generateSkewed(1000, 0, 500, 2.5),
                    name: 'PM2.5 Concentration'
                },
                DEWP: {
                    data: this.generateNormal(1000, 2, 18),
                    name: 'Dew Point'
                },
                TEMP: {
                    data: this.generateNormal(1000, 12, 12),
                    name: 'Temperature'
                },
                PRES: {
                    data: this.generateNormal(1000, 1016, 11),
                    name: 'Pressure'
                }
            },
            categorical: {
                cbwd: {
                    categories: ['NW', 'SE', 'NE', 'cv'],
                    frequencies: [350, 280, 250, 120],
                    name: 'Wind Direction'
                },
                month: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    frequencies: [83, 83, 83, 83, 83, 83, 84, 84, 84, 84, 84, 84],
                    name: 'Month'
                }
            },
            correlations: [
                [1.00, -0.32, -0.28, 0.18],
                [-0.32, 1.00, 0.88, -0.42],
                [-0.28, 0.88, 1.00, -0.52],
                [0.18, -0.42, -0.52, 1.00]
            ],
            correlationLabels: ['PM2.5', 'Dew Point', 'Temp', 'Pressure']
        };
    },

    generateNewsSample() {
        return {
            numerical: {
                n_tokens_title: {
                    data: this.generateNormal(1000, 10, 2).map(v => Math.max(2, Math.round(v))),
                    name: 'Title Tokens'
                },
                n_tokens_content: {
                    data: this.generateSkewed(1000, 0, 8000, 2),
                    name: 'Content Tokens'
                },
                num_hrefs: {
                    data: this.generateSkewed(1000, 0, 100, 3),
                    name: 'Number of Links'
                },
                num_imgs: {
                    data: this.generateSkewed(1000, 0, 50, 3.5),
                    name: 'Number of Images'
                },
                shares: {
                    data: this.generateSkewed(1000, 1, 100000, 5),
                    name: 'Shares'
                }
            },
            categorical: {
                data_channel: {
                    categories: ['Lifestyle', 'Entertainment', 'Business', 'Social Media', 'Tech', 'World'],
                    frequencies: [180, 220, 150, 140, 160, 150],
                    name: 'Data Channel'
                },
                weekday: {
                    categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    frequencies: [145, 145, 145, 145, 145, 135, 140],
                    name: 'Weekday'
                }
            },
            correlations: [
                [1.00, 0.68, 0.42, 0.38, 0.12],
                [0.68, 1.00, 0.52, 0.45, 0.18],
                [0.42, 0.52, 1.00, 0.35, 0.22],
                [0.38, 0.45, 0.35, 1.00, 0.15],
                [0.12, 0.18, 0.22, 0.15, 1.00]
            ],
            correlationLabels: ['Title Tokens', 'Content Tokens', 'Links', 'Images', 'Shares']
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SampleDataGenerator;
}
