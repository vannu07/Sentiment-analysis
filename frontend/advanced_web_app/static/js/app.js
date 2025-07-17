// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global Variables
let sentimentChart = null;
let trendChart = null;
let currentSection = 'dashboard';
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let allTrendData = [];
let allAnalyticsData = null;

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const loadingOverlay = document.getElementById('loading-overlay');
const toast = document.getElementById('toast');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    loadDashboardData();
    loadModelsData();
    setupEventListeners();
    populateModelSelects();
    initializeParticles();
    initializeEnhancedAnimations();
});

// Navigation Functions
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'analytics':
                loadAnalyticsData();
                break;
            case 'models':
                loadModelsData();
                break;
        }
    }
}

// API Functions
async function makeAPIRequest(endpoint, options = {}) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast('error', error.message || 'An error occurred');
        throw error;
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const data = await makeAPIRequest('/analytics/overview');
        allAnalyticsData = data.analytics;
        
        // Store all trend data for pagination
        if (data.analytics.sentiment_trend) {
            allTrendData = data.analytics.sentiment_trend;
            totalPages = Math.ceil(allTrendData.length / itemsPerPage);
        }
        
        updateDashboardStats(data.analytics);
        updateChartsWithPagination(data.analytics);
        loadWordCloud();
        createPaginationControls();
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateDashboardStats(analytics) {
    const stats = analytics.sentiment_distribution;
    const accuracy = analytics.model_performance.accuracy;
    
    document.getElementById('positive-count').textContent = stats.positive || 0;
    document.getElementById('negative-count').textContent = stats.negative || 0;
    document.getElementById('neutral-count').textContent = stats.neutral || 0;
    document.getElementById('accuracy-score').textContent = `${(accuracy * 100).toFixed(1)}%`;
    
    // Animate counters
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-content h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent) || 0;
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current);
            }
        }, 20);
    });
}

