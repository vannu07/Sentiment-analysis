# 🧠 Advanced Sentiment Analysis Platform

## 📋 Project Overview

A comprehensive **Final Year Project** that implements advanced sentiment analysis using multiple machine learning models with professional web interfaces, interactive dashboards, and real-time analytics capabilities.

### 🌟 Key Features

- **Multiple ML Models**: Logistic Regression, Random Forest, XGBoost, Naive Bayes with SMOTE
- **Professional Web Interface**: Modern Flask-based web application
- **Interactive Dashboards**: Streamlit and Dash-based visualization platforms
- **Real-time Analytics**: Live sentiment trends and performance metrics
- **Batch Processing**: Analyze multiple texts simultaneously
- **Model Comparison**: Visual comparison of different ML algorithms
- **Word Cloud Generation**: Dynamic keyword visualization
- **Responsive Design**: Mobile-friendly interface with animations

## 🏗️ Project Structure

```
📁 Advanced-Sentiment-Analysis-Platform/
├── 📁 src/                          # Source code
│   ├── 📁 models/                   # ML models and training
│   │   ├── 📁 trained_models/       # Saved .pkl model files
│   │   ├── model_trainer.py         # Training pipeline
│   │   └── model_evaluator.py       # Model evaluation
│   ├── 📁 data/                     # Data management
│   │   ├── 📁 raw/                  # Original datasets
│   │   ├── 📁 processed/            # Cleaned data
│   │   └── data_processor.py        # Data preprocessing
│   └── 📁 utils/                    # Utility functions
│       ├── text_preprocessor.py     # Text cleaning
│       ├── feature_extractor.py     # Feature engineering
│       └── metrics_calculator.py    # Performance metrics
├── 📁 frontend/                     # Web applications
│   └── 📁 advanced_web_app/         # Flask-based modern UI
│       ├── app.py                   # Main Flask application
│       ├── 📁 templates/            # HTML templates
│       ├── 📁 static/               # CSS, JS, assets
│       └── requirements.txt         # Dependencies
├── 📁 dashboards/                   # Interactive dashboards
│   ├── streamlit_app.py            # Streamlit interface
│   ├── analytics_dashboard.py       # Dash analytics
│   ├── performance_dashboard.py     # Model performance
│   └── interactive_dashboard.py     # Interactive charts
├── 📁 notebooks/                    # Jupyter notebooks
│   ├── Sentiment_Analysis.ipynb    # Main ML development
│   ├── EDA_Analysis.ipynb          # Exploratory analysis
│   └── Model_Comparison.ipynb      # Model benchmarking
├── 📁 docs/                        # Documentation
│   ├── API_Documentation.md        # API reference
│   ├── User_Guide.md              # Usage instructions
│   └── Technical_Report.pdf        # Final report
├── 📁 tests/                       # Test files
│   ├── test_models.py              # Model tests
│   ├── test_api.py                 # API tests
│   └── test_utils.py               # Utility tests
├── 📁 config/                      # Configuration files
│   ├── model_config.yaml          # Model parameters
│   └── app_config.yaml            # App settings
├── 📁 scripts/                     # Automation scripts
│   ├── train_models.py            # Model training script
│   ├── deploy.py                  # Deployment script
│   └── data_setup.py              # Data preparation
├── requirements.txt                # Project dependencies
├── setup.py                       # Package installation
├── Dockerfile                     # Docker configuration
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

```bash
Python 3.8+
pip (Python package manager)
Virtual environment (recommended)
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Advanced-Sentiment-Analysis-Platform
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup the project**
```bash
python scripts/data_setup.py
```

## 🖥️ Running the Applications

### 1. Advanced Web Application (Recommended)
```bash
cd frontend/advanced_web_app
python app.py
```
🌐 Open: http://localhost:5000

### 2. Streamlit Dashboard
```bash
cd dashboards
streamlit run streamlit_app.py
```
🌐 Open: http://localhost:8501

### 3. Analytics Dashboard
```bash
cd dashboards
python analytics_dashboard.py
```
🌐 Open: http://localhost:8050

### 4. Performance Dashboard
```bash
cd dashboards
python performance_dashboard.py
```
🌐 Open: http://localhost:8051

## 📊 Available Models

| Model | Accuracy | Precision | Recall | F1-Score | Use Case |
|-------|----------|-----------|--------|----------|----------|
| **Logistic Regression** | 90% | 90% | 100% | 95% | Fast, interpretable |
| **Random Forest** | 90% | 93% | 96% | 95% | Robust, feature importance |
| **XGBoost** | 88% | 95% | 92% | 93% | High performance |
| **Naive Bayes** | 83% | 95% | 85% | 90% | Simple, probabilistic |
| **LR + SMOTE** | 87% | 96% | 89% | 93% | Balanced dataset |
| **XGBoost Tuned** | 88% | 95% | 92% | 93% | Optimized parameters |

