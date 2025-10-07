import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Path to your recipes.json
const recipesFile = path.join(__dirname, '../recipes.json');

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API docs (optional)
app.get('/api/v1/docs', (req, res) => {
  res.json({
    info: { title: 'Recipe API', version: '1.0.0' },
    endpoints: ['/api/recipes']
  });
});

// Get all recipes
app.get('/api/recipes', (req, res) => {
  fs.readFile(recipesFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read recipes file' });

    let recipes;
    try {
      recipes = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON format' });
    }

    // Convert numeric keys to array if needed
    if (!Array.isArray(recipes)) recipes = Object.values(recipes);

    res.json({ data: recipes, total: recipes.length });
  });
});

// Get single recipe by title (optional)
app.get('/api/recipes/:title', (req, res) => {
  fs.readFile(recipesFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read recipes file' });

    let recipes;
    try {
      recipes = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON format' });
    }

    if (!Array.isArray(recipes)) recipes = Object.values(recipes);

    const recipe = recipes.find(r => r.title.toLowerCase() === req.params.title.toLowerCase());
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    res.json({ data: recipe });
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Recipe API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
