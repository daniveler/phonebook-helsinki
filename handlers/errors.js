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
}

module.exports = {
    malformattedId,
    idNotFound,
}