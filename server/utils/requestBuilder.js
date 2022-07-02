const getElementSvcRequestOption = (recipeId, object) => {
    return {
        url: `http://localhost:8080/api/v1/recipes/${recipeId}`,
        method: 'PUT',
        json: object
    }
}

module.exports = getElementSvcRequestOption;