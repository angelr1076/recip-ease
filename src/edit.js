import {
  updateRecipe,
  removeRecipe,
  saveRecipes,
  getRecipes,
  createIngredient,
} from "./recipes";
import { initializeEditPage, generateLastEdited } from "./views";

const titleElement = document.querySelector("#recipe-title");
const bodyElement = document.querySelector("#recipe-body");
const removeElement = document.querySelector("#remove-recipe");
const addElement = document.querySelector("#add-recipe");
const dateElement = document.querySelector("#last-updated");
const addIngredient = document.querySelector("#new-ingredient");
const recipeStatus = document.querySelector("#recipe-status");

const recipeId = location.hash.substring(1);
const recipeOnPage = getRecipes().find(item => item.id === recipeId);

initializeEditPage(recipeId);

titleElement.addEventListener("input", e => {
  const recipe = updateRecipe(recipeId, {
    title: e.target.value,
  });
  dateElement.textContent = generateLastEdited(recipe.updatedAt);
});

bodyElement.addEventListener("input", e => {
  const recipe = updateRecipe(recipeId, {
    body: e.target.value,
  });
  dateElement.textContent = generateLastEdited(recipe.updatedAt);
});

addElement.addEventListener("click", () => {
  saveRecipes();
  location.assign("/index.html");
});

removeElement.addEventListener("click", () => {
  removeRecipe(recipeId);
  location.assign("/index.html");
});

addIngredient.addEventListener("submit", e => {
  const text = e.target.elements.text.value.trim();
  e.preventDefault();

  if (text.length > 0) {
    createIngredient(recipeId, text);
    e.target.elements.text.value = "";
  }
  renderIngredients(recipeId);
});

const removeIngredient = text => {
  recipeOnPage.ingredients = recipeOnPage.ingredients.filter(
    item => item.text !== text
  );
};

const toggleIngredient = text => {
  const ingredient = recipeOnPage.ingredients.find(
    ingredient => ingredient.text === text
  );
  if (ingredient.included) {
    ingredient.included = false;
  } else {
    ingredient.included = true;
  }
};

const ingredientSummary = () => {
  let message;
  const recipeItem = recipeOnPage.ingredients;
  const allUnchecked = recipeItem.every(
    ingredient => ingredient.included === false
  );
  const allChecked = recipeItem.every(
    ingredient => ingredient.included === true
  );

  if (allUnchecked) {
    message = `none`;
  } else if (allChecked) {
    message = `all`;
  } else {
    message = `some`;
  }
  return `You have ${message} of the ingredients for this recipe`;
};

const generateIngredientDOM = ingredient => {
  const ingredientEl = document.createElement("label");
  const containerEl = document.createElement("div");
  const checkbox = document.createElement("input");
  const ingredientText = document.createElement("span");
  const removeButton = document.createElement("button");
  recipeStatus.textContent = ingredientSummary();

  // Setup ingredient container
  ingredientEl.classList.add("list-item");
  containerEl.classList.add("list-item__container");
  ingredientEl.appendChild(containerEl);

  // Setup ingredient checkbox
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = ingredient.included;
  containerEl.appendChild(checkbox);
  // Create checkbox button in ingredient div
  checkbox.addEventListener("click", () => {
    toggleIngredient(ingredient.text);
    saveRecipes();
    renderIngredients(recipeId);
  });

  // Setup ingredient text
  ingredientText.textContent = ingredient.text;
  containerEl.appendChild(ingredientText);

  // Setup the remove button
  removeButton.innerHTML = '<i class="far fa-trash-alt"></i>';
  removeButton.classList.add("button", "button--text");
  ingredientEl.appendChild(removeButton);
  // Create remove button in ingredient div
  removeButton.addEventListener("click", () => {
    removeIngredient(ingredient.text);
    saveRecipes();
    renderIngredients(recipeId);
  });

  return ingredientEl;
};

const renderIngredients = recipeId => {
  // Grab the ingredient display from the DOM
  const ingredientList = document.querySelector("#ingredients-display");
  ingredientList.innerHTML = "";
  const recipe = getRecipes().find(item => {
    return item.id === recipeId;
  });

  // Iterate through the list of ingredients on the page and render all items from recipeDOM
  recipe.ingredients.map(ingredient => {
    const ingredientDisplay = generateIngredientDOM(ingredient);
    ingredientList.appendChild(ingredientDisplay);
  });
  saveRecipes();
};

renderIngredients(recipeId);