## 🎯 Features

### Core Functionality
- ✅ **Single Text Analysis**: Real-time sentiment prediction
- ✅ **Batch Processing**: Analyze multiple texts at once
- ✅ **Model Comparison**: Compare different algorithms
- ✅ **Confidence Scores**: Prediction reliability metrics
- ✅ **Probability Distribution**: Detailed sentiment breakdown

### Analytics & Visualization
- 📈 **Interactive Charts**: Dynamic plotly visualizations
- 🔤 **Word Clouds**: Popular keywords visualization
- 📊 **Performance Metrics**: Accuracy, precision, recall, F1-score
- 📉 **Trend Analysis**: Sentiment patterns over time
- 🏢 **Brand Analysis**: Sentiment by product brands

### Advanced Features
- 🔄 **Real-time Updates**: Live dashboard updates
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI/UX**: Professional design with animations
- 🔌 **RESTful API**: Programmatic access to models
- 📋 **Export Results**: Download analysis results

## 🧪 API Endpoints

### Prediction Endpoints
```http
POST /api/predict
Content-Type: application/json

{
    "text": "This product is amazing!",
    "model": "logistic_regression"
}
```

### Batch Analysis
```http
POST /api/batch_predict
Content-Type: application/json

{
    "texts": ["Text 1", "Text 2", "Text 3"],
    "model": "random_forest"
}
```

### Analytics
```http
GET /api/analytics/overview
GET /api/analytics/wordcloud
GET /api/analytics/model_comparison
```

## 📁 Dataset Information

### Primary Dataset
- **Source**: Customer reviews from multiple platforms
- **Size**: 50,000+ reviews
- **Features**: Review text, ratings, brand, date, user info
- **Labels**: Positive, Negative, Neutral sentiments

### Data Structure
```
- reviews_text: Customer review content
- reviews_rating: 1-5 star ratings
- brand: Product brand name
- reviews_date: Review timestamp
- reviews_username: User identifier
```

## 🛠️ Development

### Adding New Models
1. Train your model using the training pipeline
2. Save the model in `src/models/trained_models/`
3. Update model configuration in `config/model_config.yaml`
4. Add model metadata to the Flask app

### Customizing UI
1. Edit HTML templates in `frontend/advanced_web_app/templates/`
2. Modify CSS in `frontend/advanced_web_app/static/css/`
3. Update JavaScript in `frontend/advanced_web_app/static/js/`

### Adding New Features
1. Implement backend logic in Flask app
2. Create new API endpoints
3. Update frontend JavaScript
4. Add corresponding UI elements

## 🧪 Testing

Run all tests:
```bash
python -m pytest tests/
```

Run specific test categories:
```bash
python -m pytest tests/test_models.py  # Model tests
python -m pytest tests/test_api.py     # API tests
python -m pytest tests/test_utils.py   # Utility tests
```

## 📦 Deployment

### Docker Deployment
```bash
docker build -t sentiment-analysis-app .
docker run -p 5000:5000 sentiment-analysis-app
```

### Cloud Deployment
- **Heroku**: Use provided `Procfile`
- **AWS**: Deploy using Elastic Beanstalk
- **Google Cloud**: Use App Engine configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Your Name]
- **Data Scientist**: [Team Member]
- **UI/UX Designer**: [Team Member]
- **Project Supervisor**: [Supervisor Name]

## 🎓 Academic Context

This project was developed as a **Final Year Project** for the Computer Science/Data Science program, demonstrating:

- **Machine Learning**: Multiple algorithms and evaluation
- **Software Engineering**: Professional code structure and practices
- **Web Development**: Modern frontend and backend technologies
- **Data Science**: EDA, preprocessing, and visualization
- **Project Management**: Documentation and deployment

## 📚 References

1. Scikit-learn Documentation
2. Flask Web Development Guide
3. Plotly Interactive Visualizations
4. Natural Language Processing with Python
5. Machine Learning for Text Analysis

## 🔗 Links

- **Live Demo**: [https://your-app-url.com](https://your-app-url.com)
- **Documentation**: [Project Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## 📞 Support

For questions, issues, or suggestions:
- 📧 Email: your-email@domain.com
- 💬 Discord: [Project Discord Server](https://discord.gg/your-server)
- 🐛 Issues: [GitHub Issues Page](https://github.com/your-repo/issues)

---

**⭐ If you find this project helpful, please give it a star!**
