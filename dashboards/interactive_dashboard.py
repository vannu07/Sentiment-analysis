from dash import Dash, dcc, html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px
import requests

# Data preparation
data = {
    "Metric": ["Accuracy", "Precision", "Recall", "F1 Score", "AUC Score"],
    "LR Train": [0.91, 0.91, 1.00, 0.95, 0.62],
    "LR Test": [0.90, 0.90, 1.00, 0.95, 0.57],
    "MNB Train": [0.92, 0.96, 0.88, 0.91, 0.92],
    "MNB Test": [0.83, 0.95, 0.85, 0.90, 0.76],
    "XGB Train": [0.94, 0.94, 0.95, 0.94, 0.94],
    "XGB Test": [0.88, 0.95, 0.92, 0.93, 0.76],
    "RF Train": [1.00, 1.00, 1.00, 1.00, 1.00],
    "RF Test": [0.90, 0.93, 0.96, 0.95, 0.69]
}
metrics_df = pd.DataFrame(data)

# Initialize Dash app
app = Dash(__name__)

# Layout
app.layout = html.Div([
    html.H1("Machine Learning Model Performance", style={'textAlign': 'center', 'color': '#3498db'}),
    
    html.Label("Select Model:"),
    dcc.Dropdown(
        id="model-dropdown",
        options=[
            {"label": "Logistic Regression (LR)", "value": "LR"},
            {"label": "Multinomial Naive Bayes (MNB)", "value": "MNB"},
            {"label": "XGBoost (XGB)", "value": "XGB"},
            {"label": "Random Forest (RF)", "value": "RF"},
        ],
        value="LR",
        clearable=False,
    ),
    
    dcc.Graph(id="bar-chart"),
    dcc.Graph(id="heatmap"),
    
    html.H3("Sentiment Analysis"),
    dcc.Textarea(
        id="sentiment-input",
        placeholder="Type a sentence to analyze sentiment...",
        style={'width': '100%', 'height': '100px'}
    ),
    html.Button("Analyze", id="analyze-button"),
    html.Div(id="sentiment-output", style={'marginTop': '20px', 'fontSize': '16px'}),
])

# Callback for 2D Bar Chart
@app.callback(
    Output("bar-chart", "figure"),
    Input("model-dropdown", "value")
)
def update_bar_chart(selected_model):
    train_column = f"{selected_model} Train"
    test_column = f"{selected_model} Test"
    
    df_melted = metrics_df.melt(id_vars=["Metric"], value_vars=[train_column, test_column], var_name="Data Type", value_name="Score")
    
    fig = px.bar(df_melted, x="Metric", y="Score", color="Data Type", barmode="group",
                 title=f"{selected_model} Model Performance")
    return fig

# Callback for Heatmap
@app.callback(
    Output("heatmap", "figure"),
    Input("model-dropdown", "value")
)
def update_heatmap(selected_model):
    train_column = f"{selected_model} Train"
    test_column = f"{selected_model} Test"
    
    df_heatmap = metrics_df[["Metric", train_column, test_column]].set_index("Metric")
    fig = px.imshow(df_heatmap.values, labels=dict(x=["Train", "Test"], y=df_heatmap.index, color="Score"),
                    x=["Train", "Test"], y=df_heatmap.index, color_continuous_scale="Viridis")
    fig.update_layout(title=f"Heatmap of {selected_model} Performance")
    return fig

# Callback for Sentiment Analysis
@app.callback(
    Output("sentiment-output", "children"),
    Input("analyze-button", "n_clicks"),
    Input("sentiment-input", "value")
)
def analyze_sentiment(n_clicks, text):
    if n_clicks and text:
        try:
            response = requests.post("http://127.0.0.1:8050/", json={"text": text})
            result = response.json()
            return f"Sentiment: {result['sentiment']}, Confidence: {result['confidence']:.2f}"
        except Exception as e:
            return f"Error in sentiment analysis: {e}"
    return ""

if __name__ == "__main__":
    app.run_server(debug=True)