import moment from 'moment'
import { getFilters } from './filters'
import { getRecipes } from './recipes'

// Generate the DOM structure for a recipe
const generateRecipeDOM = (recipe) => {
    const recipeEl = document.createElement('a')
    const textEl = document.createElement('p')
    const statusEl = document.createElement('p')

    // Setup the recipe title text
    if (recipe.title.length > 0) {
        textEl.textContent = recipe.title
    } else {
        textEl.textContent = 'Blank recipe card'
    }
    
    // Add text to the recipe card
    textEl.classList.add('list-item__title')
    recipeEl.appendChild(textEl)

    // Setup the link to the recipe edit page
    recipeEl.setAttribute('href', `/edit.html#${recipe.id}`)
    recipeEl.classList.add('list-item')

    // Setup the status message for recipe title changes
    statusEl.textContent = generateLastEdited(recipe.updatedAt)
    statusEl.classList.add('list-item__subtitle')
    recipeEl.appendChild(statusEl)

    // Return the entire recipe card
    return recipeEl
}

// Render application recipes
const renderRecipes = () => {
    const recipesEl = document.querySelector('#recipes')
    const filters = getFilters()
    const recipes = getRecipes()
    const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(filters.searchText.toLowerCase()))

    // Clear the element prior to passing items
    recipesEl.innerHTML = ''

    // If there are recipes, render cards
    if (filteredRecipes.length > 0) {
        filteredRecipes.forEach((recipe) => {
            const recipeEl = generateRecipeDOM(recipe)
            recipesEl.appendChild(recipeEl)
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No recipes to show'
        emptyMessage.classList.add('empty-message')
        recipesEl.appendChild(emptyMessage)
    }
}

// Pass to edit page for ingredient DOM use
const initializeEditPage = (recipeId) => {
    const titleElement = document.querySelector('#recipe-title')
    const bodyElement = document.querySelector('#recipe-body')
    const dateElement = document.querySelector('#last-updated')
    const recipes = getRecipes()
    const recipe = recipes.find((recipe) => recipe.id === recipeId)

    if (!recipe) {
        location.assign('/index.html')
    }
    
    titleElement.value = recipe.title
    bodyElement.value = recipe.body
    dateElement.textContent = generateLastEdited(recipe.updatedAt)
}

// Generate the last edited title
const generateLastEdited = (timestamp) => {
    return `Recipe name was changed ${moment(timestamp).fromNow()}`
}

export { generateRecipeDOM, renderRecipes, generateLastEdited, initializeEditPage }