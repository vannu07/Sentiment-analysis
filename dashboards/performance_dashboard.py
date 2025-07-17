from dash import Dash, dcc, html
from dash.dependencies import Input, Output
import pandas as pd 
import plotly.express as px
import plotly.graph_objects as go

# Data preparation
data = {
    "Metric": ["Accuracy", "Precision", "Recall", "F1 Score", "AUC Score"],
    "LR Train": [0.91, 0.91, 1.00, 0.95, 0.62],
    "LR Test": [0.90, 0.90, 1.00, 0.95, 0.57],
    "LR SM Train": [0.95, 0.98, 0.92, 0.95, 0.95],
    "LR SM Test": [0.87, 0.96, 0.89, 0.93, 0.81],
    "MNB Train": [0.92, 0.96, 0.88, 0.91, 0.92],
    "MNB Test": [0.83, 0.95, 0.85, 0.90, 0.76],
    "XGB Train": [0.94, 0.94, 0.95, 0.94, 0.94],
    "XGB Test": [0.88, 0.95, 0.92, 0.93, 0.76],
    "RF Train": [1.00, 1.00, 1.00, 1.00, 1.00],
    "RF Test": [0.90, 0.93, 0.96, 0.95, 0.69],
}
metrics_df = pd.DataFrame(data)
metrics_df_long = metrics_df.melt(id_vars=["Metric"], var_name="Model", value_name="Score")

# Initialize Dash app
app = Dash(__name__)

# Layout
app.layout = html.Div([
    html.H1("Machine Learning Model Performance Dashboard", style={'textAlign': 'center'}),
    
    html.Div([
        html.Label("Select Model:"),
        dcc.Dropdown(
            id="model-dropdown",
            options=[{"label": model, "value": model} for model in metrics_df.columns[1:]],
            value="LR Train",
            clearable=False,
            style={"width": "50%"}
        ),
        html.Label("Select Heatmap Color Scale:"),
        dcc.Dropdown(
            id="color-scale-dropdown",
            options=[
                {"label": "Viridis", "value": "Viridis"},
                {"label": "Plasma", "value": "Plasma"},
                {"label": "Cividis", "value": "Cividis"},
                {"label": "Inferno", "value": "Inferno"},
                {"label": "Magma", "value": "Magma"}
            ],
            value="Viridis",
            clearable=False,
            style={"width": "50%"}
        )
    ], style={"textAlign": "center", "marginBottom": "20px"}),
    
    dcc.Graph(id="bar-chart", style={"height": "600px", "width": "400px", "margin": "auto"}),
    dcc.Graph(id="line-chart", style={"height": "500px", "width": "800px", "margin": "auto"}),
    dcc.Graph(id="heatmap")
])

# Callback for 2D Bar Chart
@app.callback(
    Output("bar-chart", "figure"),
    Input("model-dropdown", "value")
)
def update_bar_chart(selected_model):
    filtered_df = metrics_df[["Metric", selected_model]]
    fig = px.bar(
        filtered_df, x="Metric", y=selected_model, 
        title=f"Performance Metrics for {selected_model}",
        labels={selected_model: "Score"},
        color_discrete_sequence=["black"]
    )
    fig.update_layout(yaxis=dict(range=[0, 1]), height=600, width=400)
    return fig

# Callback for Line Chart
@app.callback(
    Output("line-chart", "figure"),
    Input("model-dropdown", "value")
)
def update_line_chart(selected_model):
    fig = px.line(
        metrics_df, x="Metric", y=selected_model, 
        title=f"Line Chart for {selected_model}",
        labels={selected_model: "Score"},
        markers=True
    )
    fig.update_layout(yaxis=dict(range=[0, 1]), height=500, width=800)
    return fig

# Callback for Heatmap
@app.callback(
    Output("heatmap", "figure"),
    [Input("model-dropdown", "value"), Input("color-scale-dropdown", "value")]
)
def update_heatmap(_, color_scale):
    fig = px.imshow(
        metrics_df.iloc[:, 1:].T.values, 
        labels=dict(x="Metric", y="Model", color="Score"),
        x=metrics_df["Metric"],
        y=metrics_df.columns[1:],
        color_continuous_scale=color_scale
    )
    fig.update_traces(showscale=True, hoverongaps=False)
    fig.update_layout(
        title="Performance Heatmap",
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=False),
        margin=dict(l=0, r=0, t=40, b=40),
        plot_bgcolor="white",
        paper_bgcolor="white",
    )
    return fig

if __name__ == "__main__":
    app.run_server(debug=True)
