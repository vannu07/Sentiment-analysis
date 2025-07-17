import dash
from dash import dcc, html
import plotly.express as px
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from wordcloud import WordCloud
from io import BytesIO
import base64
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score

# Load Sentiment Data
df = pd.read_csv("../src/data/raw/sample.csv")

# Generate Word Cloud
def generate_wordcloud(text):
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(' '.join(text))
    img = BytesIO()
    wordcloud.to_image().save(img, format='PNG')
    return 'data:image/png;base64,{}'.format(base64.b64encode(img.getvalue()).decode())

# Generate Confusion Matrix Figure
def generate_confusion_matrix(y_true, y_pred):
    cm = confusion_matrix(y_true, y_pred)
    fig = px.imshow(cm, text_auto=True, labels=dict(x="Predicted", y="Actual", color="Count"))
    return fig

# Generate Sentiment Distribution Chart
def generate_sentiment_distribution(df):
    fig = px.histogram(df, x='predicted_sentiment', title="Sentiment Distribution", color='predicted_sentiment')
    return fig

# Generate Time-based Sentiment Trend
def generate_sentiment_trend(df):
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    sentiment_trend = df.groupby(pd.Grouper(key='timestamp', freq='D')).mean().reset_index()
    fig = px.line(sentiment_trend, x='timestamp', y='predicted_sentiment', title="Sentiment Trend Over Time")
    return fig

# Model Performance Metrics
def calculate_metrics(df):
    accuracy = accuracy_score(df['actual_sentiment'], df['predicted_sentiment'])
    precision = precision_score(df['actual_sentiment'], df['predicted_sentiment'], average='weighted')
    recall = recall_score(df['actual_sentiment'], df['predicted_sentiment'], average='weighted')
    f1 = f1_score(df['actual_sentiment'], df['predicted_sentiment'], average='weighted')
    return accuracy, precision, recall, f1

accuracy, precision, recall, f1 = calculate_metrics(df)

# Initialize Dash App
app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("Sentiment Analysis Dashboard", style={'textAlign': 'center'}),
    
    # Word Cloud
    html.Div([
        html.H3("Word Cloud"),
        html.Img(src=generate_wordcloud(df['text']), style={'width': '100%'})
    ]),
    
    # Confusion Matrix
    html.Div([
        html.H3("Confusion Matrix"),
        dcc.Graph(figure=generate_confusion_matrix(df['actual_sentiment'], df['predicted_sentiment']))
    ]),
    
    # Sentiment Distribution
    html.Div([
        html.H3("Sentiment Distribution"),
        dcc.Graph(figure=generate_sentiment_distribution(df))
    ]),
    
    # Sentiment Trend Over Time
    html.Div([
        html.H3("Sentiment Trend Over Time"),
        dcc.Graph(figure=generate_sentiment_trend(df))
    ]),
    
    # Model Performance Metrics
    html.Div([
        html.H3("Model Performance Metrics"),
        html.P(f"Accuracy: {accuracy:.2f}"),
        html.P(f"Precision: {precision:.2f}"),
        html.P(f"Recall: {recall:.2f}"),
        html.P(f"F1 Score: {f1:.2f}"),
    ]),
    
    # Interactive Sentiment Filtering
    html.Div([
        html.H3("Filter by Sentiment"),
        dcc.Dropdown(
            id='sentiment-filter',
            options=[
                {'label': 'Positive', 'value': 'positive'},
                {'label': 'Neutral', 'value': 'neutral'},
                {'label': 'Negative', 'value': 'negative'}
            ],
            value='positive',
            clearable=False
        ),
        dcc.Graph(id='filtered-sentiment-chart')
    ])
])

@app.callback(
    dash.dependencies.Output('filtered-sentiment-chart', 'figure'),
    [dash.dependencies.Input('sentiment-filter', 'value')]
)
def update_filtered_chart(selected_sentiment):
    filtered_df = df[df['predicted_sentiment'] == selected_sentiment]
    return px.histogram(filtered_df, x='predicted_sentiment', title=f"Distribution of {selected_sentiment} Sentiment")

if __name__ == '__main__':
    app.run_server(debug=True)
