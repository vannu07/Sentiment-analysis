

# 🧠 Advanced Sentiment Analysis Platform

![MIT License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/github/workflow/status/vannu07/Customer_Sentiment_Analysis/Build/main?label=Build\&logo=github-actions\&style=flat)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)
![Last Commit](https://img.shields.io/github/last-commit/vannu07/Customer_Sentiment_Analysis?color=orange)
![Issues](https://img.shields.io/github/issues/vannu07/Customer_Sentiment_Analysis)
![Stars](https://img.shields.io/github/stars/vannu07/Customer_Sentiment_Analysis?style=social)

---

> 🚀 **A Final Year Project** for real-time sentiment analysis using machine learning, beautiful dashboards, REST APIs, and a fully responsive modern UI.

---

## 🎞️ Project Preview (Add GIF/Image)

> *✨ Add a GIF here to demonstrate animated dashboard, word cloud, or model comparison chart.*
> You can create one using tools like **Loom**, **Peek**, or **Screenity**, and embed it like:

```md
![Demo GIF](docs/demo.gif)
```

---

## 📋 Overview

A powerful end-to-end **sentiment analysis** platform leveraging:

* 🧠 **Machine Learning Models** (Logistic Regression, Random Forest, XGBoost, Naive Bayes)
* 🌐 **Modern Flask-based Web App**
* 📊 **Streamlit & Dash Dashboards**
* ⚡ **Real-Time Sentiment Trends**
* 🧪 **Batch & Single Text Processing**
* 📉 **Model Benchmarking & Word Clouds**

---

## 🚀 Quick Start

```bash
git clone https://github.com/vannu07/Customer_Sentiment_Analysis.git
cd Customer_Sentiment_Analysis
python -m venv venv
venv\Scripts\activate      # On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python scripts/data_setup.py
```

---

## 🖥️ Run Interfaces

| Interface             | Command                                         | Access                                         |
| --------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Flask Web App         | `cd frontend/advanced_web_app && python app.py` | [http://localhost:5000](http://localhost:5000) |
| Streamlit Dashboard   | `streamlit run dashboards/streamlit_app.py`     | [http://localhost:8501](http://localhost:8501) |
| Analytics Dashboard   | `python dashboards/analytics_dashboard.py`      | [http://localhost:8050](http://localhost:8050) |
| Performance Dashboard | `python dashboards/performance_dashboard.py`    | [http://localhost:8051](http://localhost:8051) |

---

## 🏗️ Architecture

> *Click to expand detailed structure*

<details>
<summary><strong>📁 Project Tree</strong></summary>

```
📁 src/
├── models/
│   └── trained_models/
├── data/
│   ├── raw/
│   └── processed/
├── utils/

📁 frontend/
└── advanced_web_app/

📁 dashboards/
📁 notebooks/
📁 docs/
📁 tests/
📁 config/
📁 scripts/

requirements.txt
Dockerfile
setup.py
README.md
```

</details>

---

## 🧠 Machine Learning Models

| Model               | Accuracy | Precision | Recall | F1-Score | Highlights            |
| ------------------- | -------- | --------- | ------ | -------- | --------------------- |
| Logistic Regression | 90%      | 90%       | 100%   | 95%      | Interpretable, fast   |
| Random Forest       | 90%      | 93%       | 96%    | 95%      | Feature importance    |
| XGBoost             | 88%      | 95%       | 92%    | 93%      | High performance      |
| Naive Bayes         | 83%      | 95%       | 85%    | 90%      | Simple, probabilistic |
| LR + SMOTE          | 87%      | 96%       | 89%    | 93%      | Balanced data         |
| Tuned XGBoost       | 88%      | 95%       | 92%    | 93%      | Optimized parameters  |

---

## 📊 Dashboard Features

| Feature             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| 🔤 Word Cloud       | Extract & animate keywords                            |
| 📈 Trend Graphs     | Dynamic sentiment over time                           |
| ⚖️ Model Comparison | Visualize performance across models                   |
| 📊 Metric Cards     | Real-time metrics for Accuracy, Precision, Recall, F1 |
| 📦 Batch Processing | Upload .CSV for bulk prediction                       |
| 🔁 Live Updates     | Sentiment detection refreshes every few seconds       |

---

## 📁 Dataset

| Attribute | Description                                      |
| --------- | ------------------------------------------------ |
| Source    | Aggregated from Amazon, Flipkart, Trustpilot     |
| Size      | 50,000+ reviews                                  |
| Labels    | Positive, Negative, Neutral                      |
| Format    | CSV (text, ratings, brand, timestamp, user info) |

---

## 🧪 Testing

```bash
python -m pytest tests/
# Or test individual components:
python -m pytest tests/test_models.py
python -m pytest tests/test_api.py
```

---

## 🐳 Docker Support

```bash
docker build -t sentiment-analysis-app .
docker run -p 5000:5000 sentiment-analysis-app
```

---

## ☁️ Cloud Deployment

* 🔼 **Heroku**: One-click deploy with `Procfile`
* ☁️ **AWS EB**: Elastic Beanstalk-compatible
* 🔧 **Google Cloud**: Use App Engine + Docker

---

## 📡 API Usage

**Single Text Prediction**

```json
POST /api/predict
{
  "text": "Loved the product!",
  "model": "random_forest"
}
```

**Batch Prediction**

```json
POST /api/batch_predict
{
  "texts": ["Great service!", "Worst ever"],
  "model": "xgboost"
}
```

---

## 🛠 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "Added new feature"
git push origin feature/your-feature
```

Then open a Pull Request ✅

---

## 👥 Team

| Role           | Name               |
| -------------- | ------------------ |
| Lead Developer | \[Your Name]       |
| Data Scientist | \[Team Member]     |
| UI/UX Designer | \[Team Member]     |
| Supervisor     | \[Supervisor Name] |

---

## 📄 License

Licensed under the [MIT License](LICENSE)

---

## 🔗 Useful Links

* 📚 [Documentation](https://github.com/vannu07/Customer_Sentiment_Analysis/wiki)
* 💬 [Discussions](https://github.com/vannu07/Customer_Sentiment_Analysis/discussions)
* 🐞 [Issue Tracker](https://github.com/vannu07/Customer_Sentiment_Analysis/issues)
* 🌍 [Live Demo](https://your-deployed-url.com)

---

## 💌 Contact

> 📧 **Email**: [your.email@example.com](mailto:your.email@example.com)
> 💬 **Discord**: [https://discord.gg/your-invite](https://discord.gg/your-invite)

---

## 🌟 Show Some Love

If you find this project helpful, consider **starring 🌟** the repo and sharing it with others 🙌

---

Would you like me to:

* 💡 Convert this into a formatted `.md` file?
* 🎨 Design an animated GIF preview of the dashboard?
* 🖼️ Create a custom project logo or banner?

