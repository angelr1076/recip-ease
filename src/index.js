import { createRecipe, cleanSlate } from './recipes'
import { setFilters } from './filters'
import { renderRecipes } from './views'

renderRecipes()

// Grab the recipe form
document.querySelector('#create-recipe').addEventListener('click', e => {
  const id = createRecipe()
  location.assign(`/edit.html#${id}`)
})

// Search form listener
document.querySelector('#search-text').addEventListener('input', e => {
  setFilters({
    searchText: e.target.value
  })
  renderRecipes()
})

// Remove all recipes listener
document.querySelector('#remove-recipes').addEventListener('click', e => {
  cleanSlate()
  location.assign('/index.html')
})

// Watch local storage for changes even if on a different page
window.addEventListener('storage', e => {
  if (e.key === 'recipes') {
    recipes = JSON.parse(event.newValue)
    renderRecipes()
  }
})
