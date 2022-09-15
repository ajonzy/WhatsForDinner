import titleize from "./titleize"

export default function generateMeals(user, number, rules, setGeneratedProblem, lockedMeals) {
    number = lockedMeals ? number - lockedMeals.length : number
    rules = rules.map(rule => ({...rule}))
    let meals = [...user.meals]
    const requiredMeals = []
    const numberedMeals = []
    const numberedRequiredMeals = []
    const leftoverRequiredMeals = []
    const currentSelectedMeals = []
    let bestSelectedMeals = []
    let bestCompactSelectedMeals = []
    let finalSelectedMeals = []
    let problem = false

    if (lockedMeals) {
        lockedMeals.forEach(lockedMeal => meals = meals.filter(meal => meal.id !== lockedMeal.id))

        rules.forEach(rule => {
            const matchingMeals = rule.type === "Category" ? lockedMeals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))) : lockedMeals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value))
            switch(rule.rule) {
                case "None": {
                    if (matchingMeals.length > 0) {
                        problem = true
                        setGeneratedProblem(true)
                    }
                    break
                }
                case "Exactly": {
                    rule.amount -= matchingMeals.length
                    if (rule.amount <= 0) {
                        if (rule.type === "Category") {
                            meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(titleize(rule.value)))
                        }
                        else {
                            meals = meals.filter(meal => meal[rule.type.toLowerCase()] != titleize(rule.value))
                        }

                        if (rule.amount < 0) {
                            problem = true
                            setGeneratedProblem(true)
                        }

                        rule.rule = "Done"
                    }
                    break
                }
                case "No more than": {
                    rule.amount -= matchingMeals.length
                    if (rule.amount <= 0) {
                        if (rule.type === "Category") {
                            meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(titleize(rule.value)))
                        }
                        else {
                            meals = meals.filter(meal => meal[rule.type.toLowerCase()] != titleize(rule.value))
                        }

                        if (rule.amount < 0) {
                            problem = true
                            setGeneratedProblem(true)
                        }

                        rule.rule = "Done"
                    }
                    break
                }
                case "At least": {
                    rule.amount -= matchingMeals.length
                    if (rule.amount <= 0) {
                        rule.rule = "Done"
                    }
                    break
                }
            }
        })
    }

    rules.forEach(rule => {
        switch(rule.rule) {
            case "None": {
                if (rule.type === "Category") {
                    meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(titleize(rule.value)))
                }
                else {
                    meals = meals.filter(meal => meal[rule.type.toLowerCase()] != titleize(rule.value))
                }
                break
            }
            case "Exactly": {
                if (
                    (rule.type === "Category" && meals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))).length < rule.amount) ||
                    (rule.type !== "Category" && meals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value)).length < rule.amount) ||
                    (rules.filter(rule => rule.rule === "None").filter(noneRule => noneRule.value === rule.value).length > 0)
                ) {
                    problem = true
                    setGeneratedProblem(true)
                }
                else {
                    for (let i=0; i<rule.amount; i++) {
                        requiredMeals.push({
                            type: rule.type,
                            value: titleize(rule.value),
                            amount: rule.amount
                        })
                    }
                    numberedMeals.push({
                        type: rule.type,
                        value: titleize(rule.value),
                        amount: rule.amount
                    })
                }
                break
            }
            case "No more than": {
                if (
                    (rules.filter(rule => rule.rule === "Exactly").filter(exactlyRule => exactlyRule.type === rule.type && exactlyRule.value === rule.value).filter(exactlyRule => exactlyRule.amount > rule.amount).length > 0) ||
                    (rules.filter(rule => rule.rule === "At least").filter(atLeastRule => atLeastRule.type === rule.type && atLeastRule.value === rule.value).filter(atLeastRule => atLeastRule.amount > rule.amount).length > 0)
                ) {
                    problem = true
                    setGeneratedProblem(true)
                }
                else {
                    numberedMeals.push({
                        type: rule.type,
                        value: titleize(rule.value),
                        amount: rule.amount
                    })
                }
                break
            }
            case "At least": {
                if (
                    (rule.type === "Category" && meals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))).length < rule.amount) ||
                    (rule.type !== "Category" && meals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value)).length < rule.amount) ||
                    (rules.filter(rule => rule.rule === "None").filter(noneRule => noneRule.value === rule.value).length > 0) ||
                    (rules.filter(rule => rule.rule === "Exactly").filter(exactlyRule => exactlyRule.type === rule.type && exactlyRule.value === rule.value).filter(exactlyRule => exactlyRule.amount < rule.amount).length > 0)
                ) {
                    problem = true
                    setGeneratedProblem(true)
                }
                else {
                    for (let i=0; i<rule.amount; i++) {
                        numberedRequiredMeals.push({
                            type: rule.type,
                            value: titleize(rule.value),
                            amount: rule.amount
                        })
                    }
                }
                break
            }
        }
    })

    const ruledRequiredMeals = [...requiredMeals, ...numberedRequiredMeals]

    for (let i=ruledRequiredMeals.length; i<number; i++) {
        leftoverRequiredMeals.push({
            type: "All",
            value: "",
            amount: 1
        })
    }

    let bestSelectedNumber = [...ruledRequiredMeals, ...leftoverRequiredMeals].length

    const generator = requiredMeals => {
        if (currentSelectedMeals.length > bestSelectedMeals.length || (currentSelectedMeals.length >= bestSelectedMeals.length && requiredMeals.length < bestSelectedNumber)) {
            bestSelectedMeals = [...currentSelectedMeals]

            if (currentSelectedMeals.length <= number && (currentSelectedMeals.length > bestCompactSelectedMeals.length || (currentSelectedMeals.length >= bestCompactSelectedMeals.length && requiredMeals.length < bestSelectedNumber))) {
                bestSelectedNumber = requiredMeals.length
                bestCompactSelectedMeals = [...currentSelectedMeals]
            }
        }
        
        if (currentSelectedMeals.length <= number && requiredMeals.length < bestSelectedNumber) {
            bestSelectedNumber = requiredMeals.length
        }

        if (requiredMeals.length === 0) {
            if (currentSelectedMeals.length + meals.length < number || currentSelectedMeals.length > number) {
                return false
            }

            finalSelectedMeals = currentSelectedMeals
            return true
        }

        let mealChoices = []
        let affectedNumberedMeals = []
        let removedMeals = []
        let selectedMeal = {}
        let iteration = 0
        const requiredMeal = requiredMeals.shift()
        
        if (requiredMeal.type === "Category") {
            if (currentSelectedMeals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value)).length >= requiredMeal.amount) {
                const nextResult = generator(requiredMeals)

                if (!nextResult) {
                    requiredMeals.unshift(requiredMeal)
                    return false
                }
                else {
                    return true
                }
            }

            mealChoices = meals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value)).sort(function(){return 0.5 - Math.random()})
        }
        else if (requiredMeal.type === "All") {
            mealChoices = meals.sort(function(){return 0.5 - Math.random()})
        }
        else {
            if (currentSelectedMeals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value).length >= requiredMeal.amount) {
                const nextResult = generator(requiredMeals)

                if (!nextResult) {
                    requiredMeals.unshift(requiredMeal)
                    return false
                }
                else {
                    return true
                }
            }

            mealChoices = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value).sort(function(){return 0.5 - Math.random()})
        }

        while (iteration < mealChoices.length && mealChoices.length !== 0) {
            if (mealChoices.length > 0) {
                selectedMeal = mealChoices[iteration]
                meals = meals.filter(meal => meal.id !== selectedMeal.id)
        
                numberedMeals.forEach(numberedMeal => {
                    if (numberedMeal.type === "Category") {
                        if (selectedMeal.categories.map(category => category.name).includes(numberedMeal.value)) {
                            affectedNumberedMeals.push(numberedMeal)
                            numberedMeal.amount -= 1
                        }
        
                        if (numberedMeal.amount === 0) {
                            removedMeals.push(...meals.filter(meal => meal.categories.map(category => category.name).includes(numberedMeal.value)))
                            meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(numberedMeal.value))
                        }
                    }
                    else {
                        if (selectedMeal[numberedMeal.type.toLowerCase()] == numberedMeal.value) {
                            affectedNumberedMeals.push(numberedMeal)
                            numberedMeal.amount -= 1
                        }
        
                        if (numberedMeal.amount === 0) {
                            removedMeals.push(...meals.filter(meal => meal[numberedMeal.type.toLowerCase()] == numberedMeal.value))
                            meals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] != numberedMeal.value)
                        }
                    }
                })

                currentSelectedMeals.push(selectedMeal)
                const nextResult = generator(requiredMeals)

                if (nextResult) {
                    break
                }
                else {
                    currentSelectedMeals.pop()
                    meals.push(selectedMeal)
                    meals.push(...removedMeals)
                    affectedNumberedMeals.forEach(numberedMeal => numberedMeal.amount += 1)
                    removedMeals = []
                    affectedNumberedMeals = []
                    iteration++
                }
            }
            else {
                requiredMeals.unshift(requiredMeal)
                return false
            }
        }

        if (iteration >= mealChoices.length || mealChoices.length === 0) {
            requiredMeals.unshift(requiredMeal)
            return false
        }

        return true
    }

    const allRequiredMeals = [...ruledRequiredMeals.sort(function(){return 0.5 - Math.random()}), ...leftoverRequiredMeals]
    let iteration = 0
    let result = true

    do {
        result = generator(allRequiredMeals)

        if (result) {
            break
        }
        else {
            allRequiredMeals.push(allRequiredMeals.shift())
            iteration++
        }
    }
    while (iteration < ruledRequiredMeals.length)

    if (number > user.meals.length) {
        number = user.meals.length
        problem = true
        setGeneratedProblem(true)
    }

    if (result) {
        setGeneratedProblem(problem)
        return lockedMeals ? finalSelectedMeals.concat(lockedMeals) : finalSelectedMeals
    }
    else {
        const handleBestMeals = bestMeals => {
            meals = meals.filter(meal => !bestMeals.map(selectedMeal => selectedMeal.id).includes(meal.id))

            bestMeals.forEach(selectedMeal => {
                numberedMeals.forEach(numberedMeal => {
                    if (numberedMeal.type === "Category") {
                        if (selectedMeal.categories.map(category => category.name).includes(numberedMeal.value)) {
                            numberedMeal.amount -= 1
                        }
        
                        if (numberedMeal.amount === 0) {
                            meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(numberedMeal.value))
                        }
                    }
                    else {
                        if (selectedMeal[numberedMeal.type.toLowerCase()] == numberedMeal.value) {
                            numberedMeal.amount -= 1
                        }
        
                        if (numberedMeal.amount === 0) {
                            meals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] != numberedMeal.value)
                        }
                    }
                })
            })

            if (number - bestMeals.length > meals.length) {
                meals = lockedMeals ? [...user.meals].filter(meal => !bestMeals.map(selectedMeal => selectedMeal.id).includes(meal.id)).filter(meal => !lockedMeals.map(lockedMeal => lockedMeal.id).includes(meal.id)) : [...user.meals].filter(meal => !bestMeals.map(selectedMeal => selectedMeal.id).includes(meal.id))
            }

            if (bestMeals.length < number) {
                bestMeals.push(...meals.sort(function(){return 0.5 - Math.random()}).slice(0, number - bestMeals.length))
            }
        }

        if (rules.length <= number) {
            handleBestMeals(bestSelectedMeals)
            setGeneratedProblem(true)
            return lockedMeals ? bestSelectedMeals.concat(lockedMeals) : bestSelectedMeals
        }
        else {
            handleBestMeals(bestCompactSelectedMeals)
            setGeneratedProblem(true)
            return lockedMeals ? bestCompactSelectedMeals.concat(lockedMeals) : bestCompactSelectedMeals
        }
    }
}