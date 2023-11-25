const malformattedId = (error, request, response, next) => {
    if (error.name == 'CastError') {
        return response.status(400).json({ error: `Id: ${response.locals.id} is invalid` })
    }

    next(error)
}

const idNotFound = (error, request, response, next) => {
    if (error.message == 'idNotFound') {
        return response.status(404).json({ error: `Person with id: ${response.locals.id} was not found` })
    }

    next(error)
}

const validationError = (error, request, response, next) => {
    if (error.name == 'ValidationError') {
        return response.status(400).json({ error: 'Person data must be unique'})
    }

    next(error)
}

module.exports = {
    malformattedId,
    idNotFound,
    validationError
}