// Chart Functions
function initializeCharts() {
    const sentimentCtx = document.getElementById('sentimentChart');
    const trendCtx = document.getElementById('trendChart');
    
    if (sentimentCtx) {
        sentimentChart = new Chart(sentimentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#22c55e', '#ef4444', '#6b7280'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    if (trendCtx) {
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Positive',
                    data: [],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Negative',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Neutral',
                    data: [],
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}

function updateCharts(analytics) {
    if (sentimentChart && analytics.sentiment_distribution) {
        const stats = analytics.sentiment_distribution;
        sentimentChart.data.datasets[0].data = [stats.positive, stats.negative, stats.neutral];
        sentimentChart.update();
    }
    
    if (trendChart && analytics.sentiment_trend) {
        const trend = analytics.sentiment_trend;
        trendChart.data.labels = trend.map(t => new Date(t.date).toLocaleDateString());
        trendChart.data.datasets[0].data = trend.map(t => t.positive);
        trendChart.data.datasets[1].data = trend.map(t => t.negative);
        trendChart.data.datasets[2].data = trend.map(t => t.neutral);
        trendChart.update();
    }
}

// Paginated Charts Functions
function updateChartsWithPagination(analytics) {
    if (sentimentChart && analytics.sentiment_distribution) {
        const stats = analytics.sentiment_distribution;
        sentimentChart.data.datasets[0].data = [stats.positive, stats.negative, stats.neutral];
        sentimentChart.update();
    }
    
    if (trendChart && allTrendData.length > 0) {
        updateTrendChartPagination();
    }
}

function updateTrendChartPagination() {
    if (!trendChart || allTrendData.length === 0) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = allTrendData.slice(startIndex, endIndex);
    
    trendChart.data.labels = paginatedData.map(t => new Date(t.date).toLocaleDateString());
    trendChart.data.datasets[0].data = paginatedData.map(t => t.positive);
    trendChart.data.datasets[1].data = paginatedData.map(t => t.negative);
    trendChart.data.datasets[2].data = paginatedData.map(t => t.neutral);
    trendChart.update();
}

function createPaginationControls() {
    if (allTrendData.length <= itemsPerPage) {
        // No pagination needed
        return;
    }
    
    // Find the chart container that contains the trend chart
    const trendCanvas = document.getElementById('trendChart');
    if (!trendCanvas) return;
    
    const trendContainer = trendCanvas.closest('.chart-container');
    if (!trendContainer) return;
    
    // Remove existing pagination controls
    const existingPagination = trendContainer.querySelector('.pagination-controls');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-controls';
    paginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 15px;
        font-size: 14px;
    `;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.className = 'btn btn-secondary';
    prevBtn.style.cssText = `
        padding: 6px 12px;
        font-size: 12px;
        border: 1px solid #ddd;
        background: #f8f9fa;
        border-radius: 4px;
        cursor: pointer;
    `;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateTrendChartPagination();
            updatePaginationControls();
        }
    });
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pageInfo.style.cssText = `
        padding: 6px 12px;
        color: #666;
        font-weight: 500;
    `;
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.className = 'btn btn-secondary';
    nextBtn.style.cssText = `
        padding: 6px 12px;
        font-size: 12px;
        border: 1px solid #ddd;
        background: #f8f9fa;
        border-radius: 4px;
        cursor: pointer;
    `;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTrendChartPagination();
            updatePaginationControls();
        }
    });
    
    // Items per page selector
    const itemsPerPageSelect = document.createElement('select');
    itemsPerPageSelect.style.cssText = `
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-left: 10px;
    `;
    
    [5, 10, 15, 20].forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = `${value} items`;
        option.selected = value === itemsPerPage;
        itemsPerPageSelect.appendChild(option);
    });
    
    itemsPerPageSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        totalPages = Math.ceil(allTrendData.length / itemsPerPage);
        currentPage = 1;
        updateTrendChartPagination();
        updatePaginationControls();
    });
    
    paginationDiv.appendChild(prevBtn);
    paginationDiv.appendChild(pageInfo);
    paginationDiv.appendChild(nextBtn);
    paginationDiv.appendChild(itemsPerPageSelect);
    
    trendContainer.appendChild(paginationDiv);
}

function updatePaginationControls() {
    const paginationDiv = document.querySelector('.pagination-controls');
    if (!paginationDiv) return;
    
    const prevBtn = paginationDiv.querySelector('button:first-child');
    const pageInfo = paginationDiv.querySelector('.page-info');
    const nextBtn = paginationDiv.querySelector('button:nth-child(3)');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Word Cloud Functions
async function loadWordCloud() {
    try {
        const data = await makeAPIRequest('/analytics/wordcloud');
        const container = document.getElementById('wordcloud-container');
        container.innerHTML = `<img src="${data.wordcloud}" alt="Word Cloud" style="max-width: 100%; height: auto;">`;
    } catch (error) {
        console.error('Failed to load word cloud:', error);
        document.getElementById('wordcloud-container').innerHTML = '<p>Failed to load word cloud</p>';
    }
}

// Analysis Functions
function setupEventListeners() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const batchAnalyzeBtn = document.getElementById('batch-analyze-btn');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeSentiment);
    }
    
    if (batchAnalyzeBtn) {
        batchAnalyzeBtn.addEventListener('click', batchAnalyzeSentiment);
    }
}

async function analyzeSentiment() {
    const textInput = document.getElementById('text-input');
    const modelSelect = document.getElementById('model-select');
    const resultsDiv = document.getElementById('analysis-results');
    
    const text = textInput.value.trim();
    const model = modelSelect.value;
    
    if (!text) {
        showToast('error', 'Please enter some text to analyze');
        return;
    }
    
    try {
        const data = await makeAPIRequest('/predict', {
            method: 'POST',
            body: JSON.stringify({ text, model })
        });
        
        displayAnalysisResults(data.prediction);
        resultsDiv.classList.remove('hidden');
        
        showToast('success', 'Analysis completed successfully!');
    } catch (error) {
        console.error('Analysis failed:', error);
    }
}

function displayAnalysisResults(prediction) {
    // Update sentiment result
    document.querySelector('.sentiment-emoji').textContent = prediction.emoji;
    document.querySelector('.sentiment-text').textContent = prediction.sentiment;
    document.querySelector('.confidence-score').textContent = `${prediction.confidence.toFixed(1)}%`;
    
    // Update probabilities
    const probabilities = prediction.probabilities;
    updateProbabilityBar('positive', probabilities.positive * 100);
    updateProbabilityBar('negative', probabilities.negative * 100);
    updateProbabilityBar('neutral', probabilities.neutral * 100);
    
    // Update text stats
    document.getElementById('word-count').textContent = prediction.text_analysis.word_count;
    document.getElementById('char-count').textContent = prediction.text_analysis.character_count;
    document.getElementById('polarity').textContent = prediction.text_analysis.polarity.toFixed(2);
}

function updateProbabilityBar(sentiment, percentage) {
    const progressBar = document.querySelector(`.prob-bar .progress.${sentiment}`);
    const valueSpan = progressBar.parentElement.parentElement.querySelector('.prob-value');
    
    progressBar.style.width = `${percentage}%`;
    valueSpan.textContent = `${percentage.toFixed(1)}%`;
}

// Batch Analysis Functions
async function batchAnalyzeSentiment() {
    const batchInput = document.getElementById('batch-input');
    const modelSelect = document.getElementById('batch-model-select');
    const resultsDiv = document.getElementById('batch-results');
    
    const texts = batchInput.value.trim().split('\n').filter(t => t.trim());
    const model = modelSelect.value;
    
    if (texts.length === 0) {
        showToast('error', 'Please enter some texts to analyze');
        return;
    }
    
    try {
        const data = await makeAPIRequest('/batch_predict', {
            method: 'POST',
            body: JSON.stringify({ texts, model })
        });
        
        displayBatchResults(data.results, data.summary);
        resultsDiv.classList.remove('hidden');
        
        showToast('success', `Batch analysis completed! Processed ${data.summary.total_processed} texts.`);
    } catch (error) {
        console.error('Batch analysis failed:', error);
    }
}

function displayBatchResults(results, summary) {
    // Update summary stats
    document.getElementById('batch-total').textContent = summary.total_processed;
    document.getElementById('batch-positive').textContent = summary.positive;
    document.getElementById('batch-negative').textContent = summary.negative;
    document.getElementById('batch-neutral').textContent = summary.neutral;
    
    // Update results table
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';
    
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="text-truncate" style="max-width: 200px;" title="${result.text}">${result.text}</td>
            <td><span class="sentiment-badge ${result.sentiment.toLowerCase()}">${result.emoji} ${result.sentiment}</span></td>
            <td>${result.confidence.toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Analytics Functions
async function loadAnalyticsData() {
    try {
        const [modelComparison, overview] = await Promise.all([
            makeAPIRequest('/analytics/model_comparison'),
            makeAPIRequest('/analytics/overview')
        ]);
        
        createModelComparisonChart(modelComparison.model_comparison);
        createBrandSentimentChart(overview.analytics.top_brands);
        createTimelineChart(overview.analytics.sentiment_trend);
    } catch (error) {
        console.error('Failed to load analytics data:', error);
    }
}

function createModelComparisonChart(data) {
    const container = document.getElementById('model-comparison-chart');
    
    const trace = {
        x: data.map(d => d.model),
        y: data.map(d => d.accuracy),
        type: 'bar',
        marker: {
            color: '#2563eb'
        }
    };
    
    const layout = {
        title: 'Model Accuracy Comparison',
        xaxis: { title: 'Models' },
        yaxis: { title: 'Accuracy', range: [0, 1] },
        height: 300
    };
    
    Plotly.newPlot(container, [trace], layout, {responsive: true});
}

function createBrandSentimentChart(data) {
    const container = document.getElementById('brand-sentiment-chart');
    
    const trace = {
        x: data.map(d => d.brand),
        y: data.map(d => d.mean),
        type: 'bar',
        marker: {
            color: '#22c55e'
        }
    };
    
    const layout = {
        title: 'Average Rating by Brand',
        xaxis: { title: 'Brand' },
        yaxis: { title: 'Average Rating' },
        height: 300
    };
    
    Plotly.newPlot(container, [trace], layout, {responsive: true});
}

function createTimelineChart(data) {
    const container = document.getElementById('timeline-chart');
    
    // Limit to recent 20 data points for better performance
    const limitedData = data.slice(-20);
    
    const traces = [
        {
            x: limitedData.map(d => d.date),
            y: limitedData.map(d => d.positive),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Positive',
            line: { color: '#22c55e' }
        },
        {
            x: limitedData.map(d => d.date),
            y: limitedData.map(d => d.negative),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Negative',
            line: { color: '#ef4444' }
        },
        {
            x: limitedData.map(d => d.date),
            y: limitedData.map(d => d.neutral),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Neutral',
            line: { color: '#6b7280' }
        }
    ];
    
    const layout = {
        title: `Sentiment Timeline (Last 20 entries)`,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Sentiment Count' },
        height: 300
    };
    
    Plotly.newPlot(container, traces, layout, {responsive: true});
}

// Models Functions
async function loadModelsData() {
    try {
        const data = await makeAPIRequest('/models');
        displayModelsGrid(data.models);
    } catch (error) {
        console.error('Failed to load models data:', error);
    }
}

function displayModelsGrid(models) {
    const container = document.getElementById('models-grid');
    container.innerHTML = '';
    
    Object.entries(models).forEach(([key, model]) => {
        const card = document.createElement('div');
        card.className = 'model-card';
        card.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <div class="model-metrics">
                <div class="metric">
                    <span class="metric-value">${(model.accuracy * 100).toFixed(1)}%</span>
                    <span class="metric-label">Accuracy</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${(model.precision * 100).toFixed(1)}%</span>
                    <span class="metric-label">Precision</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${(model.recall * 100).toFixed(1)}%</span>
                    <span class="metric-label">Recall</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${(model.f1_score * 100).toFixed(1)}%</span>
                    <span class="metric-label">F1 Score</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Utility Functions
async function populateModelSelects() {
    try {
        const data = await makeAPIRequest('/models');
        const selects = document.querySelectorAll('#model-select, #batch-model-select');
        
        selects.forEach(select => {
            select.innerHTML = '';
            Object.entries(data.models).forEach(([key, model]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = model.name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Failed to populate model selects:', error);
    }
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showToast(type, message) {
    const toastIcon = document.querySelector('.toast-icon');
    const toastMessage = document.querySelector('.toast-message');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle toast-icon';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle toast-icon';
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

// Error Handling
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('error', 'An unexpected error occurred');
});

// Resize handler for charts
window.addEventListener('resize', function() {
    if (sentimentChart) sentimentChart.resize();
    if (trendChart) trendChart.resize();
});

// Particle Animation System
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, 6000);
}

// Enhanced Animation System
function initializeEnhancedAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .chart-container, .model-card, .analytics-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Enhanced button animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        button.addEventListener('click', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }, 100);
        });
    });
    
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll('.section, .stat-card, .chart-container, .model-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced Text Input with Real-time Feedback
function enhanceTextInputs() {
    const textInputs = document.querySelectorAll('textarea, input[type="text"]');
    
    textInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2563eb';
            this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e5e7eb';
            this.style.boxShadow = '';
        });
        
        input.addEventListener('input', function() {
            const charCount = this.value.length;
            const wordCount = this.value.trim().split(/\s+/).length;
            
            // Update character count if element exists
            const charCountElement = document.getElementById('char-count-display');
            if (charCountElement) {
                charCountElement.textContent = charCount;
            }
            
            // Update word count if element exists
            const wordCountElement = document.getElementById('word-count-display');
            if (wordCountElement) {
                wordCountElement.textContent = wordCount;
            }
        });
    });
}

// Advanced Loading States
function showAdvancedLoading(message = 'Processing...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = overlay.querySelector('p');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    overlay.classList.remove('hidden');
    
    // Add pulse animation to loading spinner
    const spinner = overlay.querySelector('.fas');
    if (spinner) {
        spinner.style.animation = 'spin 1s linear infinite, pulse 2s ease-in-out infinite';
    }
}

// Enhanced Error Handling with User-Friendly Messages
function handleAPIError(error) {
    console.error('API Error:', error);
    
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.message.includes('Network')) {
        userMessage = 'Network error. Please check your internet connection.';
    } else if (error.message.includes('400')) {
        userMessage = 'Invalid request. Please check your input.';
    } else if (error.message.includes('500')) {
        userMessage = 'Server error. Please try again later.';
    }
    
    showToast('error', userMessage);
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    const performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.duration > 1000) {
                console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
            }
        });
    });
    
    performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
}

// Export functions for global access
window.SentimentApp = {
    showSection,
    analyzeSentiment,
    batchAnalyzeSentiment,
    loadDashboardData,
    showToast,
    initializeParticles,
    initializeEnhancedAnimations,
    showAdvancedLoading,
    handleAPIError
};
