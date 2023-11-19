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

const nameNotIncluded = (error, request, response, next) => {
    if (error.message == 'nameNotIncluded') {
        return response.status(400).json({ error: '\"name\" field is mandatory' })
    }
}

const phoneNumberNotIncluded = (error, request, response, next) => {
    if (error.message == 'phoneNumberNotIncluded') {
        return response.status(400).json({ error: '\"phoneNumber\" field is mandatory' })    
    }
}



module.exports = {
    malformattedId,
    idNotFound,
    nameNotIncluded
}