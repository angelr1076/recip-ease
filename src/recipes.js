import uuidv4 from 'uuid/v4'
import moment from 'moment'

let recipes = []

// Read existing recipes from localStorage
const loadRecipes = () => {
    const recipesJSON = localStorage.getItem('recipes')

    try {
        return recipesJSON ? JSON.parse(recipesJSON) : []
    } catch (e) {
        return []
    } 
}

// Expose recipes from module
const getRecipes = () => recipes


const createRecipe = () => {
    const id = uuidv4()
    const timestamp = moment().valueOf()

    recipes.push({
        id: id,
        title: '',
        body: '',
        createdAt: timestamp,
        updatedAt: timestamp,
        ingredients: []
    })
    saveRecipes()

    return id
}

// Save the recipes to localStorage
const saveRecipes = () => {
    localStorage.setItem('recipes', JSON.stringify(recipes))
}

// Remove a recipe from the list
const removeRecipe = (id) => {
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === id)

    if (recipeIndex > -1) {
        recipes.splice(recipeIndex, 1)
        saveRecipes()
    }
}

// Remove all recipes from the recipe array
const cleanSlate = () => {
    recipes = []
    saveRecipes()
}

const updateRecipe = (id, updates) => {
    const recipe = recipes.find((recipe) => recipe.id === id)

    if (!recipe) {
        return
    }

    if (typeof updates.title === 'string') {
        recipe.title = updates.title
        recipe.updatedAt = moment().valueOf()
    }

    if (typeof updates.body === 'string') {
        recipe.body = updates.body
        recipe.updateAt = moment().valueOf()
    }

    saveRecipes()
    return recipe
}

const createIngredient = (id, text) => {
    const recipe = recipes.find((recipe) => recipe.id === id)
    const newItem = {
        text,
        included: false
    }
    recipe.ingredients.push(newItem)
    saveRecipes()
}

recipes = loadRecipes()

export { getRecipes, createRecipe, removeRecipe, updateRecipe, saveRecipes, cleanSlate, createIngredient }